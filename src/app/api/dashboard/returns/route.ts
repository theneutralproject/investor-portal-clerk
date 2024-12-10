import prisma from "@/libs/prisma.server";
import type { ReturnsDateObject, ReturnsDealStats, PortfolioReturnsResponse, ReturnsPortfolioStats } from "@/libs/returns/schema";
import { getDebtPayoutScheduleForDeal, getEquityPayoutScheduleForDeal, readEquityMilestoneData } from "@/libs/returns/utils";
import type { DealWithInvestmentStatsAndProject } from "@/libs/types";
import { errorResponse, jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import { DealFinancingType } from "@prisma/client";

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
            if (!deal.investmentStats) {
                console.error(`Deal ${deal.id} has no investment stats`);
            }
            if (deal.investmentStats && deal.project) {
                deals.push(deal);
            }
        }
    }

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
                console.log("equity payout schedule last item:", equityPayoutSchedule[equityPayoutSchedule.length - 1]);
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

    const portfolioStats: ReturnsPortfolioStats = {
        portfolioValueToDate: 0,
        distributionsToDate: 0,
        accruedInterestToDate: 0,
        projectedAccruedReturn: 0,
        projectedDistributions: 0,
        projectedPortfolioValue: 0,
        principalInvested: 0
    }

    const dealStats = [] as ReturnsDealStats[]// 

    // create one timeline for all deals, from the earliest closing date to the latest term date 
    const consolidatedSchedule = [] as ReturnsDateObject[]

    // calculate summary stats for all deals:
    const resolvedPayoutSchedules = (await Promise.all(payoutSchedules)).sort((a, b) => {
        if (!a[0]?.date) return 1;
        if (!b[0]?.date) return -1;
        return a[0].date <= b[0].date ? -1 : 1;
    });
    console.log("resolved payout schedules length:", resolvedPayoutSchedules.length);
    resolvedPayoutSchedules.forEach(schedulePerDeal => {
        if (schedulePerDeal.length === 0) {
            console.error("Empty schedule for deal");
            return;
        }
        const deal = deals.find(deal => deal.id === schedulePerDeal[0]?.dealId);
        if (!deal?.investmentStats) {
            console.log(schedulePerDeal[0]);
            console.error("Deal not found for schedule");
            return;
        };
        portfolioStats.portfolioValueToDate += deal.investmentStats.amount;
        portfolioStats.principalInvested += deal.investmentStats.amount;
        const dealSummary = {
            dealId: deal.id,
            committedAmount: deal.investmentStats.amount,
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
                existingDateObject.accruedPreferredReturn += dateObject.accruedPreferredReturn;
                existingDateObject.portfolioValueToDate += dateObject.distributionAmount;
                previousDateObject = existingDateObject;
            }
            else {
                // create new date object and add to the schedule
                dateObject.accruedPreferredReturn = previousDateObject.accruedPreferredReturn + dateObject.preferredReturnCurrent;
                dateObject.cumulativeDistribution = previousDateObject.cumulativeDistribution + dateObject.distributionAmount;
                dateObject.portfolioValueToDate = previousDateObject.portfolioValueToDate + dateObject.distributionAmount;
                previousDateObject = dateObject;
                consolidatedSchedule.push(dateObject);
            }
            // if the date is in the past, add the distribution amount to the portfolio stats
            if (dateObject.date < new Date()) {
                portfolioStats.distributionsToDate += dateObject.distributionAmount;
                portfolioStats.accruedInterestToDate += dateObject.accruedPreferredReturn;
                portfolioStats.portfolioValueToDate += (dateObject.distributionAmount + dateObject.accruedPreferredReturn);

                // update the deal summary stats
                dealSummary.distributionsToDate += dateObject.distributionAmount;
                dealSummary.accruedInterestToDate += dateObject.accruedPreferredReturn;

            }
            portfolioStats.projectedDistributions += dateObject.distributionAmount;
            portfolioStats.projectedAccruedReturn += dateObject.preferredReturnCurrent;
            portfolioStats.projectedPortfolioValue += dateObject.distributionAmount;
        });
        // add the deal summary to the dealSummaryStats
        dealStats.push(dealSummary);
    });
    // return deals with payoutSchedules
    return jsonResponse({ consolidatedSchedule, portfolioStats, dealStats } as PortfolioReturnsResponse);
}
