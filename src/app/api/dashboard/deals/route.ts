'use server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { DealStatus, Role } from '@prisma/client';
import { DealStage } from '@/libs/deal/schema';

// get deals by logged in user
export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    console.log('User not authenticated');
    return errorResponse('User not authenticated', 401);
  }

  // Get the user from the database
  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!dbUser) {
    return errorResponse('User not found in database', 404, {
      request,
      extra: { method: 'prisma.user.findUnique' },
    });
  }

  if (dbUser.role === Role.ADVISOR) {
    return jsonResponse([]);
  }

  try {
    // Get all organizations where user is a member
    const userOrgs = await prisma.organization.findMany({
      where: { members: { some: { userId: dbUser.id } } },
    });

    // Get all deals for those organizations
    const deals = await prisma.deal.findMany({
      where: {
        organizationId: { in: userOrgs.map(org => org.id) },
        dealStage: { lt: DealStage.CLOSED_LOST }, //Ignore lost deals
        status: DealStatus.ACTIVE, //Ignore Converted, Deleted and Future Conversion deals
      },
      include: {
        organization: true,
        project: { include: { pictures: true } },
        investmentStats: true,
        startDealConversion: true,
        endDealConversion: true,
      },
    });

    const filteredDeals = deals.filter(deal =>
      userOrgs.some(
        org => org.id === deal.organizationId && org.ownerId === dbUser.id
      )
    );

    return jsonResponse(filteredDeals);
  } catch (error) {
    return errorResponse('Error fetching dashboard deals', 500, {
      request,
      extra: { error },
    });
  }
}
