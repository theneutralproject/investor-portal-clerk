'use server';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { isNumber } from 'lodash';
import { NextRequest } from 'next/server';

/**
 *
 * @param request
 * @returns DealConversion with associated deals
 */
export async function GET(request: NextRequest) {
  const { userId: clerkId, sessionClaims } = getAuth(request);
  if (!clerkId) {
    return errorResponse('sessionId not found in getAuth()', 404);
  }
  const dbUserId = sessionClaims?.metadata?.investorPortalId;
  if (!dbUserId) {
    return errorResponse('investorPortalId not found in getAuth()', 404);
  }

  let dealId: number;
  try {
    const url = new URL(request.url);
    dealId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!dealId || !isNumber(dealId)) {
      throw new Error('dealId is required in url');
    }
  } catch (__error) {
    return errorResponse(`dealId is required in url`, 400);
  }

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: {
      organization: {
        include: {
          members: { include: { user: true } },
        },
      },
      conversion: {
        include: { deals: true },
      },
    },
  });
  if (!deal?.organization.members.some(member => member.userId === dbUserId)) {
    return errorResponse(
      `user ${dbUserId} is not authorized to access deal ${dealId}`,
      401
    );
  }

  return jsonResponse(deal?.conversion);
}
