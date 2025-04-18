import 'server-only';
import {
  type DealInvestmentStats,
  DealUnitType,
  DealFinancingType,
  type ProjectInvestmentStats,
  type ProjectMilestones,
} from '@prisma/client';
import { parse } from 'csv-parse';
import {
  add,
  endOfMonth,
  startOfMonth,
  differenceInCalendarDays,
  formatISO,
  isLeapYear,
} from 'date-fns';
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
import {
  generateConsolidatedSchedules,
  generateResolvedSchedules,
  getInitialPortfolioStats,
} from './portfolio-returns';

const finishedAsync = promisify(finished);

export async function readEquityMilestoneData(
  csvUrl: string
): Promise<ProjectMilestoneType[]> {
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
  cUnitThresholdAmount: number,
  equityMilestonesData?: ProjectMilestoneType[]
) {
  let unitType: DealUnitType = DealUnitType.AUNIT;
  let numberCUnits = 0;
  let numberAUnits = 0;
  let shareOfEquity = 0;

  const equityMilestones: ProjectMilestoneType[] | undefined =
    equityMilestonesData ||
    (await readEquityMilestoneData(equityReturnsFileUrl));

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

function parseDebtInterestOverrides(): Map<string, number> {
  const envVar = process.env.DEBT_INTEREST_PERIOD_OVERRIDES;
  const map = new Map<string, number>();

  if (!envVar) return map;

  for (const pair of envVar.split(';')) {
    const [dateStr, valueStr] = pair.split(',');
    if (dateStr && valueStr) {
      const parsed = parseInt(valueStr.trim(), 10);
      if (!isNaN(parsed)) {
        map.set(dateStr.trim(), parsed);
      }
    }
  }

  return map;
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

  const stats = {
    interestRateOrIrrPerc: interestRate,
    totalGrossReturn: 0,
    totalNetReturn: 0,
    investmentMultiple: 0,
  };

  // Default payment frequency
  const paymentFreq = paymentFreqMonths === 0 ? termMonths : paymentFreqMonths;

  const dayOverrides = parseDebtInterestOverrides();
  let date = getPayoutScheduleStartDate(closingDate);
  let lastPaymentDate = closingDate;

  for (let i = 1; i <= termMonths; i++) {
    // Move to next month
    date = startOfMonth(add(date, { months: 1 }));

    let distributionAmount = 0;

    const isPaymentPeriod = i % paymentFreq === 0;
    const dateKey = formatISO(date, { representation: 'date' }); // e.g., 2025-04-01

    if (isPaymentPeriod || i === termMonths) {
      let daysInPeriod: number;
      if (dayOverrides.has(dateKey)) {
        daysInPeriod = dayOverrides.get(dateKey)!;
      } else {
        daysInPeriod = differenceInCalendarDays(date, lastPaymentDate);
      }

      const daysInYear = isLeapYear(date) ? 366 : 365;

      const interestAccrued =
        (daysInPeriod / daysInYear) * amount * (interestRate / 100);

      distributionAmount = interestAccrued;

      // Include principal only in final payment
      if (i === termMonths) {
        distributionAmount += amount;

        stats.totalGrossReturn = distributionsCumulative + distributionAmount;
        stats.totalNetReturn = distributionsCumulative - amount;
        stats.investmentMultiple =
          (distributionsCumulative + distributionAmount) / amount;
      }

      lastPaymentDate = date;
    }

    distributionsCumulative += distributionAmount;
    portfolioValueToDate += distributionAmount;

    const entry: ReturnsDateObject = {
      date,
      debtDistributionsCurrent: distributionAmount,
      debtDistributionsCumulative: distributionsCumulative,
      equityDistributionsCurrent: 0,
      equityDistributionCumulative: 0,
      equityAccruedPreferredReturn: 0,
      portfolioValueToDate,
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

/**
 * Calculates the portfolio-wide return statistics, schedules, and individual deal summaries.
 *
 * @param {DealWithInvestmentStatsAndProjectWithPics[]} deals - The list of deals to process.
 * @returns {Promise<PortfolioReturnsResponse>} Portfolio-wide returns response including schedules and stats.
 *
 * @example
 * const result = await getPortfolioReturns(deals);
 * // {
 * //   consolidatedSchedule: [...],
 * //   portfolioStats: { ... },
 * //   dealStats: [...]
 * // }
 */
export async function getPortfolioReturns(
  deals: DealWithInvestmentStatsAndProjectWithPics[]
): Promise<PortfolioReturnsResponse> {
  const returnsObjectsByDate: Record<number, ReturnsDateObject[]> = {};
  const dealStats = [] as ReturnsDealStats[];
  const portfolioStats: ReturnsPortfolioStats = getInitialPortfolioStats();

  // for each deal, get the payout schedule based on the financing type
  await generateResolvedSchedules(
    deals,
    portfolioStats,
    returnsObjectsByDate,
    dealStats
  );

  //Fix calculation for portfolioStats.equityAccruedPreferredReturn
  const { totalEquityPreferredReturn } = getEquityReturnAccuredToDate(deals);
  portfolioStats.equityAccruedPreferredReturn = totalEquityPreferredReturn;

  //Fix calculation for portfolioStats.portfolioValueToDate
  portfolioStats.portfolioValueToDate =
    portfolioStats.principalInvested +
    portfolioStats.equityAccruedPreferredReturn +
    portfolioStats.debtDistributionsToDate;

  const consolidatedSchedule =
    generateConsolidatedSchedules(returnsObjectsByDate);

  return {
    consolidatedSchedule,
    portfolioStats,
    dealStats,
  } as PortfolioReturnsResponse;
}

/**
 * Calculates the total equity preferred return accrued to date for all equity deals.
 *
 * @param {DealWithInvestmentStatsAndProjectWithPics[]} deals - The list of deals to process.
 * @returns {Object} An object containing the total equity preferred return and raw metrics.
 *
 * @example
 * const result = getEquityReturnAccuredToDate(deals);
 * // {
 * //   totalEquityPreferredReturn: 10000,
 * //   rawMetrics: [...],
 */
export const getEquityReturnAccuredToDate = (
  deals: DealWithInvestmentStatsAndProjectWithPics[]
) => {
  let totalEquityPreferredReturn = 0;
  const rawMetrics = [];

  for (const deal of deals) {
    // Require equity deal
    // Require equity preferred return
    // Require closing date
    // Require amount
    if (
      deal.investmentStats?.financingType !== DealFinancingType.equity ||
      !deal.project?.investmentStats?.equityPreferredReturn ||
      !deal.closingDate ||
      !deal.investmentStats?.amount
    ) {
      continue;
    }

    const equityPreferredReturn =
      deal.project.investmentStats.equityPreferredReturn;
    const closingDate = deal.closingDate;
    const amount = deal.investmentStats.amount;

    const daysSinceClose = differenceInCalendarDays(new Date(), closingDate);
    const perDealAccrued =
      amount * (equityPreferredReturn / 365) * daysSinceClose;

    rawMetrics.push({
      dealId: deal.id,
      amount,
      equityPreferredReturn,
      closingDate,
      daysSinceClose,
      perDealAccrued,
    });

    totalEquityPreferredReturn += perDealAccrued;
  }

  return {
    rawMetrics,
    totalEquityPreferredReturn,
  };
};
