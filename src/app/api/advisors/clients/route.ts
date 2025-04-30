'use server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { DealFinancingType, DealStatus, Role } from '@prisma/client';

import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { getPortfolioReturns } from '@/libs/returns/utils.server';
import { DealStage } from '@/libs/deal/schema';
import { AdvisorClientsResponse } from '@/libs/advisorFirm/schema';

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
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  const page = Number(url.searchParams.get('page') || '1');
  const limit = Number(url.searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;
  const normalizedSearch = search?.toLowerCase();
  const financingTypeFilter = Object.values(DealFinancingType).find(
    type => type.toLowerCase() === normalizedSearch
  );

  const whereClause = {
    advisorFirmId: advisorFirm.advisorFirmId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        {
          ownedBy: {
            firstName: { contains: search, mode: 'insensitive' as const },
          },
        },
        {
          ownedBy: {
            lastName: { contains: search, mode: 'insensitive' as const },
          },
        },
        {
          ownedBy: {
            email: { contains: search, mode: 'insensitive' as const },
          },
        },
        ...(financingTypeFilter
          ? [
              {
                deals: {
                  some: {
                    investmentStats: {
                      is: {
                        financingType: financingTypeFilter,
                      },
                    },
                  },
                },
              },
            ]
          : []),
      ],
    }),
  };

  // Get client orgs from advisor firm
  const [orgs, total] = await Promise.all([
    prisma.organization.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        ownedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        deals: {
          where: {
            dealStage: DealStage.CLOSED,
            status: DealStatus.ACTIVE, //Ignore Converted, Deleted and Future Conversion deals
          },
          include: {
            startDealConversion: true,
            endDealConversion: true,
            investmentStats: true,
            project: {
              include: {
                milestones: true,
                pictures: true,
                equityMilestoneFiles: true,
                investmentStats: true,
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

  const clients = [];

  for (const org of orgs) {
    const deals = org.deals.filter(
      deal => deal.investmentStats && deal.project
    );

    const clientName = [org.ownedBy.firstName, org.ownedBy.lastName].join(' ');

    const { tableStats } = await getPortfolioReturns(deals);
    const totalInvested =
      tableStats.debt.principalInvested + tableStats.equity.principalInvested;
    const earningsToDate =
      tableStats.debt.earnedToDate + tableStats.equity.earnedToDate;
    const projectedEarnings =
      tableStats.debt.earningsProjected + tableStats.equity.earningsProjected;
    const totalProjectedReturn =
      tableStats.debt.projectedReturn + tableStats.equity.projectedReturn;

    const dealTypes = [
      ...new Set(
        deals
          .map(
            deal => deal?.investmentStats?.financingType as DealFinancingType
          )
          .filter(Boolean)
      ),
    ];

    clients.push({
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
      projectedEarnings,
      totalProjectedReturn,
    });
  }

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
