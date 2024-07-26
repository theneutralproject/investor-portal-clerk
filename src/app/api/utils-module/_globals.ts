// This file is used to define reusable functions, types and constants

import { DealFinancingType } from "@prisma/client";
import { z } from "zod";

export enum ProjectName {
  "The Edison" = "The Edison",
  "Bakers Place" = "Bakers Place",
  "The Bloom" = "The Bloom",
  "519 W Main" = "519 W Main"
}


// always look up a deal by hubspotId
export const zDealUpdateSchema = z.object({
  hubspotId: z.string(),
  projectId: z.number().optional(),
  dealStage: z.number().optional(),
  amount: z.number().optional(),
  financingType: z.nativeEnum(DealFinancingType).optional(),
});

export const zDealCreateSchema = z.object({
  projectId: z.number(),
  dealStage: z.number().optional(),
  financingType: z.nativeEnum(DealFinancingType).optional(),
  transactionId: z.string().optional(),
});

export type DealUpdateSchema = z.infer<typeof zDealUpdateSchema>
export type DealCreateSchema = z.infer<typeof zDealCreateSchema>

// todo: hook this up in docusignUtils
enum ownershipTypeEnum {
  Individual = "ownershipTypeIndividual",
  Joint = "ownershipTypeJoint",
  Corporation = "ownershipTypeCorporation",
  RevocableGrantor = "ownershipTypeRevocable",
  Other = "ownershipTypeOther",
  Marital = "ownershipTypeMarital",
  Common = "ownershipTypeCommon",
  Partnership = "ownershipTypePartnership"
}

export const zDocusignEnvelope = z.object({
  envelopeId: z.string(),
  projectId: z.number(),
  clerkUserId: z.string(),
  amount: z.number().min(0),
  amountSpelledOut: z.string().optional(),
  numAUnits: z.number().optional(),
  numCUnits: z.number().optional(),
  investorName: z.string().optional(),
  ownershipType: z.nativeEnum(ownershipTypeEnum).optional(),
  ownershipTypeOtherValue: z.string().optional(),
  coSigner: z.object({
    email: z.string(),
    fullName: z.string()
  }).optional(),
  accreditationVerifier: z.object({
    email: z.string(),
    fullName: z.string()
  }).optional()
});

export type DocusignEnvelopeSchema = z.infer<typeof zDocusignEnvelope>;

const zDocusignSigner = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().nullable(),
  title: z.string().nullable(),
  ssn: z.string().nullable()
});

export type DocusignSignerSchema = z.infer<typeof zDocusignSigner>;

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
