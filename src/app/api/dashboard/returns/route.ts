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
    // iterate through user organizations and get deals
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
    const returnsObjectsByDate: Record<number, ReturnsDateObject[]> = {};
    const dealStats = [] as ReturnsDealStats[];
    const portfolioStats: ReturnsPortfolioStats = {
        portfolioValueToDate: 0,
        distributionsToDate: 0,
        debtDistributionsToDate: 0,
        equityDistributionsToDate: 0,
        projectedEquityDistributions: 0,
        projectedDebtDistributions: 0,
        projectedPortfolioValue: 0,
        principalInvested: 0
    };

    // for each deal, get the payout schedule based on the financing type
    const resolvedSchedules = deals.map(async deal => {
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
        const dealSummary = {
            dealId: deal.id,
            committedAmount: investmentStats.amount,
            distributionsToDate: 0,
        } as ReturnsDealStats;

        const todayNumeric = new Date().getTime();
        portfolioStats.principalInvested += investmentStats.amount;
        portfolioStats.portfolioValueToDate += investmentStats.amount;
        if (investmentStats.financingType === DealFinancingType.equity) {
            try {
                const equityMilestones = await readEquityMilestoneData(project.equityReturnsFile);
                const schedule = getEquityPayoutScheduleForDeal(investmentStats, project.milestones, equityMilestones)

                schedule.forEach((dateObject, i) => {
                    if (i === schedule.length - 1) {
                        portfolioStats.projectedEquityDistributions += dateObject.equityDistributionCumulative;
                        portfolioStats.projectedPortfolioValue += dateObject.equityDistributionCumulative;
                    }
                    const dateNo = dateObject.date.getTime();
                    if (dateNo < todayNumeric) {
                        portfolioStats.distributionsToDate += dateObject.equityDistributionsCurrent;
                        portfolioStats.portfolioValueToDate += dateObject.equityDistributionsCurrent;
                        portfolioStats.equityDistributionsToDate += dateObject.equityDistributionsCurrent;

                        dealSummary.distributionsToDate += dateObject.equityDistributionsCurrent;
                    }
                    if (!returnsObjectsByDate[dateNo]) {
                        returnsObjectsByDate[dateNo] = [dateObject];
                    } else {
                        returnsObjectsByDate[dateNo].push(dateObject);
                    }
                });
                return schedule;
            }
            catch (e) {
                console.error(`Failed to get equity stats for deal ${deal.id}:`);
                console.error(e);
                return [];
            }
        }
        else if (investmentStats.financingType === DealFinancingType.promissory_note_now) {
            const schedule = getDebtPayoutScheduleForDeal(investmentStats, closingDate);
            // console.log("debt schedule", schedule)
            schedule.forEach((dateObject, i) => {
                if (i === schedule.length - 1) {
                    portfolioStats.projectedDebtDistributions += dateObject.debtDistributionsCumulative;
                    portfolioStats.projectedPortfolioValue += dateObject.debtDistributionsCumulative;
                }
                const dateNo = dateObject.date.getTime();
                if (dateNo < todayNumeric) {
                    portfolioStats.distributionsToDate += dateObject.debtDistributionsCurrent;
                    portfolioStats.portfolioValueToDate += dateObject.debtDistributionsCurrent;
                    portfolioStats.debtDistributionsToDate += dateObject.debtDistributionsCurrent;

                    dealSummary.distributionsToDate += dateObject.debtDistributionsCurrent;
                }
                if (!returnsObjectsByDate[dateNo]) {
                    returnsObjectsByDate[dateNo] = [dateObject];
                } else {
                    returnsObjectsByDate[dateNo].push(dateObject);
                }
                return {
                    ...dateObject,
                    // dealId: deal.id,
                }
            });

        }
        else {
            console.error(`Financing type ${investmentStats.financingType} not supported for dashboard graph - deal ${deal.id}`);
            return [];
        }
        dealStats.push(dealSummary);
        console.log(`Deal ${deal.id} stats:`, dealSummary);
    });

    await Promise.all(resolvedSchedules);

    const consolidatedSchedule = [] as ReturnsDateObject[];
    let previousDateObject: ReturnsDateObject | undefined;

    const sortedKeys = Object.keys(returnsObjectsByDate).sort((a, b) => (a <= b) ? -1 : 1)
    // console.log("Sorted keys:", sortedKeys.map(key => new Date(parseInt(key)).toDateString()));
    sortedKeys.forEach((key) => {
        const dateObjects = returnsObjectsByDate[parseInt(key)];
        if (!dateObjects?.length) {
            console.error("Empty date objects for key:", key);
            return;
        } else {
            // combine the date objects for the same date
            const combinedDateObject = dateObjects.reduce((acc, curr) => {
                acc.debtDistributionsCurrent += curr.debtDistributionsCurrent;
                acc.debtDistributionsCumulative += curr.debtDistributionsCumulative;
                acc.equityDistributionsCurrent += curr.equityDistributionsCurrent;
                acc.equityDistributionCumulative += curr.equityDistributionCumulative;
                acc.portfolioValueToDate += curr.portfolioValueToDate;
                acc.principalInvestedCurrent += curr.principalInvestedCurrent;
                return acc;
            });

            if (previousDateObject) {
                combinedDateObject.equityDistributionCumulative = previousDateObject.equityDistributionCumulative + combinedDateObject.equityDistributionsCurrent;
                combinedDateObject.debtDistributionsCumulative = previousDateObject.debtDistributionsCumulative + combinedDateObject.debtDistributionsCurrent;
                combinedDateObject.portfolioValueToDate = previousDateObject.portfolioValueToDate + combinedDateObject.debtDistributionsCurrent + combinedDateObject.equityDistributionsCurrent;
                combinedDateObject.principalInvestedToDate = previousDateObject.principalInvestedToDate + combinedDateObject.principalInvestedCurrent;
                console.log("combined date object", combinedDateObject);
            }
            previousDateObject = combinedDateObject;
            consolidatedSchedule.push(combinedDateObject);
        }
    });
    return jsonResponse({ consolidatedSchedule, portfolioStats, dealStats } as PortfolioReturnsResponse);
}
