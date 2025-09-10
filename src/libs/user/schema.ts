import { z } from 'zod';
import { ReferralSource } from '../hubspot/utils.client';
import { zAddressCreateSchema } from '../address/schema';

// we are excluding the email and phoneNumber, since these were previously verified by the user
// TODO: use clerk API to update and verify phone and email
export const zUserUpdateSchema = z.object({
  id: z.number().int().optional(), // if provided, an admin can update any user
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  ssn: z.string().max(200).optional().nullish(),
  referralSource: z.nativeEnum(ReferralSource).optional().nullish(),
  rampVendorId: z.string().optional().nullish(),
  address: zAddressCreateSchema.optional(),
  dateOfBirth: z.coerce.date().nullish(),
  notifyUserOnCreate: z.boolean().nullish(), // used to determine if the user should be notified when created from the admin portal
});

export type UserUpdateSchema = z.infer<typeof zUserUpdateSchema>;

export type ClerkUserUpdateSchema = {
  firstName?: string;
  lastName?: string;
};

export const zUserCreateSchema = z.object({
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  clerkId: z.string().max(60).optional(),
  hubspotId: z.string().nullish(),
  ssn: z.string().max(200).optional(),
  referralSource: z.nativeEnum(ReferralSource).optional(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: zAddressCreateSchema.optional(),
  dateOfBirth: z.coerce.date().nullish(),
  projectSlug: z.string().optional(), // used to invite user to review project documents when invited from the admin portal
  notifyUserOnCreate: z.boolean().optional(), // used to determine if the user should be notified when created from the admin portal
});

export type UserCreateSchema = z.infer<typeof zUserCreateSchema>;
