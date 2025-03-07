import { DealCreateSchema } from '@/libs/deal/schema';
import { DealWithConversion } from '@/libs/types';
import { test, expect } from '@playwright/test';
import {
  Deal,
  DealConversion,
  DealFinancingType,
  DealStatus,
} from '@prisma/client';
import { clearAllTestDeals } from 'e2e/helpers';

test.describe('api/dashboard/deals -incl conversions- test', () => {
  let startDeal: Deal | null = null;
  const startDealData: DealCreateSchema = {
    organizationId: 4,
    projectId: 1,
    dealStage: 5,
    financingType: DealFinancingType.promissory_to_equity,
    amount: 5555,
    status: DealStatus.ACTIVE,
  };

  let endDeal: Deal | null = null;
  const endDealData: DealCreateSchema = {
    organizationId: 4,
    projectId: 1,
    dealStage: 5,
    financingType: DealFinancingType.equity,
    amount: 5555,
    status: DealStatus.PENDING,
  };

  let conversion: DealConversion | null = null;

  test.beforeAll(async ({ request }) => {
    await clearAllTestDeals();
    try {
      const startRes = await request.post('/api/deals', {
        data: startDealData,
      });
      startDeal = await JSON.parse(await startRes.text());

      const endRes = await request.post('/api/deals', {
        data: endDealData,
      });
      endDeal = await JSON.parse(await endRes.text());
      if (!startDeal || !endDeal) {
        throw new Error('could not create test deals in BEFOREALL');
      }
      const conversionRes = await request.post('/api/deals/conversions', {
        data: {
          startDealId: startDeal.id,
          endDealId: endDeal.id,
          conversionDate: new Date().toISOString(),
        },
      });
      conversion = await JSON.parse(await conversionRes.text());
    } catch (e) {
      console.error('could not create test deal in BEFOREALL:');
      console.error(e);
    }
  });

  test('[GET] get all deals returns only deals with status ACTIVE', async ({
    request,
  }) => {
    const response = await request.get('/api/dashboard/deals');
    expect(response.status()).toBe(200);
    const body = await JSON.parse(await response.text());
    expect(response.headers()['content-type']).toBe('application/json');
    expect(body.length).toBe(1);
    const activeDeal = body[0] as DealWithConversion;
    expect(activeDeal.status).toBe(DealStatus.ACTIVE);
    expect(activeDeal.startDealConversion).toBeDefined();
    expect(conversion?.startDealId).toBe(activeDeal.startDealConversion?.id);
  });
});
