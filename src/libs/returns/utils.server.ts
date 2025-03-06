import 'server-only';
import {
  DealFinancingType,
  type DealInvestmentStats,
  DealStatus,
  DealUnitType,
  type ProjectInvestmentStats,
  type ProjectMilestones,
} from '@prisma/client';
import { parse } from 'csv-parse';
import { add, endOfMonth, startOfMonth } from 'date-fns';
import type {
  PortfolioReturnsResponse,
  ProjectMilestoneType,
  ProjectReturnsStats,
  ReturnsDateObject,
  ReturnsDealStats,
  ReturnsPortfolioStats,
} from './schema';
import { finished } from 'stream';
import { promisify } from 'util';
import {
  DealWithInvestmentStatsAndProjectWithPics,
  ProjectWithInvestmentStats,
} from '../types';
import Logger from '../logger';

const finishedAsync = promisify(finished);

export async function readEquityMilestoneData(csvUrl: string) {
  Logger.log({ message: csvUrl, extra: { csvUrl } });
  if (!csvUrl) {
    console.error('CSV url not provided');
    throw new Error('CSV url not provided');
  }
  const response = await fetch(csvUrl);
  const text = await response.text();
  const parser = parse(text, { columns: true });

  const milestones: ProjectMilestoneType[] = [];
  parser.on('readable', function () {
    let record;

    while ((record = parser.read()) !== null) {
      const milestone: ProjectMilestoneType = {
        date: new Date(Date.parse(record.date)),
        aUnitReturns: 0,
        cUnitReturns: 0,
      };
      milestone.aUnitReturns = parseFloat(
        record['aUnitReturns'].replace('$', '').replaceAll(',', '')
      );
      milestone.cUnitReturns = parseFloat(
        record['cUnitReturns'].replace('$', '').replaceAll(',', '')
      );

      milestones.push(milestone);
    }
  });
  // Catch any error
  parser.on('error', function (err) {
    console.error(err.message);
    throw new Error(err.message);
  });
  parser.on('end', function () {
    return milestones;
  });

  await finishedAsync(parser);
  return milestones;
}

// calculate deal unit type, share of equity, and number of units
export async function getEquityStatsFromProject(
  amount: number,
  equityReturnsFileUrl: string,
  cUnitThresholdAmount: number
) {
  let unitType: DealUnitType = DealUnitType.AUNIT;
  let numberCUnits = 0;
  let numberAUnits = 0;
  let shareOfEquity = 0;

  let equityMilestones: ProjectMilestoneType[] | undefined = undefined;
  equityMilestones = await readEquityMilestoneData(equityReturnsFileUrl);

  try {
    const firstMilestone = equityMilestones?.[0];
    if (!firstMilestone?.aUnitReturns || !firstMilestone?.cUnitReturns) {
      console.error('Milestone data not found in equity returns file');
      throw new Error('Milestone data not found in equity returns file');
    }

    if (amount >= cUnitThresholdAmount) {
      unitType = DealUnitType.CUNIT;
      numberCUnits = amount / 100000;
      shareOfEquity = -amount / firstMilestone.cUnitReturns;
    } else {
      numberAUnits = amount / 100000;
      shareOfEquity = -amount / firstMilestone.aUnitReturns;
    }

    return {
      unitType,
      numberCUnits,
      numberAUnits,
      shareOfEquity,
      equityMilestones,
    };
  } catch (e) {
    console.error('Failed to get equity stats for project:', e);
    throw e;
  }
}

// Calculate interest rate based on threshold
export function getDebtInterestRate(
  amount: number,
  investmentStats: ProjectInvestmentStats
) {
  return amount >= investmentStats.interestRateDollarThreshold
    ? investmentStats.interestRateMax
    : investmentStats.interestRateMin;
}

export function getDebtUnitType(
  amount: number,
  investmentStats: ProjectInvestmentStats
) {
  return amount >= investmentStats.interestRateDollarThreshold
    ? DealUnitType.BUNIT
    : DealUnitType.AUNIT;
}

