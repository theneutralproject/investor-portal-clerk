import 'server-only';
import { DealFinancingType, type DealInvestmentStats } from "@prisma/client";
import { isError } from "lodash";
import type { DealUpdateSchema } from "./schema";
import { getDebtInterestRate, getEquityStatsFromProject } from "../project/utils";
import prisma from "../prisma.server";
import { getHsDealPropsFromDeal, updateHubspotDealProperties } from '../hubspot/utils';
import type { DealWithInvestmentStats, ProjectWithInvestmentStats } from '../types';

/**
 * Updates a deal, as well as investmentStats in the DB and in Hubspot
 * @param {DealUpdateSchema} updateDealData - The data of the deal to update
 * @returns {Promise<Deal>} The updated deal or an error
 */
export async function updateDeal(
    updateDealData: DealUpdateSchema /**dealData includes fields for both Deal and DealInvestmentStats */,
    updateHubspot = false
) {
    const { investmentStats: investmentStatsToUpdate, ...dealData } = updateDealData;
    const existingDeal = await prisma.deal.findUnique({
        where: { hubspotId: dealData.hubspotId },
        include: { investmentStats: true },
    });
    if (!existingDeal) {
        console.error(
            `Failed to find deal with hubspot id ${dealData.hubspotId}.`
        );
        throw Error("The deal does not exist in the database");
    }

    if (existingDeal.dealStage === 5) {
        console.error("Completed Deals cannot be updated");
        throw Error("Completed Deals cannot be updated");
    }
    console.log("investmentStatsToUpdate", investmentStatsToUpdate);

    // first update the stats


    let updatedStats: DealInvestmentStats | null = null;
    // Only update investment stats if the deal stage is less than 4 (not yet signed)
    if (existingDeal.dealStage >= 4) {
        console.error(
            `Deal with id ${existingDeal.id} is already signed, and the investmentStats cannot be updated.`
        );
    } else {
        if (investmentStatsToUpdate) {
            // the only investment stats fields that can be updated  from outside this function are amount, financingType, and ownershipType
            const { amount, financingType, ownershipType, ...ignoredInvestmentStats } = investmentStatsToUpdate;
            for (const key in ignoredInvestmentStats) {
                console.warn(`For deal with id ${existingDeal.id}, ignoring to update investmentStat: ${key}, as it can only be updated internally.`);
            }

            const project = await prisma.project.findUnique({
                where: { id: existingDeal.projectId },
                include: { investmentStats: true },
            }) as ProjectWithInvestmentStats;
            if (!project || !project.investmentStats || !project.equityReturnsFile) {
                console.error(
                    `Failed to find project with id ${existingDeal.projectId} for deal with hubspot id ${dealData.hubspotId}.`
                );
                throw Error("Failed to update deal with hubspot data");
            }

            const dealFinancingType = financingType ?? existingDeal.investmentStats?.financingType;
            const dealAmount = amount ?? existingDeal.investmentStats?.amount;
            const dealOwnershipType = ownershipType ?? existingDeal.investmentStats?.ownershipType;

            let newInvestmentStats = {
                amount: dealAmount,
                financingType: dealFinancingType,
                ownershipType: dealOwnershipType,
                dealId: existingDeal.id,
            } as DealInvestmentStats;

            if (dealFinancingType === DealFinancingType.equity) {
                try {
                    console.log("Populating EQUITY stats for deal with id", existingDeal.id);
                    newInvestmentStats = await populateDealEquityStats(newInvestmentStats, project);
                } catch (e) {
                    throw e;
                }
            }
            else {
                console.log("Populating DEBT stats for deal with id", existingDeal.id);
                newInvestmentStats = populateDealDebtStats(newInvestmentStats, project);
            }

            try {
                console.log("Updating deal investment stats for deal with id", existingDeal.id);
                updatedStats = await prisma.dealInvestmentStats.update({
                    where: { dealId: existingDeal.id },
                    data: newInvestmentStats,
                });
            } catch (error) {
                console.error(
                    `Failed to update deal investment stats for deal id ${existingDeal.id}. `
                );
                console.error(error);
                throw Error("Failed to update deal with hubspot data");
            }
        }
    }

    // then update the deal

    let updatedDeal: DealWithInvestmentStats
    /* eslint-disable-next-line */
    try {
        console.log("Updating deal with this data:", dealData);
        updatedDeal = await prisma.deal
            .update({
                where: { hubspotId: dealData.hubspotId },
                data: dealData,
                include: { investmentStats: true },
            }) as DealWithInvestmentStats
    } catch (error) {
        console.error(`Failed to update deal with hubspot id ${dealData.hubspotId}:`, error);
        throw Error(`Failed to update deal with hubspot id ${dealData.hubspotId}`);
    }


    if (updateHubspot) {
        try {
            const hsDealData = updateDealData
            if (updatedStats) {
                hsDealData.investmentStats = updatedStats;
            }
            const hsDeal = getHsDealPropsFromDeal(updateDealData);
            await updateHubspotDealProperties(hsDeal);
        } catch (error) {
            console.error("Failed to update deal in Hubspot", error);
        }
    }
    if (updatedStats) {
        updatedDeal.investmentStats = updatedStats;
    }
    return updatedDeal;
}

