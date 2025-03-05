import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { DealStage, DealUpdateSchema } from '@/libs/deal/schema';
import { updateDeal } from '@/libs/deal/utils.server';
import {
  getSigningOrder,
  instantiateApiClientFromUserAndDeal,
} from '@/libs/docusign/utils.server';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { OrganizationWithFullMembers } from '@/libs/types';
// import { getPortfolioReturns } from '@/libs/returns/utils.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import {
  Deal,
  DealInvestmentStats,
  DocusignEvent,
  Project,
} from '@prisma/client';
import { isNumber } from 'lodash';
import { NextRequest } from 'next/server';

async function getDetailedDealStats(
  deal: Deal,
  investmentStats: DealInvestmentStats | null,
  organization: OrganizationWithFullMembers,
  dealDocusignEvents: DocusignEvent[],
  project: Project,
  request: NextRequest
) {
  // const returns = await getPortfolioReturns([deal]);
  let signingOrders: Awaited<ReturnType<typeof getSigningOrder>>[] = [];
  // if deal is not closed, get signing order
  if (deal.dealStage < DealStage.CLOSED) {
    const dealOwner = organization.members.find(
      member => member.type === 'OWNER'
    )?.user;
    if (!dealOwner) {
      return errorResponse(
        `Deal with id ${deal.id} does not have an owner`,
        404,
        { request }
      );
    }
    const arrSigningOrder = dealDocusignEvents.map(async event => {
      const envelopesApi = await instantiateApiClientFromUserAndDeal(
        deal,
        dealOwner?.email,
        project.slug,
        event.envelopeId
      );
      return await getSigningOrder(envelopesApi, event.envelopeId);
    });

    // get signing order for all deal envelopes (nested array of signer details)
    signingOrders = await Promise.all(arrSigningOrder);
  }
  return {
    deal,
    investmentStats,
    signingOrders,
    organization,
    project,
  };
}

/**
 * Get a deal's detailed information
 * @param request
 * @returns deal loaded returns, documents, signing order, and other information
 */
export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let dealId: number;
  try {
    const url = new URL(request.url);
    console.log(url.pathname.split('/'));
    dealId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!dealId || !isNumber(dealId)) {
      throw new Error('dealId is required in url');
    }
  } catch (__error) {
    return errorResponse(`dealId is required in url`, 400, { request });
  }

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: {
      investmentStats: true,
      project: {
        include: {
          investmentStats: true,
          milestones: true,
          pictures: true,
        },
      },
      organization: {
        include: { members: { include: { user: true } } },
      },
      DocusignEvent: true,
    },
  });
  if (!deal) {
    return errorResponse(`Deal id ${dealId} not found`, 404, { request });
  }
  try {
    const retData = await getDetailedDealStats(
      deal,
      deal.investmentStats,
      deal.organization,
      deal.DocusignEvent,
      deal.project,
      request
    );
    return jsonResponse(retData);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let dealId: number;
  try {
    const url = new URL(request.url);
    console.log(url.pathname.split('/'));
    dealId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!dealId || !isNumber(dealId)) {
      throw new Error('dealId is required in url');
    }
  } catch (__error) {
    return errorResponse(`dealId is required in url`, 400, { request });
  }

  let putData: DealUpdateSchema;
  try {
    const requestBody = (await request.json()) as DealUpdateSchema;
    putData = requestBody;
  } catch (parseError) {
    console.error(parseError);
    return errorResponse('Input data malformatted', 400, {
      request,
      extra: { error: parseError, method: 'parseError' },
    });
  }
  try {
    await updateDeal(putData, true, true);
  } catch (error) {
    return errorResponse('unable to updateDeal', 500, {
      request,
      extra: { error, method: 'updateDeal' },
    });
  }

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: {
      investmentStats: true,
      project: {
        include: {
          investmentStats: true,
          milestones: true,
          pictures: true,
        },
      },
      organization: {
        include: { members: { include: { user: true } } },
      },
      DocusignEvent: true,
    },
  });
  if (!deal) {
    return errorResponse(`Deal id ${dealId} not found`, 404, { request });
  }
  try {
    const retData = await getDetailedDealStats(
      deal,
      deal.investmentStats,
      deal.organization,
      deal.DocusignEvent,
      deal.project,
      request
    );
    return jsonResponse(retData);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }
}
