import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { Role } from '@prisma/client';

import prisma from '@/libs/prisma.server';
import type { OrganizationWithDealsAndStats } from '@/libs/types';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';

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

  const organizationDeals = await prisma.$queryRawUnsafe<
    OrganizationWithDealsAndStats[]
  >(
    `
    SELECT 
      o.id AS "organizationId",
      o.name AS "organizationName",
      u.id AS "userId",
      u."clerkId",
      d.id AS "dealId",
      d."closingDate",
      d.status,
      inv.id AS "investmentStatsId",
      inv.amount,
      inv."unitType",
      inv."financingType"
    FROM "Organization" o
    LEFT JOIN "User" u ON o."ownerId" = u.id
    LEFT JOIN "Deal" d ON d."organizationId" = o.id
    LEFT JOIN "DealInvestmentStats" inv ON inv."dealId" = d.id
    WHERE o.id = $1
  `,
    organizationId
  );

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
