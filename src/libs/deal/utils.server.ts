import 'server-only';
import {
  DealFinancingType,
  type Prisma,
  type User,
  type DealInvestmentStats,
} from '@prisma/client';
import { isError } from 'lodash';
import {
  DealStage,
  type DealCreateSchema,
  type DealUpdateSchema,
} from './schema';
import {
  getDebtInterestRate,
  getDebtUnitType,
  getEquityStatsFromProject,
} from '../returns/utils.server';
import prisma from '../prisma.server';
import {
  createHubspotDeal,
  getHsDealPropsFromDeal,
  initHubspotDealProps,
  updateHubspotDealProperties,
} from '../hubspot/utils.server';
import type {
  DealWithInvestmentStats,
  ProjectWithInvestmentStats,
} from '../types';
import { getInvestmentEntity } from './utils';
import { getErrorMessage } from '../utils.server';
import Logger from '../logger';
import { createInvestmentCompletedActivityItem } from '../activityFeedItem/utils.server';

/**
 * creates a deal in the db, and in hubspot
 * @param dealData
 * @param dealOwner
 */
export async function createDealForUser(
  dealData: DealCreateSchema,
  dealOwner: User
) {
  const project = await prisma.project.findUnique({
    where: { id: dealData.projectId },
    include: { investmentStats: true },
  });

  if (!project?.investmentStats) {
    throw new Error(
      `Project with id ${dealData.projectId} does not have investment stats.`
    );
  }

  //   generate transaction id
  dealData.transactionId = `${project.name}-${dealOwner.lastName}-${Math.floor(
    Math.random() * 900 + 100
  )}`
    .replace(/\s/g, '')
    .toUpperCase();

  if (!dealData.hubspotId) {
    // create deal in hubspot
    const hsDealInput = initHubspotDealProps(project, dealOwner, dealData);
    if (!hsDealInput) {
      throw new Error(
        'Deal cannot be created. Project not yet supported in Hubspot'
      );
    }

    Logger.log({
      message: `Creating deal in Hubspot for deal with transaction id ${dealData.transactionId}`,
      extra: { hsDealInput },
    });

    try {
      const hsDealId = await createHubspotDeal(
        hsDealInput,
        String(dealOwner.hubspotId)
      );
      dealData.hubspotId = hsDealId;
    } catch (error) {
      Logger.error(error, null, { dealData });
      throw error;
    }
  }
  // now create the deal in the db
  try {
    const newDeal = await _createDeal(
      dealData,
      project as ProjectWithInvestmentStats
    );

    return newDeal;
  } catch (error) {
    Logger.error(error, null, {
      dealData,
      message: getErrorMessage(error),
      function: 'createDealForUser._createDeal',
    });
    throw error;
  }
}

export async function createDealForAdmin(
  dealData: DealCreateSchema,
  dealOwner: User
): Promise<DealWithInvestmentStats> {
  const project = await prisma.project.findUnique({
    where: { id: dealData.projectId },
    include: { investmentStats: true },
  });
  //   generate transaction id
  dealData.transactionId = `${project?.name}-${dealOwner.lastName}-${Math.floor(
    Math.random() * 900 + 100
  )}`
    .replace(/\s/g, '')
    .toUpperCase();

  if (!project?.investmentStats) {
    throw new Error(
      `Project with id ${dealData.projectId} does not have investment stats.`
    );
  }

  if (!dealData.hubspotId) {
    // create deal in hubspot
    const hsDealInput = initHubspotDealProps(project, dealOwner, dealData);
    if (!hsDealInput) {
      throw new Error(
        'Deal cannot be created. Project not yet supported in Hubspot'
      );
    }

    Logger.log({
      message: `Creating deal in Hubspot for deal with transaction id ${dealData.transactionId}`,
      extra: { hsDealInput },
    });

    try {
      const hsDealId = await createHubspotDeal(
        hsDealInput,
        String(dealOwner.hubspotId)
      );
      dealData.hubspotId = hsDealId;
    } catch (error) {
      Logger.error(error, null, { dealData });
      throw error;
    }
  }

  try {
    const newAdminDeal = await _createDeal(
      dealData,
      project as ProjectWithInvestmentStats
    );
    return newAdminDeal;
  } catch (e) {
    console.error('Failed to create deal', getErrorMessage(e));
    throw e;
  }
}

