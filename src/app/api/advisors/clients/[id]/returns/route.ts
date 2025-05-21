import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { getPortfolioReturns } from '@/libs/returns/utils.server';
import type { DealWithInvestmentStatsAndProjectWithPics } from '@/libs/types';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { DealStatus } from '@prisma/client';
import { DealStage } from '@/libs/deal/schema';
import Logger from '@/libs/logger';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = await getAdvisorContext(request);

  if ('status' in context) return context;

  const { dbUser } = context;

  const rawOrganizationId = (await params).id;

  if (!rawOrganizationId) {
    return errorResponse('Must specify client ID', 400, {
      request,
      extra: { user: dbUser, organizationId: rawOrganizationId },
    });
  }
  const organizationId = parseInt(rawOrganizationId, 10);

  if (Number.isNaN(organizationId)) {
    return errorResponse('Client ID not valid', 400, {
      request,
      extra: { user: dbUser, organizationId: rawOrganizationId },
    });
  }

  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
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
      extra: { user: dbUser, organizationId, organization },
    });
  }

  if (!organization.ownedBy.clerkId) {
    return errorResponse("Organization's owner not found", 404, {
      request,
      extra: { user: dbUser, organizationId, organization },
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
