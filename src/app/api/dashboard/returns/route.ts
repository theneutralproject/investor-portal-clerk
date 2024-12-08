import prisma from "@/libs/prisma.server";
import type { ReturnsDateObject } from "@/libs/project/schema";
import { getDebtPayoutScheduleForDeal, getEquityPayoutScheduleForDeal, readEquityMilestoneData, roundTo } from "@/libs/project/utils";
import { DealWithInvestmentStatsAndProject, type DashboardPortfolioResponse, type DealSummaryStats, type PortfolioStats } from "@/libs/types";
import { errorResponse, jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import { type $Enums, DealFinancingType } from "@prisma/client";

export async function GET() {
    // get loggedin user
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return errorResponse("User not authenticated", 401);
    }
    const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: {
            organizationMember: {
                include: {
                    organization: {
                        include: {
                            deals: {
                                where: { dealStage: 5 },
                                include: {
                                    investmentStats: true,
                                    project: { include: { milestones: true } }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    if (!user) {
        return errorResponse("User not found in database", 404);
    }
    const deals: DealWithInvestmentStatsAndProject[] = [];
    // iterate through organizations and get deals
    for (const member of user.organizationMember) {
        const org = member.organization;
        for (const deal of org.deals) {

            console.log("completed deal/ amount/ project/ type", deal.id, deal.investmentStats?.amount, deal.project.id, deal.investmentStats?.financingType);
            if (!deal.investmentStats) {
                console.error(`Deal ${deal.id} has no investment stats`);
            }
            if (deal.investmentStats && deal.project) {
                deals.push(deal);
            }
        }
    }
    console.log("num completed deals", deals.length);
    // for each deal, get the payout schedule based on the financing type
    const payoutSchedules = deals.map(async deal => {
        const { project, investmentStats, closingDate } = deal;
        if (!investmentStats) {
            console.error(`Investment stats missing for deal ${deal.id}`);
            return [];
        }
        if (!closingDate) {
            console.error(`Closing date is missing for deal ${deal.id}`);
            return [];
        }
        if (!project?.milestones || !project.equityReturnsFile) {
            console.error(`Project milestones or equity returns file not found for project  of deal ${deal.id}`);
            return [];
        }
        if (investmentStats.financingType === DealFinancingType.equity) {
            try {
                const equityMilestones = await readEquityMilestoneData(project.equityReturnsFile);
                const equityPayoutSchedule = getEquityPayoutScheduleForDeal(investmentStats, project.milestones, equityMilestones).map(dateObject => {
                    return { ...dateObject, dealId: deal.id };
                });
                return equityPayoutSchedule;
            }
            catch (e) {
                console.error(`Failed to get equity stats for deal ${deal.id}:`);
                console.error(e);
                return [];
            }
        }
        else if (investmentStats.financingType === DealFinancingType.promissory_note_now) {
            const debtPayoutSchedule = getDebtPayoutScheduleForDeal(investmentStats, closingDate).map(dateObject => {
                return {
                    ...dateObject,
                    dealId: deal.id,
                }
            });
            console.log("debt payout schedule", debtPayoutSchedule.length);
            return debtPayoutSchedule
        }
        else {
            console.error(`Financing type ${investmentStats.financingType} not supported for dashboard graph - deal ${deal.id}`);
            return [];
        }
    });



    const portfolioStats: PortfolioStats = {
        portfolioValueToDate: 0,
        distributionsToDate: 0,
        accruedInterestToDate: 0,
        projectedInterest: 0,
        projectedDistributions: 0,
        projectedPortfolioValue: 0,
        principalInvested: 0
    }



    const dealSummaryStats = [] as DealSummaryStats[]// 

    // create one timeline for all deals, from the earliest closing date to the latest term date 
    const consolidatedSchedule = [] as ReturnsDateObject[]

    // calculate summary stats for all deals:
    console.log("sorting payout schedules");
    const resolvedPayoutSchedules = (await Promise.all(payoutSchedules)).sort((a, b) => {
        if (!a[0]?.date) return 1;
        if (!b[0]?.date) return -1;
        return a[0].date <= b[0].date ? -1 : 1;
    });
    console.log("resolved payout schedules", resolvedPayoutSchedules.length);
    resolvedPayoutSchedules.forEach(schedulePerDeal => {
        if (schedulePerDeal.length === 0) {
            console.error("Empty schedule for deal");
            return;
        }
        const deal = deals.find(deal => deal.id === schedulePerDeal[0]?.dealId);
        if (!deal) {
            console.log(schedulePerDeal[0]);
            console.error("Deal not found for schedule");
            return;
        };
        portfolioStats.portfolioValueToDate += deal.investmentStats?.amount ?? 0;
        portfolioStats.projectedPortfolioValue += deal.investmentStats?.amount ?? 0;
        portfolioStats.principalInvested += deal.investmentStats?.amount ?? 0;
        const dealSummary = {
            dealId: deal.id,
            committedAmount: deal.investmentStats?.amount ?? 0,
            distributionsToDate: 0,
            accruedInterestToDate: 0,
        }
        let previousDateObject: ReturnsDateObject | undefined;
        schedulePerDeal.forEach((dateObject) => {
            if (!previousDateObject) previousDateObject = dateObject;
            // if the dateObject is already in the consolidated schedule, add to the existing date object
            const existingDateObject = consolidatedSchedule.find(obj => obj.date.toDateString() == dateObject.date.toDateString());
            if (existingDateObject) {
                existingDateObject.distributionAmount += dateObject.distributionAmount;
                existingDateObject.cumulativeDistribution += dateObject.cumulativeDistribution;
                existingDateObject.totalGrossReturn += dateObject.totalGrossReturn;
                existingDateObject.totalNetReturn += dateObject.totalNetReturn;
                existingDateObject.investmentMultiple += dateObject.investmentMultiple;
                if (dateObject.accruedPreferredReturn) existingDateObject.accruedPreferredReturn = existingDateObject.accruedPreferredReturn ?? 0 + dateObject.accruedPreferredReturn;
                previousDateObject = existingDateObject;
            }
            else {
                // dateObject.distributionAmount += previousDateObject.distributionAmount;
                dateObject.accruedPreferredReturn = previousDateObject.accruedPreferredReturn ?? 0 + (dateObject.accruedPreferredReturn ?? 0);
                dateObject.investmentMultiple += roundTo(previousDateObject.investmentMultiple, 2);
                dateObject.totalGrossReturn = roundTo(previousDateObject.totalGrossReturn + dateObject.distributionAmount, 2);
                dateObject.totalNetReturn = roundTo(previousDateObject.totalNetReturn + dateObject.distributionAmount, 2);
                dateObject.cumulativeDistribution = roundTo(previousDateObject.cumulativeDistribution + dateObject.distributionAmount, 2);
                previousDateObject = dateObject;
                consolidatedSchedule.push(dateObject);
            }
            // if the date is in the past, add the distribution amount to the portfolio stats
            if (dateObject.date < new Date()) {
                portfolioStats.distributionsToDate += dateObject.distributionAmount;
                portfolioStats.accruedInterestToDate += dateObject.accruedPreferredReturn ?? 0;
                portfolioStats.portfolioValueToDate += dateObject.distributionAmount;

                // update the deal summary stats
                dealSummary.distributionsToDate += dateObject.distributionAmount;
                dealSummary.accruedInterestToDate += dateObject.accruedPreferredReturn ?? 0;

            }
            portfolioStats.projectedDistributions += dateObject.distributionAmount;
            portfolioStats.projectedInterest += dateObject.accruedPreferredReturn ?? 0;
            portfolioStats.projectedPortfolioValue += dateObject.distributionAmount;
        });
        // add the deal summary to the dealSummaryStats
        dealSummaryStats.push(dealSummary);
    });

    // return deals with payoutSchedules
    return jsonResponse({ consolidatedSchedule, portfolioStats, dealSummaryStats } as DashboardPortfolioResponse);
}
