import { DealCreateSchema } from '@/libs/deal/schema';
import { test, expect } from '@playwright/test';
import { Deal, DealFinancingType } from '@prisma/client';
import { clearAllTestData, deleteDealInDbAndHubspot } from 'e2e/helpers';

test.describe("api/dashboard/returns test", () => {
    let debtDeal1: Deal | null = null;
    let debtDeal2: Deal | null = null;
    let equityDeal1: Deal | null = null;

    const debtDealData1: DealCreateSchema = {
        organizationId: 4,
        projectId: 1,
        dealStage: 1,
        transactionId: 'test-deal-debt1',
        financingType: DealFinancingType.promissory_note_now,
        amount: 100000,
    };

    test.beforeAll(async ({ request }) => {
        await clearAllTestData();
        // create a debt deal
        const dealCreateResponse = await request.post('/api/deals', { data: debtDealData1 });
        debtDeal1 = await JSON.parse(await dealCreateResponse.text());

        // the put deal route configures the investment stats in the backend. 
        const response = await request.put('/api/deals', {
            data: {
                hubspotId: debtDeal1!.hubspotId,
                dealStage: 5,
                closingDate: new Date(2023, 1, 15),
            }
        });

        debtDeal1 = await JSON.parse(await response.text());
    })

    test('[GET] get dashboard returns for one debt deal', async ({ request }) => {
        const response = await request.get('/api/dashboard/returns');
        expect(response.status()).toBe(200);
        const stats = await JSON.parse(await response.text());
        expect(stats.consolidatedSchedule.length).toBe(48);
        const lastScheduleEntry = stats.consolidatedSchedule[stats.consolidatedSchedule.length - 1];
        expect(lastScheduleEntry.cumulativeDistribution).toBe(140000);
    });

    test('[GET] get dashboard returns for multiple DEBT deals starting on the same day', async ({ request }) => {

        // create first debt deal
        const dealCreateResponse = await request.post('/api/deals', { data: debtDealData1 });
        debtDeal2 = await JSON.parse(await dealCreateResponse.text());

        // the put deal route configures the investment stats in the backend. 
        const dealUpdateResponse = await request.put('/api/deals', {
            data: {
                hubspotId: debtDeal2!.hubspotId,
                dealStage: 5,
                closingDate: new Date(2023, 1, 15),
            }
        });

        debtDeal2 = await JSON.parse(await dealUpdateResponse.text());


        const response = await request.get('/api/dashboard/returns');
        expect(response.status()).toBe(200);
        const stats = await JSON.parse(await response.text());
        expect(stats.consolidatedSchedule.length).toBe(48);
        const lastScheduleEntry = stats.consolidatedSchedule[stats.consolidatedSchedule.length - 1];
        expect(lastScheduleEntry.cumulativeDistribution).toBe(280000);
    });

    test('[GET] get dashboard returns for multiple DEBT deals starting on offset days', async ({ request }) => {

        const debtDealData2: DealCreateSchema = {
            organizationId: 4,
            projectId: 1,
            dealStage: 1,
            transactionId: 'test-deal-debt2',
            financingType: DealFinancingType.promissory_note_now,
            amount: 100000,
        };

        // create first debt deal
        const dealCreateResponse = await request.post('/api/deals', { data: debtDealData2 });
        debtDeal2 = await JSON.parse(await dealCreateResponse.text());

        // the put deal route configures the investment stats in the backend. 
        const dealUpdateResponse = await request.put('/api/deals', {
            data: {
                hubspotId: debtDeal2!.hubspotId,
                dealStage: 5,
                closingDate: new Date(2024, 11, 1),
            }
        });

        debtDeal2 = await JSON.parse(await dealUpdateResponse.text());


        const response = await request.get('/api/dashboard/returns');
        expect(response.status()).toBe(200);
        const stats = await JSON.parse(await response.text());
        expect(stats.consolidatedSchedule.length).toBe(69);
        const lastScheduleEntry = stats.consolidatedSchedule[stats.consolidatedSchedule.length - 1];
        expect(lastScheduleEntry.cumulativeDistribution).toBe(420000);
    });

    test('[GET] get dashboard returns for one EQUITY deal', async ({ request }) => {

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
            amount: 100000,
        };

        // create first debt deal
        const dealCreateResponse = await request.post('/api/deals', { data: equityDealData1 });
        equityDeal1 = await JSON.parse(await dealCreateResponse.text());

        // the put deal route configures the investment stats in the backend. 
        const dealUpdateResponse = await request.put('/api/deals', {
            data: {
                hubspotId: equityDeal1!.hubspotId,
                dealStage: 5,
                closingDate: new Date(2023, 1, 15),
            }
        });

        equityDeal1 = await JSON.parse(await dealUpdateResponse.text());


        const response = await request.get('/api/dashboard/returns');
        expect(response.status()).toBe(200);
        const stats = await JSON.parse(await response.text());
        expect(stats.consolidatedSchedule.length).toBe(79);
        const lastScheduleEntry = stats.consolidatedSchedule[stats.consolidatedSchedule.length - 1];
        expect(Math.floor(lastScheduleEntry.cumulativeDistribution)).toBe(333006);
    });

    test('[GET] get dashboard returns for one DEBT and one EQUITY deal', async ({ request }) => {

        const equityDealData1: DealCreateSchema = {
            organizationId: 4,
            projectId: 1,
            dealStage: 1,
            transactionId: 'test-deal-equity1',
            financingType: DealFinancingType.equity,
            amount: 100000,
        };

        // create first debt deal
        const dealCreateResponse = await request.post('/api/deals', { data: equityDealData1 });
        equityDeal1 = await JSON.parse(await dealCreateResponse.text());

        // the put deal route configures the investment stats in the backend. 
        const dealUpdateResponse = await request.put('/api/deals', {
            data: {
                hubspotId: equityDeal1!.hubspotId,
                dealStage: 5,
                closingDate: new Date(2023, 1, 15),
            }
        });

        equityDeal1 = await JSON.parse(await dealUpdateResponse.text());

        const response = await request.get('/api/dashboard/returns');
        expect(response.status()).toBe(200);
        const stats = await JSON.parse(await response.text());
        expect(stats.consolidatedSchedule.length).toBe(79);
        const lastScheduleEntry = stats.consolidatedSchedule[stats.consolidatedSchedule.length - 1];
        expect(Math.floor(lastScheduleEntry.cumulativeDistribution)).toBe(526013);
    });

    // TODO: Add test for equity deal that starts after official closing date. Need to talk to finance team to understand how to handle this case.

    test.afterAll(async () => {
        let promises = [];
        if (debtDeal1) {
            promises.push(deleteDealInDbAndHubspot(debtDeal1));
        } else {
            console.error("debtDeal1 is null - skipping cleanup");
        }
        if (debtDeal2) {
            promises.push(deleteDealInDbAndHubspot(debtDeal2));
        }
        if (equityDeal1) {
            promises.push(deleteDealInDbAndHubspot(equityDeal1));
        }
        await Promise.all(promises);
        debtDeal1 = null;
        debtDeal2 = null;
        equityDeal1 = null;
        return;
    });
});
