import { DealOwnershipType, Organization } from "@prisma/client";
import { APIRequestContext } from '@playwright/test';
import prisma from "@/libs/prisma";

export async function resetOrgInDb(request: APIRequestContext): Promise<Organization> {
    console.log("begin resetting org in db");
    const testUser = await prisma.user.findFirst({ where: { email: `${process.env.E2E_CLERK_USER_USERNAME}` } });
    const response = await request.put(`/api/organizations/${testUser?.userOrgId}`, {
        data: {
            name: "Testi Tester's Organization",
            ownershipType: DealOwnershipType.INDIVIDUAL,
        }
    });
    return await JSON.parse(await response.text());
}