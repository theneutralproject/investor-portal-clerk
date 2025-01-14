import {
  DealOwnershipType,
  DealFinancingType,
  DealUnitType,
  PaymentMethod,
} from '@prisma/client';
import { z } from 'zod';

export const zDealInvestmentStatsUpdateSchema = z.object({
  amount: z.number().optional(),
  ownershipType: z.nativeEnum(DealOwnershipType).optional(),
  financingType: z.nativeEnum(DealFinancingType).optional(),
  unitType: z.nativeEnum(DealUnitType).optional(),
  numberAUnits: z.number().min(0).optional(),
  numberCUnits: z.number().min(0).optional(),
  shareOfEquity: z.number().min(0).optional(),
});

export type DealInvestmentStatsUpdateSchema = z.infer<
  typeof zDealInvestmentStatsUpdateSchema
>;

// always look up a deal by hubspotId
export const zDealUpdateSchema = z.object({
  hubspotId: z.string(),
  projectId: z.number().int().optional(),
  organizationId: z.number().optional(),
  dealStage: z.number().min(0).max(6).optional(),
  accreditationVerifierId: z.number().optional().nullable(),
  investmentStats: zDealInvestmentStatsUpdateSchema.optional(),
  closingDate: z.date().nullish(),
  signaturesCompletedDate: z.date().nullish(),
  dateFundsSent: z
    .date()
    .or(z.string().transform(str => new Date(str)))
    .nullish(),
  paymentMethod: z.nativeEnum(PaymentMethod).nullish(),
  paymentReferenceId: z.string().nullish(),
  transactionId: z.string().optional(),
});

export type DealUpdateSchema = z.infer<typeof zDealUpdateSchema>;

export const zDealCreateSchema = z.object({
  projectId: z.number().int(),
  organizationId: z.number().int().nullish(),
  amount: z.number().nullish(),
  hubspotId: z.string().nullish(),
  dealStage: z.number().min(0).max(6).nullish(),
  financingType: z.nativeEnum(DealFinancingType).nullish(),
  transactionId: z.string().nullish(),
  closingDate: z.date().nullish(),
  signaturesCompletedDate: z.date().nullish(),
  dateFundsSent: z
    .date()
    .or(z.string().transform(str => new Date(str)))
    .nullish(),
  paymentMethod: z.nativeEnum(PaymentMethod).nullish(),
  paymentReferenceId: z.string().nullish(),
  debtMinTerm: z.number().int().nullish(),
  debtMaxTerm: z.number().int().nullish(),
  debtInterestRatePerc: z.number().nullish(),
});

export type DealCreateSchema = z.infer<typeof zDealCreateSchema>;
