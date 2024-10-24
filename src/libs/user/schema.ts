import { z } from "zod";
import { ReferralSource } from "../hubspot/utils";
import { zAddressCreateSchema } from "../address/schema";

// we are excluding the email and phoneNumber, since these were previously verified by the user
// TODO: use clerk API to update and verify phone and email
export const zUserUpdateSchema = z.object({
    id: z.number().int(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    firstName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional(),
    ssn: z.string().max(200).optional().nullish(),
    referralsource: z.nativeEnum(ReferralSource).optional().nullish(),
    address: zAddressCreateSchema.optional().nullish(),
    dateOfBirth: z.string().optional().nullish()
  });
  
  export type UserUpdateSchema = z.infer<typeof zUserUpdateSchema>;
  
  export type ClerkUserUpdateSchema = {
    firstName?: string,
    lastName?: string,
  };

export const zUserCreateSchema = z.object({
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  clerkId: z.string().max(60).optional(),
  ssn: z.string().max(200).optional(),
  referralsource: z.nativeEnum(ReferralSource).optional(),    
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: zAddressCreateSchema.optional()
});

export type UserCreateSchema = z.infer<typeof zUserCreateSchema>;