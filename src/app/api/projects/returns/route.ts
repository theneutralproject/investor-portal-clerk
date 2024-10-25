import prisma from '@/libs/prisma';
import { jsonResponse } from '@/libs/utils';
import { DealFinancingType } from '@prisma/client';
import { type NextRequest } from 'next/server';
import { getDebtPayoutSchedule, getEquityPayoutSchedule, getEquityStatsFromProject } from '@/libs/project/utils';
import { isError } from 'lodash';

type RequestBody = {
    projectId: number;
    amount: number;
    financingType: DealFinancingType;
};
export async function POST(request: NextRequest) {
    const { projectId, amount, financingType } = (await request.json()) as RequestBody;

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

    // debt financing
    if (financingType === DealFinancingType.promissory_note_now) {
        if (amount < investmentStats.debtMinInvestment) {
            return jsonResponse({ message: `The minimum investment amount for this project is $${investmentStats.debtMinInvestment.toLocaleString()}` }, 400);
        }
        return jsonResponse(getDebtPayoutSchedule(amount, investmentStats, milestones));
    }

    // equity financing
    if (financingType === DealFinancingType.equity) {
        const equityDetails = await getEquityStatsFromProject(amount, project.equityReturnsFile, investmentStats.cUnitThresholdAmount);
        if(isError(equityDetails)) {
            return jsonResponse({ message: equityDetails.message }, 400);
        }
        const { unitType, shareOfEquity, equityMilestones } = equityDetails;
        const equityPayoutSchedule = getEquityPayoutSchedule(amount, milestones, equityMilestones, shareOfEquity, unitType);
        return jsonResponse(equityPayoutSchedule);
    }
    return jsonResponse({ message: 'Financing type not supported' }, 400);
} 
