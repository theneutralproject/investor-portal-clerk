import prisma from '@/libs/prisma';
import { jsonResponse } from '@/libs/utils';
import { DealFinancingType } from '@prisma/client';
import { type NextRequest } from 'next/server';


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
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { investmentStats: true, milestones: true }
    });

    if (!project || !project.investmentStats || !project.milestones) {
        return jsonResponse({ message: 'Project and stats not found' }, 404);
    }

    // debt financing
    if (financingType === DealFinancingType.promissory_note_now) {
        const closingDate = project.milestones.financialClosing;
        console.log("closingDate", closingDate);
        const interestRate = amount >= project.investmentStats.interestRateDollarThreshold ? project.investmentStats.interestRateMax : project.investmentStats.interestRateMin;
        // let lastDate = new Date(closingDate);
        const debtPayoutSchedule = []
        for (let i = 0; i < project.investmentStats.debtTermMonths / 4 ; i++) {
            console.log("i", i);
            const date = new Date(closingDate.setMonth(closingDate.getMonth() + i * 3));
            console.log("date", date);  
            const distributionAmount = (amount * interestRate/100) / 4;
            const multiple = Math.round(distributionAmount / amount * (i+1)*10000) / 10000;
            debtPayoutSchedule.push({ date, distributionAmount, multiple });
        }

        return jsonResponse(debtPayoutSchedule);
    }
    return jsonResponse({ message: 'Financing type not supported' }, 400);

} 
