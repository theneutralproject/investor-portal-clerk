import prisma from "@/libs/prisma";
import type { DealUpdateSchema } from "./_globals";
import { type Deal } from "@prisma/client";

/**
 * Updates a deal in the database
 * @param {DealUpdateSchema} dealData - The data of the deal to update
 * @returns {Promise<Deal | Error>} The updated deal or an error
 */
export async function updateDeal(
  dealData: DealUpdateSchema
): Promise<Deal | Error> {
  const { hubspotId, dealStage, amount, financingType } = dealData;

  if (typeof hubspotId !== "string" || !hubspotId) {
    console.error("Invalid input: hubspotId must be a non-empty string");
    return Error("Invalid input: hubspotId must be a non-empty string");
  }

  if (typeof dealStage !== "number" || !dealStage) {
    console.error("Invalid input: dealStage must be an integer");
    return Error("Invalid input: dealStage must be an integer");
  }

  if (typeof amount !== "number" || isNaN(amount)) {
    console.error("Invalid input: amount must be a number");
    return Error("Invalid input: amount must be a number");
  }

  if (typeof financingType !== "string" || !financingType) {
    console.error("Invalid input: financingType must be a non-empty string");
    return Error("Invalid input: financingType must be a non-empty string");
  }

  const data = {
    ...dealData,
    ...(dealStage ? { dealStage } : {}),
    ...(amount && { amount }),
    ...(financingType && { financingType }),
  };

  try {
    const updatedDeal = await prisma.deal.update({
      where: { hubspotId },
      // @ts-expect-error - TS doesn't know about the optional properties
      data,
    });
    return updatedDeal;
  } catch (error) {
    console.error(error);
    return Error("Failed to update deal");
  }
}