export async function populateDealEquityStats(stats: DealInvestmentStats, project: ProjectWithInvestmentStats) {
    const equityDetails = await getEquityStatsFromProject(stats.amount, project.equityReturnsFile, project.investmentStats.cUnitThresholdAmount);
    if (isError(equityDetails)) {
        console.error(
            `Failed to get equity stats for project ${project.name}:`
        );
        console.error(equityDetails);
        throw equityDetails;
    }
    const { unitType, shareOfEquity, numberAUnits, numberCUnits } = equityDetails;
    stats.unitType = unitType;
    stats.shareOfEquity = shareOfEquity;
    stats.numberAUnits = numberAUnits;
    stats.numberCUnits = numberCUnits;
    stats.equityTermMonths = project.investmentStats.equityTermMonths;

    // set all debt related fields to null
    stats.debtTermMonthsMin = 0;
    stats.debtTermMonthsMax = 0;
    stats.debtPaymentFreq = "";
    stats.debtPaymentFreqMonths = 0;
    stats.debtInterestRatePerc = 0;

    const minInvestmentAmount = project.investmentStats.equityMinInvestment;
    if (stats.amount < minInvestmentAmount) {
        console.error(
            `The minimum investment amount for this project is $${minInvestmentAmount.toLocaleString()}`
        );
        throw Error(`Amount is too low! The minimum investment amount for this deal needs to be $${minInvestmentAmount.toLocaleString()}`);
    }
    return stats;
}

export function populateDealDebtStats(stats: DealInvestmentStats, project: ProjectWithInvestmentStats) {
    stats.debtTermMonthsMin = project.investmentStats.debtTermMonthsMin;
    stats.debtTermMonthsMax = project.investmentStats.debtTermMonthsMax;
    stats.debtPaymentFreq = project.investmentStats.debtPaymentFreq;
    stats.debtPaymentFreqMonths = project.investmentStats.debtPaymentFreqMonths;
    stats.debtInterestRatePerc = getDebtInterestRate(stats.amount, project.investmentStats);

    // set all equity related fields to null
    stats.equityTermMonths = 0;
    stats.numberAUnits = 0;
    stats.numberCUnits = 0;
    stats.shareOfEquity = 0;
    const minInvestmentAmount = project.investmentStats.debtMinInvestment;
    if (stats.amount < minInvestmentAmount) {
        console.error(
            `The minimum investment amount for this project is $${minInvestmentAmount.toLocaleString()}`
        );
        throw Error(`Amount is too low! The minimum investment amount for this deal needs to be $${minInvestmentAmount.toLocaleString()}`);
    }
    return stats;
}
