import { decryptData, encryptString } from "@/libs/encryption/utils";
import { OrganizationCreateSchema, OrganizationUpdateSchema, zOrganizationCreateSchema, zOrganizationUpdateSchema } from "@/libs/organization/schema";
import prisma from "@/libs/prisma";
import { jsonResponse } from "@/libs/utils";
import { currentUser, User } from "@clerk/nextjs/server";
import { DealOwnershipType } from "@prisma/client";
import { NextRequest } from "next/server";

/**
 * @param request GET all organizations for a user
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
            organization: true
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

    // TODO: encypt TIN on orgs
    const { organization } = dbUser;

    return organization.map((org) => {
        let { tin, ...rest } = org;
        if (tin) tin = `***-**-${decryptData(tin).slice(-4)}`;
        return { ...rest, ...{ tin } }
    });
}

/**
 * This route assumes that all specified members exist in the DB
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const requestBody = await request.json();
    let postData: OrganizationCreateSchema;
    try {
        postData = zOrganizationCreateSchema.parse(requestBody)
    } catch (parseError) {
        console.error("ERROR: unable to parse POST body:\n", parseError);
        return jsonResponse({ error: "Input data malformatted" }, 400);
    }
    if (!postData.memberIds) postData.memberIds = [dbUser.id]
    if (!postData.memberIds.includes(dbUser.id)) {
        console.error(`The id of the requesting user must be present in the list of memberIds`);
        return jsonResponse(
            {
                error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
            },
            404
        );
    }

    const orgCreateData = {
        name: postData.name ?? `hello`,
        ownershipType: postData.ownershipType ?? DealOwnershipType.INDIVIDUAL,
        ownerId: dbUser.id,
        addressId: postData.addressId,
        tin: postData.tin ? encryptString(postData.tin.replace(/\D/g, "")) : null,
        dateOfCreation: postData.dateOfCreation,
        juristication: postData.juristication,
        members: {
            connect: postData.memberIds.map((mid) => { return { id: mid } })
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const requestBody = await request.json();
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

    // if (memberIds) {
    //     // !this will replace all existing members
    //     const dbUser = await prisma.user.findUnique({
    //         where: { clerkId: clerkUser.id },
    //         include: { address: true }
    //     });

    //     if (!dbUser) {
    //         console.error(`User record with clerkid ${clerkUser.id} not found in prisma (GET)`);
    //         return jsonResponse(
    //             {
    //                 error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
    //             },
    //             404
    //         );
    //     }
    //     if (!memberIds.includes(dbUser.id)) {
    //         console.error(`The id of the requesting user must be present in the list of memberIds`);
    //         return jsonResponse(
    //             {
    //                 error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
    //             },
    //             404
    //         );
    //     }

    //     updateData = {
    //         ...updateData, ...{
    //             members: {
    //                 connect: memberIds.map((mid) => { return { id: mid } })
    //             }
    //         }
    //     }
    // }

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