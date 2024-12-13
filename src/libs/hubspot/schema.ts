import { DealFinancingType, DealUnitType } from "@prisma/client";
import { z } from "zod";

/**
 * * User types
 * 👇
 */

export type HubspotContact = {
  properties: { property: string; value: string }[];
  email?: string;
  hubspotId?: string;
};

const zHsContactProperty = z.object({
  property: z.string(),
  value: z.string()
});

export const zHsContactUpdateSchema = z.object({
  email: z.string(),
  properties: z.array(zHsContactProperty)
});

export type HubspotUserCreateResponse = {
  vid: number,
  isNew: boolean
};

export const hubspotContactApiResponse = z.object({
  vid: z.number(),
});


/**
 * * Deal types
 * 👇
 */
export type HubspotDealPropertiesCollection = {
  properties: { name: string; value: string }[];
};

export type HubspotDealUpdate = {
  hubspotDealId: number,
  properties: { name: string; value: string }[]
};

export const zHsDealCreateResponse = z.object({
  dealId: z.number()
});
export type HsDealCreateResponse = z.infer<typeof zHsDealCreateResponse>;

export const zHubspotDealUpdateSchema = z.object({
  hubspotId: z.string(),
  projectId: z.number().int().optional(),
  organizationId: z.number().int().optional(),
  dealStage: z.number().optional(),
  amount: z.number().optional(),
  financingType: z.nativeEnum(DealFinancingType).optional(),
  unitType: z.nativeEnum(DealUnitType).optional()
});

export type HubspotDealUpdateSchema = z.infer<typeof zHubspotDealUpdateSchema>;

export const zHsUpdateDealSchema = z.object({
  hubspotDealId: z.number(),
  properties: z.array(z.object(
    {
      name: z.string(),
      value: z.string()
    }
  ))
});

const zHsDealSearchObjectSchema = z.object({
  properties: z.object({
    amount: z.string()
  })
});

export const zHsDealSearchResultsSchema = z.object({
  total: z.number(),
  results: z.array(zHsDealSearchObjectSchema)
});

export const zHsDealDocsAccessedUpdateSchema = z.object({
  dealId: z.number(),
  dealStage: z.number().min(1).max(6),
  documentNames: z.string(),
});

export type HsDealDocsAccessedUpdateSchema = z.infer<typeof zHsDealDocsAccessedUpdateSchema>