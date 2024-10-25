import { z } from "zod";

export const zReturnsDateObjectSchema = z.object({
    date: z.date(),
    distributionAmount: z.number(),
    multiple: z.number(),
    cumulativeDistribution: z.number(),
    cumulativeMultiple: z.number(),
    totalGrossReturn: z.number(),
    totalNetReturn: z.number(),
});
export type ReturnsDateObjectSchema = z.infer<typeof zReturnsDateObjectSchema>;
