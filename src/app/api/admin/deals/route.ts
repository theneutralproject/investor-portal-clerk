import { getAdminFromRequest } from '@/libs/admin/utils.server';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import type { NextRequest } from 'next/server';
import {
  DealDocumentType,
  DealStatus,
  type DealFinancingType,
  type Prisma,
} from '@prisma/client';
import { DealCreateSchema, DealStage } from '@/libs/deal/schema';
import { createDealForUser } from '@/libs/deal/utils.server';
import Logger from '@/libs/logger';

/**
 * can filter by email, projectSlug, minDealstage (default = 5), maxDealstage (default = 5), includeTaxDocument (default = false)
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let email: string | undefined;
  let projectSlug: string | undefined;
  let minDealstage: number | undefined;
  let maxDealstage: number | undefined;
  let documentType = '';
  let amountStr: string | undefined;
  let closingYearStr: string | undefined;
  let financingTypeStr: string | undefined;

  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    email = queryParams.get('email') ?? undefined;
    projectSlug = queryParams.get('projectSlug') ?? undefined;
    minDealstage = parseInt(queryParams.get('minDealstage') ?? '5');
    maxDealstage = parseInt(queryParams.get('maxDealstage') ?? '5');
    documentType = queryParams.get('documentType') ?? '';
    amountStr = queryParams.get('amount') ?? undefined;
    closingYearStr = queryParams.get('closingYear') ?? undefined;
    financingTypeStr = queryParams.get('financingType') ?? undefined;
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: {
        method: 'URL',
      },
    });
  }

  // return all deals if includeTaxDocument is true
  if (documentType.toLowerCase() === 'tax') {
    const allDeals = await prisma.deal.findMany({
      where: {
        dealStage: {
          gte: minDealstage,
          lte: maxDealstage ?? DealStage.CLOSED,
        },
        status: DealStatus.ACTIVE,
      },
      include: {
        document: {
          where: { type: DealDocumentType.K1 },
          include: { uploadedBy: true },
        },
      },
    });

    return jsonResponse(allDeals);
  } else {
    let projectId: number | undefined;
    if (projectSlug) {
      const project = await prisma.project.findFirst({
        where: {
          slug: {
            contains: projectSlug,
            mode: 'insensitive',
          },
        },
      });

      if (!project) {
        return errorResponse(
          `Project with name containing ${projectSlug} not found`,
          404,
          {
            request,
            extra: {
              method: 'prisma.project.findFirst',
            },
          }
        );
      }
      projectId = project.id;
    }

    let ownerOrgIds: number[] = [];
    if (email) {
      const owners = await prisma.user.findMany({
        where: {
          email: {
            contains: email,
            mode: 'insensitive',
          },
        },
        include: { organizationsOwned: true },
      });

      ownerOrgIds = owners
        .map(owner => owner.organizationsOwned.map(org => org.id))
        .flat();
      if (!ownerOrgIds.length) {
        return errorResponse(
          `User with email containing ${email} not found`,
          404,
          {
            request,
            extra: {
              method: 'ownerOrgIds.length',
            },
          }
        );
      }
    }

    const where: Prisma.DealWhereInput = {
      dealStage: {
        gte: minDealstage,
        lte: maxDealstage ?? DealStage.CLOSED,
      },
      status: DealStatus.ACTIVE,
    };
    if (projectId) {
      where.projectId = projectId;
    }
    if (email) {
      where.organizationId = { in: ownerOrgIds };
    }

    if (closingYearStr) {
      const closingYear = parseInt(closingYearStr);
      where.closingDate = {
        gte: new Date(`${closingYear}-01-01`),
        lt: new Date(`${closingYear + 1}-01-01`),
      };
    }

    if (amountStr ?? financingTypeStr) {
      where.investmentStats = {};
      if (amountStr) {
        where.investmentStats.amount = parseInt(amountStr);
      }
      if (financingTypeStr) {
        where.investmentStats.financingType =
          financingTypeStr as DealFinancingType;
      }
    }
    try {
      const deals = await prisma.deal.findMany({
        where: where,
        include: {
          organization: {
            include: { ownedBy: { include: { address: true } }, address: true },
          },
          investmentStats: true,
          document: true,
          startDealConversion: true,
          endDealConversion: true,
        },
      });
      return jsonResponse(deals);
    } catch (error) {
      return errorResponse(getErrorMessage(error), 500, {
        request,
        extra: {
          method: 'prisma.deal.findMany',
        },
      });
    }
  }
}

/**
 * create a new deal
 * @param request
 */
export async function POST(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let postData: DealCreateSchema;
  try {
    const requestBody = (await request.json()) as DealCreateSchema;
    postData = requestBody;
    Logger.log(
      {
        message: 'Creating deal',
        extra: {
          requestBody,
        },
      },
      request
    );
  } catch (parseError) {
    return errorResponse('Input data malformatted', 400, {
      request,
      extra: {
        method: 'parseError',
        error: parseError,
      },
    });
  }

  if (!postData.amount)
    return errorResponse('amount is required', 400, {
      request,
      extra: {
        method: 'postData.amount',
      },
    });
  if (!postData.organizationId)
    return errorResponse('organizationId is required', 400, {
      request,
    });
  if (!postData.financingType)
    return errorResponse('financingType is required', 400, {
      request,
    });
  if (postData.dealStage === DealStage.CLOSED && !postData.closingDate)
    return errorResponse('closingDate is required', 400, {
      request,
    });
  postData.dealStage = postData.dealStage ?? DealStage.CLOSED;
  if (postData.dealStage === DealStage.CLOSED) {
    postData.dateFundsSent = postData.dateFundsSent ?? postData.closingDate;
    postData.signaturesCompletedDate =
      postData.signaturesCompletedDate ?? postData.closingDate;
  }

  const ownerOrg = await prisma.organization.findUnique({
    where: { id: postData.organizationId },
    include: { ownedBy: true },
  });

  if (!ownerOrg?.ownedBy)
    return errorResponse(
      `organization owner for org id ${postData.organizationId} not found`,
      404,
      {
        request,
        extra: {
          method: 'ownerOrg?.ownedBy',
        },
      }
    );

  try {
    const newDeal = await createDealForUser(postData, ownerOrg.ownedBy, true);
    return jsonResponse(newDeal);
  } catch (error) {
    return errorResponse('unable to create deal', 500, {
      request,
      extra: {
        method: 'createDealForUser',
        error,
      },
    });
  }
}
