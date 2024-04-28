import prisma from "@/libs/prisma";
import type { DealUpdateSchema } from "./_globals";
import { type Deal } from "@prisma/client";

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

  /* eslint-disable */
  const updatedDeal = await prisma.deal
    .update({
      where: { hubspotId: hubspotId },
      data: data,
    })
    .catch((err) => {
      console.error(err);
      return err;
    });

  return updatedDeal;
  /* eslint-enable */
}
