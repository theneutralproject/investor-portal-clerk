// get (dashboard) returns for one user

import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { DealStage } from '@/libs/deal/schema';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { getPortfolioReturns } from '@/libs/returns/utils.server';
import { DealWithInvestmentStatsAndProjectWithPics } from '@/libs/types';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { DealStatus } from '@prisma/client';
import { isNumber } from 'lodash';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let userId: number;
  try {
    const url = new URL(request.url);
    userId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!userId || !isNumber(userId)) {
      throw new Error('userId is required in url');
    }
  } catch (__error) {
    return jsonResponse({ error: `userId is required in url` }, 400);
  }

  //   same functionality as /api/dashboard/returns
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
