import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { zPdfAdminBulkUploadSchema } from '@/libs/document/schema';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { storageClient } from '@/libs/supabase';
import {
  getErrorMessage,
  jsonResponse,
  errorResponse,
} from '@/libs/utils.server';
import { ActivityType, ProjectReport } from '@prisma/client';
import { isNumber } from 'lodash';
import { NextRequest } from 'next/server';

const PROJECT_REPORTS_BUCKET = 'project-reports';

function countDigits(number: number): number {
  return Math.abs(number).toString().length;
}

async function createActivityFeedItems(
  project: { id: number; name: string },
  report: ProjectReport
) {
  // for each investor in the project, create an activity feed item
  const projectDeals = await prisma.deal.findMany({
    where: { projectId: project.id },
    include: {
      organization: {
        include: {
          members: true,
        },
      },
    },
  });

  // for each unique user, create an activity feed item
  const uniqueUserIds = [
    ...new Set(
      projectDeals.flatMap(deal =>
        deal.organization.members.map(member => member.userId)
      )
    ),
  ];
  try {
    const createMany = await prisma.activityFeedItem.createMany({
      data: uniqueUserIds.map(userId => ({
        userId,
        header: 'New Quarterly Investor Report Available',
        body: `The Q${report.quarter}-${report.year} Quarterly Report is available for your ${project.name} investment`,
        type: ActivityType.INVESTOR_REPORT,
        dateCreated: report.dateCreated,
        link: '/documents/investor',
        itemId: report.id,
      })),
      skipDuplicates: true,
    });
    return createMany;
  } catch (error) {
    throw error;
  }
}

// upload quarterly reports for a specific project
export async function POST(request: NextRequest) {
  console.log('POST /api/admin/projects/:projectId/reports');
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }
  let projectSlug: string | null = null;
  let quarter: number;
  let year: number;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    projectSlug = queryParams.get('projectSlug') ?? null;
    quarter = parseInt(queryParams.get('quarter') ?? '');
    year = parseInt(queryParams.get('year') ?? '');
    if (!projectSlug) {
      throw new Error('projectSlug is required in query');
    }
    if (!quarter || !isNumber(quarter) || countDigits(quarter) > 1) {
      throw new Error('quarter is required in query');
    }
    if (!year || !isNumber(year) || countDigits(year) !== 4) {
      throw new Error('year is required in query');
    }
  } catch (error) {
    return errorResponse(getErrorMessage(error), 400, { request });
  }

  const project = await prisma.project.findUnique({
    where: { slug: projectSlug },
    select: { id: true, slug: true, name: true },
  });

  if (!project) {
    return errorResponse(`project with slug ${projectSlug} not found`, 404, {
      request,
    });
  }
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const parsedFiles = zPdfAdminBulkUploadSchema.parse(files);
    console.log('parsedFiles:', parsedFiles.length);
    // only one report file is uploaded at a time
    const file = parsedFiles[0];
    if (!file) {
      return errorResponse('No file uploaded', 400, { request });
    }
    if (!(file instanceof File)) {
      return errorResponse('Invalid file type', 400, { request });
    }
    const { name } = file;
    const path = `${projectSlug}/year-${year}/quarter-${quarter}/${name}`;
    // upload file to storage
    const { error } = await storageClient
      .from(PROJECT_REPORTS_BUCKET)
      .upload(path, file);
    if (error) {
      console.error('File upload error:', error.message, error.cause);
      return errorResponse(error.message, 500, { request });
    }
    try {
      // create prisma document entry
      const newReport = await prisma.projectReport.create({
        data: {
          projectId: project.id,
          quarter,
          year,
          path,
        },
      });
      const activityCreateResult = await createActivityFeedItems(
        project,
        newReport
      );
      return jsonResponse(
        { newReport, numActivityFeedItems: activityCreateResult.count },
        201
      );
    } catch (reportError) {
      console.error(
        'Error creating projectReport:',
        getErrorMessage(reportError)
      );
      return errorResponse(getErrorMessage(reportError), 500, { request });
    }
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, { request });
  }
}
