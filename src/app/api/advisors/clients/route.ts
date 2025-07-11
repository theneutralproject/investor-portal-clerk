'use server';
import { NextRequest } from 'next/server';
import { DealFinancingType, DealStatus, Prisma } from '@prisma/client';

import prisma from '@/libs/prisma.server';
import { jsonResponse } from '@/libs/utils.server';
import { getPortfolioReturns } from '@/libs/returns/utils.server';
import { DealStage } from '@/libs/deal/schema';
import { AdvisorClientsResponse } from '@/libs/advisorFirm/schema';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';
import { DealWithInvestmentStats } from '@/libs/types';

/**
 * GET /api/advisors/clients
 *
 * Fetches a list of all advisor clients that belong to the advisor firm
 * associated with the currently authenticated advisor user.
 *
 * For each client organization, the response includes:
 * - client user info (id, name, email)
 * - organization info (id, name)
 * - investment KPIs (total invested, earnings to date, projected return, etc.)
 *
 * Authentication is required via Clerk. Only users with the `ADVISOR` role are allowed.
 *
 * @param {NextRequest} request - The incoming API request.
 * @returns {Promise<Response>} JSON response containing client summaries.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const context = await getAdvisorContext(request);

  if ('status' in context) return context;

  const { advisorFirmEmployee } = context;

  // Pagination parameters
  const url = new URL(request.url);
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  const normalizedSearch = search?.toLowerCase();

  let financingTypeFilter: DealFinancingType[] | null = null;

  if (normalizedSearch === 'debt') {
    financingTypeFilter = [
      DealFinancingType.promissory_note_now,
      DealFinancingType.promissory_to_equity,
      DealFinancingType.promissory_note_at_closing,
    ];
  } else if (
    Object.values(DealFinancingType).includes(
      normalizedSearch as DealFinancingType
    )
  ) {
    financingTypeFilter = [normalizedSearch as DealFinancingType];
  }

  const matchingUserIds: number[] = [];

  const whereClause: Prisma.OrganizationWhereInput = {
    advisorFirmId: advisorFirmEmployee.advisorFirmId,
    ...(financingTypeFilter && {
      deals: {
        some: {
          investmentStats: {
            is: {
              financingType: { in: financingTypeFilter },
            },
          },
        },
      },
    }),
    ...(matchingUserIds.length > 0 && {
      ownerId: { in: matchingUserIds },
    }),
  };

  // Get client orgs from advisor firm
  const allOrgs = await prisma.organization.findMany({
    where: whereClause,
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
          status: DealStatus.ACTIVE,
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
  });

  let filteredOrgs = allOrgs;

  if (search && !financingTypeFilter?.length) {
    filteredOrgs = allOrgs.filter(org => {
      const searchLower = search.toLowerCase();
      const fullName =
        `${org.ownedBy.firstName} ${org.ownedBy.lastName}`.toLowerCase();

      return (
        org.name?.toLowerCase().includes(searchLower) ||
        fullName.includes(searchLower) ||
        org.ownedBy.email?.toLowerCase().includes(searchLower)
      );
    });
  }

  const dealsByClient: Record<string, any> = filteredOrgs.reduce(
    (acc, org) => {
      const orgDeals = org.deals.filter(
        deal => deal.investmentStats && deal.project
      );
      const clientId = org.ownedBy.id;
      const clientName = [org.ownedBy.firstName, org.ownedBy.lastName].join(
        ' '
      );

      if (acc[clientId]) {
        acc[clientId] = {
          ...acc[clientId],
          deals: [...(acc[clientId].deals || []), ...orgDeals],
        };
      } else {
        acc[clientId] = {
          client: {
            id: clientId,
            name: clientName,
            email: org.ownedBy.email,
          },
          organization: {
            id: org.id,
            name: org.name,
          },
          deals: orgDeals,
        };
      }

      return acc;
    },
    {} as Record<string, any>
  );

  const investments = [];

  for (const clientId of Object.keys(dealsByClient)) {
    const { deals, client, organization } = dealsByClient[clientId];
    const { tableStats } = await getPortfolioReturns(deals);

    const totalInvested =
      tableStats.debt.principalInvested + tableStats.equity.principalInvested;
    const earningsToDate =
      tableStats.debt.earnedToDate + tableStats.equity.earnedToDate;
    const projectedEarnings =
      tableStats.debt.earningsProjected + tableStats.equity.earningsProjected;
    const totalProjectedReturn =
      tableStats.debt.projectedReturn + tableStats.equity.projectedReturn;

    const dealTypes: DealFinancingType[] = Array.from(
      new Set(
        deals
          .map(
            (deal: DealWithInvestmentStats) =>
              deal?.investmentStats?.financingType
          )
          .filter((ft: DealFinancingType): ft is DealFinancingType =>
            Boolean(ft)
          )
      )
    );

    investments.push({
      client,
      organization,
      totalInvested,
      numberOfInvestments: deals.length,
      dealTypes,
      earningsToDate,
      projectedEarnings,
      totalProjectedReturn,
    });
  }

  const response: AdvisorClientsResponse = {
    clients: investments,
  };

  return jsonResponse(response);
}
