// This file is used to define reusable functions, types and constants

import { z } from "zod";

export enum ProjectName {
    "The Edison" = "The Edison",
    "Bakers Place" = "Bakers Place",
    "The Bloom" = "The Bloom",
    "519-521 W Main St" = "519-521 W Main St"
  }

  export const zHubspotDealUpdateSchema = z.object({
    hubspotId: z.string(),
    dealStage: z.number().optional(),
    amount: z.number().optional(),
    financingType: z.string().optional()
  });

  export type HubspotDealUpdateSchema = z.infer<typeof zHubspotDealUpdateSchema>