import { ActivityType } from '@prisma/client';
import {
  createInvestmentAvailableActivityItem,
  createInvestmentCompletedActivityItem,
  createTaxDocAvailableActivityItem,
} from '../utils.server';
import prisma from '@/libs/prisma.server';

jest.mock('@/libs/prisma.server', () => ({
  activityFeedItem: {
    upsert: jest.fn(),
  },
}));

describe('Activity Feed Item Creation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvestmentCompletedActivityItem', () => {
    it('should upsert an investment completed activity item', async () => {
      const deal = {
        userId: 100,
        itemId: 1,
        projectName: 'Project A',
        projectSlug: 'project-a',
        financingType: 'equity',
        closingDate: new Date('2025-01-01T08:39:11.723Z'),
        dateCreated: new Date('2025-01-01'),
      };

      await createInvestmentCompletedActivityItem(deal);

      expect(prisma.activityFeedItem.upsert).toHaveBeenCalledWith({
        where: {
          activity_user_item_type: {
            userId: 100,
            type: ActivityType.NEW_INVESTMENT,
            itemId: 1,
          },
        },
        update: {},
        create: {
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

    it('should handle duplicate investment completed activity item gracefully', async () => {
      const deal = {
        userId: 100,
        itemId: 1,
        projectName: 'Project A',
        projectSlug: 'project-a',
        financingType: 'equity',
        closingDate: new Date('2025-01-01T08:39:11.723Z'),
        dateCreated: new Date('2025-01-01'),
      };

      jest
        .spyOn(prisma.activityFeedItem, 'upsert')
        .mockRejectedValueOnce(new Error('Unique constraint failed'));

      await expect(createInvestmentCompletedActivityItem(deal)).rejects.toThrow(
        'Unique constraint failed'
      );

      expect(prisma.activityFeedItem.upsert).toHaveBeenCalledTimes(1);
    });
  });

  describe('createInvestmentAvailableActivityItem', () => {
    it('should upsert an investment document available activity item', async () => {
      const dealDocActivityPayload = {
        userId: 200,
        projectName: 'Project B',
        itemId: 2,
      };

      await createInvestmentAvailableActivityItem(dealDocActivityPayload);

      expect(prisma.activityFeedItem.upsert).toHaveBeenCalledWith({
        where: {
          activity_user_item_type: {
            userId: 200,
            type: ActivityType.INVESTOR_DOCUMENT,
            itemId: 2,
          },
        },
        update: {},
        create: {
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

      expect(prisma.activityFeedItem.upsert).toHaveBeenCalledWith({
        where: {
          activity_user_item_type: {
            userId: 200,
            type: ActivityType.INVESTOR_DOCUMENT,
            itemId: 3,
          },
        },
        update: {},
        create: {
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

    it('should handle duplicate investment document activity item gracefully', async () => {
      const dealDocActivityPayload = {
        userId: 200,
        projectName: 'Project B',
        itemId: 2,
      };

      jest
        .spyOn(prisma.activityFeedItem, 'upsert')
        .mockRejectedValueOnce(new Error('Unique constraint failed'));

      await expect(
        createInvestmentAvailableActivityItem(dealDocActivityPayload)
      ).rejects.toThrow('Unique constraint failed');

      expect(prisma.activityFeedItem.upsert).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTaxDocAvailableActivityItem', () => {
    it('should upsert a tax document available activity item', async () => {
      const dealDocActivityPayload = {
        userId: 300,
        itemId: 4,
      };

      await createTaxDocAvailableActivityItem(dealDocActivityPayload);

      expect(prisma.activityFeedItem.upsert).toHaveBeenCalledWith({
        where: {
          activity_user_item_type: {
            userId: 300,
            type: ActivityType.TAX_DOCUMENT,
            itemId: 4,
          },
        },
        update: {},
        create: {
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

    it('should handle duplicate tax document activity item gracefully', async () => {
      const dealDocActivityPayload = {
        userId: 300,
        itemId: 4,
      };

      jest
        .spyOn(prisma.activityFeedItem, 'upsert')
        .mockRejectedValueOnce(new Error('Unique constraint failed'));

      await expect(
        createTaxDocAvailableActivityItem(dealDocActivityPayload)
      ).rejects.toThrow('Unique constraint failed');

      expect(prisma.activityFeedItem.upsert).toHaveBeenCalledTimes(1);
    });
  });
});
