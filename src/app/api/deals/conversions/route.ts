'use server';
import {
  DealConversionCreateSchema,
  zDealConversionCreateSchema,
} from '@/libs/deal/schema';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

/**
 *
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  const { userId: clerkId, sessionClaims } = getAuth(request);
  if (!clerkId) {
    return errorResponse('userId not found in getAuth()', 404, { request });
  }
  const dbUserId = sessionClaims?.metadata?.investorPortalId;
  if (!dbUserId) {
    return errorResponse('investorPortalId not found in getAuth()', 404, {
      request,
    });
  }

  const requestBody = (await request.json()) as DealConversionCreateSchema;
  let conversionData: DealConversionCreateSchema;
  try {
    conversionData = zDealConversionCreateSchema.parse(requestBody);
  } catch (parseError) {
    console.error('ERROR: unable to parse POST body:\n', parseError);
    return errorResponse(
      'zDealConversionCreateSchema Input data malformatted',
      400,
      { request, extra: parseError as unknown as Record<string, unknown> }
    );
  }
  if (conversionData.startDealId === conversionData.endDealId) {
    return errorResponse('startDealId and endDealId cannot be the same', 400, {
      request,
    });
  }
  try {
    const DealConversion = await prisma.dealConversion.create({
      data: conversionData,
    });
    return jsonResponse(DealConversion);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, { request });
  }
}
