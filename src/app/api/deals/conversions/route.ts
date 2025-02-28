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

  // Check if user is authorized to create this conversion
  const startDeal = await prisma.deal.findUnique({
    where: { id: conversionData.startDealId },
    include: { organization: { include: { members: true } } },
  });
  if (!startDeal) {
    return errorResponse('startDeal not found', 404, { request });
  }
  const endDeal = await prisma.deal.findUnique({
    where: { id: conversionData.endDealId },
    include: { organization: { include: { members: true } } },
  });
  if (!endDeal) {
    return errorResponse('endDeal not found', 404, { request });
  }
  if (
    startDeal.organization.members.some(member => member.userId === dbUserId)
  ) {
    return errorResponse('User not authorized to create this conversion', 403, {
      request,
    });
  }

  if (endDeal.organization.members.some(member => member.userId === dbUserId)) {
    return errorResponse('User not authorized to create this conversion', 403, {
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
