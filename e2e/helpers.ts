import { type Deal, DealOwnershipType } from '@prisma/client';
import { type APIRequestContext } from '@playwright/test';
import prisma from '@/libs/prisma.server';
import { type OrganizationWithMembersAndAddress } from '@/libs/types';
import { getErrorMessage } from '@/libs/utils';

async function deleteHubspotDeal(hubspotId: string) {
  console.log('begin deleting hubspot deal', hubspotId);
  return fetch(
    `${process.env.HUBSPOT_API_BASE_URL}/crm/v3/objects/deals/${hubspotId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
    }
  )
    .then(async response => {
      if (response.status >= 300) {
        console.error(
          'ERROR: unable to delete Hubspot deal:\n',
          response.statusText
        );
        console.log('response', response);
        return { success: false };
      }
      return { success: true };
    })
    .catch(fetchError => {
      console.error('ERROR: unable to delete Hubspot deal:\n', fetchError);
      return { success: false };
    });
}

export async function getHusbpotContactFromEmail(email: string) {
  console.log('begin to fetch contact', email);
  try {
    const data = await fetch(
      `${process.env.HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts/${email}?idProperty=email`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        },
      }
    );
    return await data.json();
  } catch (error) {
    console.log('failed to fetch hubspot contact, error: ', getErrorMessage(error));
  }
}

export async function getDealsFromContactId(contactId: string) {
  console.log('begin to fetch deals', contactId);
  try {
    const data = await fetch(
      `${process.env.HUBSPOT_API_BASE_URL}/crm/v4/objects/contact/${contactId}/associations/deals`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        },
      }
    );
    const { results } = await data.json();
    console.log(results);
    return results.map((deal: { toObjectId: string; }) => ({ id: deal.toObjectId }));
  } catch (error) {
    console.log('failed to fetch hubspot deals, error: ', getErrorMessage(error));
  }
}

export async function deleteDealsFromTestContact() {
  console.log('begin to delete deals');
  try {
    const contact = await getHusbpotContactFromEmail('testi+clerk_test@neutral.us');
    const deals = await getDealsFromContactId(contact.id);
    for (let index = 0; index < deals.length; index++) {
      const deal = deals[index];
      await deleteHubspotDeal(deal.id);
    }
    console.log('all deals have been deleted');
  } catch (error) {
    console.log('failed to delete hubspot deals, error: ', getErrorMessage(error));
  }
}

export async function resetOrgInDb(
  request: APIRequestContext
): Promise<OrganizationWithMembersAndAddress> {
  // delete all but the test user's individual org
  // console.log("begin resetting org in db");
  const testUser = await prisma.user.findFirst({
    where: { email: `${process.env.E2E_CLERK_USER_USERNAME}` },
  });
  if (!testUser?.userOrgId) {
    throw new Error('test user not found in db');
  }

  const allOrgs = await prisma.organization.findMany({
    where: { ownerId: testUser.id },
  });
  for (const org of allOrgs) {
    if (org.id === testUser.userOrgId) {
      continue;
    }
    await request.delete(`/api/organizations/${org.id}`);
  }

  const response = await request.put(
    `/api/organizations/${testUser?.userOrgId}`,
    {
      data: {
        name: "Testi Tester's Organization",
        ownershipType: DealOwnershipType.INDIVIDUAL,
        members: {
          update: [{ id: testUser.id, type: DealOwnershipType.INDIVIDUAL }],
        },
      },
    }
  );
  const body: OrganizationWithMembersAndAddress = await JSON.parse(
    await response.text()
  );
  console.log(`finished resetting org with id ${body.id}`, response.status());
  return body;
}

export async function deleteDealInDbAndHubspot(dealOrDealId: Deal | number) {
  let dealId: number | null = null;

  // Determine deal ID
  if (typeof dealOrDealId === 'number') {
    dealId = dealOrDealId;
  } else {
    dealId = dealOrDealId.id;
  }

  if (!dealId) {
    console.error('Invalid deal ID provided');
    return { dbDeleted: false, hubspotDeleted: false };
  }

  let dealToDelete: Deal | null = null;
  let dbDeleted = false;
  let hubspotDeleted = false;

  try {
    // Attempt to delete the deal in the database
    dealToDelete = await prisma.deal.delete({ where: { id: dealId } });
    dbDeleted = !!dealToDelete;
  } catch (error) {
    console.error(`Failed to delete deal in database for deal ID: ${dealId}`, error);
  }

  if (dealToDelete) {
    try {
      // Attempt to delete the deal in HubSpot
      const hubspotResponse = await deleteHubspotDeal(dealToDelete.hubspotId);
      hubspotDeleted = hubspotResponse?.success || false;
    } catch (error) {
      console.error(
        `Failed to delete HubSpot deal for hubspotId: ${dealToDelete.hubspotId}`,
        error
      );
    }
  }

  console.log(
    `Deletion results for deal ID ${dealId}:`,
    `Database - ${dbDeleted ? 'Success' : 'Failed'}`,
    `HubSpot - ${hubspotDeleted ? 'Success' : 'Failed'}`
  );

  // Return the status of deletions
  return { dbDeleted, hubspotDeleted };
}

export async function clearAllTestDeals() {
  console.log('begin clearing all test deals');
  const testUser = await prisma.user.findFirst({
    where: { email: `${process.env.E2E_CLERK_USER_USERNAME}` },
  });
  if (!testUser) {
    throw new Error('test user not found in db');
  }
  //Find all orgs owned by the test user
  const orgs = await prisma.organization.findMany({
    where: { ownerId: testUser.id },
  });
  //Delete all deals associated with each org
  for (const org of orgs) {
    try {
      await prisma.deal.deleteMany({ where: { organizationId: org.id } });
    } catch (e) {
      console.error('could not delete deals in db', getErrorMessage(e));
    }
  }
}
