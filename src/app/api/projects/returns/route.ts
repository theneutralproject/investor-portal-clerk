'use server';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { DealFinancingType } from '@prisma/client';
import { type NextRequest } from 'next/server';
import {
  getDebtPayoutScheduleForProject as getDebtPayoutScheduleAndStatsForProject,
  getEquityPayoutScheduleForProject as getEquityPayoutScheduleAndStatsForProject,
  getEquityStatsFromProject,
} from '@/libs/returns/utils.server';

type RequestBody = {
  projectId: number;
  amount: number;
  financingType: DealFinancingType;
  closingDate?: Date;
};
export async function POST(request: NextRequest) {
  const { projectId, amount, financingType, closingDate } =
    (await request.json()) as RequestBody;

  if (!projectId || !amount || !financingType) {
    return errorResponse('Missing required fields', 400, { request });
  }
  const projectResponse = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      investmentStats: true,
      milestones: true,
    },
  });
  if (!projectResponse) {
    return errorResponse('Project not found', 404, { request });
  }
  const { investmentStats, milestones, ...project } = projectResponse;
  if (!investmentStats) {
    return errorResponse('Project investment stats not found', 404, {
      request,
    });
  }
  if (!milestones) {
    return errorResponse('Project milestones not found', 404, { request });
  }
  if (!project.equityReturnsFile) {
    return errorResponse('Project equity returns file not found', 404, {
      request,
    });
  }

  // for closed deals, use the closing date as the start date. Otherwise, use today's date, if the project already officially closed
  let startDate = milestones.financialClosing;
  if (closingDate) startDate = closingDate;
  else {
    if (startDate < new Date()) {
      startDate = new Date();
    }
  }

  if (
    financingType !== DealFinancingType.equity &&
    financingType !== DealFinancingType.promissory_note_now
  ) {
    return errorResponse('Financing type not supported', 400, {
      request,
      extra: { financingType },
    });
  }

  // debt financing
  if (financingType === DealFinancingType.promissory_note_now) {
    if (amount < investmentStats.debtMinInvestment) {
      return errorResponse(
        `The minimum investment amount for this project is $${investmentStats.debtMinInvestment.toLocaleString()}`,
        400,
        { request, extra: { amount } }
      );
    }
    const payoutScheduleAndStats = getDebtPayoutScheduleAndStatsForProject(
      amount,
      investmentStats,
      startDate
    );
    return jsonResponse(payoutScheduleAndStats);
  }

  // equity financing
  if (financingType === DealFinancingType.equity) {
    try {
      const equityDetails = await getEquityStatsFromProject(
        amount,
        project.equityReturnsFile,
        investmentStats.cUnitThresholdAmount
      );
      const { unitType, shareOfEquity, equityMilestones } = equityDetails;
      const payoutScheduleAndStats = getEquityPayoutScheduleAndStatsForProject(
        amount,
        milestones,
        equityMilestones,
        shareOfEquity,
        unitType,
        investmentStats.equityPreferredReturn
      );
      return jsonResponse(payoutScheduleAndStats);
    } catch (error) {
      return errorResponse(
        `Failed to get equity stats for project ${project.name}`,
        500,
        { request, extra: { error } }
      );
    }
  }
}
