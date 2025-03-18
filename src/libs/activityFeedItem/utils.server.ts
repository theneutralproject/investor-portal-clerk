import _ from 'lodash';
import {
  ActivityType,
  Deal,
  DealDocument,
  DealInvestmentStats,
  Project,
} from '@prisma/client';
import prisma from '../prisma.server';

export type DealWithNestedItems = Deal & {
  investmentStats: DealInvestmentStats;
  project: Project;
  organization: { ownerId: number };
};

export type DealDocumentWithDealItems = DealDocument & {
  deal: DealWithNestedItems;
};

export interface DealDocumentActivityItemCreate {
  userId: number;
  projectName?: string;
  itemId: number;
}

export const createInvestmentCompletedActivityItem = async (
  deal: DealWithNestedItems
) => {
  return await prisma.activityFeedItem.create({
    data: {
      userId: deal.organization.ownerId,
      header: 'Investment Completed',
      body: `You successfully initiated an ${_.startCase(deal.investmentStats?.financingType)} investment into ${deal.project.name} on ${deal?.closingDate?.toDateString()}.`,
      type: ActivityType.NEW_INVESTMENT,
      dateCreated: deal.dateCreated!,
      link: `/projects/${deal.project.slug}`,
      itemId: deal.id,
    },
  });
};

export const createInvestmentAvailableActivityItem = async (
  dealDocActivityPayload: DealDocumentActivityItemCreate
) => {
  return await prisma.activityFeedItem.create({
    data: {
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
  return await prisma.activityFeedItem.create({
    data: {
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
