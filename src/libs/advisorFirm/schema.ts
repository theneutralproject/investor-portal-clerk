import { z } from 'zod';
import { zUserCreateSchema } from '../user/schema';
import { AdvisorEmployeeRole } from '@prisma/client';

export const zAdvisorFirmCreateSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

export type AdvisorFirmCreateSchema = z.infer<typeof zAdvisorFirmCreateSchema>;

export const zAdvisorEmployeeCreateSchema = z.object({
  role: z.nativeEnum(AdvisorEmployeeRole),
  user: zUserCreateSchema,
});

export type AdvisorEmployeeCreateSchema = z.infer<
  typeof zAdvisorEmployeeCreateSchema
>;
