import { ActivityType, DealDocumentType, PrismaClient } from '@prisma/client';
import _ from 'lodash';

const prisma = new PrismaClient();
const START_DATE = new Date('2025-01-01');

async function main() {
  console.log('Seeding Activity Feed...');

  // Fetch Closed Deals Since 1/1/25
  const closedDeals = await prisma.deal.findMany({
    where: { closingDate: { gte: START_DATE } },
    include: { project: true, investmentStats: true, organization: { select: { ownerId: true } } },
  });

  // Fetch Investor Documents Since 1/1/25
  const investorDocuments = await prisma.dealDocument.findMany({
    where: { dateCreated: { gte: START_DATE }, type: DealDocumentType.INVESTMENT_DOCUMENT },
    include: { 
      deal: { include: { project: true, organization: { select: { ownerId: true } } } },
    }
  });

  // Fetch All Tax Documents
  const taxDocuments = await prisma.dealDocument.findMany({
    where: { type: DealDocumentType.K1 },
    include: { 
      deal: { include: { project: true, organization: { select: { ownerId: true } } } },
    }
  });

  // Create Activity Feed Items
  const activities: {
    userId: number
    header: string
    body: string
    dateCreated: Date
    link: string | null
    itemId: number
    type: ActivityType
  }[] = [
    ...closedDeals.map(deal => ({
      userId: deal.organization.ownerId,
      header: 'Investment Completed',
      body: `You successfully initiated an ${_.startCase(deal.investmentStats?.financingType)} investment into ${deal.project.name} on ${deal?.closingDate?.toDateString()}.`,
      type: ActivityType.NEW_INVESTMENT,
      dateCreated: deal.dateCreated!,
      link: `/projects/${deal.project.slug}`,
      itemId: deal.id
    })),

    ...investorDocuments.map(doc => ({
      userId: doc.deal.organization.ownerId,
      header: 'Investment Doc Available',
      body: `A new investment document is available for your investment into ${doc.deal.project.name}.`,
      type: ActivityType.INVESTOR_DOCUMENT,
      dateCreated: doc.dateCreated,
      link: `/documents/investor`,
      itemId: doc.id
    })),

    ...taxDocuments.map(doc => ({
      userId: doc.deal.organization.ownerId,
      header: 'K-1 Tax Doc Available',
      body: `A new tax document has been added to your document portal.`,
      type: ActivityType.TAX_DOCUMENT,
      dateCreated: doc.dateCreated,
      link: `/documents/tax`,
      itemId: doc.id
    })),
  ];

  // Insert Activity Feed Items
  console.log(activities);
  await prisma.activityFeedItem.createMany({ data: activities });

  console.log('Seed Completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error('Error during backfill:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
