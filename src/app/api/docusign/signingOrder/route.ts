import {
  getSigningOrder,
  instantiateApiClientFromUserAndDeal,
} from '@/libs/docusign/utils.server';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { currentUser } from '@clerk/nextjs/server';
import { EnvelopesApi } from 'docusign-esign';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const clerkUser = await currentUser();
  let envelopeId: string | null = null;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    envelopeId = queryParams.get('envelopeId') ?? null;
  } catch (error) {
    return errorResponse('unable to read query params', 400, {
      request,
      extra: { error },
    });
  }

  if (!envelopeId) {
    return jsonResponse('envelopeId is required', 400);
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser?.id ?? '' },
  });
  if (!user) {
    return errorResponse(`User not found in DB`, 404, {
      request,
      extra: { clerkUser },
    });
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
    return errorResponse(
      `Docusign event not found for envelopeId ${envelopeId}`,
      404,
      { request }
    );
  }

  const { deal } = docusignEvent;
  const { slug } = deal.project;
  let envelopesApi: EnvelopesApi | null = null;
  try {
    envelopesApi = await instantiateApiClientFromUserAndDeal(
      deal,
      user.email,
      slug,
      envelopeId
    );
  } catch (error) {
    return errorResponse('error getting envelopesApi', 500, {
      request,
      extra: { error, method: 'instantiateApiClientFromUserAndDeal' },
    });
  }
  try {
    const signingOrder = await getSigningOrder(envelopesApi, envelopeId);
    return jsonResponse(signingOrder);
  } catch (error) {
    return errorResponse('error getting envelopesApi or signingOrder', 500, {
      request,
      extra: {
        error,
        method: 'instantiateApiClientFromUserAndDeal or getSigningOrder',
      },
    });
  }
}
