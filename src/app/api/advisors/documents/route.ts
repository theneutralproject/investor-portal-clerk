'use server';

import { getAuth } from '@clerk/nextjs/server';
import { Role, DealDocumentType } from '@prisma/client';
import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { getSupabaseDownloadUrl } from '@/libs/supabase';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
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

  try {
    const orgs = await prisma.organization.findMany({
      where: {
        advisorFirmId: advisorFirm.advisorFirmId,
      },
      include: {
        deals: {
          include: {
            document: true,
            project: true,
          },
        },
      },
    });

    const deals = orgs.flatMap(org => org.deals);
    const projectIds = [...new Set(deals.map(deal => deal.projectId))];

    const projectReports = await prisma.projectReport.findMany({
      where: { projectId: { in: projectIds } },
      include: { project: true },
    });

    const documents: Array<{
      id: number;
      name: string;
      type: DealDocumentType;
      projectName: string | null;
      dealId?: number;
      projectId?: number;
      dateCreated: Date;
      downloadUrl: string;
    }> = [];

    for (const report of projectReports) {
      const downloadUrl = await getSupabaseDownloadUrl(
        report.path,
        'project-reports'
      );
      documents.push({
        id: report.id,
        name: report.name,
        type: DealDocumentType.REPORT,
        projectName: report.project?.name ?? null,
        projectId: report.projectId,
        dateCreated: report.dateCreated,
        downloadUrl,
      });
    }

    for (const deal of deals) {
      for (const doc of deal.document) {
        const downloadUrl = await getSupabaseDownloadUrl(
          doc.path,
          'deal-documents'
        );
        documents.push({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          projectName: deal.project?.name ?? null,
          dealId: doc.dealId,
          dateCreated: doc.dateCreated,
          downloadUrl,
        });
      }
    }

    return jsonResponse({ documents });
  } catch (error) {
    Logger.error('Error fetching advisor documents', request, { extra: error });
    return errorResponse('Error fetching documents', 500, {
      request,
      extra: { error },
    });
  }
}