async function _createDeal(
  dealData: DealCreateSchema,
  project: ProjectWithInvestmentStats
): Promise<DealWithInvestmentStats> {
  //   get investment stats from project
  if (!dealData.financingType)
    dealData.financingType = DealFinancingType.equity;
  let minInvestmentAmount = 5000;
  if (dealData.financingType === DealFinancingType.equity)
    minInvestmentAmount = project.investmentStats?.equityMinInvestment ?? 5000;
  else minInvestmentAmount = project.investmentStats?.debtMinInvestment ?? 5000;

  if (!dealData.amount) dealData.amount = minInvestmentAmount; // set default amount to min investment amount

  let newInvestmentStats = {
    amount: dealData.amount,
    financingType: dealData.financingType,
  } as DealInvestmentStats;

  const { investmentStats, ...projectData } = project;
  if (dealData.financingType === DealFinancingType.equity) {
    try {
      newInvestmentStats = await populateDealEquityStats(newInvestmentStats, {
        ...projectData,
        investmentStats,
      });
    } catch (e) {
      throw e;
    }
  } else {
    newInvestmentStats = populateDealDebtStats(newInvestmentStats, {
      ...projectData,
      investmentStats,
    });
    if (dealData.debtMaxTerm)
      newInvestmentStats.debtTermMonthsMax = dealData.debtMaxTerm;
    if (dealData.debtMinTerm)
      newInvestmentStats.debtTermMonthsMin = dealData.debtMinTerm;
    if (dealData.debtInterestRatePerc)
      newInvestmentStats.debtInterestRatePerc = dealData.debtInterestRatePerc;
  }

  // ensure that organizationId and hubspotId are set
  if (!dealData.organizationId || !dealData.hubspotId) {
    throw Error('OrganizationId and HubspotId must be set');
  }
  if (!dealData.dealStage) dealData.dealStage = 0;

  const data: Prisma.DealUncheckedCreateInput = {
    organizationId: dealData.organizationId,
    projectId: dealData.projectId,
    dealStage: dealData.dealStage,
    hubspotId: dealData.hubspotId,
    transactionId: dealData.transactionId,
    investmentEntity:
      getInvestmentEntity(
        project.name,
        dealData.financingType,
        dealData.investmentEntity
      ) ?? '',
    investmentStats: {
      create: newInvestmentStats,
    },
  };

  if (dealData.closingDate) data.closingDate = dealData.closingDate;
  if (dealData.signaturesCompletedDate)
    data.signaturesCompletedDate = dealData.signaturesCompletedDate;
  if (dealData.dateFundsSent) data.dateFundsSent = dealData.dateFundsSent;
  if (dealData.paymentMethod) data.paymentMethod = dealData.paymentMethod;
  if (dealData.paymentReferenceId)
    data.paymentReferenceId = dealData.paymentReferenceId;
  if (dealData.status) data.status = dealData.status;

  const newDeal = await prisma.deal.create({
    data,
    include: { investmentStats: true },
  });
  return newDeal as DealWithInvestmentStats;
}

/**
 * Updates a deal, as well as investmentStats in the DB and in Hubspot
 * @param {DealUpdateSchema} updateDealData - The data of the deal to update
 * @returns {Promise<Deal>} The updated deal or an error
 */
