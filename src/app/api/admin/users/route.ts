import { getAdminFromRequest } from "@/libs/admin/utils";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { isError } from "lodash";
import type { NextRequest } from "next/server";

// test route to get user if correct jwt is provided
export async function GET(request: NextRequest) {
    const adminUser = await getAdminFromRequest(request);
    if(isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
    }
    return jsonResponse(adminUser);
}
