import prisma from '@/libs/prisma.server';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import {
  type DealCreateSchema,
  DealStage,
  type DealUpdateSchema,
  zDealCreateSchema,
  zDealUpdateSchema,
} from '../../../libs/deal/schema';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { createDealForUser, updateDeal } from '@/libs/deal/utils.server';
import { DealStatus } from '@prisma/client';
import Logger from '@/libs/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 *
 * @param request
 * @returns Deal for a given project, if the user is a member of the organization that owns the deal
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const slug = new URLSearchParams(url.search).get('slug');

  if (!slug) {
    return errorResponse('Project slug is required', 400, { request });
  }

  try {
    const { userId: clerkId, sessionClaims } = getAuth(request);
    if (!clerkId) {
      return errorResponse('userId not found in getAuth()', 404, { request });
    }
    let dbUserId = sessionClaims?.metadata?.investorPortalId;
    if (!dbUserId) {
      Logger.warn(
        'investorPortalId not found in getAuth() - looking up from DB instead',
        request
      );
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkId },
      });
      dbUserId = dbUser?.id;
      if (!dbUserId) {
        return errorResponse(`User with clerkId ${clerkId} not found`, 404, {
          request,
        });
      }
    }

    // Find the project based on the slug
    const project = await prisma.project.findUnique({
      where: { slug: slug },
    });

    if (!project) {
      return errorResponse(`Project with slug ${slug} not found`, 404, {
        request,
      });
    }

    const userOrgs = await prisma.organization.findMany({
      where: { members: { some: { userId: dbUserId } } },
    });

    const deals = await prisma.deal.findMany({
      where: {
        organizationId: { in: userOrgs.map(org => org.id) },
        projectId: project.id,
      },
      include: { investmentStats: true },
    });

    if (!deals || deals.length === 0) {
      return jsonResponse(null, 200); // Valid return with no deals found
    }

    // only return deals for organizations (1) that the user is the owner of, or (2) that are completed, and the user is a member of its organization
    return jsonResponse(
      deals.filter(
        deal =>
          deal.dealStage === DealStage.CLOSED ||
          userOrgs.some(
            org => org.id === deal.organizationId && org.ownerId === dbUserId
          )
      )[0] ?? null
    );
  } catch (error) {
    return errorResponse('Error fetching dealflow data', 500, {
      request,
      extra: { error },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = getAuth(request);
    if (!clerkId) {
      return errorResponse('User not found', 404, { request });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });
    if (!dbUser) {
      return errorResponse(
        `User record with clerkid ${clerkId} not found in prisma (POST)`,
        404,
        { request }
      );
    }

    const requestBody = (await request.json()) as DealCreateSchema;
    let dealData: DealCreateSchema;
    try {
      dealData = zDealCreateSchema.parse(requestBody);
    } catch (parseError) {
      console.error('ERROR: unable to parse POST body:\n', parseError);
      return errorResponse('zDealCreateSchema Input data malformatted', 400, {
        request,
      });
    }

    // only create a deal if the user is the owner of the organization
    if (dealData.organizationId) {
      const org = await prisma.organization.findFirst({
        where: { id: dealData.organizationId, ownerId: dbUser.id },
      });
      if (!org) {
        return errorResponse(
          `Deal cannot be created. User is not the owner of the organization`,
          403,
          { request }
        );
      }
    }

    if (!dealData.organizationId) {
      // use the default organization:
      const userOrg = await prisma.organization.findFirst({
        where: { ownerId: dbUser.id },
      });
      if (userOrg) {
        dealData.organizationId = userOrg.id;
      } else
        return errorResponse(
          `Deal cannot be created. No Owner Org was found for the User w ID ${dbUser.id}`,
          500,
          { request }
        );
    }

    const deal = await createDealForUser(dealData, dbUser);

    return jsonResponse(deal, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }
}

/**
 * Update a deal in the DB, and also trigger a deal update in hubspot
 * @param request
 * @returns updated Deal
 */
export async function PUT(request: NextRequest) {
  try {
    const requestBody = (await request.json()) as DealUpdateSchema;
    // parse the date strings into Date objects for zod to validate
    if (requestBody.closingDate) {
      requestBody.closingDate = new Date(
        Date.parse(requestBody.closingDate.toString())
      );
    }

    let deal: DealUpdateSchema;
    try {
      deal = zDealUpdateSchema.parse(requestBody);
    } catch (error) {
      return errorResponse('Input data malformatted', 400, {
        request,
        extra: { error },
      });
    }

    // also update the deal in hubspot:
    const updatedDeal = await updateDeal(deal, true);

    return jsonResponse(updatedDeal);
  } catch (error) {
    return errorResponse(
      `Error updating deal: ${getErrorMessage(error)}`,
      500,
      {
        request,
        extra: { error },
      }
    );
  }
}

/**
 * Delete in-progress deal by setting its dealstage to Lost)
 * @param request
 * @returns
 */
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const dealId = Number(body.dealId);

  if (!dealId || isNaN(dealId)) {
    return errorResponse('Invalid deal ID', 400, { request });
  }

  const { userId: clerkId, sessionClaims } = getAuth(request);
  if (!clerkId) {
    return errorResponse('User not authenticated', 401, { request });
  }

  const dbUserId = sessionClaims?.metadata?.investorPortalId;
  if (!dbUserId) {
    return errorResponse('investorPortalId not found in getAuth()', 404);
  }

  const deal = await prisma.deal.findUnique({
    where: { id: dealId, dealStage: { lt: DealStage.CLOSED } },
    include: { organization: true },
  });

  if (!deal) {
    return errorResponse('Deal not found', 404, {
      request: request,
      extra: { method: 'prisma.deal.findUnique' },
    });
  }

  // Verify user owns the organization
  const isOwner = await prisma.organization.findFirst({
    where: { id: deal.organizationId, ownerId: dbUserId },
  });

  if (!isOwner) {
    return errorResponse('Unauthorized to cancel this deal', 403, {
      request: request,
      extra: { method: 'prisma.organization.findUnique' },
    });
  }

  await prisma.deal.update({
    where: { id: dealId },
    data: { dealStage: DealStage.CLOSED_LOST, status: DealStatus.LOST },
  });

  return jsonResponse({ message: 'Deal cancelled' });
}
