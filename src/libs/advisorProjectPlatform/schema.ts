import { z } from 'zod';

export const zAdvisorProjectPlatformCreateSchema = z.object({
  advisorId: z.number().min(1, 'advisorId is required'),
  projectId: z.number().min(1, 'projectId is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'UPCOMING']),
});

export type AdvisorProjectPlatformCreateSchema = z.infer<
  typeof zAdvisorProjectPlatformCreateSchema
>;
