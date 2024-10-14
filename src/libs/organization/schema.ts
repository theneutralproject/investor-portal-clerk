import { DealOwnershipType, MembershipType } from "@prisma/client";
import { z } from "zod";
import { zUserCreateSchema } from "../user/schema";

export const zOrganizationUpdateSchema = z.object({
    id: z.number().int(),
    name: z.string().length(120, "120 characters max").optional(),
    tin: z.string().length(200).optional(),
    dateOfCreation: z.date().optional(),
    juristication: z.string().length(120, "120 characters max").optional(),
    addressId: z.number().int().optional(),
    ownershipType: z.nativeEnum(DealOwnershipType).optional(),
});
export type OrganizationUpdateSchema = z.infer<typeof zOrganizationUpdateSchema>;

export const zOrganizationCreateSchema = z.object({
    name: z.string().length(120, "120 characters max"),
    tin: z.string().length(200).nullable(),
    dateOfCreation: z.date().nullable(),
    juristication: z.string().length(120, "120 characters max").nullable(),
    addressId: z.number().int().nullable(),
    ownershipType: z.nativeEnum(DealOwnershipType).nullable(),
});

export type OrganizationCreateSchema = z.infer<typeof zOrganizationCreateSchema>;

export const zOrganizationMemberCreateSchema = z.object({
    organizationId: z.number().int(),
    dealId: z.number().int(),
    user: zUserCreateSchema,
    type: z.nativeEnum(MembershipType),
});
export type OrganizationMemberCreateSchema = z.infer<typeof zOrganizationMemberCreateSchema>;