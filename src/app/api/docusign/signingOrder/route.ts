import {
  getSigningOrder,
  instantiateApiClient,
  refreshAccessToken,
} from '@/libs/docusign/utils.server';
import prisma from '@/libs/prisma.server';
import { getErrorMessage, jsonResponse } from '@/libs/utils.server';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const clerkUser = await currentUser();
  let envelopeId: string | null = null;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    envelopeId = queryParams.get('envelopeId') ?? null;
  } catch (error) {
    console.error('unable to read query params:', getErrorMessage(error));
    return jsonResponse(getErrorMessage(error), 500);
  }

  if (!envelopeId) {
    return jsonResponse('envelopeId is required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser?.id ?? '' },
  });
  if (!user) {
    return jsonResponse(
      `user with clerkId ${clerkUser?.id} not found in DB`,
      404
    );
  }

  const docusignEvent = await prisma.docusignEvent.findUnique({
    where: { envelopeId },
    include: {
      deal: {
        include: {
          project: {
            select: {
              slug: true,
              id: true,
            },
          },
        },
      },
    },
  });

  if (!docusignEvent || !docusignEvent.deal) {
    return jsonResponse(
      `docusign event not found for envelopeId ${envelopeId}`,
      404
    );
  }

  const { deal } = docusignEvent;
  const { slug } = deal.project;

  const accessTokenResponse = await refreshAccessToken(
    user.email,
    deal.id,
    slug
  );

  if (accessTokenResponse.consentUrl) {
    // we need to get consent from the user to share their data with docusign.
    // this should never happen as we already did this when the user signed the document
    const errorMessage = `Consent required to share data with docusign for envelopeId: ${envelopeId} - THIS SHOULD NEVER HAPPEN!`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  let envelopesApi;
  try {
    envelopesApi = await instantiateApiClient(accessTokenResponse.accessToken);
  } catch (error) {
    console.error('Error instantiating envelopesApi:', getErrorMessage(error));
    return jsonResponse(getErrorMessage(error), 500);
  }
  try {
    const signingOrder = await getSigningOrder(envelopesApi, envelopeId);
    return jsonResponse(signingOrder);
  } catch (error) {
    console.error(
      'Error getting envelopesApi or signing order:',
      getErrorMessage(error)
    );
    return jsonResponse(getErrorMessage(error), 500);
  }
}
