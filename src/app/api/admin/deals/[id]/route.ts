import { getAdminFromRequest } from '@/libs/admin/utils.server';
import {
  getSigningOrder,
  instantiateApiClientFromUserAndDeal,
} from '@/libs/docusign/utils.server';
import prisma from '@/libs/prisma.server';
import { getPortfolioReturns } from '@/libs/returns/utils.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { isError, isNumber } from 'lodash';
import { NextRequest } from 'next/server';

/**
 * Get a deal's detailed information
 * @param request
 * @returns deal loaded returns, documents, signing order, and other information
 */
export async function GET(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    console.error(getErrorMessage(adminUser));
    return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
  }

  let dealId: number;
  try {
    const url = new URL(request.url);
    dealId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!dealId || !isNumber(dealId)) {
      throw new Error('dealId is required in url');
    }
  } catch (__error) {
    return jsonResponse({ error: `dealId is required in url` }, 400);
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
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
      organization: {
        include: { members: { include: { user: true } } },
      },
      DocusignEvent: true,
    },
  });
  if (!deal) {
    return errorResponse(`Deal id ${dealId} not found`, 404);
  }

  try {
    const returns = await getPortfolioReturns([deal]);
    let signingOrders: Awaited<ReturnType<typeof getSigningOrder>>[] = [];
    // if deal is not closed, get signing order
    if (deal.dealStage < 5) {
      const dealOwner = deal.organization.members.find(
        member => member.type === 'OWNER'
      )?.user;
      if (!dealOwner) {
        return errorResponse(
          `Deal with id ${dealId} does not have an owner`,
          404
        );
      }
      const arrSigningOrder = deal.DocusignEvent?.map(async event => {
        const envelopesApi = await instantiateApiClientFromUserAndDeal(
          deal,
          dealOwner?.email,
          deal.project.slug,
          event.envelopeId
        );
        return await getSigningOrder(envelopesApi, event.envelopeId);
      });

      // get signing order for all deal envelopes (nested array of signer details)
      signingOrders = await Promise.all(arrSigningOrder);
    }
    const { organization, project, investmentStats, ...dealData } = deal;

    return jsonResponse({
      deal: dealData,
      returns,
      investmentStats,
      signingOrders,
      organization,
      project,
    });
  } catch (error) {
    console.error(`unable to get portfolio returns: ${error}`);
    return errorResponse(getErrorMessage(error), 500);
  }
}
