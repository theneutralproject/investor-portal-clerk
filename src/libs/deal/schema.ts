import {
  DealOwnershipType,
  DealFinancingType,
  DealUnitType,
  PaymentMethod,
  DealStatus,
  DealConversion,
  Deal,
} from '@prisma/client';
import { z } from 'zod';

export const zDealInvestmentStatsUpdateSchema = z.object({
  amount: z.number().optional(),
  ownershipType: z.nativeEnum(DealOwnershipType).optional(),
  financingType: z.nativeEnum(DealFinancingType).optional(),
  unitType: z.nativeEnum(DealUnitType).optional(),
  numberAUnits: z.number().min(0).optional(),
  numberCUnits: z.number().min(0).optional(),
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
  status: z.nativeEnum(DealStatus).optional(),
});

export type DealUpdateSchema = z.infer<typeof zDealUpdateSchema>;

export const zDealCreateSchema = z.object({
  projectId: z.number().int(),
  organizationId: z.number().int().nullish(),
  amount: z.number().nullish(),
  hubspotId: z.string().nullish(),
  dealStage: z.number().min(0).max(6).nullish(),
  financingType: z.nativeEnum(DealFinancingType).nullish(),
  transactionId: z.string().optional(),
  closingDate: z.date().nullish(),
  signaturesCompletedDate: z.date().nullish(),
  dateFundsSent: z
    .date()
    .or(z.string().transform(str => new Date(str)))
    .nullish(),
  paymentMethod: z.nativeEnum(PaymentMethod).nullish(),
  paymentReferenceId: z.string().nullish(),
  debtMinTerm: z.number().int().nullish(), //used for maintenance scripts to create old deals
  debtMaxTerm: z.number().int().nullish(), //used for maintenance scripts to create old deals
  debtInterestRatePerc: z.number().nullish(), //used for maintenance scripts to create old deals
  investmentEntity: z.string().optional(), //used for maintenance scripts to create old deals
  status: z.nativeEnum(DealStatus).optional(), //used to create deals with conversions
});

export type DealCreateSchema = z.infer<typeof zDealCreateSchema>;

export const zDealConversionCreateSchema = z.object({
  startDealId: z.number().int(),
  endDealId: z.number().int(),
});

export type DealConversionCreateSchema = z.infer<
  typeof zDealConversionCreateSchema
>;

export type DealWithConversion = Deal & {
  startDealConversion?: DealConversion;
  endDealConversion?: DealConversion;
};

export enum DealStage {
  'LEAD' = 0,
  'STARTED' = 1,
  'DETAILS_SUBMITTED' = 2,
  'DOCUMENT_REVIEW' = 3,
  'SIGNATURES_COMPLETED' = 4,
  'CLOSED' = 5,
  'CLOSED_LOST' = 6,
}
