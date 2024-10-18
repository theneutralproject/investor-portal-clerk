import { encryptString } from "@/libs/encryption/utils";
import { updateHubspotContact } from "@/libs/hubspot/utils";
import prisma from "@/libs/prisma";
import { type UserUpdateSchema, zUserUpdateSchema } from "@/libs/user/schema";
import { sanitizeUser } from "@/libs/user/utils";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import { isNumber } from "lodash";
import type { NextRequest } from "next/server";

/**
 * Update information of a ghost user that is a member of the requester's organization
 * @param request 
 * @returns 
 */
export async function PUT(request: NextRequest) {
    let userId: number;
    try {
        const url = new URL(request.url);
        userId = parseInt(url.pathname.split("/").pop() ?? "");
        if (!userId || !isNumber(userId)) {
            throw new Error('userId is required in url');
        }
    } catch (error: unknown) {
        return jsonResponse({ error: `userId is required in url` }, 400);
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }

    const requestingUser = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
    if (!requestingUser) {
        return jsonResponse({ error: "Requesting user not found" }, 404);
    }

    // get the user to update and make sure they are a ghost user
    const userToUpdate = await prisma.user.findUnique({
        where: { id: userId }, include: { organizationMember: { include: { organization: { include: { members: true } } } } }
    });

    if (!userToUpdate) {
        return jsonResponse({ error: "User to update not found" }, 404);
    }

    // get the organization of the requester and make sure the user to update is a member
    if (userToUpdate.clerkId === clerkUser.id) {
        return jsonResponse({ error: "use /api/users PUT route to update your own user data" }, 401);
    }

    if (userToUpdate.clerkId) {
        return jsonResponse({ error: "You cannot update a user that is not a ghost user" }, 401);
    }

    // make sure the requester is the owner of the organization
    if (!userToUpdate.organizationMember.map(member => member.organization).filter(org => org.ownerId === requestingUser.id).length) {
        return jsonResponse({ error: "You are not authorized to update users outside of your organization" }, 401);
    }

    // update the user
    const requestBody = (await request.json()) as UserUpdateSchema;
    let putData: UserUpdateSchema;
    try {
        putData = zUserUpdateSchema.parse(requestBody);
    } catch (parseError) {
        console.error("ERROR: unable to parse PUT body:\n", parseError);
        return jsonResponse({ error: `Input data malformatted: \n${(parseError as Error).message}` }, 400);
    }

    const { address, ...userUpdateData } = putData;
    let hubspotNeedsUpdate = false;
    if (userUpdateData.email && userToUpdate.email !== userUpdateData.email) hubspotNeedsUpdate = true;
    if (userUpdateData.phoneNumber && userToUpdate.phoneNumber !== userUpdateData.phoneNumber) hubspotNeedsUpdate = true;
    if (userUpdateData.firstName && userToUpdate.firstName!== userUpdateData.firstName) hubspotNeedsUpdate = true;
    if (userUpdateData.lastName && userToUpdate.lastName !== userUpdateData.lastName) hubspotNeedsUpdate = true;
    //  Check if hubspot needs to be updated

    if (hubspotNeedsUpdate) {
        const hsUserUpdateProps = [];
        if (userUpdateData.firstName) {
            hsUserUpdateProps.push({ property: 'firstname', value: userUpdateData.firstName });
        }
        if (userUpdateData.lastName) {
            hsUserUpdateProps.push({ property: 'lastname', value: userUpdateData.lastName ?? userToUpdate.lastName });
        }
        if (userUpdateData.email) {
            hsUserUpdateProps.push({ property: 'email', value: userUpdateData.email });
        }
        try {
            await updateHubspotContact({ properties: hsUserUpdateProps, hubspotId: userToUpdate.hubspotId });
        } catch (hsError) {
            console.log(hsError)
        }
    }

    if (userUpdateData.ssn && !userUpdateData.ssn.startsWith("***-**-")) {
        // sanitize it (digits only) and encrypt SSN before storing it:
        const presanitizedSSN = userUpdateData.ssn.replace(/\D/g, "");
        if (presanitizedSSN.length !== 9) {
            return jsonResponse({ error: 'SSN must be 9 digits' }, 400);
        }
        userUpdateData.ssn = encryptString(userUpdateData.ssn.replace(/\D/g, ""));
    }

    if (address) {
        // upsert address
        await prisma.address.upsert({
            where: { userId: userToUpdate.id },
            create: { ...address, userId: userToUpdate.id },
            update: { ...address, userId: userToUpdate.id }
        }).catch((dbError) => {
            console.error("ERROR: unable to upsert address:\n", dbError);
            return jsonResponse({ error: `unable to upsert address:\n${getErrorMessage(dbError)}` }, 400);
        });

        try {
            const updatedUser = await prisma.user.update({
                where: { id: userToUpdate.id },
                data: userUpdateData,
                include: { address: true }
            });
            return jsonResponse(sanitizeUser(updatedUser));
        } catch (dbError) {
            console.error("ERROR: unable to update user:\n", dbError);
            return jsonResponse({ error: 'unable to update user1' }, 400);
        }
    } else {
        // no address to update, just update user data
        try {
            const updatedUser = await prisma.user.update({
                where: { id: userToUpdate.id },
                data: userUpdateData,
                include: { address: true }
            });

            return jsonResponse(sanitizeUser(updatedUser));
        } catch (dbError) {
            console.error("ERROR: unable to update user:\n", dbError);
            return jsonResponse({ error: 'unable to update user2' }, 400);
        }
    }
}
