import { DealOwnershipType, DealFinancingType, DealUnitType, PaymentMethod } from "@prisma/client";
import { z } from "zod";


export const zDealInvestmentStatsUpdateSchema = z.object({
  amount: z.number().optional(),
  ownershipType: z.nativeEnum(DealOwnershipType).optional(),
  financingType: z.nativeEnum(DealFinancingType).optional(),
  unitType: z.nativeEnum(DealUnitType).optional(),
  numberAUnits: z.number().min(0).optional(),
  numberCUnits: z.number().min(0).optional(),
  shareOfEquity: z.number().min(0).optional(),
});

export type DealInvestmentStatsUpdateSchema = z.infer<typeof zDealInvestmentStatsUpdateSchema>;

// always look up a deal by hubspotId
export const zDealUpdateSchema = z.object({
  hubspotId: z.string(),
  projectId: z.number().int().optional(),
  organizationId: z.number().optional(),
  dealStage: z.number().optional(),
  accreditationVerifierId: z.number().optional().nullable(),
  investmentStats: zDealInvestmentStatsUpdateSchema.optional(),
  closingDate: z.date().nullish(),
  signaturesCompletedDate: z.date().nullish(),
  dateFundsSent: z.date().nullish(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  paymentReferenceId: z.string().nullish(),
});

export type DealUpdateSchema = z.infer<typeof zDealUpdateSchema>;

export const zDealCreateSchema = z.object({
  projectId: z.number().int(),
  amount: z.number().optional(),
  dealStage: z.number().optional(),
  financingType: z.nativeEnum(DealFinancingType).optional(),
  transactionId: z.string().optional(),
  organizationId: z.number().optional() /**will be set in the backend if not provided by UI */,
});

export type DealCreateSchema = z.infer<typeof zDealCreateSchema>;
