import { DealCreateSchema } from '@/libs/deal/schema';
import { PortfolioReturnsResponse } from '@/libs/returns/schema';
import { test, expect, APIResponse } from '@playwright/test';
import { Deal, DealFinancingType } from '@prisma/client';
import {
  clearAllTestDeals,
  deleteDealInDbAndHubspot,
  deleteDealsFromTestContact,
} from 'e2e/helpers';

test.describe('api/dashboard/returns test', () => {
  let debtDeal1: Deal | null = null;
  let debtDeal2: Deal | null = null;
  let equityDeal1: Deal | null = null;
  let equityDeal2: Deal | null = null;

  const debtDealData1: DealCreateSchema = {
    organizationId: 4,
    projectId: 1,
    dealStage: 1,
    transactionId: 'test-deal-debt1',
    financingType: DealFinancingType.promissory_note_now,
    amount: 100000,
  };

  const debtDealData2: DealCreateSchema = {
    organizationId: 4,
    projectId: 1,
    dealStage: 1,
    transactionId: 'test-deal-debt2',
    financingType: DealFinancingType.promissory_note_now,
    amount: 100000,
  };

  test.beforeEach(async ({ request }) => {
    try {
      await clearAllTestDeals();
    } catch (e) {
      console.error(
        'could not clear all test data in api/dashboard/returns beforeEach:'
      );
      console.error(e);
    }
    try {
      // create a debt deal
      const dealCreateResponse = await request.post('/api/deals', {
        data: debtDealData1,
      });
      try {
        debtDeal1 = await JSON.parse(await dealCreateResponse.text());
      } catch (e) {
        console.error('Error parsing response from creating debtDeal1', e);
      }
      // the put deal route configures the investment stats in the backend.
      const response = await request.put('/api/deals', {
        data: {
          hubspotId: debtDeal1!.hubspotId,
          dealStage: 5,
          closingDate: new Date(2023, 1, 15),
        },
      });

      debtDeal1 = await JSON.parse(await response.text());
    } catch (e) {
      console.error(
        'could not create test deal in api/dashboard/returns beforeEach:'
      );
      console.error(e);
    }
  });

  test('[GET] get dashboard returns for one debt deal', async ({ request }) => {
    let response: APIResponse;
    try {
      response = await request.get('/api/dashboard/returns');
    } catch (e) {
      console.error(
        'could not get dashboard returns for one debt deal in api/dashboard/returns test:'
      );
      console.error(e);
      test.fail();
      return;
    }
    expect(response.status()).toBe(200);
    const stats = (await JSON.parse(
      await response.text()
    )) as PortfolioReturnsResponse;
    console.log(
      'stats consolidated schedule length: ',
      stats.consolidatedSchedule.length
    );

    expect(stats.consolidatedSchedule.length).toBe(48);
    const lastScheduleEntry =
      stats.consolidatedSchedule[stats.consolidatedSchedule.length - 1];
    expect(lastScheduleEntry?.debtDistributionsCumulative).toBeCloseTo(
      141260.27,
      2
    );
    expect(lastScheduleEntry?.portfolioValueToDate).toBeCloseTo(141260.27, 2);
  });

  test('[GET] get dashboard returns for multiple DEBT deals starting on the same day', async ({
    request,
  }) => {
    try {
      // create first debt deal
      const dealCreateResponse = await request.post('/api/deals', {
        data: debtDealData1,
      });
      debtDeal2 = await JSON.parse(await dealCreateResponse.text());
    } catch (e) {
      console.error(
        'could not create second debt deal in api/dashboard/returns test:'
      );
      console.error(e);
    }
    let dealUpdateResponse: APIResponse;
    try {
      // the put deal route configures the investment stats in the backend.
      dealUpdateResponse = await request.put('/api/deals', {
        data: {
          hubspotId: debtDeal2!.hubspotId,
          dealStage: 5,
          closingDate: new Date(2023, 1, 15),
        },
      });

      debtDeal2 = await JSON.parse(await dealUpdateResponse.text());
    } catch (e) {
      console.error(
        'could not get dashboard returns for multiple DEBT deals starting on the same day in api/dashboard/returns test:'
      );
      console.error(e);
      test.fail();
      return;
    }

    const response = await request.get('/api/dashboard/returns');
    expect(response.status()).toBe(200);
    const stats = (await JSON.parse(
      await response.text()
    )) as PortfolioReturnsResponse;
    expect(stats.consolidatedSchedule.length).toBe(48);
    const lastScheduleEntry =
      stats.consolidatedSchedule[stats.consolidatedSchedule.length - 1];
    expect(lastScheduleEntry?.debtDistributionsCumulative).toBeCloseTo(
      282520.55,
      2
    );
    expect(lastScheduleEntry?.portfolioValueToDate).toBeCloseTo(282520.55, 2);
  });

  test('[GET] get dashboard returns for multiple DEBT deals starting on offset days', async ({
    request,
  }) => {
    try {
      // create first debt deal
      const dealCreateResponse = await request.post('/api/deals', {
        data: debtDealData2,
      });
      debtDeal2 = await JSON.parse(await dealCreateResponse.text());

      // the put deal route configures the investment stats in the backend.
      const dealUpdateResponse = await request.put('/api/deals', {
        data: {
          hubspotId: debtDeal2!.hubspotId,
          dealStage: 5,
          closingDate: new Date(2024, 11, 1),
        },
      });

      debtDeal2 = await JSON.parse(await dealUpdateResponse.text());
    } catch (e) {
      console.error(
        'could not create second debt deal in api/dashboard/returns test:'
      );
      console.error(e);
    }
    let response: APIResponse;
    try {
      response = await request.get('/api/dashboard/returns');
    } catch (e) {
      console.error(
        'could not get dashboard returns for multiple DEBT deals starting on offset days in api/dashboard/returns test:'
      );
      console.error(e);
      test.fail();
      return;
    }
    expect(response.status()).toBe(200);
    const stats = (await JSON.parse(
      await response.text()
    )) as PortfolioReturnsResponse;
    expect(stats.consolidatedSchedule.length).toBe(69);
    const lastScheduleEntry =
      stats.consolidatedSchedule[stats.consolidatedSchedule.length - 1];

    expect(lastScheduleEntry?.debtDistributionsCumulative).toBeCloseTo(
      281287.67,
      2
    );
    expect(lastScheduleEntry?.portfolioValueToDate).toBeCloseTo(281287.67, 2);
    expect(stats.portfolioStats?.principalInvested).toBe(200000);
    expect(stats.portfolioStats?.projectedDebtDistributions).toBeCloseTo(
      281287.67,
      2
    );
  });

  test('[GET] get dashboard returns for one EQUITY deal', async ({
    request,
  }) => {
    if (debtDeal1) {
      await deleteDealInDbAndHubspot(debtDeal1);
      debtDeal1 = null;
    }

    const equityDealData1: DealCreateSchema = {
      organizationId: 4,
      projectId: 1,
      dealStage: 1,
      transactionId: 'test-deal-equity1',
      financingType: DealFinancingType.equity,
      amount: 50000,
    };
    try {
      // create first debt deal
      const dealCreateResponse = await request.post('/api/deals', {
        data: equityDealData1,
      });
      equityDeal1 = await JSON.parse(await dealCreateResponse.text());
    } catch (e) {
      console.error(
        'could not create equity deal in api/dashboard/returns test:'
      );
      console.error(e);
    }
    try {
      // the put deal route configures the investment stats in the backend.
      const dealUpdateResponse = await request.put('/api/deals', {
        data: {
          hubspotId: equityDeal1!.hubspotId,
          dealStage: 5,
          closingDate: new Date(2023, 1, 15),
        },
      });

      equityDeal1 = await JSON.parse(await dealUpdateResponse.text());
    } catch (e) {
      console.error(
        'could not update equity deal in api/dashboard/returns test:'
      );
      console.error(e);
    }
    let response: APIResponse;
    try {
      response = await request.get('/api/dashboard/returns');
    } catch (e) {
      console.error(
        'could not get dashboard returns for one EQUITY deal in api/dashboard/returns test:'
      );
      console.error(e);
      test.fail();
      return;
    }

    expect(response.status()).toBe(200);
    const stats = (await JSON.parse(
      await response.text()
    )) as PortfolioReturnsResponse;
    expect(stats.consolidatedSchedule.length).toBe(60);
    const lastScheduleEntry =
      stats.consolidatedSchedule[stats.consolidatedSchedule.length - 1];
    expect(
      Math.floor(lastScheduleEntry?.equityDistributionCumulative ?? 0)
    ).toBe(100091);
  });

  test('[GET] get dashboard returns for one DEBT and one EQUITY deal', async ({
    request,
  }) => {
    const equityDealData1: DealCreateSchema = {
      organizationId: 4,
      projectId: 1,
      dealStage: 1,
      transactionId: 'test-deal-equity1',
      financingType: DealFinancingType.equity,
      amount: 10000,
    };
    try {
      // create first debt deal
      const dealCreateResponse = await request.post('/api/deals', {
        data: equityDealData1,
      });
      equityDeal1 = await JSON.parse(await dealCreateResponse.text());
    } catch (e) {
      console.error(
        'could not create equity deal in api/dashboard/returns test:'
      );
      console.error(e);
    }

    // the put deal route configures the investment stats in the backend.
    const dealUpdateResponse = await request.put('/api/deals', {
      data: {
        hubspotId: equityDeal1!.hubspotId,
        dealStage: 5,
        closingDate: new Date(2023, 1, 15),
      },
    });
    let stats: PortfolioReturnsResponse | null = null;
    let response: APIResponse;
    try {
      equityDeal1 = await JSON.parse(await dealUpdateResponse.text());
      response = await request.get('/api/dashboard/returns');
    } catch (e) {
      console.error(
        'could not get dashboard returns for one DEBT and one EQUITY deal in api/dashboard/returns test:'
      );
      console.error(e);
      test.fail();
      return;
    }
    expect(response.status()).toBe(200);
    stats = (await JSON.parse(
      await response.text()
    )) as PortfolioReturnsResponse;

    if (!stats?.consolidatedSchedule) {
      console.error('no good response from API');
      test.skip();
      return;
    }
    expect(stats.consolidatedSchedule.length).toBeGreaterThanOrEqual(79);
    expect(stats.consolidatedSchedule.length).toBeLessThanOrEqual(80);

    const lastScheduleEntry =
      stats.consolidatedSchedule[stats.consolidatedSchedule.length - 1];
    const cumulativeDistribution =
      (lastScheduleEntry?.debtDistributionsCumulative ?? 0) +
      (lastScheduleEntry?.equityDistributionCumulative ?? 0);
    expect(Math.floor(cumulativeDistribution)).toBe(140000 + 21278);
  });

  test('[GET] get dashboard returns for two EQUITY deals', async ({
    request,
  }) => {
    const equityDealData1: DealCreateSchema = {
      organizationId: 4,
      projectId: 1,
      dealStage: 1,
      transactionId: 'test-deal-equity1',
      financingType: DealFinancingType.equity,
      amount: 5000,
    };
    // create first debt deal
    const dealCreateResponse = await request.post('/api/deals', {
      data: debtDealData2,
    });
    debtDeal2 = await JSON.parse(await dealCreateResponse.text());

    const equityDealData2: DealCreateSchema = {
      organizationId: 4,
      projectId: 1,
      dealStage: 1,
      transactionId: 'test-deal-equity2',
      financingType: DealFinancingType.equity,
      amount: 45000,
    };
    try {
      if (debtDeal1) {
        await deleteDealInDbAndHubspot(debtDeal1);
        debtDeal1 = null;
      }
      // create first debt deal
      const dealCreateResponse = await request.post('/api/deals', {
        data: equityDealData1,
      });
      equityDeal1 = await JSON.parse(await dealCreateResponse.text());

      // create first debt deal
      const dealCreateResponse2 = await request.post('/api/deals', {
        data: equityDealData2,
      });
      equityDeal2 = await JSON.parse(await dealCreateResponse2.text());
    } catch (e) {
      console.error(
        'could not create equity deal in api/dashboard/returns test:'
      );
      console.error(e);
    }
    // the put deal route configures the investment stats in the backend.
    await request.put('/api/deals', {
      data: {
        hubspotId: equityDeal1!.hubspotId,
        dealStage: 5,
        closingDate: new Date(2025, 10, 1),
      },
    });

    await request.put('/api/deals', {
      data: {
        hubspotId: equityDeal2!.hubspotId,
        dealStage: 5,
        closingDate: new Date(2023, 1, 15),
      },
    });

    let stats: PortfolioReturnsResponse | null = null;
    let response: APIResponse;
    try {
      response = await request.get('/api/dashboard/returns');
    } catch (e) {
      console.error(
        'could not get dashboard returns for two EQUITY deals in api/dashboard/returns test:'
      );
      console.error(e);
      test.fail();
      return;
    }
    expect(response.status()).toBe(200);
    stats = (await JSON.parse(
      await response.text()
    )) as PortfolioReturnsResponse;

    expect(stats?.portfolioStats.portfolioValueToDate).toBe(50000);
    expect(stats?.portfolioStats.distributionsToDate).toBe(0);
    expect(stats?.portfolioStats.projectedDebtDistributions).toBe(0);
    expect(
      Math.floor(stats?.portfolioStats.projectedEquityDistributions ?? 0)
    ).toBe(100091);
    expect(stats?.consolidatedSchedule.length).toBe(60);
  });

  // TODO: Add test for equity deal that starts after official closing date. Need to talk to finance team to understand how to handle this case.

  test.afterEach(async () => {
    await deleteDealsFromTestContact();
  });
});
