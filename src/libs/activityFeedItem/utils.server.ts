import _ from 'lodash';
import { ActivityType } from '@prisma/client';
import prisma from '../prisma.server';

export interface DealActivityItemCreate {
  userId: number;
  itemId: number;
  projectName: string;
  projectSlug: string;
  financingType?: string;
  dateCreated?: Date | null;
  closingDate: Date;
}

export interface DealDocumentActivityItemCreate {
  userId: number;
  projectName?: string;
  itemId: number;
}

export const createInvestmentCompletedActivityItem = async (
  deal: DealActivityItemCreate
) => {
  return await prisma.activityFeedItem.upsert({
    where: {
      activity_user_item_type: {
        userId: deal.userId,
        type: ActivityType.NEW_INVESTMENT,
        itemId: deal.itemId,
      },
    },
    update: {},
    create: {
      userId: deal.userId,
      header: 'Investment Completed',
      body: `You successfully initiated an ${_.startCase(deal.financingType || '')} investment into ${deal.projectName} on ${deal.closingDate?.toDateString()}.`,
      type: ActivityType.NEW_INVESTMENT,
      dateCreated: deal.dateCreated!,
      link: `/projects/${deal.projectSlug}`,
      itemId: deal.itemId,
    },
  });
};

export const createInvestmentAvailableActivityItem = async (
  dealDocActivityPayload: DealDocumentActivityItemCreate
) => {
  return await prisma.activityFeedItem.upsert({
    where: {
      activity_user_item_type: {
        userId: dealDocActivityPayload.userId,
        type: ActivityType.INVESTOR_DOCUMENT,
        itemId: dealDocActivityPayload.itemId,
      },
    },
    update: {},
    create: {
      userId: dealDocActivityPayload.userId,
      header: 'Investment Doc Available',
      body: `A new investment document is available for your investment into ${dealDocActivityPayload.projectName || ''}.`,
      type: ActivityType.INVESTOR_DOCUMENT,
      dateCreated: new Date(),
      link: `/documents/investor`,
      itemId: dealDocActivityPayload.itemId,
    },
  });
};

export const createTaxDocAvailableActivityItem = async (
  dealDocActivityPayload: DealDocumentActivityItemCreate
) => {
  return await prisma.activityFeedItem.upsert({
    where: {
      activity_user_item_type: {
        userId: dealDocActivityPayload.userId,
        type: ActivityType.TAX_DOCUMENT,
        itemId: dealDocActivityPayload.itemId,
      },
    },
    update: {},
    create: {
      userId: dealDocActivityPayload.userId,
      header: 'K-1 Tax Doc Available',
      body: `A new tax document has been added to your document portal.`,
      type: ActivityType.TAX_DOCUMENT,
      dateCreated: new Date(),
      link: `/documents/tax`,
      itemId: dealDocActivityPayload.itemId,
    },
  });
};
