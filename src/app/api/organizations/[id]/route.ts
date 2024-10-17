import { decryptData, encryptString } from "@/libs/encryption/utils";
import { type OrganizationUpdateSchema, zOrganizationUpdateSchema } from "@/libs/organization/schema";
import prisma from "@/libs/prisma";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import { DealOwnershipType } from "@prisma/client";
import { isNumber } from "lodash";
import type { NextRequest } from "next/server";


async function getUserAndOrg(request: NextRequest) {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split("/").pop() ?? "");
    if (!id || !isNumber(id)) {
        throw new Error('id is required in url');
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
        throw new Error("Clerk user not found");
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: {
            address: true,
            organizationMember: true
        }
    });

    if (!user) {
        console.error(`User record with clerkid ${clerkUser.id} not found in prisma (GET)`);
        throw new Error(`User record with clerkid ${clerkUser.id} not found in prisma (GET)`);
    }

    // get org by id if they are a member
    const organization = await prisma.organization.findFirst({
        where:
        {
            AND: [{ members: { some: { userId: user.id } } },
            { id: id }]
        }
    });

    return { user, organization };
}

/**
 * Get an organization by id if the requesting user is a member
 * @param request 
 * @returns Promise <Organization | null>
 */
export async function GET(request: NextRequest) {
    try {
        const { organization } = await getUserAndOrg(request);
        if (organization?.tin) {
            organization.tin = `***-**-${decryptData(organization.tin).slice(-4)}`;
        }

        return jsonResponse(organization);
    } catch (error: unknown) {
        return jsonResponse(getErrorMessage(error), 400);
    }
}


/**
 * Update an existing org  - exclusive of its members
 * @param request with body:OrganizationUpdateSchema
 * @returns updated organization
 **/
export async function PUT(request: NextRequest) {

    try {
        const { user, organization: orgToUpdate } = await getUserAndOrg(request);

        if (!orgToUpdate) {
            throw new Error('You do not have access to this organization');
        }

        const requestBody = (await request.json()) as OrganizationUpdateSchema;
        let putData: OrganizationUpdateSchema;
        try {
            putData = zOrganizationUpdateSchema.parse(requestBody)
        } catch (parseError) {
            console.error("ERROR: unable to parse PUT body:\n", parseError);
            throw new Error(`Input data malformatted: \n${(parseError as Error).message}`);
        }

        if (putData.ownershipType) {
            if (orgToUpdate.isPrimary && putData.ownershipType !== DealOwnershipType.INDIVIDUAL) {
                throw new Error('Cannot update primary organization to non-INDIVIDUAL ownership type');
            }
        }

        if (putData.tin) {
            if (putData.tin.replace(/\D/g, "").length !== 9) {
                return jsonResponse({ error: 'TIN must be 9 digits' }, 400);
            }

            putData.tin = encryptString(putData.tin.replace(/\D/g, ""));
        }

        const updatedOrg = await prisma.organization.update({
            where: {
                ownerId: user.id,
                id: orgToUpdate.id

            }, data: putData
        }).catch((dbError) => {
            console.error("ERROR: unable to update org:\n", dbError);
            throw new Error('unable to update the organization');
        });

        if (updatedOrg.tin) {
            updatedOrg.tin = `***-**-${decryptData(updatedOrg.tin).slice(-4)}`;
        }

        return jsonResponse(updatedOrg);
    } catch (error: unknown) {
        return jsonResponse(getErrorMessage(error), 400);
    }
}

/**
 * Delete an organization (if it has no deals, and if it is not the last INDIVIDUAL one) by its owner
 * @param request with query param: {id: number}
 * @returns 204 if successful
 */
export async function DELETE(request: NextRequest) {
    try {
        const { user, organization: orgToDelete } = await getUserAndOrg(request);

        if (!orgToDelete) {
            throw new Error('You do not have access to this organization');
        }

        // check if org has existing deals
        const orgDeals = await prisma.deal.findMany({ where: { organizationId: orgToDelete.id } });
        if (orgDeals.length > 0) {
            throw new Error('Organization has existing deals and cannot be deleted');
        }

        if (orgToDelete.isPrimary) {
            throw new Error('Cannot delete primary organization');
        }

        if (orgToDelete.ownerId !== user.id) {
            throw new Error('Only the organization owner can delete the organization');
        }

        await prisma.organization.
            delete({ where: { id: orgToDelete.id, ownerId: user.id } }).catch((dbError) => {
                console.error("ERROR: unable to delete org:\n", dbError);
                throw new Error('unable to delete the organization');
            });

        return jsonResponse({ success: true, message: "organization successfully deleted" }, 204);
    } catch (error: unknown) {
        return jsonResponse(getErrorMessage(error), 400);
    }
};
