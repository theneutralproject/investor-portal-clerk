import { getAdminFromRequest } from '@/libs/admin/utils';
import prisma from '@/libs/prisma.server';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils';
import { isError } from 'lodash';
import type { NextRequest } from 'next/server';
import {
  DealDocumentType,
  type DealFinancingType,
  type Prisma,
} from '@prisma/client';

/**
 * can filter by email, projectSlug, minDealstage (default = 5), maxDealstage (default = 5), includeTaxDocument (default = false)
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    console.error(getErrorMessage(adminUser));
    return errorResponse(getErrorMessage(adminUser), 401, {
      request,
      extra: {
        log: 'failed at GET admin/deals -> getAdminFromRequest',
      },
    });
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
        log: 'failed at GET admin/deals -> URL',
      },
    });
  }

  // return all deals if includeTaxDocument is true
  if (documentType.toLowerCase() === 'tax') {
    const allDeals = await prisma.deal.findMany({
      where: {
        dealStage: { gte: minDealstage, lte: maxDealstage ?? 5 },
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
              log: 'failed at GET admin/deals -> prisma.project.findFirst',
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
              log: 'failed at GET admin/deals -> ownerOrgIds.length',
            },
          }
        );
      }
    }

    const where: Prisma.DealWhereInput = {
      dealStage: { gte: minDealstage, lte: maxDealstage ?? 5 },
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

    const deals = await prisma.deal.findMany({
      where: where,
      include: {
        organization: { include: { ownedBy: true } },
        investmentStats: true,
        document: {
          where: { type: DealDocumentType.INVESTMENT_DOCUMENT },
          include: { uploadedBy: true },
        },
      },
    });
    return jsonResponse(deals);
  }
}

/**
 * create a new deal
 * @param request
 */
export async function POST(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    console.error(getErrorMessage(adminUser));
    return errorResponse(getErrorMessage(adminUser), 401, {
      request,
      extra: {
        log: 'failed at POST admin/deals -> getAdminFromRequest',
      },
    });
  }

  // let postData: Prisma.DealCreateInput;
  // try {
  //   const requestBody = (await request.json()) as Prisma.DealCreateInput;
  //   postData = requestBody;
  // } catch (parseError) {
  //   console.error(
  //     'ERROR: unable to parse deals POST body:\n',
  //     getErrorMessage(parseError)
  //   );
  //   return errorResponse(getErrorMessage(parseError), 400);
  // }

  // try {
  //   const newDeal = await prisma.deal.create({ data: postData });
  //   return jsonResponse(newDeal);
  // } catch (error) {
  //   console.error('unable to create deal:', getErrorMessage(error));
  //   return errorResponse(getErrorMessage(error), 500);
  // }
}
