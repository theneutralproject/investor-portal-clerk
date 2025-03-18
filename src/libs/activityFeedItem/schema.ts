import { ActivityType } from '@prisma/client';
import { z } from 'zod';

export const zActivityFeedItemCreateSchema = z.object({
  userId: z.number(),
  header: z.string(),
  body: z.string(),
  dateCreated: z.date(),
  link: z.string(),
  itemId: z.number(),
  type: z.nativeEnum(ActivityType),
});

export type ActivityFeedItemCreateSchema = z.infer<
  typeof zActivityFeedItemCreateSchema
>;