// find last day of first month of next quarter
export function getPayoutScheduleStartDate(closingDate: Date) {
  if (!closingDate) throw new Error('Closing date not provided');

  const thisQuarter = Math.ceil(closingDate.getUTCMonth() / 3);
  const firstDayOfNextQuarter = new Date(
    closingDate.getUTCFullYear(),
    thisQuarter * 3,
    1
  );
  return new Date(endOfMonth(firstDayOfNextQuarter).setHours(0, 0, 0, 0));
}

function _getDebtPayoutSchedule(
  amount: number,
  interestRate: number,
  termMonths: number,
  paymentFreqMonths: number,
  closingDate: Date
) {
  const payoutSchedule: ReturnsDateObject[] = [];
  let distributionsCumulative = 0;
  let portfolioValueToDate = 0;
  let distributionDivisor = 4;
  let paymentFreq = paymentFreqMonths; //default to every 3 months
  if (paymentFreq === 0) {
    // one time payment at the end of the term
    paymentFreq = termMonths;
    distributionDivisor = 1;
  }
  const stats = {
    interestRateOrIrrPerc: interestRate,
    totalGrossReturn: 0,
    totalNetReturn: 0,
    investmentMultiple: 0,
  };

  let date = getPayoutScheduleStartDate(closingDate);
  for (let i = 1; i <= termMonths; i++) {
    // Move to next month
    date = startOfMonth(add(date, { months: 1 }));

    // Calculate distribution amount based on payment frequency
    let distributionAmount = 0;
    if (i % paymentFreq === 0 && i !== 0) {
      if (paymentFreq === termMonths) {
        // onetime payment at the end of the term:
        distributionAmount =
          (((amount * interestRate) / 100) * termMonths) / 12;
      } else {
        distributionAmount =
          (amount * interestRate) / 100 / distributionDivisor;
      }
    }

    // Handle final payment (principal + interest)
    if (i === termMonths) {
      distributionAmount += amount;
      // portfolioValueToDate -= amount;

      stats.totalGrossReturn = distributionsCumulative + distributionAmount;
      stats.totalNetReturn = distributionsCumulative - amount;
      stats.investmentMultiple =
        (distributionsCumulative + distributionAmount) / amount;
    }

    // Calculate running totals
    distributionsCumulative += distributionAmount;
    portfolioValueToDate += distributionAmount;

    // Round all numerical values for consistency
    const entry: ReturnsDateObject = {
      date,
      debtDistributionsCurrent: distributionAmount,
      debtDistributionsCumulative: distributionsCumulative,
      equityDistributionsCurrent: 0,
      equityDistributionCumulative: 0,
      equityAccruedPreferredReturn: 0,
      portfolioValueToDate: portfolioValueToDate,
      principalInvestedToDate: amount,
      principalInvestedCurrent: i === 1 ? amount : 0,
    };

    payoutSchedule.push(entry);
  }
  return { schedule: payoutSchedule, stats };
}

// Calculate debt payout schedule for a closed or in progress deal (used in dashboard)
export function getDebtPayoutScheduleForDeal(
  investmentStats: DealInvestmentStats,
  closingDate: Date
): ReturnsDateObject[] {
  if (!closingDate) {
    console.error('Closing date not provided for deal', investmentStats.dealId);
    throw new Error('Closing date not provided');
  }
  return _getDebtPayoutSchedule(
    investmentStats.amount,
    investmentStats.debtInterestRatePerc,
    investmentStats.debtTermMonthsMax,
    investmentStats.debtPaymentFreqMonths,
    closingDate
  ).schedule;
}

// Calculate debt payout schedule for a project (used to simulate returns before a deal has closed)
export function getDebtPayoutScheduleForProject(
  amount: number,
  investmentStats: ProjectInvestmentStats,
  closingDate: Date
) {
  const interestRate = getDebtInterestRate(amount, investmentStats);
  return _getDebtPayoutSchedule(
    amount,
    interestRate,
    investmentStats.debtTermMonthsMax,
    investmentStats.debtPaymentFreqMonths,
    closingDate
  );
}

// Helper function for consistent rounding
export function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

// used in dashboard for finalized deals
export function getEquityPayoutScheduleForDeal(
  stats: DealInvestmentStats,
  projectMilestones: ProjectMilestones,
  equityMilestones: ProjectMilestoneType[],
  shareOfEquity: number
): ReturnsDateObject[] {
  const { amount, unitType, equityPreferredReturn } = stats;
  return _getEquityPayoutSchedule(
    amount,
    projectMilestones,
    equityMilestones,
    shareOfEquity,
    unitType,
    equityPreferredReturn
  );
}

