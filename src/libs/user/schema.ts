import { z } from "zod";
import { ReferralSource } from "../hubspot/utils";
import { zAddressCreateSchema } from "../address/schema";

// we are excluding the email and phoneNumber, since these were previously verified by the user
// TODO: use clerk API to update and verify phone and email 
export const zUserUpdateSchema = z.object({
    // email: z.string().email().optional(),
    // phoneNumber: z.string().optional(),
    firstName: z.string().length(50).optional(),
    lastName: z.string().length(50).optional(),
    ssn: z.string().length(200).optional(),
    referralsource: z.nativeEnum(ReferralSource).optional(),
  });
  
  export type UserUpdateSchema = z.infer<typeof zUserUpdateSchema>;
  
  export type ClerkUserUpdateSchema = {
    firstName?: string,
    lastName?: string,
  };

export const zUserCreateSchema = z.object({
  firstName: z.string().length(50),
  lastName: z.string().length(50),
  clerkId: z.string().length(60).optional(),
  ssn: z.string().length(200).optional(),
  referralsource: z.nativeEnum(ReferralSource).optional(),    
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: zAddressCreateSchema.optional()
});

export type UserCreateSchema = z.infer<typeof zUserCreateSchema>;