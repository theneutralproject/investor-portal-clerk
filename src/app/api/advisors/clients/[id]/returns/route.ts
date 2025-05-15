import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { getPortfolioReturns } from '@/libs/returns/utils.server';
import type { DealWithInvestmentStatsAndProjectWithPics } from '@/libs/types';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { DealStatus, Role } from '@prisma/client';
import { DealStage } from '@/libs/deal/schema';
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

  const rawClientId = (await params).id;

  if (!rawClientId) {
    return errorResponse('Must specify client ID', 400, {
      request,
      extra: { user: dbUser, clientId: rawClientId },
    });
  }
  const clientId = parseInt(rawClientId, 10);

  if (Number.isNaN(clientId)) {
    return errorResponse('Client ID not valid', 400, {
      request,
      extra: { user: dbUser, clientId: rawClientId },
    });
  }

  const organization = await prisma.organization.findFirst({
    where: {
      id: clientId,
    },
    select: {
      id: true,
      name: true,
      ownedBy: {
        select: {
          id: true,
          clerkId: true,
        },
      },
    },
  });

  if (!organization) {
    return errorResponse('Organization not found', 404, {
      request,
      extra: { user: dbUser, clientId, organization },
    });
  }

  if (!organization.ownedBy.clerkId) {
    return errorResponse("Organization's owner not found", 404, {
      request,
      extra: { user: dbUser, clientId, organization },
    });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: organization.ownedBy.clerkId },
    include: {
      organizationMember: {
        include: {
          organization: {
            include: {
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
          },
        },
      },
    },
  });
  if (!user) {
    return errorResponse('User not found in database', 404, { request });
  }
  const deals: DealWithInvestmentStatsAndProjectWithPics[] = [];
  // iterate through user organizations and get deals
  let equityFileLastUpdated: Date | null = null;
  for (const member of user.organizationMember) {
    const org = member.organization;
    for (const deal of org.deals) {
      if (
        deal.project?.equityMilestoneFiles &&
        deal.project.equityMilestoneFiles.length > 0
      ) {
        const latestFile = deal.project.equityMilestoneFiles[0];
        if (latestFile) {
          equityFileLastUpdated = latestFile.createdAt;
        }
      }
      if (!deal.investmentStats) {
        Logger.error(
          `Deal ${deal.id} has no investment stats and cannot be shown in user dashboard!`
        );
      }
      if (deal.investmentStats && deal.project) {
        deals.push(deal);
      }
    }
  }
  try {
    const portfolioReturns = await getPortfolioReturns(deals);
    return jsonResponse({
      ...portfolioReturns,
      equityFileLastUpdated,
    });
  } catch (error) {
    return errorResponse('unable to get portfolio returns', 500, {
      request,
      extra: { error },
    });
  }
}
