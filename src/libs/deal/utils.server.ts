import 'server-only';
import { DealFinancingType, type DealInvestmentStats } from "@prisma/client";
import { isError } from "lodash";
import type { DealUpdateSchema } from "./schema";
import { getEquityStatsFromProject } from "../project/utils";
import prisma from "../prisma.server";
import { getHsDealPropsFromDeal, updateHubspotDealProperties } from '../hubspot/utils';

/**
 * Updates a deal in the database and in Hubspot
 * @param {DealUpdateSchema} updateDealData - The data of the deal to update
 * @returns {Promise<Deal | Error>} The updated deal or an error
 */
export async function updateDeal(
    updateDealData: DealUpdateSchema /**dealData includes fields for both Deal and DealInvestmentStats */,
    updateHubspot = false
) {
    const { investmentStats, ...dealData } = updateDealData;
    let updatedStats: DealInvestmentStats | null | Error = null;
    const existingDeal = await prisma.deal.findUnique({
        where: { hubspotId: dealData.hubspotId },
    });
    if (existingDeal === null) {
        console.error(
            `Failed to find deal with hubspot id ${dealData.hubspotId}.`
        );
        return Error("The deal does not exist in the database");
    }

    if (existingDeal.dealStage === 5) {
        console.error("Completed Deals cannot be updated");
        return Error("Completed Deals cannot be updated");
    }

    /* eslint-disable-next-line */
    const updatedDeal = await prisma.deal
        .update({
            where: { hubspotId: dealData.hubspotId },
            data: dealData,
            include: { investmentStats: true },
        })

    if (!updatedDeal || isError(updateDeal)) {
        console.error(
            `Failed to update deal with hubspot id ${dealData.hubspotId}. It is possible that the Hubspot UI was used to update a deal that was not created in the investor portal:`
        );
        console.error(updatedDeal);
        return Error("Failed to update deal with hubspot data");
    }
    if (investmentStats) {
        const project = await prisma.project.findUnique({
            where: { id: updatedDeal.projectId },
            include: { investmentStats: true },
        });
        if (!project || !project.investmentStats || !project.equityReturnsFile) {
            console.error(
                `Failed to find project with id ${updatedDeal.projectId} for deal with hubspot id ${dealData.hubspotId}.`
            );
            return Error("Failed to update deal with hubspot data");
        }

        if (investmentStats.amount) {
            const equityDetails = await getEquityStatsFromProject(investmentStats.amount, project.equityReturnsFile, project.investmentStats.cUnitThresholdAmount);
            if (isError(equityDetails)) {
                console.error(
                    `Failed to get equity stats for deal with hubspot id ${dealData.hubspotId}.`
                );
                return Error("Failed to update deal with hubspot data");
            }
            const { unitType, shareOfEquity, numberAUnits, numberCUnits } = equityDetails;
            investmentStats.unitType = unitType;
            investmentStats.shareOfEquity = shareOfEquity;
            investmentStats.numberAUnits = numberAUnits;
            investmentStats.numberCUnits = numberCUnits;

            let minInvestmentAmount = project.investmentStats?.debtMinInvestment ?? 5000;
            if (investmentStats.financingType === DealFinancingType.equity) minInvestmentAmount = project.investmentStats?.equityMinInvestment ?? 5000;
            if (investmentStats.amount < minInvestmentAmount) {
                console.error(
                    `The minimum investment amount for this project is $${minInvestmentAmount.toLocaleString()}`
                );
                return Error(`The minimum investment amount for this project is $${minInvestmentAmount.toLocaleString()}`);
            }
        }

        updatedStats = await prisma.dealInvestmentStats.update({
            where: { dealId: updatedDeal.id },
            data: investmentStats,
        })
            .catch((error) => {
                console.error(
                    `Failed to update deal investment stats for deal id ${updatedDeal.id}. `
                );
                console.error(error);
                return Error("Failed to update deal with hubspot data");
            });
    }
    if (isError(updatedStats)) return updatedStats;

    if (updateHubspot) {
        try {
            const hsDeal = getHsDealPropsFromDeal(updateDealData);
            await updateHubspotDealProperties(hsDeal);
        } catch (error) {
            console.error("Failed to update deal in Hubspot", error);
        }
    }

    updatedDeal.investmentStats = updatedStats;
    return updatedDeal;
};