// used to simulate returns for equity financing
export function getEquityPayoutScheduleForProject(
  amount: number,
  projectMilestones: ProjectMilestones,
  equityMilestones: ProjectMilestoneType[],
  shareOfEquity: number,
  unitType: DealUnitType,
  preferredReturn: number
) {
  const schedule = _getEquityPayoutSchedule(
    amount,
    projectMilestones,
    equityMilestones,
    shareOfEquity,
    unitType,
    preferredReturn
  );
  const lastEntry = schedule[schedule.length - 1];
  if (!lastEntry) {
    console.error('No last entry found in equity payout schedule');
    throw new Error('No last entry found in equity payout');
  }
  const investmentMultiple = lastEntry.equityDistributionCumulative / amount;
  const periods = schedule.length - 1;
  const irr = periods > 0 ? (investmentMultiple - 1) / (periods / 12) : 0;
  const stats = {
    investmentMultiple,
    interestRateOrIrrPerc: roundTo(irr * 100, 2),
    totalGrossReturn: roundTo(lastEntry.equityDistributionCumulative, 2),
    totalNetReturn: roundTo(lastEntry.equityDistributionCumulative - amount, 2),
  } as ProjectReturnsStats;

  return { schedule, stats };
}

function _getEquityPayoutSchedule(
  amount: number,
  projectMilestones: ProjectMilestones,
  equityMilestones: ProjectMilestoneType[],
  shareOfEquity: number,
  unitType: DealUnitType,
  preferredReturn: number
) {
  const closingDate = projectMilestones.financialClosing;
  let date =
    closingDate.getUTCDate() !== 1 ? startOfMonth(closingDate) : closingDate;

  if (!equityMilestones?.length) {
    throw new Error('Milestone data not found in equity returns file');
  }

  let previousEntry: ReturnsDateObject | undefined = undefined;
  return equityMilestones.reduce<ReturnsDateObject[]>((schedule, em, index) => {
    if (!em) {
      throw new Error(`Invalid milestone data at index ${index}`);
    }
    if (index === 0) {
      return schedule;
    }
    // Advance date by one month
    date = startOfMonth(add(date, { months: 1 }));

    // Calculate distribution amount based on unit type
    const distributionAmount =
      shareOfEquity *
      (unitType === DealUnitType.CUNIT ? em.cUnitReturns : em.aUnitReturns);
    const equityDistributionCumulative =
      (previousEntry?.equityDistributionCumulative ?? 0) + distributionAmount;
    const preferredReturnCurrent = (amount * preferredReturn) / 12;
    const equityAccruedPreferredReturn = preferredReturnCurrent * index;
    const portfolioValueToDate = previousEntry
      ? previousEntry.portfolioValueToDate + distributionAmount
      : 0;
    // if(index === schedule.length - 1) {
    //     portfolioValueToDate -=amount
    // }
    schedule.push({
      date,
      debtDistributionsCurrent: 0,
      debtDistributionsCumulative: 0,
      equityDistributionsCurrent: distributionAmount,
      equityDistributionCumulative,
      portfolioValueToDate,
      principalInvestedToDate: amount,
      principalInvestedCurrent: index === 1 ? amount : 0,
      equityAccruedPreferredReturn,
    });

    previousEntry = schedule[schedule.length - 1];
    return schedule;
  }, []);
}

