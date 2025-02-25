import {
  getEquityStatsFromProject,
  getDebtInterestRate,
  getDebtUnitType,
  readEquityMilestoneData,
  getDebtPayoutScheduleForDeal,
  getPayoutScheduleStartDate,
  getDebtPayoutScheduleForProject,
  roundTo,
} from '../utils.server';
import 'whatwg-fetch';
import { DealUnitType } from '@prisma/client';
import { jest } from '@jest/globals';
import { textFetchMock } from '@/mocks/fetch.mock';
import {
  equityMilestoneData,
  equityMilestoneEmptyData,
} from '@/fixtures/equityMilestone/equityMilestone.csv';
import { endOfMonth } from 'date-fns';
import {
  investmentStatsFixture,
  projectInvestmentStatsFixture,
} from '@/fixtures/investmentsStats/investmentStats.fixture';

describe('utils.server', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('readEquityMilestoneData', () => {
    const csvUrlMock = 'test.com/csv';

    beforeEach(() => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(textFetchMock(equityMilestoneData));
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
        .mockImplementationOnce(textFetchMock(equityMilestoneData));

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
        .mockImplementationOnce(textFetchMock(equityMilestoneData));

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
      const expectedDate = endOfMonth(new Date('2024-04-31')); // Last day of April (Q2 start)
      expect(getPayoutScheduleStartDate(closingDate)).toEqual(
        new Date(expectedDate.setHours(0, 0, 0, 0))
      );
    });

    it('should return the last day of the first month of the next quarter for Q2', () => {
      const closingDate = new Date('2024-05-15'); // Q2
      const expectedDate = endOfMonth(new Date('2024-07-30')); // Last day of July (Q3 start)
      expect(getPayoutScheduleStartDate(closingDate)).toEqual(
        new Date(expectedDate.setHours(0, 0, 0, 0))
      );
    });

    it('should return the last day of the first month of the next quarter for Q3', () => {
      const closingDate = new Date('2024-08-15'); // Q3
      const expectedDate = endOfMonth(new Date('2024-10-31')); // Last day of October (Q4 start)
      expect(getPayoutScheduleStartDate(closingDate)).toEqual(
        new Date(expectedDate.setHours(0, 0, 0, 0))
      );
    });

    it('should return the last day of the first month of the next quarter for Q4', () => {
      const closingDate = new Date('2024-11-15'); // Q4
      const expectedDate = endOfMonth(new Date('2025-01-31')); // Last day of January (Q1 start)
      expect(getPayoutScheduleStartDate(closingDate)).toEqual(
        new Date(expectedDate.setHours(0, 0, 0, 0))
      );
    });

    it('should handle end of year correctly', () => {
      const closingDate = new Date('2024-12-20'); // Q4
      const expectedDate = endOfMonth(new Date('2025-01-31')); // Last day of Jan (Q1 start)
      expect(getPayoutScheduleStartDate(closingDate)).toEqual(
        new Date(expectedDate.setHours(0, 0, 0, 0))
      );
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
      ).toBeGreaterThan(100000);
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
  });
});
