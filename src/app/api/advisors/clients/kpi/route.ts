'use server';
import { NextRequest } from 'next/server';
import { DealStatus } from '@prisma/client';

import prisma from '@/libs/prisma.server';
import { jsonResponse } from '@/libs/utils.server';
import { getPortfolioReturns } from '@/libs/returns/utils.server';
import { DealStage } from '@/libs/deal/schema';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';

/**
 * GET /api/advisors/clients/kpis
 *
 * Returns investment KPIs for all clients associated with the authenticated advisor's firm.
 *
 * The response includes:
 * - Total amount invested across all CLOSED and ACTIVE deals
 * - Total number of client organizations linked to the advisor firm
 *
 * Only deals with:
 * - status = ACTIVE
 * - dealStage = CLOSED
 * are included in the calculation.
 *
 * Authentication is required via Clerk. Only users with the `ADVISOR` role are authorized.
 *
 * @param {NextRequest} request - The incoming API request.
 * @returns {Promise<Response>} - A JSON response containing portfolio KPIs.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const context = await getAdvisorContext(request);

  if ('status' in context) return context;

  const { advisorFirmEmployee } = context;

  // Pagination parameters

  const whereClause = {
    advisorFirmId: advisorFirmEmployee.advisorFirmId,
  };

  // Get client orgs from advisor firm
  const [deals, total] = await Promise.all([
    prisma.deal.findMany({
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
    }),
    prisma.organization.count({
      where: whereClause,
    }),
  ]);

  const { tableStats } = await getPortfolioReturns(deals);

  const totalInvested =
    tableStats.debt.principalInvested + tableStats.equity.principalInvested;

  return jsonResponse({
    totalInvested,
    numberOfClients: total,
    debtPrincipalInvested: tableStats.debt.principalInvested,
    equityPrincipalInvested: tableStats.equity.principalInvested,
  });
}
