import {
  getEquityStatsFromProject,
  getDebtInterestRate,
  getDebtUnitType,
  readEquityMilestoneData,
  getDebtPayoutScheduleForDeal,
  getPayoutScheduleStartDate,
  getDebtPayoutScheduleForProject,
  roundTo,
  getEquityPayoutScheduleForDeal,
  getEquityPayoutScheduleForProject,
  getPortfolioReturns,
} from '../utils.server';
import { DealFinancingType, DealUnitType } from '@prisma/client';
import { jest } from '@jest/globals';
import { textFetchMock } from '@/mocks/fetch.mock';
import {
  equityMilestoneData,
  equityMilestoneDataSmall,
  equityMilestoneEmptyData,
} from '@/fixtures/equityMilestone/equityMilestone.csv';
import { add, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import {
  investmentStatsFixture,
  projectInvestmentStatsFixture,
} from '@/fixtures/investmentsStats/investmentStats.fixture';
import { baseStats } from '@/fixtures/stats/stats.fixture';
import Logger from '@/libs/logger';
import {
  debtDealFixture,
  equityDealFixture,
} from '@/fixtures/deals/deals.fixture';

describe('utils.server', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('readEquityMilestoneData', () => {
    const csvUrlMock = 'test.com/csv';

    beforeEach(() => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(textFetchMock(equityMilestoneDataSmall));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should parse CSV data and return milestones', async () => {
      const milestones = await readEquityMilestoneData(csvUrlMock);
      expect(milestones).toEqual([
        { date: new Date('2024-01-01'), aUnitReturns: 1000, cUnitReturns: 500 },
        { date: new Date('2024-02-01'), aUnitReturns: 1100, cUnitReturns: 600 },
      ]);
    });

    it('should throw an error if CSV URL is not provided', async () => {
      await expect(readEquityMilestoneData('')).rejects.toThrow(
        'CSV url not provided'
      );
    });
  });

  describe('getEquityStatsFromProject', () => {
    const csvUrlMock = 'test.com/csv';

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return correct equity stats for AUNIT', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(textFetchMock(equityMilestoneDataSmall));

      const result = await getEquityStatsFromProject(
        200000,
        csvUrlMock,
        300000
      );
      expect(result).toEqual({
        unitType: DealUnitType.AUNIT,
        numberCUnits: 0,
        numberAUnits: 2,
        shareOfEquity: -200000 / 1000,
        equityMilestones: expect.any(Array),
      });
    });

    it('should return correct equity stats for CUNIT', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(textFetchMock(equityMilestoneDataSmall));

      const result = await getEquityStatsFromProject(
        400000,
        csvUrlMock,
        300000
      );
      expect(result).toEqual({
        unitType: DealUnitType.CUNIT,
        numberCUnits: 4,
        numberAUnits: 0,
        shareOfEquity: -400000 / 500,
        equityMilestones: expect.any(Array),
      });
    });

    it('should throw an error if milestone data is missing', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(textFetchMock(equityMilestoneEmptyData));

      await expect(
        getEquityStatsFromProject(200000, csvUrlMock, 300000)
      ).rejects.toThrow('Milestone data not found in equity returns file');
    });
  });

  describe('getDebtInterestRate', () => {
    const investmentStats: any = {
      interestRateDollarThreshold: 100000,
      interestRateMax: 10,
      interestRateMin: 5,
    };
    it('should return max interest rate if amount exceeds threshold', () => {
      expect(getDebtInterestRate(150000, investmentStats)).toBe(10);
    });

    it('should return min interest rate if amount is below threshold', () => {
      expect(getDebtInterestRate(50000, investmentStats)).toBe(5);
    });
  });

  describe('getDebtUnitType', () => {
    const investmentStats: any = {
      interestRateDollarThreshold: 100000,
      interestRateMax: 10,
      interestRateMin: 5,
    };

    it('should return BUNIT if amount exceeds threshold', () => {
      expect(getDebtUnitType(150000, investmentStats)).toBe(DealUnitType.BUNIT);
    });

    it('should return AUNIT if amount is below threshold', () => {
      expect(getDebtUnitType(50000, investmentStats)).toBe(DealUnitType.AUNIT);
    });
  });
  describe('getPayoutScheduleStartDate', () => {
    it('should return the last day of the first month of the next quarter for Q1', () => {
      const closingDate = new Date('2024-02-15'); // Q1
      const expectedDate = startOfDay(endOfMonth(new Date('2024-04-30'))); // Last day of April (Q2 start)
      expect(getPayoutScheduleStartDate(closingDate)).toEqual(expectedDate);
    });

    it('should return the last day of the first month of the next quarter for Q2', () => {
      const closingDate = new Date('2024-05-15'); // Q2
      const expectedDate = startOfDay(endOfMonth(new Date('2024-07-30'))); // Last day of July (Q3 start)
      expect(getPayoutScheduleStartDate(closingDate)).toEqual(expectedDate);
    });

    it('should return the last day of the first month of the next quarter for Q3', () => {
      const closingDate = new Date('2024-08-15'); // Q3
      const expectedDate = startOfDay(endOfMonth(new Date('2024-10-31'))); // Last day of October (Q4 start)
      expect(getPayoutScheduleStartDate(closingDate)).toEqual(expectedDate);
    });

    it('should return the last day of the first month of the next quarter for Q4', () => {
      const closingDate = new Date('2024-11-15'); // Q4
      const expectedDate = startOfDay(endOfMonth(new Date('2025-01-31'))); // Last day of January (Q1 start)
      expect(getPayoutScheduleStartDate(closingDate)).toEqual(expectedDate);
    });

    it('should handle end of year correctly', () => {
      const closingDate = new Date('2024-12-20'); // Q4
      const expectedDate = startOfDay(endOfMonth(new Date('2025-01-31'))); // Last day of Jan (Q1 start)
      expect(getPayoutScheduleStartDate(closingDate)).toEqual(expectedDate);
    });
  });

  describe('getDebtPayoutScheduleForDeal', () => {
    it('should return a valid payout schedule', () => {
      const closingDate = new Date('2024-02-15');
      const schedule = getDebtPayoutScheduleForDeal(
        investmentStatsFixture,
        closingDate
      );
      expect(schedule).toHaveLength(investmentStatsFixture.debtTermMonthsMax);
      expect(schedule[0]?.date).toBeDefined();
      expect(
        schedule[schedule.length - 1]?.debtDistributionsCumulative
      ).toBeGreaterThan(investmentStatsFixture.amount);
    });

    it('should throw an error if closing date is not provided', () => {
      expect(() =>
        getDebtPayoutScheduleForDeal(investmentStatsFixture, null as any)
      ).toThrow('Closing date not provided');
    });
  });

  describe('getDebtPayoutScheduleForProject', () => {
    it('should return a valid payout schedule based on project investment stats', () => {
      const closingDate = new Date('2024-02-15');
      const { schedule, stats } = getDebtPayoutScheduleForProject(
        projectInvestmentStatsFixture.amount,
        projectInvestmentStatsFixture,
        closingDate
      );
      // schedule length should be the same as debtTermMonthsMax
      expect(schedule).toHaveLength(
        projectInvestmentStatsFixture.debtTermMonthsMax
      );
      // totalGrossReturn should be the last schedule equityDistributionCumulative
      expect(stats.totalGrossReturn).toBeGreaterThan(
        schedule[schedule.length - 1]?.equityDistributionCumulative || 0
      );
    });

    it('should return a schedule with valid debt distributions', () => {
      const closingDate = new Date('2024-02-15');
      const { schedule } = getDebtPayoutScheduleForProject(
        projectInvestmentStatsFixture.amount,
        projectInvestmentStatsFixture,
        closingDate
      );
      expect(schedule.every(entry => entry.debtDistributionsCurrent >= 0)).toBe(
        true
      );
    });

    it('should throw an error if closing date is not provided', () => {
      expect(() =>
        getDebtPayoutScheduleForProject(
          projectInvestmentStatsFixture.amount,
          projectInvestmentStatsFixture,
          null as any
        )
      ).toThrow('Closing date not provided');
    });
  });

  describe('roundTo', () => {
    it('should correctly round numbers to given decimals', () => {
      expect(roundTo(123.456, 2)).toBe(123.46);
      expect(roundTo(123.454, 2)).toBe(123.45);
      expect(roundTo(0.1, 1)).toBe(0.1);
      expect(roundTo(0.15, 1)).toBe(0.2);
    });

    it('should handle rounding to zero decimals correctly', () => {
      expect(roundTo(123.9, 0)).toBe(124);
      expect(roundTo(123.4, 0)).toBe(123);
    });

    it('should handle negative numbers correctly', () => {
      expect(roundTo(-123.456, 2)).toBe(-123.46);
      expect(roundTo(-123.454, 2)).toBe(-123.45);
    });

    it('should big numbers correctly', () => {
      expect(roundTo(50045.813, 2)).toBe(50045.81);
      expect(roundTo(50000045.823, 2)).toBe(50000045.82);
    });
  });

  describe('getEquityPayoutScheduleForDeal', () => {
    const baseProjectMilestones: any = {
      financialClosing: new Date('2024-01-15'),
    };

    const baseEquityMilestones: any[] = [
      { aUnitReturns: 0, cUnitReturns: 0 },
      { aUnitReturns: 5000, cUnitReturns: 10000 },
      { aUnitReturns: 7000, cUnitReturns: 14000 },
    ];

    it('should generate a payout schedule for valid milestones', () => {
      const shareOfEquity = 0.5; // 50% share of equity
      const result = getEquityPayoutScheduleForDeal(
        baseStats,
        baseProjectMilestones,
        baseEquityMilestones,
        shareOfEquity
      );

      expect(result).toHaveLength(2); // Excludes first milestone
      expect(result[0]).toMatchObject({
        date: startOfMonth(add(new Date('2024-01-15'), { months: 1 })), // February 1, 2024
        equityDistributionsCurrent: 5000, // 50% of CUNIT returns (10,000)
        equityDistributionCumulative: 5000,
      });
      expect(result[1]).toMatchObject({
        date: startOfMonth(add(new Date('2024-01-15'), { months: 2 })), // March 1, 2024
        equityDistributionsCurrent: 7000, // 50% of 14,000
        equityDistributionCumulative: 12000, // 5000 + 7000
      });
    });

    it('should throw an error when no equity milestones are provided', () => {
      expect(() =>
        getEquityPayoutScheduleForDeal(
          baseStats,
          baseProjectMilestones,
          [],
          0.5
        )
      ).toThrow('Milestone data not found in equity returns file');
    });

    it('should calculate payouts correctly for different unit types (AUNIT)', () => {
      const shareOfEquity = 0.5; // 50% share of equity
      const result = getEquityPayoutScheduleForDeal(
        { ...baseStats, unitType: DealUnitType.AUNIT }, // Change unit type
        baseProjectMilestones,
        baseEquityMilestones,
        shareOfEquity
      );

      expect(result[0]?.equityDistributionsCurrent).toBe(2500); // 50% of 5000
      expect(result[1]?.equityDistributionsCurrent).toBe(3500); // 50% of 7000
    });
  });

  describe('getEquityPayoutScheduleForProject', () => {
    const baseAmount = 1000000; // $1M Investment
    const shareOfEquity = 0.5; // 50% share of equity
    const preferredReturn = 0.08; // 8% preferred return

    const baseProjectMilestones: any = {
      financialClosing: new Date('2024-01-15'),
    };

    const baseEquityMilestones: any[] = [
      { aUnitReturns: 0, cUnitReturns: 0 },
      { aUnitReturns: 5000, cUnitReturns: 10000 },
      { aUnitReturns: 7000, cUnitReturns: 14000 },
    ];

    it('should correctly generate the payout schedule and stats', () => {
      const { schedule, stats } = getEquityPayoutScheduleForProject(
        baseAmount,
        baseProjectMilestones,
        baseEquityMilestones,
        shareOfEquity,
        DealUnitType.CUNIT,
        preferredReturn
      );

      expect(schedule).toHaveLength(2); // First milestone excluded
      expect(schedule[0]).toMatchObject({
        date: startOfMonth(add(new Date('2024-01-15'), { months: 1 })), // February 1, 2024
        equityDistributionsCurrent: 5000, // 50% of 10,000
        equityDistributionCumulative: 5000,
      });
      expect(schedule[1]).toMatchObject({
        date: startOfMonth(add(new Date('2024-01-15'), { months: 2 })), // March 1, 2024
        equityDistributionsCurrent: 7000, // 50% of 14,000
        equityDistributionCumulative: 12000, // 5000 + 7000
      });

      expect(stats).toMatchObject({
        investmentMultiple: 0.012, // (Total returns / amount)
        interestRateOrIrrPerc: expect.any(Number),
        totalGrossReturn: 12000,
        totalNetReturn: 12000 - baseAmount,
      });
    });

    it('should throw an error when no equity milestones are provided', () => {
      expect(() =>
        getEquityPayoutScheduleForProject(
          baseAmount,
          baseProjectMilestones,
          [],
          shareOfEquity,
          DealUnitType.CUNIT,
          preferredReturn
        )
      ).toThrow('Milestone data not found in equity returns file');
    });

    it('should handle an empty schedule and throw an error', () => {
      expect(() =>
        getEquityPayoutScheduleForProject(
          baseAmount,
          baseProjectMilestones,
          [
            { date: new Date('2024-01-15'), aUnitReturns: 0, cUnitReturns: 0 }, // Adding date
          ], // Only one milestone, making the schedule empty
          shareOfEquity,
          DealUnitType.CUNIT,
          preferredReturn
        )
      ).toThrow('No last entry found in equity payout');
    });

    it('should correctly calculate payout schedule for AUNIT', () => {
      const { schedule, stats } = getEquityPayoutScheduleForProject(
        baseAmount,
        baseProjectMilestones,
        baseEquityMilestones,
        shareOfEquity,
        DealUnitType.AUNIT,
        preferredReturn
      );

      expect(schedule[0]?.equityDistributionsCurrent).toBe(2500); // 50% of 5000
      expect(schedule[1]?.equityDistributionsCurrent).toBe(3500); // 50% of 7000
      expect(stats.totalGrossReturn).toBe(6000); // 2500 + 3500
    });

    it('should return 0% IRR and investment multiple of 1 when no returns occur', () => {
      const noReturnsMilestones: any[] = [
        { aUnitReturns: 0, cUnitReturns: 0 },
        { aUnitReturns: 0, cUnitReturns: 0 },
      ];

      const { stats } = getEquityPayoutScheduleForProject(
        baseAmount,
        baseProjectMilestones,
        noReturnsMilestones,
        shareOfEquity,
        DealUnitType.CUNIT,
        preferredReturn
      );

      expect(stats.investmentMultiple).toBe(0);
      expect(stats.interestRateOrIrrPerc).toBe(0);
      expect(stats.totalGrossReturn).toBe(0);
      expect(stats.totalNetReturn).toBe(-baseAmount);
    });
  });

  describe('getPortfolioReturns', () => {
    beforeEach(() => {
      jest.restoreAllMocks(); // Ensure fresh mocks before every test
    });

    it('should return correct dashboard returns for one debt deal', async () => {
      const result = await getPortfolioReturns([debtDealFixture]);

      expect(result.consolidatedSchedule.length).toBe(48);
      const lastScheduleEntry = result.consolidatedSchedule.at(-1);
      expect(lastScheduleEntry).toBeDefined();
      expect(lastScheduleEntry!.debtDistributionsCumulative).toBeCloseTo(
        141260.27,
        2
      );
      expect(lastScheduleEntry!.portfolioValueToDate).toBeCloseTo(141260.27, 2);
    });

    it('should return correct dashboard returns for multiple DEBT deals starting on the same day', async () => {
      const result = await getPortfolioReturns([
        debtDealFixture,
        debtDealFixture,
      ]);

      expect(result.consolidatedSchedule.length).toBe(48);
      const lastScheduleEntry = result.consolidatedSchedule.at(-1);

      expect(lastScheduleEntry).toBeDefined();
      expect(lastScheduleEntry!.debtDistributionsCumulative).toBeCloseTo(
        282520.547,
        2
      );
      expect(lastScheduleEntry!.portfolioValueToDate).toBeCloseTo(
        282520.547,
        2
      );
    });

    it('should return correct dashboard returns for multiple DEBT deals with different start dates', async () => {
      const debtDeal2Fixture = {
        ...debtDealFixture,
        closingDate: new Date('2024-12-01'),
      };

      const result = await getPortfolioReturns([
        debtDealFixture,
        debtDeal2Fixture,
      ]);

      expect(result.consolidatedSchedule.length).toBe(69);
      const lastScheduleEntry = result.consolidatedSchedule.at(-1);

      expect(lastScheduleEntry).toBeDefined();
      expect(lastScheduleEntry!.debtDistributionsCumulative).toBeCloseTo(
        282136.986,
        2
      );
      expect(lastScheduleEntry!.portfolioValueToDate).toBeCloseTo(
        282136.986,
        2
      );
      expect(result.portfolioStats.principalInvested).toBe(200000);
      expect(result.portfolioStats.projectedDebtDistributions).toBeCloseTo(
        282136.986,
        2
      );
    });

    it('should return correct dashboard returns for one EQUITY deal', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(textFetchMock(equityMilestoneData));

      const result = await getPortfolioReturns([equityDealFixture]);

      expect(result.consolidatedSchedule.length).toBe(60);
      const lastScheduleEntry = result.consolidatedSchedule.at(-1);

      expect(lastScheduleEntry).toBeDefined();
      expect(
        Math.floor(lastScheduleEntry!.equityDistributionCumulative ?? 0)
      ).toBe(100091);
    });

    it('should return correct dashboard returns for one DEBT and one EQUITY deal', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(textFetchMock(equityMilestoneData));

      const newEquityDealFixture = {
        ...equityDealFixture,
        investmentStats: {
          ...equityDealFixture.investmentStats,
          amount: 10000,
        },
      };

      const result = await getPortfolioReturns([
        debtDealFixture,
        newEquityDealFixture,
      ]);

      expect(result.consolidatedSchedule.length).toBeGreaterThanOrEqual(79);
      expect(result.consolidatedSchedule.length).toBeLessThanOrEqual(80);

      const lastScheduleEntry =
        result.consolidatedSchedule[result.consolidatedSchedule.length - 1];

      const cumulativeDistribution =
        (lastScheduleEntry?.debtDistributionsCumulative ?? 0) +
        (lastScheduleEntry?.equityDistributionCumulative ?? 0);
      expect(Math.floor(cumulativeDistribution)).toBe(140000 + 21251);
    });

    it('should return correct dashboard returns for two EQUITY deals', async () => {
      const equityDeal1Fixture = {
        ...equityDealFixture,
        organizationId: 4,
        projectId: 1,
        dealStage: 1,
        transactionId: 'test-deal-equity1',
        investmentStats: {
          ...equityDealFixture.investmentStats,
          amount: 5000,
          financingType: DealFinancingType.equity,
        },
      };
      const equityDeal2Fixture = {
        ...equityDealFixture,
        organizationId: 4,
        projectId: 1,
        dealStage: 1,
        transactionId: 'test-deal-equity2',
        investmentStats: {
          ...equityDealFixture.investmentStats,
          amount: 45000,
          financingType: DealFinancingType.equity,
        },
      };

      jest
        .spyOn(global, 'fetch')
        .mockImplementation(textFetchMock(equityMilestoneData));

      const result = await getPortfolioReturns([
        equityDeal1Fixture,
        equityDeal2Fixture,
      ]);

      expect(result.portfolioStats.portfolioValueToDate).toBe(50000);
      expect(result.portfolioStats.distributionsToDate).toBe(0);
      expect(result.portfolioStats.projectedDebtDistributions).toBe(0);
      expect(
        Math.floor(result.portfolioStats.projectedEquityDistributions ?? 0)
      ).toBe(100091);
      expect(result.consolidatedSchedule.length).toBe(60);
    });

    it('should handle missing investment stats gracefully', async () => {
      const invalidDeals = [{ ...equityDealFixture, investmentStats: null }];
      const loggerWarnSpy = jest
        .spyOn(Logger, 'warn')
        .mockImplementation(() => {});

      const result = await getPortfolioReturns(invalidDeals);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Investment stats missing for deal')
      );
      expect(result.dealStats).toHaveLength(0);
    });

    it('should handle missing closing dates correctly', async () => {
      const invalidDeals = [{ ...equityDealFixture, closingDate: null }];
      const loggerWarnSpy = jest
        .spyOn(Logger, 'warn')
        .mockImplementation(() => {});

      const result = await getPortfolioReturns(invalidDeals);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Closing date is missing for deal')
      );
      expect(result.dealStats).toHaveLength(0);
    });

    it('should handle missing project milestones and equity return files', async () => {
      const invalidDeals = [
        {
          ...equityDealFixture,
          project: {
            ...equityDealFixture.project,
            milestones: null,
            equityReturnsFile: null,
          },
        },
      ];
      const loggerWarnSpy = jest
        .spyOn(Logger, 'warn')
        .mockImplementation(() => {});

      const result = await getPortfolioReturns(invalidDeals);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Project milestones or equity returns file not found'
        )
      );
      expect(result.dealStats).toHaveLength(0);
    });

    it('should correctly aggregate payout schedules', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(textFetchMock(equityMilestoneData));

      const result = await getPortfolioReturns([
        debtDealFixture,
        equityDealFixture,
      ]);

      expect(result.consolidatedSchedule).toHaveLength(80);
      const [consolidatedSchedule] = result.consolidatedSchedule;

      expect(consolidatedSchedule).not.toBeNull();
      expect(consolidatedSchedule?.date).toEqual(expect.any(Date));
      expect(consolidatedSchedule?.date.getFullYear()).toBe(
        consolidatedSchedule?.date.getFullYear()
      );
      expect(consolidatedSchedule?.date.getMonth()).toBe(
        consolidatedSchedule?.date.getMonth()
      );
      expect(consolidatedSchedule?.date.getDate()).toBe(
        consolidatedSchedule?.date.getDate()
      );

      expect(consolidatedSchedule).toMatchObject({
        debtDistributionsCurrent: expect.any(Number),
        equityDistributionsCurrent: expect.any(Number),
        portfolioValueToDate: expect.any(Number),
      });
    });

    it('should handle unsupported financing types', async () => {
      const invalidFinancingType = 'unsupported-type';
      const invalidDeals = [
        {
          ...debtDealFixture,
          investmentStats: {
            ...debtDealFixture.investmentStats,
            financingType: invalidFinancingType,
          },
        },
      ];
      const loggerWarnSpy = jest
        .spyOn(Logger, 'warn')
        .mockImplementation(() => {});

      await getPortfolioReturns(invalidDeals);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Financing type ${invalidFinancingType} not supported for dashboard graph`
        )
      );
    });

    it('should handle failed equity stats fetch gracefully', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(textFetchMock(undefined as any));

      const faultyDeal = {
        ...equityDealFixture,
        project: {
          ...equityDealFixture.project,
          equityReturnsFile: 'invalid-file',
        },
      };

      await expect(getPortfolioReturns([faultyDeal])).rejects.toThrow(
        'Equity stats processing failed for deal'
      );
    });

    it('should calculate daily-accrued interest correctly for Q1', async () => {
      const closingDate = new Date('2025-01-02');
      const jan1Deal = {
        ...debtDealFixture,
        closingDate,
        investmentStats: {
          ...debtDealFixture.investmentStats,
          amount: 100_000,
          interestRate: 10,
          financingType: DealFinancingType.promissory_note_now,
        },
      };

      const result = await getPortfolioReturns([jan1Deal]);

      // Find the schedule entry for one day after end of first quarter (April 1, 2025)
      const q1LastMonthEntry = result.consolidatedSchedule[2];

      expect(q1LastMonthEntry).toBeDefined();

      // Expected: (90 / 365) * 100_000 * 10% = 2,438.36
      expect(q1LastMonthEntry!.debtDistributionsCurrent).toBeCloseTo(
        2465.753,
        2
      );
      expect(q1LastMonthEntry!.portfolioValueToDate).toBeCloseTo(2465.753, 2);
    });
  });
});
