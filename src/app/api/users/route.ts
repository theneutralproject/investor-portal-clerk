'use server';
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import prisma from "@/libs/prisma.server";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { type ClerkUserUpdateSchema, type UserUpdateSchema, zUserUpdateSchema } from "@/libs/user/schema";
import { updateHubspotContact } from "@/libs/hubspot/utils";
import { sanitizeUser } from "@/libs/user/utils";

/**
 * @param request 
 * @returns the full user data for the currently logged in user
 */
export async function GET() {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }
    const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: { address: true }
    });

    if (!user) {
        console.error(`User record with clerkid ${clerkUser.id} not found in prisma (GET)`);
        return jsonResponse(
            {
                error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
            },
            404
        );
    }

    return jsonResponse(sanitizeUser(user));
}

/**
 * Update own user information
 * This function handles create and update of user address and user information
 * @param request with body:UserUpdateSchema
 * @returns updated user as Promise<UserWithAddress>
 */
export async function PUT(request: NextRequest) {
    // user can only update their own information
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }
    const requestingUser = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
    if (!requestingUser) {
        return jsonResponse({ error: "Requesting user not found" }, 404);
    }

    const requestBody = (await request.json()) as UserUpdateSchema;
    let putData: UserUpdateSchema;
    try {
        putData = zUserUpdateSchema.parse(requestBody)
    } catch (parseError) {
        console.error("ERROR: unable to parse PUT body:\n", parseError);
        return jsonResponse({ error: `Input data malformatted: \n${(parseError as Error).message}` }, 400);
    }

    const { address, ...userData } = putData;
    //  Check if hubspot and clerk needs to be updated, and then update them
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (userData.firstName || userData.lastName) {
        const properties = [];
        const clerkUpdate: ClerkUserUpdateSchema = {};
        if (userData.firstName) {
            properties.push({ property: 'firstname', value: userData.firstName });
            clerkUpdate.firstName = userData.firstName;
        }
        if (userData.lastName) {
            properties.push({ property: 'lastname', value: userData.lastName });
            clerkUpdate.lastName = userData.lastName;
        }
        try {
            await updateHubspotContact({ hubspotId: requestingUser.hubspotId, properties });
        } catch (hsError) {
            console.log(hsError)
        }
        try {
            await clerkClient.users.updateUser(clerkUser.id, clerkUpdate)
        } catch (clerkError) {
            console.log(clerkError)
        }
    }

    if (userData.ssn) {
        if (userData.ssn.startsWith("***-**-")) {
            delete userData.ssn;
        }
        else {
            // sanitize it (digits only) and encrypt SSN before storing it:
            const presanitizedSSN = userData.ssn.replace(/\D/g, "");
            if (presanitizedSSN.length !== 9) {
                return jsonResponse({ error: 'SSN must be 9 digits' }, 400);
            }
            userData.ssn = presanitizedSSN;
        }
    }

    if (address) {
        const existingUser = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
        if (!existingUser) {
            return jsonResponse({ error: 'User not found' }, 404);
        }

        // upsert address
        await prisma.address.upsert({
            where: { userId: existingUser.id },
            create: { ...address, userId: existingUser.id },
            update: { ...address, userId: existingUser.id }
        }).catch((dbError) => {
            console.error("ERROR: unable to upsert address:\n", dbError);
            return jsonResponse({ error: `unable to upsert address:\n${getErrorMessage(dbError)}` }, 400);
        });

        try {
            const updatedUser = await prisma.user.update({
                where: { clerkId: clerkUser.id },
                data: userData,
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
                where: { clerkId: clerkUser.id },
                data: userData,
                include: { address: true }
            });

            return jsonResponse(sanitizeUser(updatedUser));
        } catch (dbError) {
            console.error("ERROR: unable to update user:\n", dbError);
            return jsonResponse({ error: 'unable to update user2' }, 400);
        }
    }
}
