import {
  type DealInvestmentStats,
  DealUnitType,
  type ProjectInvestmentStats,
  type ProjectMilestones,
} from '@prisma/client';
import { parse } from 'csv-parse';
import { add, endOfMonth, startOfMonth } from 'date-fns';
import type { ProjectReturnsStats, ReturnsDateObject } from './schema';
import { finished } from 'stream';
import { promisify } from 'util';

const finishedAsync = promisify(finished);

interface MilestoneType {
  date: Date;
  aUnitReturns: number;
  cUnitReturns: number;
}
export async function readEquityMilestoneData(csvUrl: string) {
  if (!csvUrl) {
    console.error('CSV url not provided');
    throw new Error('CSV url not provided');
  }
  const response = await fetch(csvUrl);
  const text = await response.text();
  const parser = parse(text, { columns: true });

  const milestones: MilestoneType[] = [];
  parser.on('readable', function () {
    let record;
    /* eslint-disable */
    while ((record = parser.read()) !== null) {
      const milestone: MilestoneType = {
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
      /* eslint-enable */
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
  try {
    const equityMilestones =
      await readEquityMilestoneData(equityReturnsFileUrl);

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

export function getDebtUnitType(amount: number, investmentStats: ProjectInvestmentStats) {
  return amount >= investmentStats.interestRateDollarThreshold ? DealUnitType.BUNIT : DealUnitType.AUNIT;
}

// find last day of first month of next quarter
export function getPayoutScheduleStartDate(closingDate: Date) {
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
  equityMilestones: MilestoneType[]
): ReturnsDateObject[] {
  const { amount, shareOfEquity, unitType, equityPreferredReturn } = stats;
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
  equityMilestones: MilestoneType[],
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
  const irr = (investmentMultiple - 1) / ((schedule.length - 1) / 12);
  const stats = {
    investmentMultiple,
    interestRateOrIrrPerc: roundTo(irr * 100, 2),
    totalGrossReturn: lastEntry.equityDistributionCumulative,
    totalNetReturn: lastEntry.equityDistributionCumulative - amount,
  } as ProjectReturnsStats;

  return { schedule, stats };
}

function _getEquityPayoutSchedule(
  amount: number,
  projectMilestones: ProjectMilestones,
  equityMilestones: MilestoneType[],
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
