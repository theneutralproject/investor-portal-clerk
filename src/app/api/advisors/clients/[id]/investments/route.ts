import { NextRequest } from 'next/server';
import { DealStatus } from '@prisma/client';

import prisma from '@/libs/prisma.server';
import type { AdvisorClientInvestment } from '@/libs/types';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { DealStage } from '@/libs/deal/schema';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = await getAdvisorContext(request);

  if ('status' in context) return context;

  const { dbUser } = context;

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
                  project: {
                    select: {
                      id: true,
                      name: true,
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

  const organizationDeals: AdvisorClientInvestment[] = [];

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
          ownershipType: org.organization.ownershipType,
          projectName: deal.project.name,
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
