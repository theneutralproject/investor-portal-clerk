import { z } from "zod";

export const zReturnsDateObjectSchema = z.object({
    date: z.date(),
    distributionAmount: z.number(), // typically used for debt deals
    cumulativeDistribution: z.number(), // sum of all distributionAmounts
    accruedPreferredReturn : z.number(), // only used for equity deals // should dip once there are distributions
    preferredReturnCurrent: z.number(), // indicate return for current month
    portfolioValueToDate: z.number(),
});
export type ReturnsDateObject = z.infer<typeof zReturnsDateObjectSchema>;

export const zReturnsPortfolioStatsSchema = z.object({
    portfolioValueToDate: z.number(), // sum of accruedInterestToDate and distributionsToDate and principalInvested
    distributionsToDate: z.number(), // payments made to the investor to date
    accruedInterestToDate: z.number(), // only used for equity deals
    projectedAccruedReturn: z.number(), // only used for equity deals
    projectedDistributions: z.number(), // sum of existing and future distributions
    projectedPortfolioValue: z.number(), // sum of portfolioValueToDate and projectedDistributions
    principalInvested: z.number(), // sum of all committed amounts
});
export type ReturnsPortfolioStats = z.infer<typeof zReturnsPortfolioStatsSchema>;

export const zReturnsDealStatsSchema = z.object({
    dealId: z.number(),
    committedAmount: z.number(),
    distributionsToDate: z.number(),
    accruedInterestToDate: z.number(),
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