export async function updateDeal(
  updateDealData: DealUpdateSchema /**dealData includes fields for both Deal and DealInvestmentStats */,
  updateHubspot = false,
  allowMaintenanceOfCompletedDeals = false
) {
  const { investmentStats: investmentStatsToUpdate, ...dealData } =
    updateDealData;
  const existingDeal = await prisma.deal.findUnique({
    where: { hubspotId: dealData.hubspotId },
    include: {
      investmentStats: true,
      project: { select: { id: true, name: true, slug: true } },
      organization: { select: { ownerId: true } },
    },
  });
  if (!existingDeal) {
    throw Error('The deal does not exist in the database');
  }

  if (
    existingDeal.dealStage >= DealStage.CLOSED &&
    !allowMaintenanceOfCompletedDeals
  ) {
    Logger.error(new Error('Completed Deals cannot be updated'), null, {
      extra: { existingDeal },
    });
    throw Error('Completed Deals cannot be updated');
  }
  console.log('investmentStatsToUpdate', investmentStatsToUpdate);

  // first update the stats
  let updatedStats: DealInvestmentStats | null = null;
  // Only update investment stats if the deal stage is less than 4 (not yet signed)
  if (existingDeal.dealStage >= 4 && !allowMaintenanceOfCompletedDeals) {
    console.warn(
      `Deal with id ${existingDeal.id} is already signed, and the investmentStats will not be updated, but the deal itself will be.`
    );
  } else {
    if (investmentStatsToUpdate) {
      // the only investment stats fields that can be updated  from outside this function are amount and financingType.
      const { amount, financingType, ...ignoredInvestmentStats } =
        investmentStatsToUpdate;

      for (const key in ignoredInvestmentStats) {
        console.warn(
          `For deal with id ${existingDeal.id}, ignoring to update investmentStat: ${key}, as it can only be updated internally.`
        );
      }

      const project = (await prisma.project.findUnique({
        where: { id: existingDeal.projectId },
        include: { investmentStats: true },
      })) as ProjectWithInvestmentStats;
      if (!project || !project.investmentStats || !project.equityReturnsFile) {
        console.error(
          `Failed to find project with id ${existingDeal.projectId} for deal with hubspot id ${dealData.hubspotId}.`
        );
        throw Error('Failed to update deal with hubspot data');
      }

      const dealFinancingType =
        financingType ?? existingDeal.investmentStats?.financingType;
      const dealAmount = amount ?? existingDeal.investmentStats?.amount;

      let newInvestmentStats = {
        amount: dealAmount,
        financingType: dealFinancingType,
        dealId: existingDeal.id,
      } as DealInvestmentStats;

      if (dealFinancingType === DealFinancingType.equity) {
        try {
          console.log(
            'Populating EQUITY stats for deal with id',
            existingDeal.id
          );
          newInvestmentStats = await populateDealEquityStats(
            newInvestmentStats,
            project
          );
        } catch (e) {
          throw e;
        }
      } else {
        console.log('Populating DEBT stats for deal with id', existingDeal.id);
        newInvestmentStats = populateDealDebtStats(newInvestmentStats, project);
      }

      try {
        console.log(
          'Updating deal investment stats for deal with id',
          existingDeal.id
        );
        updatedStats = await prisma.dealInvestmentStats.update({
          where: { dealId: existingDeal.id },
          data: newInvestmentStats,
        });
      } catch (error) {
        console.error(
          `Failed to update deal investment stats for deal id ${existingDeal.id}. `
        );
        console.error(error);
        throw error;
      }
    }
  }

  // then update the deal without the investment stats
  let updatedDeal: DealWithInvestmentStats;

  if (
    dealData.dealStage === DealStage.CLOSED &&
    !existingDeal.closingDate &&
    !dealData.closingDate
  ) {
    console.log(
      'Setting closing date to today for deal with id',
      existingDeal.id
    );
    dealData.closingDate = new Date();
  }

  try {
    updatedDeal = (await prisma.deal.update({
      where: { hubspotId: dealData.hubspotId },
      data: dealData,
      include: { investmentStats: true },
    })) as DealWithInvestmentStats;
  } catch (error) {
    console.error(
      `Failed to update deal with hubspot id ${dealData.hubspotId}:`,
      getErrorMessage(error)
    );
    throw error;
  }

  if (updateHubspot) {
    try {
      const hsDealData = updateDealData;
      if (updatedStats) {
        hsDealData.investmentStats = updatedStats;
      }
      console.log(
        'Updating deal in Hubspot with this data:',
        existingDeal.project.slug,
        hsDealData
      );
      const hsDeal = getHsDealPropsFromDeal(
        updateDealData,
        existingDeal.project.slug
      );
      await updateHubspotDealProperties(hsDeal);
    } catch (error) {
      console.error(
        'Failed to update deal in Hubspot - but deal was updated in DB:'
      );
      console.error(error);
    }
  }
  if (updatedStats) {
    updatedDeal.investmentStats = updatedStats;
  }

  // Add activity feed item if the deal has closed
  if (updateDealData.dealStage === DealStage.CLOSED) {
    await createInvestmentCompletedActivityItem({
      itemId: updatedDeal.id,
      userId: existingDeal.organization.ownerId,
      closingDate: (dealData.closingDate || existingDeal.closingDate)!,
      dateCreated: existingDeal.dateCreated,
      financingType: existingDeal.investmentStats?.financingType,
      projectName: existingDeal.project.name,
      projectSlug: existingDeal.project.slug,
    });
  }

  return updatedDeal;
}

