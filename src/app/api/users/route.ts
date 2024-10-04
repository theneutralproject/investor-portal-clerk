import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import prisma from "@/libs/prisma";
import { jsonResponse } from "@/libs/utils";
import { type ClerkUserUpdateSchema, type UserUpdateSchema, zUserUpdateSchema } from "@/libs/user/schema";
import { updateHubspotContact } from "@/libs/hubspot/utils";
import { decryptData, encryptString } from "@/libs/encryption/utils";

/**
 * @param request 
 * @returns the full user data for the currently logged in user
 */
export async function GET() {
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

    if (dbUser.ssn) {
        dbUser.ssn = `***-**-${decryptData(dbUser.ssn).slice(-4)}`;
    }
    
    return jsonResponse(dbUser)
}

/**
 * This function handles encryption of the Social Security Number (SSN) on user object
 * @param request with body:UserUpdateSchema
 * @returns updated user
 */
export async function PUT(request: NextRequest) {
    // user can only update their own information
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const requestBody = await request.json();
    let putData: UserUpdateSchema;
    try {
        putData = zUserUpdateSchema.parse(requestBody)
    } catch (parseError) {
        console.error("ERROR: unable to parse PUT body:\n", parseError);
        return jsonResponse({ error: "Input data malformatted" }, 400);
    }

    //  Check if hubspot and clerk needs to be updated, and then update them
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (putData.firstName || putData.lastName) {
        const { emailAddresses, primaryEmailAddressId } = clerkUser
        const email = emailAddresses.find(({ id }) => id === primaryEmailAddressId)
            ?.emailAddress ?? "";
        const properties = [];
        const clerkUpdate: ClerkUserUpdateSchema = {};
        if (putData.firstName) {
            properties.push({ property: 'firstname', value: putData.firstName });
            clerkUpdate.firstName = putData.firstName;
        }
        if (putData.lastName) {
            properties.push({ property: 'lastname', value: putData.lastName });
            clerkUpdate.lastName = putData.lastName;
        }
        try {
            await updateHubspotContact({ email, properties });
        } catch (hsError) {
            console.log(hsError)
        }
        try {
            await clerkClient.users.updateUser(clerkUser.id, clerkUpdate)
        } catch (clerkError) {
            console.log(clerkError)
        }
    }

    if (putData.ssn) {
        // sanitize it (digits only) and encrypt SSN before storing it:
        putData.ssn = encryptString(putData.ssn.replace(/\D/g, ""));
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { clerkId: clerkUser.id },
            data: putData,
        });
        return jsonResponse(updatedUser);
    } catch (dbError) {
        console.error("ERROR: unable to update user:\n", dbError);
        return jsonResponse({ error: 'unable to update user' }, 400);
    }
}