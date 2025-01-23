'use server';
import { isError } from 'lodash';
import prisma from '@/libs/prisma.server';
import {
  type DocusignEnvelopeCreateSchema,
  zDocusignEvelopeCreate,
} from '@/libs/docusign/schema';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils';
import {
  refreshDocusignAccessToken,
  instantiateApiClient,
  makeEnvelopeDefinition,
  makeRecipientViewRequest,
} from '@/libs/docusign/utils';
import { currentUser } from '@clerk/nextjs/server';
import type {
  DealWithInvestmentStatsAndVerification,
  OrganizationWithFullMembersAndAddress,
  UserWithAddress,
} from '@/libs/types';
import type {
  Envelope,
  EnvelopesApi,
  EnvelopeSummary,
  ViewUrl,
} from 'docusign-esign';
import { DocusignEvent } from '@prisma/client';

async function createNewEnvelopeDefinition(
  envelopesApi: EnvelopesApi,
  templateId: string,
  deal: DealWithInvestmentStatsAndVerification,
  userWOrgsAndAddress: UserWithAddress,
  organization: OrganizationWithFullMembersAndAddress
) {
  const envelope = makeEnvelopeDefinition(
    templateId,
    organization,
    deal,
    userWOrgsAndAddress
  );
  try {
    const envelopeResponse = await envelopesApi.createEnvelope(
      process.env.DOCUSIGN_API_ACCOUNT_ID!,
      { envelopeDefinition: envelope }
    );
    return envelopeResponse;
  } catch (err) {
    console.error('CANNOT CREATE ENVELOPE:');
    console.error(err);
    throw new Error(getErrorMessage(err));
  }
}

async function getExistingEnvelopeDefinition(
  envelopesApi: EnvelopesApi,
  envelopeId: string
) {
  try {
    const envelopeResponse = await envelopesApi.getEnvelope(
      process.env.DOCUSIGN_API_ACCOUNT_ID!,
      envelopeId
    );
    return envelopeResponse;
  } catch (err) {
    console.error('CANNOT GET ENVELOPE:', getErrorMessage(err));
    throw new Error(getErrorMessage(err));
  }
}

