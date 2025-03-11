import prisma from '@/libs/prisma.server';
import { getPortfolioReturns } from '@/libs/returns/utils.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

/**
 * get conversion object by id
 * @param request
 * @returns DealConversion with associated deals
 */
export async function GET(request: NextRequest) {
  const { userId: clerkId, sessionClaims } = getAuth(request);
  if (!clerkId) {
    return errorResponse('userId not found in getAuth()', 404);
  }
  const dbUserId = sessionClaims?.metadata?.investorPortalId;
  if (!dbUserId) {
    return errorResponse('investorPortalId not found in getAuth()', 404);
  }

  let conversionId: number;
  try {
    const url = new URL(request.url);
    conversionId = parseInt(url.pathname.split('/').pop() ?? '');
    if (!conversionId) {
      throw new Error('conversionId is required in url');
    }
  } catch (__error) {
    return errorResponse(`conversionId is required in url`, 400);
  }

  try {
    const conversion = await prisma.dealConversion.findUnique({
      where: { id: conversionId },
      include: {
        startDeal: {
          include: {
            organization: {
              include: { members: true },
            },
            project: {
              include: {
                milestones: true,
                pictures: true,
                investmentStats: true,
              },
            },
            investmentStats: true,
          },
        },
        endDeal: {
          include: {
            organization: {
              include: { members: true },
            },
            project: {
              include: {
                milestones: true,
                pictures: true,
                investmentStats: true,
              },
            },
            investmentStats: true,
          },
        },
      },
    });

    // Check if user is authorized to view this conversion
    if (!conversion) {
      return errorResponse('Conversion not found', 404);
    }
    const startOrgMembers = conversion.startDeal?.organization?.members ?? [];
    const endOrgMembers = conversion.endDeal?.organization?.members ?? [];

    const deals = [conversion.startDeal, conversion.endDeal];
    const conversionReturns = await getPortfolioReturns(deals);

    if (
      !startOrgMembers.some(member => member.userId === dbUserId) &&
      !endOrgMembers.some(member => member.userId === dbUserId)
    ) {
      return errorResponse('User not authorized to view this conversion', 403);
    }

    return jsonResponse({
      conversion,
      conversionReturns,
    });
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500);
  }
}
