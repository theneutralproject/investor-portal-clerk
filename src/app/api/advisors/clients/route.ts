'use server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { DealFinancingType, Role } from '@prisma/client';
import {
  AdvisorClientsResponse,
  AdvisorClientSummary,
} from '@/libs/advisorFirm/schema';

/**
 * GET /api/advisors/clients
 *
 * Fetches a paginated list of all advisor clients that belong to the advisor firm
 * associated with the currently authenticated advisor user.
 *
 * For each client organization, the response includes:
 * - client user info (id, name, email)
 * - organization info (id, name)
 * - investment KPIs (total invested, earnings to date, projected return, etc.)
 *
 * Authentication is required via Clerk. Only users with the `ADVISOR` role are allowed.
 *
 * Pagination is controlled via `page` and `limit` query parameters.
 *
 * @param {NextRequest} request - The incoming API request.
 * @returns {Promise<Response>} JSON response containing client summaries and pagination info.
 */
export async function GET(request: NextRequest) {
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
    message: `Advisor ${dbUser.email} is loading advisor firm clients`,
    extra: { advisorFirm },
  });

  // Pagination parameters
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') || '1');
  const limit = Number(url.searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  // Get client orgs from advisor firm
  const [orgs, total] = await Promise.all([
    prisma.organization.findMany({
      where: {
        advisorFirmId: advisorFirm.advisorFirmId,
      },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        ownedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        deals: {
          select: {
            investmentStats: {
              select: {
                amount: true,
                equityPreferredReturn: true,
                financingType: true,
              },
            },
          },
        },
      },
    }),
    prisma.organization.count({
      where: {
        advisorFirmId: advisorFirm.advisorFirmId,
      },
    }),
  ]);

  const clients: AdvisorClientSummary[] = orgs.map(org => {
    const deals = org.deals.map(d => d.investmentStats).filter(Boolean);
    const clientName = [org.ownedBy.firstName, org.ownedBy.lastName].join(' ');

    const totalInvested = deals.reduce(
      (sum, stat) => sum + (stat?.amount ?? 0),
      0
    );
    const earningsToDate = deals.reduce(
      (sum, stat) =>
        sum + (stat?.amount ?? 0) * (stat?.equityPreferredReturn ?? 0),
      0
    );
    const totalProjected = deals.reduce((sum, stat) => {
      const amt = stat?.amount ?? 0;
      const ret = stat?.equityPreferredReturn ?? 0;
      return sum + amt + amt * ret;
    }, 0);

    const dealTypes = [
      ...new Set(
        deals.map(d => d?.financingType as DealFinancingType).filter(Boolean)
      ),
    ];

    return {
      client: {
        id: org.ownedBy.id,
        name: clientName,
        email: org.ownedBy.email,
      },
      organization: {
        id: org.id,
        name: org.name,
      },
      totalInvested,
      numberOfInvestments: deals.length,
      dealTypes,
      earningsToDate,
      projectedEarnings: totalProjected - totalInvested,
      totalProjectedReturn: totalProjected,
    };
  });

  const response: AdvisorClientsResponse = {
    clients,
    pagination: {
      page,
      limit,
      total,
      hasMore: skip + clients.length < total,
    },
  };

  return jsonResponse(response);
}
