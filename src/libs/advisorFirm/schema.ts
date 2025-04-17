import { z } from 'zod';

export const zAdvisorFirmCreateSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

export type AdvisorFirmCreateSchema = z.infer<typeof zAdvisorFirmCreateSchema>;
