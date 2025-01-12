import { getAdminFromRequest } from "@/libs/admin/utils";
import prisma from "@/libs/prisma.server";
import { type UserUpdateSchema, zUserUpdateSchema } from "@/libs/user/schema";
import { updateUserInDbAndHubspotAndClerk } from "@/libs/user/utils";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { isError } from "lodash";
import type { NextRequest } from "next/server";

// test route to get user if correct jwt is provided
export async function GET(request: NextRequest) {
    const adminUser = await getAdminFromRequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
    }

    try {
        const allUsers = await prisma.user.findMany(
            {
                include: {
                    organizationsOwned: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                            tin: true,
                            isPrimary: true,
                            ownershipType: true,
                        }
                    },
                    address: true,
                }
            }
        );
        return jsonResponse(allUsers);
    } catch (error) {
        console.error('unable to fetch users:', getErrorMessage(error));
        return jsonResponse({ error: getErrorMessage(error) }, 500);
    }
}

export async function PUT(request: NextRequest) {
    const adminUser = await getAdminFromRequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
    }

    let putData: UserUpdateSchema;
    try {
        const requestBody = (await request.json()) as UserUpdateSchema;
        putData = zUserUpdateSchema.parse(requestBody)
    } catch (parseError) {
        console.error("ERROR: unable to parse users PUT body:\n", getErrorMessage(parseError));
        return jsonResponse({ error: getErrorMessage(parseError) }, 400);
    }

    try {
        const updatedUser = await updateUserInDbAndHubspotAndClerk(putData);
        return jsonResponse(updatedUser);
    } catch (error) {
        console.error('unable to update user:', getErrorMessage(error));
        return jsonResponse({ error: getErrorMessage(error) }, 500);
    }
}
