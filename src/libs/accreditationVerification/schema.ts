
import { AccreditationMethod } from "@prisma/client";
import { z } from "zod";

export const zAccreditationVerifierCreateSchema = z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string().nullish(),
    title: z.string().nullish(),
});

export type AccreditationVerifierCreateSchema = z.infer<typeof zAccreditationVerifierCreateSchema>;

export const zAccreditationVerificationCreateSchema = z.object({
    dealId: z.number().int(),
    method: z.nativeEnum(AccreditationMethod),
    verifier: zAccreditationVerifierCreateSchema.nullish(),
    // verifierId: z.number().int().nullish(),
});

export type AccreditationVerificationCreateSchema = z.infer<typeof zAccreditationVerificationCreateSchema>;