// create new envelope or get existing envelope, and display recipient view to user
export async function POST(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return jsonResponse({ error: 'User not found' }, 404);
  }

  const userWOrgsAndAddress = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      address: true,
      organizationMember: {
        include: {
          user: true,
        },
      },
    },
  });
  if (!userWOrgsAndAddress) {
    console.error('Neutral user not found in api/docusign');
    return jsonResponse(
      {
        error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
      },
      404
    );
  }

  let payload: DocusignEnvelopeCreateSchema;
  try {
    payload = zDocusignEvelopeCreate.parse(await req.json());
  } catch (err) {
    console.error(
      'Error parsing Docusign POST payload: ',
      getErrorMessage(err)
    );
    return new Response(
      JSON.stringify({ error: 'Unable to parse Docusign POST payload:', err }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }
    );
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
    console.error(
      `Deal with id ${payload.dealId} not found in user's organization`
    );
    return jsonResponse(
      {
        error: `Deal with id ${payload.dealId} not found in user's organization1`,
      },
      404
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
    console.error(
      `Deal with id ${payload.dealId} not found in user's organization2`
    );
    console.log(!!project, !!organization, !!investmentStats);
    return jsonResponse(
      {
        error: `Deal with id ${payload.dealId} not found in user's organization`,
      },
      404
    );
  }
  let accessTokenResponse: { consentUrl?: string; accessToken?: string };
  try {
    // get access token and instantiate api client
    accessTokenResponse = await refreshDocusignAccessToken(
      project.slug,
      deal.id
    );
    if (accessTokenResponse.consentUrl) {
      // we need to get consent from the user to share their data with docusign.
      console.log(
        'need to get consent from user to use docusign',
        accessTokenResponse
      );
      return new Response(
        JSON.stringify({ consentUrl: accessTokenResponse.consentUrl }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    if (!accessTokenResponse.accessToken) {
      // this is unexpected
      console.error('No access token found after consent flow');
      return errorResponse('No access token found after consent flow', 500);
    }
  } catch (err) {
    console.error('Error refreshing access token', getErrorMessage(err));
    return errorResponse('Error refreshing access token', 500);
  }
  // we do not need consent anymore, so we can instantiate the api client
  console.log(
    'instantiating api client with access token',
    accessTokenResponse.accessToken
  );

  let envelopesApi: EnvelopesApi | null = null;
  try {
    envelopesApi = await instantiateApiClient(accessTokenResponse.accessToken);
  } catch (err) {
    console.error('Error instantiating envelopesApi', getErrorMessage(err));
    return errorResponse('Error instantiating envelopesApi', 500);
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
  } catch (err) {
    console.error(
      'Error finding existing docusign event',
      getErrorMessage(err)
    );
    return errorResponse('Error finding existing docusign event', 500);
  }

  if (existingDocusignEvent) {
    console.log('Reusing existing envelope:', existingDocusignEvent);
    try {
      envelopeResponse = await getExistingEnvelopeDefinition(
        envelopesApi,
        existingDocusignEvent.envelopeId
      );
    } catch (err) {
      console.error('Unable to get existing envelope from Docusign', err);
      return errorResponse(
        'Unable to get existing envelope from Docusign',
        500
      );
    }
  } else {
    // if no, create a new envelope
    console.log('Creating new envelope for deal', deal.id);
    try {
      envelopeResponse = await createNewEnvelopeDefinition(
        envelopesApi,
        payload.templateId,
        { ...dealData, investmentStats, accreditationVerification },
        userWOrgsAndAddress,
        organization
      );
    } catch (err) {
      console.error('Unable to create new envelope in Docusign', err);
      return errorResponse('Unable to create new envelope in Docusign', 500);
    }
  }

  if (!envelopeResponse.envelopeId) {
    console.error('docusign envelope response is falsy:', envelopeResponse);
    return errorResponse('Docusign envelope response is falsy', 500);
  }

  const documentTemplateId = payload.templateId;
  const userId = userWOrgsAndAddress.id;

  const returnUrl = `${process.env.BASE_URL}/api/docusign/return?documentTemplateId=${documentTemplateId}&userId=${userId}&dealId=${deal.id}`;
  // Create the recipient view for the Signing Ceremony
  console.log('Creating recipient view with returnUrl', returnUrl);
  const viewRequest = makeRecipientViewRequest(userWOrgsAndAddress, returnUrl);
  let viewRequestResponse: ViewUrl | Error;
  try {
    viewRequestResponse = await envelopesApi.createRecipientView(
      process.env.DOCUSIGN_API_ACCOUNT_ID!,
      envelopeResponse.envelopeId,
      { recipientViewRequest: viewRequest }
    );
  } catch (err) {
    console.error('CANNOT CREATE RECIPIENT VIEW:', err);
    return errorResponse('CANNOT CREATE RECIPIENT VIEW', 500);
  }

  if (isError(viewRequestResponse)) {
    console.error('returning error for bad makeRecipientViewRequest');
    return errorResponse(`${viewRequestResponse}`, 500);
  }
  // store docusignEvent:
  if (!existingDocusignEvent) {
    try {
      const docusignEvent = await prisma.docusignEvent.create({
        data: {
          envelopeId: envelopeResponse.envelopeId,
          templateId: documentTemplateId,
          dealId: deal.id,
          userId: userWOrgsAndAddress.id,
          dateSent: new Date(),
        },
      });

      return jsonResponse(viewRequestResponse, 200);
    } catch (err) {
      console.error('Error creating new docusignEvent:', err);
      return errorResponse('Error creating new docusignEvent', 500);
    }
  }
}
