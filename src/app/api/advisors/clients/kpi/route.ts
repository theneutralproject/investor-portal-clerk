'use server';
import { NextRequest } from 'next/server';
import { DealStatus } from '@prisma/client';

import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
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

  const kpis = await prisma.$queryRaw<
    { number_of_clients: number; total_invested: number }[]
  >`SELECT
    CAST((
      SELECT COUNT(*)
      FROM "Organization" o
      WHERE o."advisorFirmId" = ${advisorFirmEmployee.advisorFirmId}
    ) AS INTEGER) AS number_of_clients,
    CAST((
      SELECT COALESCE(SUM(dis.amount), 0)
      FROM "Deal" d
      JOIN "Organization" o ON o.id = d."organizationId"
      JOIN "DealInvestmentStats" dis ON dis."dealId" = d.id
      JOIN "Project" p ON p.id = d."projectId"
      WHERE o."advisorFirmId" = ${advisorFirmEmployee.advisorFirmId}
        AND d."dealStage" = ${DealStage.CLOSED}
        AND d.status = ${DealStatus.ACTIVE}::"DealStatus"
    ) AS INTEGER) AS total_invested`;

  if (!kpis.length)
    return errorResponse('There are no deals assigned to this advisor', 404, {
      request,
      extra: {
        kpis,
        advisorFirmEmployee,
      },
    });

  const totalInvested = Number(kpis[0]?.total_invested);
  const numberOfClients = Number(kpis[0]?.number_of_clients);

  return jsonResponse({
    totalInvested,
    numberOfClients,
  });
}
