import { getAdminFromRequest } from '@/libs/admin/utils';
import prisma from '@/libs/prisma.server';
import { getPortfolioReturns } from '@/libs/returns/utils';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils';
import { isError, isNumber } from 'lodash';
import { NextRequest } from 'next/server';

/**
 * Get a deal's return information
 * @param request
 * @returns return information
 */
export async function GET(request: NextRequest) {
  //   const adminUser = await getAdminFromRequest(request);
  //   if (isError(adminUser)) {
  //     console.error(getErrorMessage(adminUser));
  //     return errorResponse(getErrorMessage(adminUser), 401);
  //   }

  let dealId: number;
  try {
    const url = new URL(request.url);
    dealId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!dealId || !isNumber(dealId)) {
      throw new Error('dealId is required in url');
    }
  } catch (error: unknown) {
    return jsonResponse({ error: `dealId is required in url` }, 400);
  }

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: {
      investmentStats: true,
      project: {
        include: {
          investmentStats: true,
          milestones: true,
          pictures: true,
        },
      },
    },
  });
  if (!deal) {
    return errorResponse(`Deal id ${dealId} not found`, 404);
  }

  try {
    const dealReturns = await getPortfolioReturns([deal]);
    return jsonResponse(dealReturns);
  } catch (error) {
    console.error(`unable to get portfolio returns: ${error}`);
    return errorResponse(getErrorMessage(error), 500);
  }
}
