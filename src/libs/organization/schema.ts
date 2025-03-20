import { DealOwnershipType, MembershipType } from '@prisma/client';
import { z } from 'zod';
import { zUserCreateSchema, zUserUpdateSchema } from '../user/schema';
import { zAddressCreateSchema } from '../address/schema';

export const zOrganizationUpdateSchema = z.object({
  id: z.number().int().optional(), // if provided, an admin can update any organization
  name: z.string().max(120, '120 characters max').optional(),
  tin: z.string().max(200).optional(),
  dateOfCreation: z.coerce.date().optional(),
  juristication: z.string().max(120, '120 characters max').optional(),
  ownershipType: z.nativeEnum(DealOwnershipType).optional(),
  address: zAddressCreateSchema.nullish(),
});
export type OrganizationUpdateSchema = z.infer<
  typeof zOrganizationUpdateSchema
>;

export const zOrganizationCreateSchema = z.object({
  name: z.string().max(120, '120 characters max').nullish(),
  tin: z.string().max(200).nullish(),
  dateOfCreation: z.coerce.date().nullish(),
  juristication: z.string().max(120, '120 characters max').nullish(),
  ownershipType: z.nativeEnum(DealOwnershipType).nullish(),
  address: zAddressCreateSchema.nullish(),
  ownerId: z.number().int().nullish(), // used in admin route
});

export type OrganizationCreateSchema = z.infer<
  typeof zOrganizationCreateSchema
>;

export const zOrganizationMemberCreateSchema = z.object({
  // organizationId: z.number().int(),
  dealId: z.number().int().optional(),
  user: zUserCreateSchema,
  type: z.nativeEnum(MembershipType),
  title: z.string().max(120, '120 characters max').optional(),
});
export type OrganizationMemberCreateSchema = z.infer<
  typeof zOrganizationMemberCreateSchema
>;

export const zOrganizationMemberUpdateSchema = z.object({
  dealId: z.number().int().nullish(),
  user: zUserUpdateSchema.partial().nullish(),
  type: z.nativeEnum(MembershipType),
  title: z.string().max(120, '120 characters max').nullish(),
});
export type OrganizationMemberUpdateSchema = z.infer<
  typeof zOrganizationMemberUpdateSchema
>;

export const zAdminOrganizationMemberCreateSchema = z.object({
  organizationId: z.number().int(),
  userId: z.number().int(),
  type: z.nativeEnum(MembershipType),
  title: z.string().max(120, '120 characters max').optional(),
});
export type AdminOrganizationMemberCreateSchema = z.infer<
  typeof zAdminOrganizationMemberCreateSchema
>;

export const zAdminOrganizationMemberDeleteSchema = z.object({
  id: z.number().int(),
});

export type AdminOrganizationMemberDeleteSchema = z.infer<
  typeof zAdminOrganizationMemberDeleteSchema
>;
