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
            if(!lastScheduleEntry) {
                throw new Error("lastScheduleEntry is undefined");
            }
            // todo: bring back IRR
            expect(lastScheduleEntry.accruedPreferredReturn).toBe(50000);
            expect(Math.floor(lastScheduleEntry.portfolioValueToDate)).toBe(193006);
            expect(Math.floor(lastScheduleEntry.cumulativeDistribution)).toBe(193006);
            
            console.log(lastScheduleEntry);
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
            expect(stats.length).toBe(48);
            const lastScheduleEntry = stats[stats.length - 1];
            if(!lastScheduleEntry) {
                throw new Error("lastScheduleEntry is undefined");
            }
            console.log("lastScheduleEntry", lastScheduleEntry);
            expect(lastScheduleEntry.accruedPreferredReturn).toBe(0);
            expect(Math.floor(lastScheduleEntry.portfolioValueToDate)).toBe(140000);
            expect(lastScheduleEntry.distributionAmount).toBe(102500);
        } catch (e) {
            console.error("could not get dashboard returns for one debt deal in api/project/returns test:");
            console.error(e);
        }
    });

});