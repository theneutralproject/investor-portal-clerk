'use server';
import { isError } from 'lodash';
import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import type {
  Envelope,
  EnvelopesApi,
  EnvelopeSummary,
  ViewUrl,
} from 'docusign-esign';
import { DocusignEvent } from '@prisma/client';
import prisma from '@/libs/prisma.server';
import {
  type DocusignEnvelopeCreateSchema,
  zDocusignEvelopeCreate,
} from '@/libs/docusign/schema';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import {
  createNewEnvelopeDefinition,
  getExistingEnvelopeDefinition,
  instantiateApiClientFromAccessToken,
  makeRecipientViewRequest,
  refreshAccessToken,
} from '@/libs/docusign/utils.server';
import Logger from '@/libs/logger';

interface AccessTokenResponse {
  consentUrl?: string;
  accessToken?: string;
}

// create new envelope or get existing envelope, and display recipient view to user
export async function POST(request: NextRequest) {
  const { userId: clerkUserId } = getAuth(request);
  if (!clerkUserId) {
    return jsonResponse({ error: 'User not found' }, 404);
  }

  const userWOrgsAndAddress = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    include: { address: true, organizationMember: { include: { user: true } } },
  });
  if (!userWOrgsAndAddress) {
    return errorResponse(`User record not found`, 404, {
      request,
      extra: { clerkUserId },
    });
  }

  let payload: DocusignEnvelopeCreateSchema;
  // console.log('Docusign POST payload:', await req.json());
  try {
    payload = zDocusignEvelopeCreate.parse(await request.json());
  } catch (error) {
    return errorResponse('Unable to parse Docusign POST payload', 404, {
      request,
      extra: { error },
    });
  }

  // check if user has access to deal
  // get deal from db that belongs to the user's organization
  const deal = await prisma.deal.findFirst({
    where: {
      id: payload.dealId,
      organizationId: {
        in: userWOrgsAndAddress.organizationMember
          .filter(om => om.type === 'OWNER')
          .map(om => om.organizationId),
      },
    },
    include: {
      investmentStats: true,
      accreditationVerification: { include: { verifier: true } },
      organization: {
        include: {
          members: { include: { user: { include: { address: true } } } },
          address: true,
        },
      },
      project: true,
    },
  });
  if (!deal) {
    return errorResponse(
      `Deal with id ${payload.dealId} not found in user's organization`,
      404,
      {
        request,
      }
    );
  }

  const {
    organization,
    project,
    investmentStats,
    accreditationVerification,
    ...dealData
  } = deal;

  if (!project || !organization || !investmentStats) {
    return errorResponse(
      `Details for deal with id ${payload.dealId} not found`,
      404,
      {
        request,
      }
    );
  }
  let accessTokenResponse: AccessTokenResponse;
  try {
    // get access token and instantiate api client
    accessTokenResponse = await refreshAccessToken(
      userWOrgsAndAddress.email,
      deal.id,
      project.slug
    );
    if (accessTokenResponse.consentUrl) {
      // we need to get consent from the user to share their data with docusign.
      Logger.log(
        {
          message: 'We are requesting consent from user to use docusign',
          extra: accessTokenResponse,
        },
        request
      );
      return new Response(
        JSON.stringify({ consentUrl: accessTokenResponse.consentUrl }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!accessTokenResponse.accessToken) {
      // this is unexpected
      return errorResponse('No access token found after consent flow', 500, {
        request,
        extra: { accessTokenResponse },
      });
    }
  } catch (error) {
    return errorResponse('Error refreshing access token', 500, {
      request,
      extra: { error },
    });
  }
  // we do not need consent anymore, so we can instantiate the api client
  Logger.log(
    {
      message: `instantiating api client with access token ${accessTokenResponse.accessToken}`,
    },
    request
  );

  let envelopesApi: EnvelopesApi | null = null;
  try {
    envelopesApi = await instantiateApiClientFromAccessToken(
      accessTokenResponse.accessToken
    );
  } catch (error) {
    return errorResponse('Error instantiating envelopesApi', 500, {
      request,
      extra: { error },
    });
  }

  let envelopeResponse: EnvelopeSummary | Envelope;
  let existingDocusignEvent: DocusignEvent | null = null;

  // check if a docusign envelope already exists for this deal, so that we dont duplicate it
  try {
    // if yes, create a recipient view and return it
    existingDocusignEvent = await prisma.docusignEvent.findFirst({
      where: {
        dealId: payload.dealId,
        userId: userWOrgsAndAddress.id,
        templateId: payload.templateId,
      },
    });
  } catch (error) {
    return errorResponse('Error finding existing docusign event', 500, {
      request,
      extra: { error },
    });
  }

  if (existingDocusignEvent) {
    Logger.log(
      {
        message: 'Reusing existing envelope',
        extra: existingDocusignEvent,
      },
      request
    );
    try {
      envelopeResponse = await getExistingEnvelopeDefinition(
        envelopesApi,
        existingDocusignEvent.envelopeId
      );
    } catch (error) {
      return errorResponse(
        'Unable to get existing envelope from Docusign',
        500,
        { request, extra: { error } }
      );
    }
  } else {
    // if no, create a new envelope
    Logger.log(
      { message: 'Creating new envelope for deal', extra: { dealId: deal.id } },
      request
    );
    try {
      envelopeResponse = await createNewEnvelopeDefinition(
        envelopesApi,
        payload.templateId,
        { ...dealData, investmentStats, accreditationVerification },
        userWOrgsAndAddress,
        organization
      );
    } catch (error) {
      return errorResponse('Unable to create new envelope in Docusign', 500, {
        request,
        extra: { error },
      });
    }
  }

  if (!envelopeResponse.envelopeId) {
    return errorResponse('Docusign envelope response is falsy', 500, {
      request,
      extra: { envelopeResponse },
    });
  }

  const documentTemplateId = payload.templateId;
  const userId = userWOrgsAndAddress.id;

  const returnUrl = `${process.env.BASE_URL}/api/docusign/return?documentTemplateId=${documentTemplateId}&userId=${userId}&dealId=${deal.id}`;
  // Create the recipient view for the Signing Ceremony
  Logger.log(
    { message: 'Creating recipient view for user', extra: { returnUrl } },
    request
  );
  const viewRequest = makeRecipientViewRequest(userWOrgsAndAddress, returnUrl);
  let viewRequestResponse: ViewUrl | Error;
  try {
    viewRequestResponse = await envelopesApi.createRecipientView(
      process.env.DOCUSIGN_API_ACCOUNT_ID!,
      envelopeResponse.envelopeId,
      { recipientViewRequest: viewRequest }
    );
  } catch (error) {
    return errorResponse('Cannot create recipient view', 500, {
      request,
      extra: { error },
    });
  }

  if (isError(viewRequestResponse)) {
    return errorResponse(`Bad viewRequestResponse`, 500, {
      request,
      extra: { viewRequestResponse },
    });
  }
  // store docusignEvent:
  if (!existingDocusignEvent) {
    try {
      await prisma.docusignEvent.create({
        data: {
          envelopeId: envelopeResponse.envelopeId,
          templateId: documentTemplateId,
          dealId: deal.id,
          userId: userWOrgsAndAddress.id,
          dateSent: new Date(),
        },
      });

      return jsonResponse(viewRequestResponse, 200);
    } catch (error) {
      return errorResponse('Error creating new docusignEvent', 500, {
        request,
        extra: { error },
      });
    }
  } else {
    try {
      await prisma.docusignEvent.update({
        where: { id: existingDocusignEvent.id },
        data: { envelopeId: envelopeResponse.envelopeId, dateSent: new Date() },
      });
      return jsonResponse(viewRequestResponse, 200);
    } catch (error) {
      return errorResponse('Error updating existing docusignEvent', 500, {
        request,
        extra: { error },
      });
    }
  }
}
