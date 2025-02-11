import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { currentUser } from '@clerk/nextjs';
import { NextRequest } from 'next/server';

// get deals by logged in user
export async function GET(request: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.log('User not authenticated');
    return errorResponse('User not authenticated', 401);
  }

  Logger.log(
    {
      extra: {
        user: { clerkUserId: clerkUser.id, email: clerkUser.emailAddresses[0] },
      },
    },
    request
  );

  // Get the user from the database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) {
    return errorResponse('User not found in database', 404, {
      request,
      extra: {
        method: 'prisma.user.findUnique',
      },
    });
  }

  // Get all organizations where user is a member
  const userOrgs = await prisma.organization.findMany({
    where: { members: { some: { userId: dbUser.id } } },
  });

  // Get all deals for those organizations
  const deals = await prisma.deal.findMany({
    where: {
      organizationId: { in: userOrgs.map(org => org.id) },
      dealStage: { lte: 5 }, //Ignore lost deals
    },
    include: {
      organization: true,
      project: {
        include: {
          pictures: true,
        },
      },
      investmentStats: true,
    },
  });

  const filteredDeals = deals.filter(deal =>
    userOrgs.some(
      org => org.id === deal.organizationId && org.ownerId === dbUser.id
    )
  );

  return jsonResponse(filteredDeals);
}
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const dealId = Number(body.dealId);
  Logger.log({ extra: body }, req);

  if (!dealId || isNaN(dealId)) {
    return errorResponse('Invalid deal ID', 400, {
      request: req,
    });
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return errorResponse('User not authenticated', 401, {
      request: req,
    });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) {
    return errorResponse('User not found in database', 404, {
      request: req,
      extra: {
        method: 'prisma.user.findUnique',
      },
    });
  }

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { organization: true },
  });

  if (!deal) {
    return errorResponse('Deal not found', 404, {
      request: req,
      extra: {
        method: 'prisma.deal.findUnique',
      },
    });
  }

  // Verify user owns the organization
  const isOwner = await prisma.organization.findFirst({
    where: {
      id: deal.organizationId,
      ownerId: dbUser.id,
    },
  });

  if (!isOwner) {
    return errorResponse('Unauthorized to cancel this deal', 403, {
      request: req,
      extra: {
        method: 'prisma.organization.findUnique',
      },
    });
  }

  await prisma.deal.update({
    where: { id: dealId },
    data: {
      dealStage: 6,
    },
  });

  return jsonResponse({ message: 'Deal cancelled' });
}