export async function populateDealEquityStats(
  stats: DealInvestmentStats,
  project: ProjectWithInvestmentStats
) {
  const equityDetails = await getEquityStatsFromProject(
    stats.amount,
    project.equityReturnsFile,
    project.investmentStats.cUnitThresholdAmount
  );
  if (isError(equityDetails)) {
    console.error(`Failed to get equity stats for project ${project.name}:`);
    console.error(equityDetails);
    throw equityDetails;
  }
  const { unitType, numberAUnits, numberCUnits } = equityDetails;
  stats.unitType = unitType;
  stats.numberAUnits = numberAUnits;
  stats.numberCUnits = numberCUnits;
  stats.equityTermMonths = project.investmentStats.equityTermMonths;
  stats.equityPreferredReturn = project.investmentStats.equityPreferredReturn;

  // set all debt related fields to null
  stats.debtTermMonthsMin = 0;
  stats.debtTermMonthsMax = 0;
  stats.debtPaymentFreq = '';
  stats.debtPaymentFreqMonths = 0;
  stats.debtInterestRatePerc = 0;

  const minInvestmentAmount = project.investmentStats.equityMinInvestment;
  if (stats.amount < minInvestmentAmount) {
    console.log(
      `Increasing minimum investment amount to $${minInvestmentAmount.toLocaleString()}`
    );
    stats.amount = minInvestmentAmount;
  }
  if (stats.amount < minInvestmentAmount) {
    console.error(
      `The minimum investment amount for this project is $${minInvestmentAmount.toLocaleString()}`
    );
    throw Error(
      `Amount is too low! The minimum investment amount for this deal needs to be $${minInvestmentAmount.toLocaleString()}`
    );
  }
  return stats;
}

export function populateDealDebtStats(
  stats: DealInvestmentStats,
  project: ProjectWithInvestmentStats
) {
  stats.debtTermMonthsMin = project.investmentStats.debtTermMonthsMin;
  stats.debtTermMonthsMax = project.investmentStats.debtTermMonthsMax;
  stats.debtPaymentFreq = project.investmentStats.debtPaymentFreq;
  stats.debtPaymentFreqMonths = project.investmentStats.debtPaymentFreqMonths;
  stats.debtInterestRatePerc = getDebtInterestRate(
    stats.amount,
    project.investmentStats
  );
  stats.unitType = getDebtUnitType(stats.amount, project.investmentStats);

  // set all equity related fields to null
  stats.equityTermMonths = 0;
  stats.numberAUnits = 0;
  stats.numberCUnits = 0;

  const minInvestmentAmount = project.investmentStats.debtMinInvestment;
  if (stats.amount < minInvestmentAmount) {
    console.log(
      `Increasing minimum investment amount to $${minInvestmentAmount.toLocaleString()}`
    );
    stats.amount = minInvestmentAmount;
  }
  if (stats.amount < minInvestmentAmount) {
    console.error(
      `The minimum investment amount for this project is $${minInvestmentAmount.toLocaleString()}`
    );
    throw Error(
      `Amount is too low! The minimum investment amount for this deal needs to be $${minInvestmentAmount.toLocaleString()}`
    );
  }
  return stats;
}

export function toUTCMidnight(date: Date): Date {
  const utcMidnight = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  return utcMidnight;
}
