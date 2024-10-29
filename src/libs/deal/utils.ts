import { type Deal, DealFinancingType } from "@prisma/client";
import { isError } from "lodash";
import { ProjectName } from "../schema";
import prisma from "../prisma";
import type { DealUpdateSchema } from "./schema";
import { getEquityStatsFromProject } from "../project/utils";

/**
 * Updates a deal in the database
 * @param {DealUpdateSchema} updateDealData - The data of the deal to update
 * @returns {Promise<Deal | Error>} The updated deal or an error
 */
export async function updateDeal(
    updateDealData: DealUpdateSchema /**dealData includes fields for both Deal and DealInvestmentStats */
): Promise<Deal | Error> {
    const { investmentStats, ...dealData } = updateDealData;

    /* eslint-disable-next-line */
    const updatedDeal = await prisma.deal
        .update({
            where: { hubspotId: dealData.hubspotId },
            data: dealData,
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

            let minInvestmentAmount = 5000;
            if (investmentStats.financingType === DealFinancingType.equity) minInvestmentAmount = project.investmentStats?.equityMinInvestment ?? 5000;
            else minInvestmentAmount = project.investmentStats?.debtMinInvestment ?? 5000;
            if (investmentStats.amount < minInvestmentAmount) {
                console.error(
                    `The minimum investment amount for this project is $${minInvestmentAmount.toLocaleString()}`
                );
                return Error(`The minimum investment amount for this project is $${minInvestmentAmount.toLocaleString()}`);
            }
        }

        await prisma.dealInvestmentStats.update({
            where: { dealId: updatedDeal.id },
            data: investmentStats
        })
            .catch((error) => {
                console.error(
                    `Failed to update deal investment stats for deal id ${updatedDeal.id}. `
                );
                console.error(error);
                return Error("Failed to update deal with hubspot data");
            });
    }

    return updatedDeal;
}

const InvestmentEntity = {
    "The Edison": {
        equity: "Edison Project LLC",
        promissory_note_now: "North Edison LLC",
        promissory_note_at_closing: "Edison Project LLC",
        promissory_to_equity: "North Edison LLC",
    },
    "519 W Main": {
        equity: "Vanilla 301 LLC",
        promissory_note_now: "Vanilla 301 LLC",
        promissory_note_at_closing: "Vanilla 301 LLC",
        promissory_to_equity: "Vanilla 301 LLC",
    },
    "Bakers Place": {
        equity: "Bakers Place Investment LLC",
        promissory_note_now: "Bakers Place Investment LLC",
        promissory_note_at_closing: "Bakers Place Investment LLC",
        promissory_to_equity: "Bakers Place Investment LLC",
    },
};

export function getInvestmentEntity(
    projectName: string,
    financingType: DealFinancingType
) {
    /* eslint-disable */
    switch (projectName) {
        case ProjectName["The Edison"]:
        case ProjectName["519 W Main"]: 
        case ProjectName["Bakers Place"]: {
            return InvestmentEntity[projectName][financingType];
        }
        default: {
            console.error(
                `The project with name ${projectName} is not yet supported in getInvestmentEntity()`
            );
            return null;
        }
    }
    /* eslint-enable */
};