export async function getPortfolioReturns(
  deals: DealWithInvestmentStatsAndProjectWithPics[]
): Promise<PortfolioReturnsResponse> {
  const returnsObjectsByDate: Record<number, ReturnsDateObject[]> = {};
  const dealStats = [] as ReturnsDealStats[];
  const portfolioStats: ReturnsPortfolioStats = {
    portfolioValueToDate: 0,
    distributionsToDate: 0,
    debtDistributionsToDate: 0,
    equityDistributionsToDate: 0,
    projectedEquityDistributions: 0,
    projectedDebtDistributions: 0,
    projectedPortfolioValue: 0,
    principalInvested: 0,
  };

  // for each deal, get the payout schedule based on the financing type
  const resolvedSchedules = deals.map(async deal => {
    const { project, investmentStats, closingDate } = deal;
    if (!investmentStats) {
      Logger.warn(
        `!!!Investment stats missing for deal ${deal.id}. The deal will not be processed!`
      );
      return [];
    }
    if (!closingDate) {
      Logger.warn(
        `!!!Closing date is missing for deal ${deal.id}. The deal will not be processed!`
      );
      return [];
    }
    if (!project?.milestones || !project.equityReturnsFile) {
      Logger.warn(
        `!!!Project milestones or equity returns file not found for project of deal ${deal.id}. The deal will not be processed!`
      );
      return [];
    }
    if (!project.investmentStats) {
      Logger.warn(
        `!!!Project investment stats not found for project of deal ${deal.id}. The deal will not be processed!`
      );
      return [];
    }

    const dealSummary: ReturnsDealStats = {
      dealId: deal.id,
      status: deal.status ?? DealStatus.ACTIVE,
      committedAmount: investmentStats.amount,
      distributionsToDate: 0,
      distributionsProjected: 0,
      financingType:
        investmentStats.financingType === DealFinancingType.equity
          ? 'equity'
          : 'debt',
      closingDate: closingDate,
      project: {
        id: project.id,
        name: project.displayName,
        location: project.location,
        pictures: project.pictures,
      },
      conversionId:
        deal.startDealConversion?.id || deal.endDealConversion?.id || null,
    };
    const todayNumeric = new Date().getTime();
    portfolioStats.principalInvested += investmentStats.amount;
    portfolioStats.portfolioValueToDate += investmentStats.amount;
    if (investmentStats.financingType === DealFinancingType.equity) {
      try {
        const equityMilestones = await readEquityMilestoneData(
          project.equityReturnsFile
        );

        const projectEquityStats = await getEquityStatsFromProject(
          investmentStats.amount,
          project.equityReturnsFile,
          project.investmentStats.cUnitThresholdAmount
        );
        const schedule = getEquityPayoutScheduleForDeal(
          investmentStats,
          project.milestones,
          equityMilestones,
          projectEquityStats.shareOfEquity
        );

        if (!schedule.length) {
          Logger.warn(`Skipping deal ${deal.id}: No payout schedule generated`);
          return [];
        }

        schedule.forEach((dateObject, i) => {
          if (i === schedule.length - 1) {
            portfolioStats.projectedEquityDistributions +=
              dateObject.equityDistributionCumulative;
            portfolioStats.projectedPortfolioValue +=
              dateObject.equityDistributionCumulative;
          }
          const dateNo = dateObject.date.getTime();
          if (dateNo < todayNumeric) {
            portfolioStats.distributionsToDate +=
              dateObject.equityDistributionsCurrent;
            portfolioStats.portfolioValueToDate +=
              dateObject.equityDistributionsCurrent;
            portfolioStats.equityDistributionsToDate +=
              dateObject.equityDistributionsCurrent;

            dealSummary.distributionsToDate +=
              dateObject.equityDistributionsCurrent;
          } else {
            dealSummary.distributionsProjected +=
              dateObject.equityDistributionsCurrent;
          }
          if (!returnsObjectsByDate[dateNo]) {
            returnsObjectsByDate[dateNo] = [dateObject];
          } else {
            returnsObjectsByDate[dateNo].push(dateObject);
          }
        });
      } catch (e) {
        Logger.error(`Failed to get equity stats for deal ${deal.id}:`, null, {
          extra: e,
        });
        throw new Error(`Equity stats processing failed for deal ${deal.id}`);
        // return [];
      }
    } else if (
      investmentStats.financingType === DealFinancingType.promissory_note_now
    ) {
      const schedule = getDebtPayoutScheduleForDeal(
        investmentStats,
        closingDate
      );

      // console.log("debt schedule", schedule)
      schedule.forEach((dateObject, i) => {
        if (i === schedule.length - 1) {
          portfolioStats.projectedDebtDistributions +=
            dateObject.debtDistributionsCumulative;
          portfolioStats.projectedPortfolioValue +=
            dateObject.debtDistributionsCumulative;
        }
        const dateNo = dateObject.date.getTime();
        if (dateNo < todayNumeric) {
          portfolioStats.distributionsToDate +=
            dateObject.debtDistributionsCurrent;
          portfolioStats.portfolioValueToDate +=
            dateObject.debtDistributionsCurrent;
          portfolioStats.debtDistributionsToDate +=
            dateObject.debtDistributionsCurrent;

          dealSummary.distributionsToDate +=
            dateObject.debtDistributionsCurrent;
        } else {
          dealSummary.distributionsProjected +=
            dateObject.debtDistributionsCurrent;
        }
        if (!returnsObjectsByDate[dateNo]) {
          returnsObjectsByDate[dateNo] = [dateObject];
        } else {
          returnsObjectsByDate[dateNo].push(dateObject);
        }
        return {
          ...dateObject,
          // dealId: deal.id,
        };
      });
    } else {
      Logger.warn(
        `Financing type ${investmentStats.financingType} not supported for dashboard graph - deal ${deal.id}`
      );
      return [];
    }

    Logger.log({
      message: `adding to deal stats: ${dealSummary.dealId} - ${dealSummary.financingType.toUpperCase()}, \tamt:${dealSummary.committedAmount}\ttodate: ${dealSummary.distributionsToDate}\tproj: ${dealSummary.distributionsProjected}`,
    });
    dealStats.push(dealSummary);
    // console.log(`Deal ${deal.id} stats:`, dealSummary);
  });

  await Promise.all(resolvedSchedules);

  const consolidatedSchedule = [] as ReturnsDateObject[];
  let previousDateObject: ReturnsDateObject | undefined;

  const sortedKeys = Object.keys(returnsObjectsByDate).sort((a, b) =>
    a <= b ? -1 : 1
  );
  // console.log("Sorted keys:", sortedKeys.map(key => new Date(parseInt(key)).toDateString()));
  sortedKeys.forEach(key => {
    const dateObjects = returnsObjectsByDate[parseInt(key)];
    if (!dateObjects?.length) {
      Logger.warn(`Empty date objects for key: ${key}`);
      return;
    } else {
      // combine the date objects for the same date
      const combinedDateObject = dateObjects.reduce((acc, curr) => {
        acc.debtDistributionsCurrent += curr.debtDistributionsCurrent;
        acc.debtDistributionsCumulative += curr.debtDistributionsCumulative;
        acc.equityDistributionsCurrent += curr.equityDistributionsCurrent;
        acc.equityDistributionCumulative += curr.equityDistributionCumulative;
        acc.portfolioValueToDate += curr.portfolioValueToDate;
        acc.principalInvestedCurrent += curr.principalInvestedCurrent;
        acc.principalInvestedToDate += curr.principalInvestedToDate;
        return acc;
      });

      if (previousDateObject) {
        combinedDateObject.equityDistributionCumulative =
          previousDateObject.equityDistributionCumulative +
          combinedDateObject.equityDistributionsCurrent;
        combinedDateObject.debtDistributionsCumulative =
          previousDateObject.debtDistributionsCumulative +
          combinedDateObject.debtDistributionsCurrent;
        combinedDateObject.portfolioValueToDate =
          previousDateObject.portfolioValueToDate +
          combinedDateObject.debtDistributionsCurrent +
          combinedDateObject.equityDistributionsCurrent;
        combinedDateObject.principalInvestedToDate =
          previousDateObject.principalInvestedToDate +
          combinedDateObject.principalInvestedCurrent;
      }
      previousDateObject = combinedDateObject;
      consolidatedSchedule.push(combinedDateObject);
    }
  });
  return {
    consolidatedSchedule,
    portfolioStats,
    dealStats,
  } as PortfolioReturnsResponse;
}

export async function validateEquityMilestonesFile(
  storageUrl: string,
  project: ProjectWithInvestmentStats
) {
  // parse the csv file with some test data
  const projectEquityStats = await getEquityStatsFromProject(
    100000,
    storageUrl,
    200000
  );
  const { equityMilestones } = projectEquityStats;
  if (
    equityMilestones.length !==
    project.investmentStats?.equityTermMonths + 1
  ) {
    Logger.log({
      message: `milestones length: ${equityMilestones.length}, project term: ${project.investmentStats?.equityTermMonths}`,
    });
    return false;
  }
  return true;
}
