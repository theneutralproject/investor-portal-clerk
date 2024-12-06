import prisma from "@/libs/prisma.server";
import { ReturnsDateObject } from "@/libs/project/schema";
import { getDebtPayoutScheduleForDeal, getEquityPayoutScheduleForDeal, readEquityMilestoneData } from "@/libs/project/utils";
import { errorResponse, jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import { $Enums, DealFinancingType } from "@prisma/client";
import { date } from "zod";

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

    // iterate through organizations and get deals
    const deals: ({ project: { milestones: { id: number; projectId: number; equityContribution: Date; financialClosing: Date; groundBreakingCeremony: Date | null; startVerticalConstruction: Date | null; toppingOut: Date | null; preLeasing: Date | null; fullEnclosure: Date | null; temporaryOccupancy: Date; grandOpening: Date; stabilized: Date; refinance: Date; sale: Date; } | null; } & { id: number; name: string; location: string; tags: string; status: $Enums.Status; description: string; marketHighlights: string; youtubeUrl: string; slug: string; equityReturnsFile: string; }; investmentStats: { id: number; ownershipType: $Enums.DealOwnershipType; dealId: number; amount: number; financingType: $Enums.DealFinancingType; unitType: $Enums.DealUnitType; debtInterestRatePerc: number; debtTermMonthsMin: number; debtTermMonthsMax: number; debtPaymentFreqMonths: number; debtPaymentFreq: string; equityTermMonths: number; equityPreferredReturn: number; shareOfEquity: number; numberAUnits: number; numberCUnits: number; } | null; } & { id: number; hubspotId: string; organizationId: number; projectId: number; dealStage: number; transactionId: string; investmentEntity: string; closingDate: Date | null; signaturesCompletedDate: Date | null; dateFundsSent: Date | null; paymentMethod: $Enums.PaymentMethod | null; paymentReferenceId: string | null; })[] = [];
    for (const member of user.organizationMember) {
        const org = member.organization;
        for (const deal of org.deals) {

            console.log("deal", deal.id, deal.investmentStats?.amount, deal.project.id);
            if (deal.dealStage === 5) {
                if (!deal.investmentStats) {
                    console.error(`Deal ${deal.id} has no investment stats`);
                }
                if (deal.investmentStats && deal.project) {
                    deals.push(deal);
                }
            }
        }
    }
    console.log("deals", deals.length);
    // for each deal, get the payout schedule based on the financing type
    const payoutSchedules = await deals.map(async deal => {
        const { project, investmentStats, closingDate } = deal;
        if (!investmentStats) {
            return [];
        }
        if (!closingDate) {
            console.error(`Closing date is missing for deal ${deal.id}`);
            return [];
        }
        if (!project?.milestones || !project.equityReturnsFile) {
            console.error(`Project milestones or equity returns file not found for project ${project.id}`);
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

            return debtPayoutSchedule
        }
        else {
            console.error(`Financing type ${investmentStats.financingType} not supported for dashboard graph - deal ${deal.id}`);
            return [];
        }
    });

    const portfolioStats = {
        portfolioValueToDate: 0,
        distributionsToDate: 0,
        accruedInterestToDate: 0,
        projectedInterest: 0,
        projectedDistributions: 0,
        projectedPortfolioValue: 0,
        principalInvested: 0
    }

    type DealSummaryStats = {
        dealId: number;
        committedAmount: number;
        distributionsToDate: number;
        accruedInterestToDate: number;
    }

    const dealSummaryStats = [] as DealSummaryStats[]// 

    // create one timeline for all deals, from the earliest closing date to the latest term date 
    const consolidatedSchedule = [] as ReturnsDateObject[]

    // calculate summary stats for all deals:
    const resolvedPayoutSchedules = await Promise.all(payoutSchedules);
    resolvedPayoutSchedules.forEach(schedulePerDeal => {
        if (!schedulePerDeal.length) return;
        const deal = deals.find(deal => deal.id === schedulePerDeal[0]!.dealId);
        if (!deal) return;
        portfolioStats.portfolioValueToDate += deal.investmentStats?.amount ?? 0;
        portfolioStats.projectedPortfolioValue += deal.investmentStats?.amount ?? 0;
        portfolioStats.principalInvested += deal.investmentStats?.amount ?? 0;
        let dealSummary = {
            dealId: deal.id,
            committedAmount: deal.investmentStats?.amount ?? 0,
            distributionsToDate: 0,
            accruedInterestToDate: 0,
        }
        schedulePerDeal.forEach(dateObject => {
            // if the dateObject is already in the consolidated schedule, add to the existing date object
            const existingDateObject = consolidatedSchedule.find(obj => obj.date.toDateString() === dateObject.date.toDateString());
            if (existingDateObject) {
                existingDateObject.distributionAmount += dateObject.distributionAmount;
                existingDateObject.cumulativeDistribution += dateObject.cumulativeDistribution;
                existingDateObject.totalGrossReturn += dateObject.totalGrossReturn;
                existingDateObject.totalNetReturn += dateObject.totalNetReturn;
                existingDateObject.investmentMultiple += dateObject.investmentMultiple;
                if (dateObject.accruedPreferredReturn) existingDateObject.accruedPreferredReturn = existingDateObject.accruedPreferredReturn ?? 0 + dateObject.accruedPreferredReturn;
            }
            else {
                consolidatedSchedule.push(dateObject);
            }
            // if the date is in the past, add the distribution amount to the portfolio stats
            if (dateObject.date < new Date()) {
                console.log("processing past date object", dateObject);
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
    return jsonResponse({ consolidatedSchedule, portfolioStats, dealSummaryStats });
}
