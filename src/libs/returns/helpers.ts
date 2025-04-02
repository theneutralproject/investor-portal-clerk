import {
  DealStatus,
  DealFinancingType,
  DealInvestmentStats,
  Project,
  ProjectInvestmentStats,
  ProjectMilestones,
  ProjectPicture,
} from '@prisma/client';
import Logger from '../logger';
import { DealWithInvestmentStatsAndProjectWithPics } from '../types';
import {
  PortfolioReturnsResponse,
  ReturnsDateObject,
  ReturnsDealStats,
  ReturnsPortfolioStats,
} from './schema';
import {
  readEquityMilestoneData,
  getEquityStatsFromProject,
  getEquityPayoutScheduleForDeal,
  getDebtPayoutScheduleForDeal,
  roundTo,
} from './utils.server';

type IProjectWithStatsAndPics = Project & {
  milestones: ProjectMilestones;
  pictures: ProjectPicture[];
  investmentStats: ProjectInvestmentStats;
};

type IReturnsByDateObject = Record<number, ReturnsDateObject[]>;

/**
 * Initializes a blank ReturnsPortfolioStats object with zeroed values.
 *
 * @returns {ReturnsPortfolioStats} Initial portfolio stats.
 */
const getInitialPortfolioStats = (): ReturnsPortfolioStats => {
  return {
    portfolioValueToDate: 0,
    distributionsToDate: 0,
    debtDistributionsToDate: 0,
    equityDistributionsToDate: 0,
    projectedEquityDistributions: 0,
    projectedDebtDistributions: 0,
    projectedPortfolioValue: 0,
    principalInvested: 0,
  };
};

/**
 * Checks whether a deal contains the required data to be processed.
 *
 * @param {DealWithInvestmentStatsAndProjectWithPics} deal - The deal to validate.
 * @returns {boolean} Whether the deal has all required fields.
 *
 * @example
 * isValidDeal(deal); // true or false
 */
export const isValidDeal = (
  deal: DealWithInvestmentStatsAndProjectWithPics
): boolean => {
  const { investmentStats, closingDate, project } = deal;

  if (!investmentStats) {
    Logger.warn(
      `!!!Investment stats missing for deal ${deal.id}. The deal will not be processed!`
    );
    return false;
  }

  if (!closingDate) {
    Logger.warn(
      `!!!Closing date is missing for deal ${deal.id}. The deal will not be processed!`
    );
    return false;
  }

  if (!project?.milestones || !project.equityReturnsFile) {
    Logger.warn(
      `!!!Project milestones or equity returns file not found for project of deal ${deal.id}. The deal will not be processed!`
    );
    return false;
  }

  if (!project.investmentStats) {
    Logger.warn(
      `!!!Project investment stats not found for project of deal ${deal.id}. The deal will not be processed!`
    );
    return false;
  }

  return true;
};

/**
 * Constructs a ReturnsDealStats object with initial values based on a deal.
 *
 * @param {DealWithInvestmentStatsAndProjectWithPics} deal - Deal to extract data from.
 * @returns {ReturnsDealStats} Initialized stats for the given deal.
 *
 * @example
 * {
 *   dealId: 123,
 *   status: 'active',
 *   committedAmount: 10000,
 *   distributionsToDate: 0,
 *   distributionsProjected: 0,
 *   financingType: 'equity',
 *   closingDate: new Date(),
 *   project: {
 *     id: 55,
 *     name: 'Project Alpha',
 *     location: 'NYC',
 *     pictures: [...]
 *   },
 *   conversionId: null
 * }
 */
export const initializeDealSummary = (
  deal: DealWithInvestmentStatsAndProjectWithPics
): ReturnsDealStats => {
  const {
    investmentStats,
    status,
    closingDate,
    project,
    startDealConversion,
    endDealConversion,
  } = deal;

  return {
    dealId: deal.id,
    status: status ?? DealStatus.ACTIVE,
    committedAmount: investmentStats?.amount ?? 0,
    distributionsToDate: 0,
    distributionsProjected: 0,
    financingType:
      investmentStats?.financingType === DealFinancingType.equity
        ? 'equity'
        : 'debt',
    closingDate: closingDate!,
    project: {
      id: project!.id,
      name: project!.displayName,
      location: project!.location,
      pictures: project!.pictures,
    },
    conversionId: startDealConversion?.id || endDealConversion?.id || null,
  };
};

