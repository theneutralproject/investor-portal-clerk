import prisma from '@/libs/prisma.server';
import { getSupabaseDownloadUrl } from '@/libs/supabase';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { DealDocumentType } from '@prisma/client';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
/**
 *
 * @param request Get documents for a deal
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
      include: { organizationMember: true },
    });

    if (!neutralUser) {
      return errorResponse('User not found in database', 404, { request });
    }

    const organizationIds = neutralUser.organizationMember.map(
      om => om.organizationId
    );

    const dealsWithDocuments = await prisma.deal.findMany({
      where: {
        organizationId: { in: organizationIds },
        dealStage: 5,
      },
      include: {
        document: true,
        project: true,
      },
    });

    if (!dealsWithDocuments) {
      return jsonResponse({ taxDocuments: [], investmentDocuments: [] });
    }

    const uniqueProjectIds = [
      ...new Set(dealsWithDocuments.map(deal => deal.projectId)),
    ];

    const projectReports = await prisma.projectReport.findMany({
      where: { projectId: { in: uniqueProjectIds } },
      include: { project: true },
    });

    const taxDocuments = [];
    const investmentDocuments = [];
    for (const report of projectReports) {
      const downloadUrl = await getSupabaseDownloadUrl(
        report.path,
        'project-reports'
      );
      const reportWithProjectName = {
        ...report,
        projectName: report.project?.name,
        downloadUrl,
        type: DealDocumentType.REPORT,
      };
      investmentDocuments.push(reportWithProjectName);
    }

    for (const deal of dealsWithDocuments) {
      for (const doc of deal.document) {
        const downloadUrl = await getSupabaseDownloadUrl(
          doc.path,
          'deal-documents'
        );
        const documentWithProjectName = {
          ...doc,
          projectName: deal.project?.name,
          downloadUrl,
        };
        if (doc.type === DealDocumentType.K1) {
          taxDocuments.push(documentWithProjectName);
        } else if (
          doc.type === DealDocumentType.INVESTMENT_DOCUMENT ||
          doc.type === DealDocumentType.REPORT
        ) {
          investmentDocuments.push(documentWithProjectName);
        }
      }
    }

    // Sort taxDocuments by taxYear descending, if taxYear exists
    taxDocuments.sort((a, b) => {
      // If both have taxYear, sort descending
      if (a.taxYear && b.taxYear) {
        return b.taxYear - a.taxYear;
      }
      // If only one has taxYear, that one comes first
      if (a.taxYear && !b.taxYear) return -1;
      if (!a.taxYear && b.taxYear) return 1;
      // Otherwise, keep original order
      return 0;
    });

    return jsonResponse({ taxDocuments, investmentDocuments });
  } catch (error) {
    return errorResponse('Error fetching deal documents', 500, {
      request,
      extra: { error },
    });
  }
}
