import { decryptData, encryptString } from "@/libs/encryption/utils";
import { type OrganizationCreateSchema, type OrganizationUpdateSchema, zOrganizationCreateSchema, zOrganizationUpdateSchema } from "@/libs/organization/schema";
import prisma from "@/libs/prisma";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import { DealOwnershipType, MembershipType } from "@prisma/client";
import type { NextRequest } from "next/server";

/**
 * @param request GET all organizations that a user is a member of
 */
export async function GET() {

    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: {
            address: true,
            organizationMember: true
        }
    });


    if (!dbUser) {
        console.error(`User record with clerkid ${clerkUser.id} not found in prisma (GET)`);
        return jsonResponse(
            {
                error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
            },
            404
        );
    }

    // get orgs they are a member of
    const userOrganizations = await prisma.organization.findMany({ where: { members: { some: { id: dbUser.id } }} });

    // encypt TIN on orgs
    return jsonResponse(userOrganizations.map((org) => {
        // eslint-disable-next-line prefer-const
        let { tin, ...rest } = org;
        if (tin) tin = `***-**-${decryptData(tin).slice(-4)}`;
        return { ...rest, ...{ tin } };
    }));
}

/**
 * Create a new organization without specifying members
 * @param request POST create a new organization
 */
export async function POST(request: NextRequest) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: { address: true }
    });

    if (!dbUser) {
        console.error(`User record with clerkid ${clerkUser.id} not found in prisma (GET)`);
        return jsonResponse(
            {
                error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
            },
            404
        );
    }

    const requestBody = (await request.json()) as OrganizationCreateSchema;
    let postData: OrganizationCreateSchema;
    try {
        postData = zOrganizationCreateSchema.parse(requestBody)
    } catch (parseError) {
        console.error("ERROR: unable to parse POST body:\n", parseError);
        return jsonResponse({ error: "Input data malformatted" }, 400);
    }

    const getOrgName = () => {
        if (postData.name) {
            return postData.name;
        }
        switch (postData.ownershipType) {
            case DealOwnershipType.CORPORATION: {
                return `Corporation of ${dbUser.firstName} ${dbUser.lastName}`;
            }
            case DealOwnershipType.PARTNERSHIP: {
                return `${dbUser.firstName} ${dbUser.lastName}'s Parnership Organization`; 
            }
            case DealOwnershipType.MARITAL: {
                return `${dbUser.firstName} ${dbUser.lastName}'s Marital Organization`;
            }
            case DealOwnershipType.COMMON: {
                return `${dbUser.firstName} ${dbUser.lastName}'s Common Organization`;
            }
            case DealOwnershipType.TRUST: {
                return `${dbUser.firstName} ${dbUser.lastName}'s Trust Organization`;
            }
            default: return `${dbUser.firstName} ${dbUser.lastName}'s Organization`
        }
    }

    const orgCreateData = {
        name: getOrgName(),
        ownershipType: postData.ownershipType ?? DealOwnershipType.INDIVIDUAL,
        ownerId: dbUser.id,
        addressId: postData.addressId,
        tin: postData.tin ? encryptString(postData.tin.replace(/\D/g, "")) : null,
        dateOfCreation: postData.dateOfCreation,
        juristication: postData.juristication,
        members: {
            create: {
                type: MembershipType.OWNER,
                userId: dbUser.id
            }
        }
    };
    try {
        const newOrg = prisma.organization.create({
            data: orgCreateData
        });
        return jsonResponse(newOrg);
    } catch (dbError) {
        console.error("ERROR: unable to update org:\n", dbError);
        return jsonResponse({ error: dbError }, 400);
    }
};

/**
 * Update an existing org  - EXCLUSIVE of their members! User api/organization/members for that
 * @param request with body:OrganizationUpdateSchema
 * @returns updated organization
 **/
export async function PUT(request: NextRequest) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }

    const requestBody = (await request.json()) as OrganizationUpdateSchema;
    let putData: OrganizationUpdateSchema;
    try {
        putData = zOrganizationUpdateSchema.parse(requestBody)
    } catch (parseError) {
        console.error("ERROR: unable to parse PUT body:\n", parseError);
        return jsonResponse({ error: "Input data malformatted" }, 400);
    }
    const { id, ...data } = putData;
    if (data.tin) {
        data.tin = encryptString(data.tin.replace(/\D/g, ""));
    }

    try {
        const updatedOrg = await prisma.organization.update({
            where: { id },
            data,
            include: {
                address: true,
                members: true
            }
        })
        return jsonResponse(updatedOrg);
    } catch (dbError) {
        console.error("ERROR: unable to update org:\n", dbError);
        return jsonResponse({ error: 'unable to update the organization' }, 400);
    }
};