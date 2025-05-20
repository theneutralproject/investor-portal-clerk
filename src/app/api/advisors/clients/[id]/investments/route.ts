import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { DealStatus, Role } from '@prisma/client';

import prisma from '@/libs/prisma.server';
import type { OrganizationWithDealsAndStats } from '@/libs/types';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { DealStage } from '@/libs/deal/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: clerkId, sessionClaims } = getAuth(request);

  if (!clerkId) {
    Logger.warn('User not authenticated');
    return errorResponse('User not authenticated', 401);
  }

  const userId = sessionClaims?.metadata?.investorPortalId;

  if (!userId) {
    return errorResponse('User not found', 404, {
      request,
      extra: { method: 'sessionClaims?.metadata?.investorPortalId' },
    });
  }

  const dbUser = await prisma.user.findFirst({
    where: { OR: [{ clerkId }, { id: userId }] },
  });

  if (!dbUser || dbUser.role !== Role.ADVISOR) {
    return errorResponse('Unauthorized or not found', 403, {
      request,
      extra: { user: dbUser },
    });
  }

  const advisorFirm = await prisma.advisorFirmEmployee.findFirst({
    where: { userId: dbUser.id },
    select: { advisorFirmId: true },
  });

  if (!advisorFirm) {
    return errorResponse('User is not assigned to an advisor firm', 400, {
      request,
      extra: { user: dbUser },
    });
  }

  Logger.log({
    message: `Advisor ${dbUser.email} is loading firm documents`,
    extra: { advisorFirm },
  });

  const rawOrganizationId = (await params).id;

  if (!rawOrganizationId) {
    return errorResponse('Must specify organization ID', 400, {
      request,
      extra: { user: dbUser, organizationId: rawOrganizationId },
    });
  }
  const organizationId = parseInt(rawOrganizationId, 10);

  if (Number.isNaN(organizationId)) {
    return errorResponse('Organization ID not valid', 400, {
      request,
      extra: { user: dbUser, organizationId: rawOrganizationId },
    });
  }

  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
    },
  });

  if (!organization) {
    return errorResponse('Organization not found', 404, {
      request,
      extra: { user: dbUser, organizationId, organization },
    });
  }

  const userWithDeals = await prisma.user.findFirst({
    where: { id: organization.ownerId },
    include: {
      organizationMember: {
        include: {
          organization: {
            include: {
              deals: {
                where: {
                  dealStage: DealStage.CLOSED,
                  status: DealStatus.ACTIVE,
                },
                select: {
                  id: true,
                  closingDate: true,
                  status: true,
                  investmentStats: {
                    select: {
                      id: true,
                      amount: true,
                      unitType: true,
                      financingType: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const organizationDeals: OrganizationWithDealsAndStats[] = [];

  if (!userWithDeals?.organizationMember.length) {
    return errorResponse('Organization not found', 404, {
      request,
      extra: {
        user: dbUser,
        organizationId,
        member: userWithDeals?.organizationMember,
      },
    });
  }

  for (const org of userWithDeals?.organizationMember) {
    const { deals } = org.organization;
    if (deals.length) {
      for (const deal of deals) {
        organizationDeals.push({
          organizationId: org.organization.id,
          organizationName: org.organization.name,
          userId: userWithDeals.id,
          clerkId: userWithDeals.clerkId,
          dealId: deal.id,
          closingDate: deal.closingDate,
          status: deal.status,
          investmentStatsId: deal.investmentStats?.id ?? null,
          amount: deal.investmentStats?.amount ?? null,
          unitType: deal.investmentStats?.unitType ?? null,
          financingType: deal.investmentStats?.financingType ?? null,
        });
      }
    }
  }

  if (!organizationDeals || !organizationDeals.length) {
    return errorResponse('Organization deals not found', 404, {
      request,
      extra: { user: dbUser, organizationId, organizationDeals },
    });
  }

  return jsonResponse({
    deals: organizationDeals,
  });
}
