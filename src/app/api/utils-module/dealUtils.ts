import prisma from "@/libs/prisma";
import type { DealUpdateSchema } from "./_globals";
import { type Deal } from "@prisma/client";

type PartialDeal = Record<string, unknown>;

/**
 * Updates a deal in the database
 * @param {DealUpdateSchema} dealData - The data of the deal to update
 * @param {PartialDeal} data - The partial data to update the deal with
 * @returns {Promise<Deal | Error>} The updated deal or an error
 */
export async function updateDeal(
  dealData: DealUpdateSchema,
  data: PartialDeal
): Promise<Deal | Error> {
  const { hubspotId, dealStage, amount, financingType } = dealData;

  if (typeof hubspotId !== "string" || !hubspotId) {
    console.error("Invalid input: hubspotId must be a non-empty string");
    return Error("Invalid input: hubspotId must be a non-empty string");
  }

  if (typeof dealStage !== "string" || !dealStage) {
    console.error("Invalid input: dealStage must be a non-empty string");
    return Error("Invalid input: dealStage must be a non-empty string");
  }

  if (typeof amount !== "number" || isNaN(amount)) {
    console.error("Invalid input: amount must be a number");
    return Error("Invalid input: amount must be a number");
  }

  if (typeof financingType !== "string" || !financingType) {
    console.error("Invalid input: financingType must be a non-empty string");
    return Error("Invalid input: financingType must be a non-empty string");
  }

  data = {
    ...data,
    ...(dealStage ? { dealStage } : {}),
    ...(amount && { amount }),
    ...(financingType && { financingType }),
  };

  try {
    const updatedDeal = await prisma.deal.update({
      where: { hubspotId },
      data,
    });
    return updatedDeal;
  } catch (error) {
    console.error(error);
    return Error("Failed to update deal");
  }
}