/**
 * Rounds key numeric values in the given deal summary to two decimal places and logs them.
 *
 * @param {ReturnsDealStats} dealSummary - The deal summary to round.
 *
 * @example
 * roundDealSummary(dealSummary);
 * // dealSummary.distributionsToDate becomes 1234.57 instead of 1234.5678
 */
export function roundDealSummary(dealSummary: ReturnsDealStats): void {
  // round all numerical values for to 2 decimal places
  dealSummary.distributionsToDate = roundTo(dealSummary.distributionsToDate, 2);
  dealSummary.distributionsProjected = roundTo(
    dealSummary.distributionsProjected,
    2
  );
  dealSummary.committedAmount = roundTo(dealSummary.committedAmount, 2);

  Logger.log({
    message: `adding to deal stats: ${dealSummary.dealId} - ${dealSummary.financingType.toUpperCase()}, \tamt:${dealSummary.committedAmount}\ttodate: ${dealSummary.distributionsToDate}\tproj: ${dealSummary.distributionsProjected}`,
  });
}

/**
 * Calculates the equity payout schedule and updates the portfolio and deal stats.
 *
 * @param {number} dealId - ID of the deal being processed.
 * @param {ReturnsDealStats} dealSummary - Deal-level stats to update.
 * @param {DealInvestmentStats} investmentStats - Investment details.
 * @param {ReturnsPortfolioStats} portfolioStats - Aggregated portfolio-level stats.
 * @param {IProjectWithStatsAndPics} project - The associated project with milestones and returns file.
 * @param {IReturnsByDateObject} returnsObjectsByDate - Object storing returns per date.
 * @param {number} time - Current timestamp in ms used to determine if a return is past or future.
 * @returns {Promise<void>} A promise that resolves when processing is complete.
 *
 * @example
 * await calculateEquityDeal(123, dealSummary, investmentStats, portfolioStats, project, returnsByDate, Date.now());
 * // Updates dealSummary and portfolioStats in place
 */
