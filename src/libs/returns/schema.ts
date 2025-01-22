import { PictureTypeSchema } from 'prisma/generated/zod';
import { z } from 'zod';

export const zReturnsDateObjectSchema = z.object({
  date: z.date(),
  debtDistributionsCurrent: z.number(), // used for debt deals
  debtDistributionsCumulative: z.number(), // sum of all debtDistributions
  equityDistributionsCurrent: z.number(), // only used for equity deals // should dip once there are distributions
  equityDistributionCumulative: z.number(), // sum of all equityDistributions
  equityAccruedPreferredReturn: z.number(), // only used for equity deals
  portfolioValueToDate: z.number(),
  principalInvestedToDate: z.number(), // sum of all principalInvestedCurrent
  principalInvestedCurrent: z.number(), // indicate principal invested for current month
});
export type ReturnsDateObject = z.infer<typeof zReturnsDateObjectSchema>;

export const zReturnsPortfolioStatsSchema = z.object({
  portfolioValueToDate: z.number(), // sum of accruedInterestToDate and distributionsToDate and principalInvested
  distributionsToDate: z.number(), // payments made to the investor to date
  debtDistributionsToDate: z.number(), // only used for debt deals
  equityDistributionsToDate: z.number(), // only used for equity deals
  projectedEquityDistributions: z.number(), // only used for equity deals
  projectedDebtDistributions: z.number(), // sum of existing and future distributions
  projectedPortfolioValue: z.number(), // sum of portfolioValueToDate and projectedDistributions
  principalInvested: z.number(), // sum of all committed amounts
});

export type ReturnsPortfolioStats = z.infer<
  typeof zReturnsPortfolioStatsSchema
>;
export const zReturnsDealStatsSchema = z.object({
  dealId: z.number(),
  committedAmount: z.number(),
  distributionsToDate: z.number(),
  distributionsProjected: z.number(),
  project: z.object({
    id: z.number(),
    name: z.string(),
    location: z.string(),
    pictures: z
      .array(
        z.object({
          id: z.number(),
          type: PictureTypeSchema,
          url: z.string(),
        })
      )
      .nullable(),
  }),
  financingType: z.enum(['equity', 'debt']),
});
export type ReturnsDealStats = z.infer<typeof zReturnsDealStatsSchema>;

export const zPortfolioReturnsSchema = z.object({
  portfolioStats: zReturnsPortfolioStatsSchema,
  dealStats: z.array(zReturnsDealStatsSchema),
  consolidatedSchedule: z.array(zReturnsDateObjectSchema),
});
export type PortfolioReturnsResponse = z.infer<typeof zPortfolioReturnsSchema>;

export const zProjectReturnsStatsSchema = z.object({
  interestRateOrIrrPerc: z.number(),
  investmentMultiple: z.number(),
  totalGrossReturn: z.number(),
  totalNetReturn: z.number(),
});
export type ProjectReturnsStats = z.infer<typeof zProjectReturnsStatsSchema>;

// used for dealflow amount graph
export const zProjectReturnsSchema = z.object({
  stats: zProjectReturnsStatsSchema,
  schedule: z.array(zReturnsDateObjectSchema),
});
export type ProjectReturnsResponse = z.infer<typeof zProjectReturnsSchema>;

export const zProjectMilestoneTypeSchema = z.object({
  date: z.date(),
  aUnitReturns: z.number(),
  cUnitReturns: z.number(),
});
export type ProjectMilestoneType = z.infer<typeof zProjectMilestoneTypeSchema>;

export const zProjectMilestoneTypeArraySchema = z.array(
  zPortfolioReturnsSchema
);
export type ProjectMilestoneTypeArray = z.infer<
  typeof zProjectMilestoneTypeArraySchema
>;
