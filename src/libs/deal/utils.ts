import type { DealFinancingType, Deal } from "@prisma/client";
import { isError } from "lodash";
import { ProjectName } from "../schema";
import prisma from "../prisma";
import type { DealUpdateSchema } from "./schema";

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
};

export function getInvestmentEntity(
    projectName: string,
    financingType: DealFinancingType
) {
    /* eslint-disable */
    switch (projectName) {
        case ProjectName["The Edison"]: {
            return InvestmentEntity[projectName][financingType];
        }

        case ProjectName["519 W Main"]: {
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