export const calculateEquityDeal = async (
  dealId: number,
  dealSummary: ReturnsDealStats,
  investmentStats: DealInvestmentStats,
  portfolioStats: ReturnsPortfolioStats,
  project: IProjectWithStatsAndPics,
  returnsObjectsByDate: IReturnsByDateObject,
  time: number
): Promise<void> => {
  if (!project) {
    Logger.error(
      `Failed to calculate equity stats for deal ${dealId}: project is null/undefined`
    );
    throw new Error(
      `Failed to calculate equity stats for deal ${dealId}: project is null/undefined`
    );
  }
  try {
    const equityMilestones = await readEquityMilestoneData(
      project.equityReturnsFile
    );

    const projectEquityStats = await getEquityStatsFromProject(
      investmentStats.amount,
      project.equityReturnsFile,
      project.investmentStats.cUnitThresholdAmount,
      equityMilestones
    );
    const schedule = getEquityPayoutScheduleForDeal(
      investmentStats,
      project.milestones,
      equityMilestones,
      projectEquityStats.shareOfEquity
    );

    if (!schedule.length) {
      Logger.warn(`Skipping deal ${dealId}: No payout schedule generated`);
      return;
    }

    schedule.forEach((dateObject, i) => {
      if (i === schedule.length - 1) {
        dateObject.portfolioValueToDate = -investmentStats.amount; // subtract principal on last date
        portfolioStats.projectedEquityDistributions +=
          dateObject.equityDistributionCumulative;
        portfolioStats.projectedPortfolioValue +=
          dateObject.equityDistributionCumulative;
      }

      const dateNo = dateObject.date.getTime();
      if (dateNo < time) {
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

      returnsObjectsByDate[dateNo] ??= [];
      returnsObjectsByDate[dateNo].push(dateObject);
    });
  } catch (e) {
    Logger.error(`Failed to get equity stats for deal ${dealId}:`, null, {
      extra: e,
    });
    throw new Error(`Equity stats processing failed for deal ${dealId}`);
  }
};

/**
 * Calculates the debt payout schedule and updates the portfolio and deal stats.
 *
 * @param {ReturnsDealStats} dealSummary - Deal-level stats to update.
 * @param {DealInvestmentStats} investmentStats - Investment details.
 * @param {Date} closingDate - Date when the deal was closed.
 * @param {ReturnsPortfolioStats} portfolioStats - Aggregated portfolio-level stats.
 * @param {IReturnsByDateObject} returnsObjectsByDate - Object storing returns per date.
 * @param {number} time - Current timestamp in ms used to determine if a return is past or future.
 *
 * @example
 * calculateDebtDeal(dealSummary, investmentStats, new Date('2024-01-01'), portfolioStats, returnsByDate, Date.now());
 * // Updates dealSummary and returnsObjectsByDate in place
 */
export const calculateDebtDeal = (
  dealSummary: ReturnsDealStats,
  investmentStats: DealInvestmentStats,
  closingDate: Date,
  portfolioStats: ReturnsPortfolioStats,
  returnsObjectsByDate: IReturnsByDateObject,
  time: number
): void => {
  const schedule = getDebtPayoutScheduleForDeal(investmentStats, closingDate);

  schedule.forEach((dateObject, i) => {
    if (i === schedule.length - 1) {
      dateObject.portfolioValueToDate = -investmentStats.amount; // subtract principal
      portfolioStats.projectedDebtDistributions +=
        dateObject.debtDistributionsCumulative;
      portfolioStats.projectedPortfolioValue +=
        dateObject.debtDistributionsCumulative;
    }

    const dateNo = dateObject.date.getTime();
    if (dateNo < time) {
      portfolioStats.distributionsToDate += dateObject.debtDistributionsCurrent;
      portfolioStats.portfolioValueToDate +=
        dateObject.debtDistributionsCurrent;
      portfolioStats.debtDistributionsToDate +=
        dateObject.debtDistributionsCurrent;

      dealSummary.distributionsToDate += dateObject.debtDistributionsCurrent;
    } else {
      dealSummary.distributionsProjected += dateObject.debtDistributionsCurrent;
    }

    returnsObjectsByDate[dateNo] ??= [];
    returnsObjectsByDate[dateNo].push(dateObject);
    return {
      ...dateObject,
      // dealId: deal.id,
    };
  });
};

/**
 * Iterates through all valid deals and populates their respective payout schedules,
 * updating portfolio statistics and appending to the dealStats array.
 *
 * @param {DealWithInvestmentStatsAndProjectWithPics[]} deals - List of deals to process.
 * @param {ReturnsPortfolioStats} portfolioStats - Overall portfolio statistics to update.
 * @param {IReturnsByDateObject} returnsObjectsByDate - Grouped returns data by date.
 * @param {ReturnsDealStats[]} dealStats - Array to which individual deal stats are added.
 * @returns {Promise<void[]>} Promise resolving once all deals are processed.
 *
 * @example
 * await generateResolvedSchedules(deals, portfolioStats, returnsByDate, Date.now(), []);
 * // Each valid deal updates returns and stats accordingly
 */
export const generateResolvedSchedules = async (
  deals: DealWithInvestmentStatsAndProjectWithPics[],
  portfolioStats: ReturnsPortfolioStats,
  returnsObjectsByDate: IReturnsByDateObject,
  dealStats: ReturnsDealStats[]
) => {
  const time = new Date().getTime();

  const resolvedSchedules = deals.map(async deal => {
    const { investmentStats, project, closingDate } = deal;
    if (!isValidDeal(deal)) return;

    const investStats = investmentStats!;
    const dealSummary = initializeDealSummary(deal);
    portfolioStats.principalInvested += investStats.amount;
    portfolioStats.portfolioValueToDate += investStats.amount;

    // Handle equity deal
    if (investStats.financingType === DealFinancingType.equity) {
      await calculateEquityDeal(
        deal.id,
        dealSummary,
        investStats,
        portfolioStats,
        project as IProjectWithStatsAndPics,
        returnsObjectsByDate,
        time
      );
    } else if (
      // Calculate debt deal
      investStats.financingType === DealFinancingType.promissory_note_now
    ) {
      calculateDebtDeal(
        dealSummary,
        investStats,
        closingDate!,
        portfolioStats,
        returnsObjectsByDate,
        time
      );
    } else {
      // Otherwise return empty array
      Logger.warn(
        `Financing type ${investStats.financingType} not supported for dashboard graph - deal ${deal.id}`
      );
      return [];
    }

    roundDealSummary(dealSummary);
    dealStats.push(dealSummary);
  });

  return await Promise.all(resolvedSchedules);
};

/**
 * Merges two ReturnsDateObject entries into one by summing relevant fields.
 *
 * @param {ReturnsDateObject} acc - The accumulator (first object).
 * @param {ReturnsDateObject} curr - The current entry being combined.
 * @returns {ReturnsDateObject} A single ReturnsDateObject with summed values.
 *
 * @example
 * combineDateObjects(obj1, obj2);
 * // Returns a new object with fields summed like:
 * {
 *   debtDistributionsCurrent: 300,
 *   equityDistributionsCurrent: 400,
 *   ...
 * }
 */
export const combineDateObjects = (
  acc: ReturnsDateObject,
  curr: ReturnsDateObject
): ReturnsDateObject => {
  return {
    ...acc,
    debtDistributionsCurrent:
      acc.debtDistributionsCurrent + curr.debtDistributionsCurrent,
    debtDistributionsCumulative:
      acc.debtDistributionsCumulative + curr.debtDistributionsCumulative,
    equityDistributionsCurrent:
      acc.equityDistributionsCurrent + curr.equityDistributionsCurrent,
    equityDistributionCumulative:
      acc.equityDistributionCumulative + curr.equityDistributionCumulative,
    principalInvestedCurrent:
      acc.principalInvestedCurrent + curr.principalInvestedCurrent,
    principalInvestedToDate:
      acc.principalInvestedToDate + curr.principalInvestedToDate,
    portfolioValueToDate: acc.portfolioValueToDate + curr.portfolioValueToDate,
    date: acc.date,
  };
};

/**
 * Consolidates all date-based return entries into a sequential, cumulative payout schedule.
 *
 * @param {Record<number, ReturnsDateObject[]>} returnsByDate - Grouped return objects by timestamp.
 * @returns {ReturnsDateObject[]} Consolidated list of cumulative returns over time.
 *
 * @example
 * generateConsolidatedSchedules({ 1712000000000: [obj1, obj2], 1713000000000: [obj3] });
 * // Returns an array of ReturnsDateObject entries with cumulative values by date
 */
export const generateConsolidatedSchedules = (
  returnsByDate: Record<number, ReturnsDateObject[]>
) => {
  const sortedDates = Object.keys(returnsByDate).sort((a, b) => +a - +b);
  const consolidated: ReturnsDateObject[] = [];
  let previous: ReturnsDateObject | undefined;

  for (const dateKey of sortedDates) {
    const entries = returnsByDate[+dateKey];
    if (!entries?.length) return;

    const combined = entries.reduce(combineDateObjects);

    if (previous) {
      combined.equityDistributionCumulative =
        previous.equityDistributionCumulative +
        combined.equityDistributionsCurrent;
      combined.debtDistributionsCumulative =
        previous.debtDistributionsCumulative +
        combined.debtDistributionsCurrent;
      combined.principalInvestedToDate =
        previous.principalInvestedToDate + combined.principalInvestedCurrent;
      combined.portfolioValueToDate =
        combined.equityDistributionCumulative +
        combined.debtDistributionsCumulative;
    }

    previous = combined;
    consolidated.push(combined);
  }

  return consolidated;
};

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

  const consolidatedSchedule =
    generateConsolidatedSchedules(returnsObjectsByDate);

  return {
    consolidatedSchedule,
    portfolioStats,
    dealStats,
  } as PortfolioReturnsResponse;
}
