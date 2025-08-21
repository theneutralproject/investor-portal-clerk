import { Status } from '@prisma/client';
import { z } from 'zod';

export const zCustodianPlatformCreateSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url().min(1),
  status: z.nativeEnum(Status),
  projectIds: z.array(z.number()).optional(),
  advisorIds: z.array(z.number()).optional(),
});

export type CustodianPlatformCreateSchema = z.infer<
  typeof zCustodianPlatformCreateSchema
>;
