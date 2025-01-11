import { getAdminFromRequest } from "@/libs/admin/utils";
import prisma from "@/libs/prisma.server";
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
                    organizationsOwned: true,
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
