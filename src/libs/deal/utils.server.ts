import 'server-only';
import {
  DealFinancingType,
  type Prisma,
  type User,
  type DealInvestmentStats,
} from '@prisma/client';
import { isError } from 'lodash';
import { type DealCreateSchema, type DealUpdateSchema } from './schema';
import {
  getDebtInterestRate,
  getDebtUnitType,
  getEquityStatsFromProject,
} from '../returns/utils';
import prisma from '../prisma.server';
import {
  createHubspotDeal,
  getHsDealPropsFromDeal,
  initHubspotDealProps,
  updateHubspotDealProperties,
} from '../hubspot/utils';
import type {
  DealWithInvestmentStats,
  ProjectWithInvestmentStats,
} from '../types';
import { getInvestmentEntity } from './utils';
import { getErrorMessage } from '../utils';

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

  const hsDealInput = initHubspotDealProps(project.name, dealOwner, dealData);
  if (!hsDealInput) {
    throw new Error(
      'Deal cannot be created. Project not yet supported in Hubspot'
    );
  }

  const hsDealId = await createHubspotDeal(
    hsDealInput,
    String(dealOwner.hubspotId)
  );
  dealData.hubspotId = hsDealId;
  try {
    const newDeal = await _createDeal(
      dealData,
      dealOwner,
      project as ProjectWithInvestmentStats
    );
    return newDeal;
  } catch (e) {
    console.error('Failed to create deal', e);
    throw e;
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

  if (!project?.investmentStats) {
    throw new Error(
      `Project with id ${dealData.projectId} does not have investment stats.`
    );
  }
  try {
    const newDeal = await _createDeal(
      dealData,
      dealOwner,
      project as ProjectWithInvestmentStats
    );
    return newDeal;
  } catch (e) {
    console.error('Failed to create deal', getErrorMessage(e));
    throw e;
  }
}

async function _createDeal(
  dealData: DealCreateSchema,
  user: User,
  project: ProjectWithInvestmentStats
): Promise<DealWithInvestmentStats> {
  //   generate transaction id
  dealData.transactionId = `${project.name}-${user.lastName}-${Math.floor(
    Math.random() * 900 + 100
  )}`
    .replace(/\s/g, '')
    .toUpperCase();

  //   get investment stats from project
  if (!dealData.financingType)
    dealData.financingType = DealFinancingType.equity;
  let minInvestmentAmount = 5000;
  if (dealData.financingType === DealFinancingType.equity)
    minInvestmentAmount = project.investmentStats?.equityMinInvestment ?? 5000;
  else minInvestmentAmount = project.investmentStats?.debtMinInvestment ?? 5000;

  if (!dealData.amount) dealData.amount = minInvestmentAmount;

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
      getInvestmentEntity(project.name, dealData.financingType) ?? '',
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
    },
  });
  if (!existingDeal) {
    console.error(`Failed to find deal with hubspot id ${dealData.hubspotId}.`);
    throw Error('The deal does not exist in the database');
  }

  if (existingDeal.dealStage >= 5 && !allowMaintenanceOfCompletedDeals) {
    console.error('Completed Deals cannot be updated');
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
      // the only investment stats fields that can be updated  from outside this function are amount, financingType, and ownershipType
      const {
        amount,
        financingType,
        ownershipType,
        ...ignoredInvestmentStats
      } = investmentStatsToUpdate;

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
      const dealOwnershipType =
        ownershipType ?? existingDeal.investmentStats?.ownershipType;

      let newInvestmentStats = {
        amount: dealAmount,
        financingType: dealFinancingType,
        ownershipType: dealOwnershipType,
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
        throw Error('Failed to update deal with hubspot data');
      }
    }
  }

  // then update the deal
  let updatedDeal: DealWithInvestmentStats;
  /* eslint-disable-next-line */
  try {
    updatedDeal = (await prisma.deal.update({
      where: { hubspotId: dealData.hubspotId },
      data: dealData,
      include: { investmentStats: true },
    })) as DealWithInvestmentStats;
  } catch (error) {
    console.error(
      `Failed to update deal with hubspot id ${dealData.hubspotId}:`,
      error
    );
    throw Error(`Failed to update deal with hubspot id ${dealData.hubspotId}`);
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
      console.error('Failed to update deal in Hubspot', error);
    }
  }
  if (updatedStats) {
    updatedDeal.investmentStats = updatedStats;
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
