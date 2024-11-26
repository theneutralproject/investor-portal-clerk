
import { DealCreateSchema } from '@/libs/deal/schema';
import { DealWithInvestmentStats } from '@/libs/types';
import { test, expect } from '@playwright/test';
import { Deal, DealFinancingType, DealUnitType } from '@prisma/client';
import { clearAllTestData, deleteDealInDbAndHubspot } from 'e2e/helpers';

test.describe("api/deals test", () => {
    let testDeal: Deal | null = null;
    let secondDeal: Deal | null = null;
    const testDealData: DealCreateSchema = {
        organizationId: 4,
        projectId: 1,
        dealStage: 0,
        transactionId: 'test-deal-1',
        financingType: DealFinancingType.equity,
        amount: 5555,
    };
    test.beforeAll(async ({ request }) => {
        await clearAllTestData();
        // create a deal
        const response = await request.post('/api/deals', { data: testDealData });
        testDeal = await JSON.parse(await response.text());

    });

    test('[GET] get all deals returns null if no deal exists', async ({ request }) => {
        const response = await request.get('/api/deals?slug=519');
        expect(response.status()).toBe(200);
        const body = await JSON.parse(await response.text());
        expect(response.headers()['content-type']).toBe('application/json');
        expect(body).toBe(null);
    });

    test('[GET] get all deals returns a deal for the Edison', async ({ request }) => {
        const response = await request.get('/api/deals?slug=edison');
        expect(response.status()).toBe(200);
        const { investmentStats, ...deal } = await JSON.parse(await response.text()) as DealWithInvestmentStats;
        expect(response.headers()['content-type']).toBe('application/json');
        expect(investmentStats.amount).toBe(testDealData.amount);
        expect(investmentStats.numberAUnits).toBe((testDealData.amount! / 100000));
        expect(investmentStats.numberCUnits).toBe(0);
        expect(investmentStats.unitType).toBe(DealUnitType.AUNIT);
        expect(deal.dealStage).toBe(testDealData.dealStage);
    });

    test('[POST] create a deal', async ({ request }) => {
        const secondDealData: DealCreateSchema = {
            organizationId: 4,
            projectId: 1,
            dealStage: 0,
            transactionId: 'test-deal-2',
            financingType: DealFinancingType.equity,
            amount: 500000,
        };
        const response = await request.post('/api/deals', { data: secondDealData });
        const body = await JSON.parse(await response.text()) as DealWithInvestmentStats;
        secondDeal = body;
        expect(response.status()).toBe(201);
        expect(response.headers()['content-type']).toBe('application/json');
        expect(body.investmentStats.amount).toBe(secondDealData.amount);
        expect(body.investmentStats.numberAUnits).toBe(0);
        expect(body.investmentStats.numberCUnits).toBe((secondDealData.amount! / 100000));
    });

    test('[PUT] update a deal', async ({ request }) => {
        if (!testDeal) {
            console.error("testDeal is null - skipping test");
            test.skip();
        };
        const response = await request.put('/api/deals', {
            data: {
                hubspotId: testDeal?.hubspotId,
                projectId: 1,
                organizationId: 4,
                dealStage: 1,
                investmentStats: {
                    amount: 1000000,
                    financingType: DealFinancingType.equity,
                }
            }
        });
        const body = await JSON.parse(await response.text()) as DealWithInvestmentStats;
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toBe('application/json');
        expect(body.investmentStats.amount).toBe(1000000);
        expect(body.investmentStats.numberAUnits).toBe(0);
        expect(body.investmentStats.numberCUnits).toBe(10);
        expect(body.investmentStats.unitType).toBe(DealUnitType.CUNIT);
        expect(body.dealStage).toBe(1);
    });

    test.afterAll(async () => {
        if (testDeal) {
            await deleteDealInDbAndHubspot(testDeal);
            testDeal = null;
        } else {
            console.error("testDeal is null - skipping cleanup");
        }
        if (secondDeal) {
            await deleteDealInDbAndHubspot(secondDeal);
            secondDeal = null;
        }
        return;
    });
});