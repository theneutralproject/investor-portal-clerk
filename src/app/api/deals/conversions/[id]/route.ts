import prisma from '@/libs/prisma.server';
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
        startDeal: true,
        endDeal: true,
      },
    });
    return jsonResponse(conversion);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500);
  }
}
