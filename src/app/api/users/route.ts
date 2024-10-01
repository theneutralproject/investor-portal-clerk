import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import prisma from "@/libs/prisma";
import { jsonResponse } from "@/libs/utils";
import { ClerkUserUpdateSchema, UserUpdateSchema, zUserUpdateSchema } from "@/libs/user/schema";
import { updateHubspotContact } from "@/libs/hubspot/utils";

/**
 * @param request 
 * @returns the full user data for the currently logged in user
 */
export async function GET(request: NextRequest) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: { address: true }
    });
    if (!dbUser) {
        console.error("Neutral user not found in api/deals");
        return jsonResponse(
            {
                error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
            },
            404
        );
    }

    return jsonResponse(dbUser)
}

export async function PUT(request: NextRequest) {
    // user can only update their own information
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const requestBody = await request.json();
    let userData: UserUpdateSchema;
    try {
        userData = zUserUpdateSchema.parse(requestBody)
    } catch (parseError) {
        console.error("ERROR: unable to parse PUT body:\n", parseError);
        return jsonResponse({ error: "Input data malformatted" }, 400);
    }

    //  Check if hubspot and clerk needs to be updated, and then update them
    if (userData.firstName || userData.lastName) {
        const { emailAddresses, primaryEmailAddressId } = clerkUser
        const email = emailAddresses.find(({ id }) => id === primaryEmailAddressId)
            ?.emailAddress ?? "";
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

    try {
        const updatedUser = await prisma.user.update({
            where: { clerkId: clerkUser.id },
            data: userData,
        });
        return jsonResponse(updatedUser);
    } catch (dbError) {
        console.error("ERROR: unable to update user:\n", dbError);
        return jsonResponse({ error: dbError }, 400);
    }
}