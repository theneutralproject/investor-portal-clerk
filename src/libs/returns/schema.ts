import { z } from "zod";

export const zReturnsDateObjectSchema = z.object({
    date: z.date(),
    distributionAmount: z.number(), // typically used for debt deals
    distributionMultiple: z.number(), //
    cumulativeDistribution: z.number(), // sum of all distributionAmounts
    cumulativeDistributionMultiple: z.number(), // sum of all distributionMultiples
    investmentMultiple: z.number(), // used for all deal types to indicate the multiple of the investment
    totalGrossReturn: z.number(),
    totalNetReturn: z.number(),
    interestRateOrIrrPerc: z.number(),  // only the IRR value of the last date object should be used
    accruedPreferredReturn : z.number(), // only used for equity deals
    preferredReturnCurrent: z.number(), // indicate return for current month
    dealId: z.number().nullish(),
});
export type ReturnsDateObject = z.infer<typeof zReturnsDateObjectSchema>;

export const zReturnsPortfolioStatsSchema = z.object({
    portfolioValueToDate: z.number(), // sum of accruedInterestToDate and distributionsToDate and principalInvested
    distributionsToDate: z.number(), // payments made to the investor to date
    accruedInterestToDate: z.number(), // only used for equity deals
    projectedAccruedInterest: z.number(), // only used for equity deals
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

export const zReturnsPortfolioSchema = z.object({
    portfolioStats: zReturnsPortfolioStatsSchema,
    dealStats: z.array(zReturnsDealStatsSchema),
    consolidatedSchedule: z.array(zReturnsDateObjectSchema),
});

export type ReturnsPortfolioResponse = z.infer<typeof zReturnsPortfolioSchema>;
