import { z } from "zod";

export const zReturnsDateObjectSchema = z.object({
    date: z.date(),
    distributionAmount: z.number(),
    multiple: z.number()
});
export type ReturnsDateObjectSchema = z.infer<typeof zReturnsDateObjectSchema>;

export const zReturnsResponseSchema = z.object({
    schedule: z.array(zReturnsDateObjectSchema),
    totalGrossReturn: z.number().optional(),
    totalNetReturn: z.number().optional(),
});
export type ReturnsResponseSchema = z.infer<typeof zReturnsResponseSchema>;