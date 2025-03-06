import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { DealFinancingType, Prisma, type DocumentEvent } from '@prisma/client';
import { type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 *
 * @param request Get documents for a project
 * @returns
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return errorResponse('Clerk user not found', 404, { request });
    }

    const neutralUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!neutralUser) {
      return errorResponse('User not found in database', 404, { request });
    }

    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    const projectId = parseInt(queryParams.get('projectId') ?? '', 10);
    const dealStage = parseInt(queryParams.get('dealStage') ?? '', 10);
    const financingType = queryParams.get('financingType') ?? '';

    if (isNaN(projectId)) {
      return errorResponse('Invalid Project ID', 400, { request });
    }

    //If no financing type is provided, return all documents
    const where: Prisma.ProjectDocumentWhereInput = {
      projectId: projectId,
    };
    if (dealStage) where.dealStage = dealStage;
    if (financingType === '' || !financingType) {
      const documents = await prisma.projectDocument.findMany({
        where: where,
      });
      return new Response(JSON.stringify(documents), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isDealFinancingType = Object.values(DealFinancingType).includes(
      financingType as DealFinancingType
    );
    const documents = await prisma.projectDocument.findMany({
      where: {
        projectId: projectId,
        ...(dealStage ? { dealStage: dealStage } : {}),
        ...(isDealFinancingType
          ? {
              OR: [
                { financingTypes: { has: financingType as DealFinancingType } },
                { financingTypes: { equals: [] } },
              ],
            }
          : { financingTypes: { equals: [] } }),
      },
      include: {
        documentEvents: {
          where: { userId: neutralUser?.id },
        },
      },
    });

    const results = documents.map(doc => ({
      ...doc,
      completed: doc.documentEvents.some(
        (event: DocumentEvent) => event.documentId === doc.id
      ),
    }));

    results.sort((a, b) => {
      if (a.link.includes('youtube') && !b.link.includes('youtube')) return -1;
      if (!a.link.includes('youtube') && b.link.includes('youtube')) return 1;
      if (a.link.includes('docusign') && !b.link.includes('docusign')) return 1;
      if (!a.link.includes('docusign') && b.link.includes('docusign'))
        return -1;
      return 0;
    });

    return jsonResponse(results);
  } catch (error) {
    return errorResponse('Error fetching data', 500, {
      request,
      extra: { error },
    });
  }
}
