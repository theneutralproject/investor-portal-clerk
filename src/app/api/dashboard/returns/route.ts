import prisma from '@/libs/prisma.server';
import { getPortfolioReturns } from '@/libs/returns/utils';
import type { DealWithInvestmentStatsAndProjectWithPics } from '@/libs/types';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  // get loggedin user
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return errorResponse('User not authenticated', 401);
  }
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      organizationMember: {
        include: {
          organization: {
            include: {
              deals: {
                where: { dealStage: 5 },
                include: {
                  investmentStats: true,
                  project: {
                    include: {
                      milestones: true,
                      pictures: true,
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
    return errorResponse('User not found in database', 404);
  }
  const deals: DealWithInvestmentStatsAndProjectWithPics[] = [];
  // iterate through user organizations and get deals
  for (const member of user.organizationMember) {
    const org = member.organization;
    for (const deal of org.deals) {
      if (!deal.investmentStats) {
        console.error(`Deal ${deal.id} has no investment stats`);
      }
      if (deal.investmentStats && deal.project) {
        deals.push(deal);
      }
    }
  }
  try {
    const portfolioReturns = await getPortfolioReturns(deals);
    return jsonResponse(portfolioReturns);
  } catch (error) {
    console.error(`unable to get portfolio returns: ${error}`);
    return errorResponse(getErrorMessage(error), 500);
  }
}
