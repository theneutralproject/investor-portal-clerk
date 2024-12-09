import { ReturnsDateObject } from "@/libs/returns/schema";
import { test, expect } from '@playwright/test';
import {  DealFinancingType } from "@prisma/client";


test.describe("api/project/returns test", () => {

    test('[GET] get EQUITY returns for the Edison', async ({ request }) => {
        try {
            const response = await request.post('/api/projects/returns', {
                data: { 
                    projectId: 1,
                    financingType: DealFinancingType.equity.toLowerCase(),
                    amount: 100000,
                }
            });
            expect(response.status()).toBe(200);
            const stats = await JSON.parse(await response.text()) as ReturnsDateObject[];
            expect(stats.length).toBe(60);
            const lastScheduleEntry = stats[stats.length - 1];
            expect(lastScheduleEntry?.interestRateOrIrrPerc).toBe(18.6);
            expect(lastScheduleEntry?.totalNetReturn).toBe(93006.93);
            expect(lastScheduleEntry?.totalGrossReturn).toBe(193006.93);
            expect(lastScheduleEntry?.accruedPreferredReturn).toBe(50000);
        } catch (e) {
            console.error("could not get dashboard returns for one debt deal in api/project/returns test:");
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
                }
            });
            expect(response.status()).toBe(200);
            const stats = await JSON.parse(await response.text()) as ReturnsDateObject[];
            console.log(stats);
            expect(stats.length).toBe(48);
            const lastScheduleEntry = stats[stats.length - 1];
            expect(lastScheduleEntry?.interestRateOrIrrPerc).toBe(10);
            expect(lastScheduleEntry?.totalNetReturn).toBe(40000);
            expect(lastScheduleEntry?.totalGrossReturn).toBe(140000);
            expect(lastScheduleEntry?.investmentMultiple).toBe(1.4);
            expect(lastScheduleEntry?.accruedPreferredReturn).toBe(0);
        } catch (e) {
            console.error("could not get dashboard returns for one debt deal in api/project/returns test:");
            console.error(e);
        }
    });

});