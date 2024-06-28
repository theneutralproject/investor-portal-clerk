import prisma from "@/libs/prisma";
import { DealCreateSchema, ProjectName, type DealUpdateSchema } from "./_globals";
import type { DealFinancingType, Deal } from "@prisma/client";
import axios from "axios";

/**
 * Updates a deal in the database
 * @param {DealUpdateSchema} dealData - The data of the deal to update
 * @returns {Promise<Deal | Error>} The updated deal or an error
 */
export async function updateDeal(
  dealData: DealUpdateSchema
): Promise<Deal | Error> {
  const { hubspotId, dealStage, amount, financingType } = dealData;
  /* eslint-disable */
  interface PartialDeal {
    [key: string]: any;
  }
  /* eslint-enable */

  const data: PartialDeal = {};
  if (dealStage) {
    data.dealStage = dealStage;
  }

  if (amount) {
    data.amount = amount;
  }

  if (financingType) {
    data.financingType = financingType;
  }

  /* eslint-disable-next-line */
  const updatedDeal = await prisma.deal
    .update({
      where: { hubspotId: hubspotId },
      data: data,
    })
    .catch((error) => {
      console.error(`Failed to update deal with hubspot id ${hubspotId}. It is possible that the Hubspot UI was used to update a deal that was not created in the investor portal:`);
      console.error(error);
      return Error("Failed to update deal with hubspot data");
    });

  return updatedDeal;
  /* eslint-enable */
}

export async function createDeal(dealData:DealCreateSchema) {
    return await axios.post(`/api/deals`)
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
  }
}

export function getInvestmentEntity(projectName: string, financingType: DealFinancingType) {
  /* eslint-disable */
  switch (projectName) {
    case ProjectName["The Edison"]: {
      return InvestmentEntity[projectName][financingType]
    }

    case ProjectName["519 W Main"]: {
      return InvestmentEntity[projectName][financingType]
    }
    default: {
      console.error(`The project with name ${projectName} is not yet supported in getInvestmentEntity()`)
      return null;
    }
  }
  /* eslint-enable */
}
