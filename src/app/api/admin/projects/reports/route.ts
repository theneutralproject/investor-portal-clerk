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
import { isNumber } from 'lodash';
import { NextRequest } from 'next/server';

const PROJECT_REPORTS_BUCKET = 'project-reports';

function countDigits(number: number): number {
  return Math.abs(number).toString().length;
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
    select: { id: true },
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

    // only one file is uploaded at a time
    const file = parsedFiles[0];
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
      return errorResponse(getErrorMessage(error), 500, { request });
    }

    // create prisma document entry
    const newReport = await prisma.projectReport.create({
      data: {
        projectId: project.id,
        quarter,
        year,
        path,
      },
    });
    return jsonResponse(newReport, 201);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, { request });
  }
}
