import { type Deal, DealOwnershipType } from "@prisma/client";
import { APIRequestContext } from '@playwright/test';
import prisma, { OrganizationWithMembersAndAddress } from "@/libs/prisma";

async function deleteHubspotDeal(dealId: string) {
    return fetch(
      `${process.env.HUBSPOT_API_BASE_URL}/crm/v3/objects/deals/${dealId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        }
      }
    ).then(async (response) => {
      if (response.status >= 300) {
        console.error("ERROR: unable to delete Hubspot deal:\n", response.statusText);
        console.log("response", response);
        return new Error("unable to delete hubspot deal");
      }
      return { success: true };
    }).catch((fetchError) => {
      console.error("ERROR: unable to delete Hubspot deal:\n", fetchError);
      return new Error("unable to delete hubspot deal")
    });
  }

export async function resetOrgInDb(request: APIRequestContext): Promise<OrganizationWithMembersAndAddress> {
    // console.log("begin resetting org in db");
    const testUser = await prisma.user.findFirst({ where: { email: `${process.env.E2E_CLERK_USER_USERNAME}` } });
    if (!testUser) { throw new Error("test user not found in db"); }
    const response = await request.put(`/api/organizations/${testUser?.userOrgId}`, {
        data: {
            name: "Testi Tester's Organization",
            ownershipType: DealOwnershipType.INDIVIDUAL,
            members: { update: [{ id: testUser.id, type: DealOwnershipType.INDIVIDUAL }] }
        }
    });
    const body: OrganizationWithMembersAndAddress = await JSON.parse(await response.text());
    console.log(`finished resetting org with id ${body.id}`, response.status());
    return body;
}

export async function deleteDealInDbAndHubspot(deal: Deal){
    // console.log("begin deleting deal in db and hubspot");
    await prisma.deal.delete({ where: { id: deal.id } });
    await deleteHubspotDeal(deal.hubspotId);
    console.log("finished deleting deal in db and hubspot");
    return;
}