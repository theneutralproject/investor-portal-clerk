import { ActivityType } from '@prisma/client';
import {
  createInvestmentAvailableActivityItem,
  createInvestmentCompletedActivityItem,
  createTaxDocAvailableActivityItem,
} from '../utils.server';
import prisma from '@/libs/prisma.server';

jest.mock('@/libs/prisma.server', () => ({
  activityFeedItem: {
    create: jest.fn(),
  },
}));

describe('Activity Feed Item Creation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvestmentCompletedActivityItem', () => {
    it('should create an investment completed activity item', async () => {
      const deal = {
        id: 1,
        organization: { ownerId: 100 },
        investmentStats: { financingType: 'equity' },
        project: { name: 'Project A', slug: 'project-a' },
        closingDate: new Date('2025-01-01T08:39:11.723Z'),
        dateCreated: new Date('2025-01-01'),
      } as any;

      await createInvestmentCompletedActivityItem(deal);

      expect(prisma.activityFeedItem.create).toHaveBeenCalledWith({
        data: {
          userId: 100,
          header: 'Investment Completed',
          body: `You successfully initiated an Equity investment into Project A on Wed Jan 01 2025.`,
          type: ActivityType.NEW_INVESTMENT,
          dateCreated: deal.dateCreated,
          link: '/projects/project-a',
          itemId: 1,
        },
      });
    });
  });

  describe('createInvestmentAvailableActivityItem', () => {
    it('should create an investment document available activity item', async () => {
      const dealDocActivityPayload = {
        userId: 200,
        projectName: 'Project B',
        itemId: 2,
      };

      await createInvestmentAvailableActivityItem(dealDocActivityPayload);

      expect(prisma.activityFeedItem.create).toHaveBeenCalledWith({
        data: {
          userId: 200,
          header: 'Investment Doc Available',
          body: `A new investment document is available for your investment into Project B.`,
          type: ActivityType.INVESTOR_DOCUMENT,
          dateCreated: expect.any(Date),
          link: '/documents/investor',
          itemId: 2,
        },
      });
    });

    it('should handle missing project name gracefully', async () => {
      const dealDocActivityPayload = {
        userId: 200,
        projectName: undefined,
        itemId: 3,
      };

      await createInvestmentAvailableActivityItem(dealDocActivityPayload);

      expect(prisma.activityFeedItem.create).toHaveBeenCalledWith({
        data: {
          userId: 200,
          header: 'Investment Doc Available',
          body: `A new investment document is available for your investment into .`,
          type: ActivityType.INVESTOR_DOCUMENT,
          dateCreated: expect.any(Date),
          link: '/documents/investor',
          itemId: 3,
        },
      });
    });
  });

  describe('createTaxDocAvailableActivityItem', () => {
    it('should create a tax document available activity item', async () => {
      const dealDocActivityPayload = {
        userId: 300,
        itemId: 4,
      };

      await createTaxDocAvailableActivityItem(dealDocActivityPayload);

      expect(prisma.activityFeedItem.create).toHaveBeenCalledWith({
        data: {
          userId: 300,
          header: 'K-1 Tax Doc Available',
          body: `A new tax document has been added to your document portal.`,
          type: ActivityType.TAX_DOCUMENT,
          dateCreated: expect.any(Date),
          link: '/documents/tax',
          itemId: 4,
        },
      });
    });
  });
});
