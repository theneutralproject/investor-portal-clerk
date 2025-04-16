import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { getPortfolioReturns } from '@/libs/returns/utils.server';
import type { DealWithInvestmentStatsAndProjectWithPics } from '@/libs/types';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { DealStatus } from '@prisma/client';
import { DealStage } from '@/libs/deal/schema';
import Logger from '@/libs/logger';

export async function GET(request: NextRequest) {
  // get loggedin user
  const { userId } = getAuth(request);
  if (!userId) {
    return errorResponse('User not authenticated', 401);
  }
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      organizationMember: {
        include: {
          organization: {
            include: {
              deals: {
                where: {
                  dealStage: DealStage.CLOSED,
                  status: DealStatus.ACTIVE, //Ignore Converted, Deleted and Future Conversion deals
                },
                include: {
                  startDealConversion: true,
                  endDealConversion: true,
                  investmentStats: true,
                  project: {
                    include: {
                      milestones: true,
                      pictures: true,
                      equityMilestoneFiles: true,
                      investmentStats: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!user) {
    return errorResponse('User not found in database', 404, { request });
  }
  const deals: DealWithInvestmentStatsAndProjectWithPics[] = [];
  // iterate through user organizations and get deals
  let equityFileLastUpdated: Date | null = null;
  for (const member of user.organizationMember) {
    const org = member.organization;
    for (const deal of org.deals) {
      if (
        deal.project?.equityMilestoneFiles &&
        deal.project.equityMilestoneFiles.length > 0
      ) {
        const latestFile = deal.project.equityMilestoneFiles[0];
        if (latestFile) {
          equityFileLastUpdated = latestFile.createdAt;
        }
      }
      if (!deal.investmentStats) {
        Logger.error(
          `Deal ${deal.id} has no investment stats and cannot be shown in user dashboard!`
        );
      }
      if (deal.investmentStats && deal.project) {
        deals.push(deal);
      }
    }
  }
  try {
    const portfolioReturns = await getPortfolioReturns(deals);
    return jsonResponse({
      ...portfolioReturns,
      equityFileLastUpdated,
    });
  } catch (error) {
    return errorResponse('unable to get portfolio returns', 500, {
      request,
      extra: { error },
    });
  }
}
