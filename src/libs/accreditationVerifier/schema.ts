
import { z } from "zod";

export const zAccreditationVerifierCreateSchema = z.object({
    dealId: z.number().int(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string().nullish(),
    title: z.string().nullish(),
});

export type AccreditationVerifierCreateSchema = z.infer<typeof zAccreditationVerifierCreateSchema>;
