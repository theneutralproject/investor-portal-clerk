import prisma from "@/libs/prisma";
import type { HubspotDealUpdateSchema } from "./_globals";
import { type Deal } from "@prisma/client";

/**
 * Updates a deal in the database
 * @param {HubspotDealUpdateSchema} dealData - The data of the deal to update
 * @returns {Promise<Deal | Error>} The updated deal or an error
 */
export async function updateDeal(
  dealData: HubspotDealUpdateSchema
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
      console.error(error);
      return Error("Failed to update deal with hubspot data");
    });

  return updatedDeal;
  /* eslint-enable */
}
