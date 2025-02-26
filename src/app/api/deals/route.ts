import prisma from '@/libs/prisma.server';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import {
  type DealCreateSchema,
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
    return errorResponse('Project slug is required', 400);
  }

  try {
    const { userId: clerkId, sessionClaims } = getAuth(request);
    if (!clerkId) {
      console.error('User not authenticated');
      return errorResponse('userId not found in getAuth()', 404);
    }
    let dbUserId = sessionClaims?.metadata?.investorPortalId;
    if (!dbUserId) {
      console.error('investorPortalId not found in getAuth()');
      // return errorResponse('investorPortalId not found in getAuth()', 404);
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkId },
      });
      dbUserId = dbUser?.id;
      if (!dbUserId) {
        return errorResponse('investorPortalId not found in getAuth()', 404);
      }
    }

    // Find the project based on the slug
    const project = await prisma.project.findUnique({
      where: { slug: slug },
    });

    if (!project) {
      return jsonResponse(
        { error: `Project with slug ${slug} not found` },
        404
      );
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
          deal.dealStage === 5 ||
          userOrgs.some(
            org => org.id === deal.organizationId && org.ownerId === dbUserId
          )
      )[0] ?? null
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(errorMessage);
    return jsonResponse({ error: 'Error fetching data: ' + errorMessage }, 500);
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
        return jsonResponse(
          {
            error: `Deal cannot be created. No Owner Org was found for the User w ID ${dbUser.id}`,
          },
          500
        );
    }

    const deal = await createDealForUser(dealData, dbUser);

    return jsonResponse(deal, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(getErrorMessage(error), 500, { request });
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
    console.log('PUT requestBody', requestBody);
    try {
      deal = zDealUpdateSchema.parse(requestBody);
    } catch (parseError) {
      console.error(
        'ERROR: unable to parse Deal PUT body:\n',
        getErrorMessage(parseError)
      );
      return jsonResponse({ error: 'Input data malformatted' }, 400);
    }

    // also update the deal in hubspot:
    const updatedDeal = await updateDeal(deal, true);

    return jsonResponse(updatedDeal);
  } catch (error) {
    console.error('Error updating deal:', error);
    return jsonResponse({ error: 'Error updating deal' }, 500);
  }
}

/**
 * Delete in-progress deal by setting it to dealstage 6)
 * @param request
 * @returns
 */
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const dealId = Number(body.dealId);

  if (!dealId || isNaN(dealId)) {
    return errorResponse('Invalid deal ID', 400, { request: req });
  }

  const { userId: clerkId, sessionClaims } = getAuth(req);
  if (!clerkId) {
    return errorResponse('User not authenticated', 401, { request: req });
  }

  const dbUserId = sessionClaims?.metadata?.investorPortalId;
  if (!dbUserId) {
    return errorResponse('investorPortalId not found in getAuth()', 404);
  }

  const deal = await prisma.deal.findUnique({
    where: { id: dealId, dealStage: { lt: 5 } },
    include: { organization: true },
  });

  if (!deal) {
    return errorResponse('Deal not found', 404, {
      request: req,
      extra: { method: 'prisma.deal.findUnique' },
    });
  }

  // Verify user owns the organization
  const isOwner = await prisma.organization.findFirst({
    where: { id: deal.organizationId, ownerId: dbUserId },
  });

  if (!isOwner) {
    return errorResponse('Unauthorized to cancel this deal', 403, {
      request: req,
      extra: { method: 'prisma.organization.findUnique' },
    });
  }

  await prisma.deal.update({ where: { id: dealId }, data: { dealStage: 6 } });

  return jsonResponse({ message: 'Deal cancelled' });
}
