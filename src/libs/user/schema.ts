import { z } from "zod";

// we are excluding the email and phoneNumber, since these were previosuly verified by the user
// TODO: use clerk API to update and verify these 
export const zUserUpdateSchema = z.object({
    // email: z.string().email().optional(),
    // phoneNumber: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    ssn: z.string().optional(),
    referralsource: z.string().optional(),
  });
  
  export type UserUpdateSchema = z.infer<typeof zUserUpdateSchema>;
  
  export type ClerkUserUpdateSchema = {
    firstName?: string,
    lastName?: string,
  };