import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const HUBSPOT_API_URL = `${process.env.HUBSPOT_API_BASE_URL}/crm/v3/objects/deals`;
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

async function fetchAllDealsFromHubspot() {
  let hubspotDeals: Record<
    string,
    { createdate: string; hs_lastmodifieddate?: string }
  > = {};
  let after = null;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await axios.get(HUBSPOT_API_URL, {
        headers: { Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}` },
        params: {
          properties: 'createdate,hs_lastmodifieddate',
          limit: 100,
          after: after,
        },
      });

      hubspotDeals = response.data.results.reduce(
        (
          acc: Record<
            string,
            { createdate: string; hs_lastmodifieddate?: string }
          >,
          deal: any
        ) => {
          acc[deal.id] = {
            createdate: deal.properties.createdate,
            hs_lastmodifieddate: deal.properties.hs_lastmodifieddate,
          };
          return acc;
        },
        hubspotDeals
      );

      after = response.data.paging?.next?.after || null;
      hasMore = !!after;
    }
  } catch (error) {
    console.error('Error fetching deals from HubSpot:', error);
  }

  return hubspotDeals;
}

async function main() {
  const deals = await prisma.deal.findMany();
  console.log(`${deals.length} deals found in database.`);
  const hubspotDeals = await fetchAllDealsFromHubspot();
  console.log(
    `Fetched ${Object.keys(hubspotDeals).length} deals from hubspot.`
  );

  for (const deal of deals) {
    const hubspotData = hubspotDeals[deal.hubspotId];

    if (hubspotData) {
      const createdDate = new Date(hubspotData.createdate || Date.now());
      const updatedDate = hubspotData.hs_lastmodifieddate
        ? new Date(hubspotData.hs_lastmodifieddate)
        : createdDate;

      await prisma.deal.update({
        where: { id: deal.id },
        data: {
          dateCreated: createdDate,
          dateUpdated: updatedDate,
        },
      });

      console.log(
        `Updated deal ${deal.id} with dateCreated: ${createdDate} and dateUpdated: ${updatedDate}`
      );
    } else {
      console.warn(
        `No HubSpot data found for deal ${deal.id} with hubspotId ${deal.hubspotId}`
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
