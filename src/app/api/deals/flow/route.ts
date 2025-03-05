import { type NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { z } from 'zod';
import type { DealFinancingType, Organization } from '@prisma/client';
import prisma from '@/libs/prisma.server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const QuerySchema = z.object({
  projectSlug: z.string().min(1),
  dealId: z.string().optional(),
});

async function fetchProjectDocuments(
  projectId: number,
  financingType: DealFinancingType | null,
  userId: number,
  dealId: number
) {
  const documents = await prisma.projectDocument.findMany({
    where: {
      projectId: projectId,
      ...(financingType
        ? {
            OR: [
              { financingTypes: { has: financingType } },
              { financingTypes: { equals: [] } },
            ],
          }
        : { financingTypes: { equals: [] } }),
      documentType: 'DOCUSIGN',
    },
  });

  const dealDocusignEvents = await prisma.docusignEvent.findMany({
    where: { userId, dealId },
  });
  const results = documents.map(doc => ({
    ...doc,
    completed:
      dealDocusignEvents.find(
        event => event.templateId === doc.docusignTemplateId
      )?.investorSignatureCompleted ?? false,
  }));

  return results;
}

async function fetchProject(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      investmentStats: true,
      propertyStats: true,
      milestones: true,
      pictures: true,
      projectPaymentInfo: true,
    },
  });
}

async function fetchDeal(id: number) {
  return prisma.deal.findUnique({
    where: { id },
    include: {
      investmentStats: true,
      organization: true,
      document: true,
      DocusignEvent: true,
    },
  });
}

async function checkUserAccess(
  _userId: number,
  _dealOrganization: Organization
) {
  return _dealOrganization.ownerId === _userId;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryResult = QuerySchema.safeParse(
      Object.fromEntries(url.searchParams)
    );

    if (!queryResult.success) {
      return errorResponse('Invalid query parameters', 400, { request });
    }

    const { projectSlug, dealId } = queryResult.data;

    const project = await fetchProject(projectSlug);
    if (!project) {
      return errorResponse(`Project ${projectSlug} not found`, 404, {
        request,
      });
    }

    // Return public project data if dealId is not provided or is "new"
    if (!dealId || dealId.toLowerCase() === 'new') {
      return jsonResponse({ project });
    }

    const { userId: clerkUserId } = getAuth(request);
    if (!clerkUserId) {
      return errorResponse('User not authenticated', 401);
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });
    if (!dbUser) {
      return errorResponse(
        `User w clerkId ${clerkUserId} not found in DB`,
        404,
        { request }
      );
    }

    const deal = await fetchDeal(parseInt(dealId, 10));
    if (!deal) {
      return errorResponse(`Deal with id ${dealId} not found`, 404, {
        request,
      });
    }

    if (deal.projectId !== project.id) {
      return errorResponse(
        'Deal does not belong to the specified project',
        403,
        { request }
      );
    }

    const hasAccess = await checkUserAccess(dbUser.id, deal.organization);
    if (!hasAccess) {
      return errorResponse('You do not have access to this deal', 403, {
        request,
      });
    }

    const docusignDocs = await fetchProjectDocuments(
      project.id,
      deal.investmentStats?.financingType ?? null,
      dbUser.id,
      deal.id
    );

    return jsonResponse({
      project: { ...project, documents: docusignDocs },
      deal,
    });
  } catch (error) {
    return errorResponse('Error in GET /api/deal', 500, {
      request,
      extra: { error },
    });
  }
}
