// This file is used to define reusable functions, types and constants

import { z } from "zod";

export enum ProjectName {
    "The Edison" = "The Edison",
    "Bakers Place" = "Bakers Place",
    "The Bloom" = "The Bloom",
    "519 W Main" = "519 W Main"
  }

  export const zHubspotDealUpdateSchema = z.object({
    hubspotId: z.string(),
    dealStage: z.number().optional(),
    amount: z.number().optional(),
    financingType: z.string().optional()
  });

  export type HubspotDealUpdateSchema = z.infer<typeof zHubspotDealUpdateSchema>;

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
