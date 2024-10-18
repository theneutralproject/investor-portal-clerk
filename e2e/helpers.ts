import { DealOwnershipType } from "@prisma/client";
import { APIRequestContext } from '@playwright/test';
import prisma, { OrganizationWithMembersAndAddress } from "@/libs/prisma";

export async function resetOrgInDb(request: APIRequestContext): Promise<OrganizationWithMembersAndAddress> {
    console.log("begin resetting org in db");
    const testUser = await prisma.user.findFirst({ where: { email: `${process.env.E2E_CLERK_USER_USERNAME}` } });
    if(!testUser) { throw new Error("test user not found in db"); }
    const response = await request.put(`/api/organizations/${testUser?.userOrgId}`, {
        data: {
            name: "Testi Tester's Organization",
            ownershipType: DealOwnershipType.INDIVIDUAL,
        }
    });
    const body: OrganizationWithMembersAndAddress = await JSON.parse(await response.text());
    console.log(`finished resetting org with id ${body.id}`, response.status());
    return body;
}