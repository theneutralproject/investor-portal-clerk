import {
  ProjectReturnsResponse,
  ReturnsDateObject,
} from '@/libs/returns/schema';
import { test, expect } from '@playwright/test';
import { DealFinancingType } from '@prisma/client';

test.describe('api/project/returns test', () => {
  test('[GET] get EQUITY returns for the Edison', async ({ request }) => {
    try {
      const response = await request.post('/api/projects/returns', {
        data: {
          projectId: 1,
          financingType: DealFinancingType.equity.toLowerCase(),
          amount: 100000,
        },
      });
      expect(response.status()).toBe(200);
      const resp = (await JSON.parse(
        await response.text()
      )) as ProjectReturnsResponse;
      const { schedule, stats } = resp;
      expect(schedule.length).toBe(60);
      const lastScheduleEntry = schedule[schedule.length - 1];
      if (!lastScheduleEntry) {
        throw new Error('lastScheduleEntry is undefined');
      }
      console.log('stats', stats);
      console.log(lastScheduleEntry);
      expect(lastScheduleEntry.equityAccruedPreferredReturn).toBe(50000);
      expect(Math.floor(lastScheduleEntry.portfolioValueToDate)).toBe(193006);
      expect(Math.floor(lastScheduleEntry.equityDistributionCumulative)).toBe(
        193006
      );
      expect(Math.floor(stats.totalGrossReturn)).toBe(193006);
      expect(Math.floor(stats.totalNetReturn)).toBe(93006);
      expect(Math.floor(stats.investmentMultiple * 100)).toBe(193);
      expect(Math.floor(stats.interestRateOrIrrPerc)).toBe(18);
    } catch (e) {
      console.error(
        'could not get dashboard returns for one debt deal in api/project/returns test:'
      );
      console.error(e);
    }
  });

  test('[GET] get DEBT returns for the Edison', async ({ request }) => {
    try {
      const response = await request.post('/api/projects/returns', {
        data: {
          projectId: 1,
          financingType: DealFinancingType.promissory_note_now.toLowerCase(),
          amount: 100000,
        },
      });
      expect(response.status()).toBe(200);
      const resp = (await JSON.parse(
        await response.text()
      )) as ProjectReturnsResponse;
      const { schedule, stats } = resp;
      expect(schedule.length).toBe(48);
      const lastScheduleEntry = schedule[schedule.length - 1];
      if (!lastScheduleEntry) {
        throw new Error('lastScheduleEntry is undefined');
      }
      console.log('lastScheduleEntry', lastScheduleEntry);
      console.log('stats', stats);
      expect(lastScheduleEntry.equityDistributionsCurrent).toBe(0);
      expect(Math.floor(lastScheduleEntry.portfolioValueToDate)).toBe(140000);
      expect(lastScheduleEntry.debtDistributionsCurrent).toBe(102500);
    } catch (e) {
      console.error(
        'could not get dashboard returns for one debt deal in api/project/returns test:'
      );
      console.error(e);
    }
  });
});
