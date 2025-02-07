import prisma from '@/libs/prisma.server';
import { currentUser } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import {
  type DealCreateSchema,
  type DealUpdateSchema,
  zDealCreateSchema,
  zDealUpdateSchema,
} from '../../../libs/deal/schema';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils';
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
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return jsonResponse({ error: 'User not found' }, 404);
    }
    console.log('clerkUser', clerkUser.id);
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    if (!dbUser) {
      console.error('Neutral user not found in api/deals');
      return jsonResponse(
        {
          error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
        },
        404
      );
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
      where: { members: { some: { userId: dbUser.id } } },
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
            org => org.id === deal.organizationId && org.ownerId === dbUser.id
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
    const user = await currentUser();
    if (!user) {
      return jsonResponse({ error: 'User not found' }, 404);
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!dbUser) {
      return jsonResponse(
        {
          error: `User record with clerkid ${user.id} not found in prisma (POST)`,
        },
        404
      );
    }

    const requestBody = (await request.json()) as DealCreateSchema;
    let dealData: DealCreateSchema;
    try {
      dealData = zDealCreateSchema.parse(requestBody);
    } catch (parseError) {
      console.error('ERROR: unable to parse POST body:\n', parseError);
      return jsonResponse({ error: 'Input data malformatted' }, 400);
    }

    // only create a deal if the user is the owner of the organization
    if (dealData.organizationId) {
      const org = await prisma.organization.findFirst({
        where: { id: dealData.organizationId, ownerId: dbUser.id },
      });
      if (!org) {
        return jsonResponse(
          {
            error: `Deal cannot be created. User is not the owner of the organization`,
          },
          403
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
    return jsonResponse({ error }, 500);
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
