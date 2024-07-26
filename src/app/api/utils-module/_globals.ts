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

export const zDocusignPayload = z.object({
  user: z.object({
    id: z.string(),
    fullName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }),
  amount: z.number().min(1000)
});

export type DocusignPayloadSchema = z.infer<typeof zDocusignPayload>;


export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
