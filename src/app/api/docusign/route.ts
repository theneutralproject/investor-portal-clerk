'use server';
import { isError } from 'lodash';
import prisma from '@/libs/prisma.server';
import {
  type DocusignEnvelopeCreateSchema,
  zDocusignEvelopeCreate,
} from '@/libs/docusign/schema';
import { getErrorMessage, jsonResponse } from '@/libs/utils';
import {
  refreshAccessToken,
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
import type { Envelope, EnvelopesApi, EnvelopeSummary } from 'docusign-esign';

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

  const accessTokenResponse = await refreshAccessToken();
  if (accessTokenResponse.consentUrl) {
    // we need to get consent from the user to share their data with docusign.
    return new Response(
      JSON.stringify({ consentUrl: accessTokenResponse.consentUrl }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  const envelopesApi = await instantiateApiClient(
    accessTokenResponse.accessToken
  );

  // check if a docusign envelope already exists for this deal, so that we dont duplicate it

  // if yes, create a recipient view and return it
  const existingDocusignEvent = await prisma.docusignEvent.findFirst({
    where: {
      dealId: payload.dealId,
      userId: userWOrgsAndAddress.id,
      templateId: payload.templateId,
    },
  });

  let envelopeResponse: EnvelopeSummary | Envelope;

  if (existingDocusignEvent) {
    console.log('Displaying existing envelope for deal', deal.id);
    try {
      envelopeResponse = await getExistingEnvelopeDefinition(
        envelopesApi,
        existingDocusignEvent.envelopeId
      );
      if (isError(envelopeResponse)) {
        console.error('returning error for bad envelopeResponse1');
        return new Response(JSON.stringify('unable to get envelope'), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (err) {
      console.error('returning error for bad envelopeResponse2');
      return new Response(JSON.stringify('unable to get envelope'), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
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
      console.error(
        'returning error for bad envelopeResponse4',
        getErrorMessage(err)
      );
      return new Response(JSON.stringify('unable to create envelope'), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (!envelopeResponse.envelopeId) {
    console.error('returning error for bad envelopeResponse5');
    return new Response(JSON.stringify('unable to get envelope'), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const documentTemplateId = payload.templateId;
  const userId = userWOrgsAndAddress.id;

  const returnUrl = `${process.env.BASE_URL}/api/docusign/return?documentTemplateId=${documentTemplateId}&userId=${userId}&dealId=${deal.id}`;
  // Create the recipient view for the Signing Ceremony
  const viewRequest = makeRecipientViewRequest(userWOrgsAndAddress, returnUrl);
  const viewRequestResponse = await envelopesApi
    .createRecipientView(
      process.env.DOCUSIGN_API_ACCOUNT_ID!,
      envelopeResponse.envelopeId,
      { recipientViewRequest: viewRequest }
    )
    .catch(err => {
      console.error('CANNOT CREATE RECIPIENT VIEW:', getErrorMessage(err));
      return new Error(getErrorMessage(err));
    });

  if (isError(viewRequestResponse)) {
    console.error('returning error for bad makeRecipientViewRequest');
    return new Response(JSON.stringify(viewRequestResponse.message), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
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
    } catch (err) {
      console.error('Error creating docusignEvent:', getErrorMessage(err));
    }
  }

  return new Response(JSON.stringify(viewRequestResponse), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
