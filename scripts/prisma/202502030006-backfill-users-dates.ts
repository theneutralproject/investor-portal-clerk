import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const HUBSPOT_API_URL = `${process.env.HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts`;
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

async function fetchAllUsersFromHubspot() {
  let hubspotUsers: Record<
    string,
    { createdate: string; hs_lastmodifieddate?: string }
  > = {};
  let after = null;
  let hasMore = true;

  try {
    while (hasMore) {
      const response: any = await axios.get(HUBSPOT_API_URL, {
        headers: { Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}` },
        params: {
          properties: 'createdate,hs_lastmodifieddate',
          limit: 100,
          after: after,
        },
      });

      hubspotUsers = response.data.results.reduce(
        (
          acc: Record<
            string,
            { createdate: string; hs_lastmodifieddate?: string }
          >,
          user: any
        ) => {
          acc[user.id] = {
            createdate: user.properties.createdate,
            hs_lastmodifieddate: user.properties.hs_lastmodifieddate,
          };
          return acc;
        },
        hubspotUsers
      );

      after = response.data.paging?.next?.after || null;
      hasMore = !!after;
    }
  } catch (error) {
    console.error('Error fetching users from HubSpot:', error);
  }

  return hubspotUsers;
}

async function main() {
  const users = await prisma.user.findMany({ where: { dateCreated: null } });
  console.log(`${users.length} users found in database.`);
  const hubspotUsers = await fetchAllUsersFromHubspot();
  console.log(
    `Fetched ${Object.keys(hubspotUsers).length} users from HubSpot.`
  );

  for (const user of users) {
    const hubspotData = hubspotUsers[user.hubspotId];

    if (hubspotData) {
      const createdDate = new Date(hubspotData.createdate || Date.now());
      const updatedDate = hubspotData.hs_lastmodifieddate
        ? new Date(hubspotData.hs_lastmodifieddate)
        : createdDate;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          dateCreated: createdDate,
          dateUpdated: updatedDate,
        },
      });

      console.log(
        `Updated user ${user.id} with dateCreated: ${createdDate} and dateUpdated: ${updatedDate}`
      );
    } else {
      console.warn(
        `No HubSpot data found for user ${user.id} with hubspotId ${user.hubspotId}`
      );
    }
  }
}

console.log('Running script');

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error('Error during backfill:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
