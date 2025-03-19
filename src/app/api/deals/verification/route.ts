'use server';
import {
  type AccreditationVerificationCreateSchema,
  zAccreditationVerificationCreateSchema,
} from '@/libs/accreditationVerification/schema';
import { HubspotDealUpdate } from '@/libs/hubspot/schema';
import { updateHubspotDealProperties } from '@/libs/hubspot/utils.server';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import type { AccreditationVerifier } from '@prisma/client';
import type { NextRequest } from 'next/server';

/**
 * Specify a AccreditationVerification details for a deal
 * @param request body with AccreditationVerificationCreateSchema
 * @returns
 */
export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return jsonResponse({ error: 'Clerk user not found' }, 404);
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return errorResponse(
      `User record with clerkid ${userId} not found in prisma (POST)`,
      404,
      { request }
    );
  }

  try {
    const requestBody =
      (await request.json()) as AccreditationVerificationCreateSchema;
    let requestData: AccreditationVerificationCreateSchema;

    try {
      requestData = zAccreditationVerificationCreateSchema.parse(requestBody);
    } catch (error) {
      return errorResponse('Input data malformatted', 400, {
        request,
        extra: { error },
      });
    }

    const { dealId, method, basis, verifier } = requestData;

    // check if deal belongs to the user
    const dealToUpdate = await prisma.deal.findFirst({
      where: { id: dealId, organization: { ownerId: user.id } },
    });
    if (!dealToUpdate) {
      console.error(`You do not have access to deal id ${dealId} (POST)`);
      return errorResponse(`You do not have access to deal id ${dealId}`, 404, {
        request,
      });
    }
    let newVerifier: AccreditationVerifier | undefined;
    if (verifier) {
      newVerifier = await prisma.accreditationVerifier.create({
        data: verifier,
      });
    }

    const newAccreditationVerification =
      await prisma.accreditationVerification.create({
        data: { dealId, method, basis, verifierId: newVerifier?.id ?? null },
      });

    const hsStartDealUpdate: HubspotDealUpdate = {
      hubspotDealId: dealId,
      properties: [
        { name: 'verification_basis', value: basis },
        { name: 'verification_method', value: method },
      ],
    };
    await updateHubspotDealProperties(hsStartDealUpdate);
    return jsonResponse(newAccreditationVerification);
  } catch (error) {
    return errorResponse('Error creating AccreditationVerification', 500, {
      request,
      extra: { error },
    });
  }
}
