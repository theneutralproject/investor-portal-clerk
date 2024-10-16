import { DealOwnershipType, MembershipType } from "@prisma/client";
import { z } from "zod";
import { zUserCreateSchema } from "../user/schema";

export const zOrganizationUpdateSchema = z.object({
    id: z.number().int(),
    name: z.string().max(120, "120 characters max").optional(),
    tin: z.string().max(200).optional(),
    dateOfCreation: z.coerce.date().optional(),
    juristication: z.string().max(120, "120 characters max").optional(),
    addressId: z.number().int().optional(),
    ownershipType: z.nativeEnum(DealOwnershipType).optional(),
});
export type OrganizationUpdateSchema = z.infer<typeof zOrganizationUpdateSchema>;

export const zOrganizationCreateSchema = z.object({
    name: z.string().max(120, "120 characters max"),
    tin: z.string().max(200).nullish(),
    dateOfCreation: z.coerce.date().nullish(),
    juristication: z.string().max(120, "120 characters max").nullish(),
    addressId: z.number().int().nullish(),
    ownershipType: z.nativeEnum(DealOwnershipType).nullish(),
});

export type OrganizationCreateSchema = z.infer<typeof zOrganizationCreateSchema>;

export const zOrganizationMemberCreateSchema = z.object({
    organizationId: z.number().int(),
    dealId: z.number().int(),
    user: zUserCreateSchema,
    type: z.nativeEnum(MembershipType),
});
export type OrganizationMemberCreateSchema = z.infer<typeof zOrganizationMemberCreateSchema>;