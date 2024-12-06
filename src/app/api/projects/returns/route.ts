'use server';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils';
import { DealFinancingType } from '@prisma/client';
import { type NextRequest } from 'next/server';
import { getDebtPayoutScheduleForProject, getEquityPayoutScheduleForProject, getEquityStatsFromProject } from '@/libs/project/utils';

type RequestBody = {
    projectId: number;
    amount: number;
    financingType: DealFinancingType;
    closingDate?: Date;
};
export async function POST(request: NextRequest) {
    const { projectId, amount, financingType, closingDate } = (await request.json()) as RequestBody;

    if (!projectId || !amount || !financingType) {
        return jsonResponse({ message: 'Missing required fields' }, 400);
    }
    const projectResponse = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            investmentStats: true, milestones: true
        }
    });
    if (!projectResponse) {
        return jsonResponse({ message: 'Project not found' }, 404);
    }
    const { investmentStats, milestones, ...project } = projectResponse;
    if (!investmentStats) {
        return jsonResponse({ message: 'Project investment stats not found' }, 404);
    }
    if (!milestones) {
        return jsonResponse({ message: 'Project milestones not found' }, 404);
    }
    if (!project.equityReturnsFile) {
        return jsonResponse({ message: 'Project equity returns file not found' }, 404);
    }

    // for closed deals, use the closing date as the start date. Otherwise, use today's date, if the project already officially closed
    let startDate = milestones.financialClosing;
    if (closingDate) startDate = closingDate;
    else {
        if (startDate < new Date()) {
            startDate = new Date();
        }
    }

    // debt financing
    if (financingType === DealFinancingType.promissory_note_now) {
        if (amount < investmentStats.debtMinInvestment) {
            return jsonResponse({ message: `The minimum investment amount for this project is $${investmentStats.debtMinInvestment.toLocaleString()}` }, 400);
        }
        const payoutSchedule = getDebtPayoutScheduleForProject(amount, investmentStats, startDate);
        return jsonResponse(payoutSchedule);
    }

    // equity financing
    if (financingType === DealFinancingType.equity) {
        try {
            const equityDetails = await getEquityStatsFromProject(amount, project.equityReturnsFile, investmentStats.cUnitThresholdAmount);
            const { unitType, shareOfEquity, equityMilestones } = equityDetails;
            const equityPayoutSchedule = getEquityPayoutScheduleForProject(amount, milestones, equityMilestones, shareOfEquity, unitType, investmentStats.preferredReturn);
            return jsonResponse(equityPayoutSchedule);
        } catch (e) {
            console.error(
                `Failed to get equity stats for project ${project.name}:`
            );
            console.error(e);
            return errorResponse('Failed to get equity stats', 500);
        }
    }
    return jsonResponse({ message: 'Financing type not supported' }, 400);
} 
