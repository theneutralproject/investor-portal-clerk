import { z } from "zod";

export const zReturnsDateObjectSchema = z.object({
    date: z.date(),
    distributionAmount: z.number(),
    multiple: z.number(),
    cumulativeDistribution: z.number(),
    investmentMultiple: z.number(),
    totalGrossReturn: z.number(),
    totalNetReturn: z.number(),
    interestRateOrIrrPerc: z.number(),
    accruedPreferredReturn : z.number().optional(),
});
export type ReturnsDateObject = z.infer<typeof zReturnsDateObjectSchema>;
