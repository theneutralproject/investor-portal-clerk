import {
  createDocumentEntry,
  getAdminFromRequest,
  matchDealWithPdf,
} from '@/libs/admin/utils.server';
import { zPdfAdminBulkUploadSchema } from '@/libs/document/schema';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { isError } from 'lodash';
import type { NextRequest } from 'next/server';
import type { MatchResponseObject } from '@/libs/admin/schema';
import prisma from '@/libs/prisma.server';
import { storageClient } from '@/libs/supabase';
import type { DealWithFullOrgAndSlimProject } from '@/libs/types';
import { DealDocumentType, DealStatus, Prisma, User } from '@prisma/client';
import { DealStage } from '@/libs/deal/schema';
import Logger from '@/libs/logger';

/**
 * Admin can upload up to 20 PDFs at a time
 * @param request formData with PdfDocumentCreateSchema
 * @returns
 */
export async function POST(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let taxYear: number | null = null;
  let projectSlug: string | null = null;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    taxYear = parseInt(queryParams.get('taxYear') ?? '-1');
    projectSlug = queryParams.get('projectSlug') ?? null;
  } catch (error) {
    return errorResponse('unable to read query params', 500, {
      request,
      extra: { error },
    });
  }

  if (!taxYear || taxYear < 2018) {
    return errorResponse(
      'taxYear query param is required and must be 2018 or later',
      400,
      { request }
    );
  }

  let pdfFiles: FormDataEntryValue[] = [];
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    pdfFiles = zPdfAdminBulkUploadSchema.parse(files);
    const { data, error } = await storageClient
      .from(`deal-documents`)
      .list('tempPdfStorage');
    if (isError(error)) {
      Logger.warn(getErrorMessage(error), request);
    }
    if (data?.length) {
      console.log('Deleting all files in tempPdfStorage folder');
      const deleteResult = await storageClient
        .from(`deal-documents`)
        .remove(data.map(file => `tempPdfStorage/${file.name}`));
      if (deleteResult.error) {
        return errorResponse('Could not delete temp files from storage', 500, {
          request,
          extra: { error: deleteResult.error },
        });
      }
    }
  } catch (error) {
    return errorResponse('unable to read form data', 500, {
      request,
      extra: { error },
    });
  }

  let deals: DealWithFullOrgAndSlimProject[] = [];

  let whereQuery: Prisma.DealWhereInput = {
    dealStage: DealStage.CLOSED,
    closingDate: { lt: new Date(`${taxYear + 1}-01-01`) },
    status: DealStatus.ACTIVE,
  };

  if (projectSlug) {
    if (!['519', 'bakers', 'edison'].includes(projectSlug)) {
      return errorResponse(`Invalid projectSlug: ${projectSlug}`, 400, {
        request,
      });
    }
    whereQuery = {
      ...whereQuery,
      project: { slug: projectSlug },
    };
  }

  try {
    // get all closed deals
    deals = await prisma.deal.findMany({
      where: whereQuery,
      include: {
        organization: {
          include: {
            members: { include: { user: { include: { address: true } } } },
            address: true,
          },
        },
        project: true,
      },
    });
  } catch (error) {
    return errorResponse('Unable to fetch deals', 500, {
      request,
      extra: { error },
    });
  }

  try {
    const retArr = [] as MatchResponseObject[];
    const matchPromises = pdfFiles.map(async file => {
      if (file instanceof File) {
        const { name, type } = file;
        console.log(`Uploading ${name} to temp storage`);
        const { error } = await storageClient
          .from(`deal-documents`)
          .upload(`tempPdfStorage/${name}`, file, { contentType: type });
        if (error) {
          return errorResponse('unable to upload file to temp storage', 500, {
            request,
            extra: { error },
          });
        }

        // match the files to the correct deal
        const match = await matchDealWithPdf(deals, file);
        retArr.push(match);
      } else {
        return errorResponse('file is not instance of File', 400, {
          request,
          extra: { file },
        });
      }
    });
    await Promise.all(matchPromises);
    return jsonResponse(retArr);
  } catch (err) {
    return errorResponse(getErrorMessage(err), 500, {
      request,
      extra: { error: err },
    });
  }
}

/**
 * Store PDF matched with deal
 * @param request
 * @returns
 */
export async function PUT(request: NextRequest) {
  let adminUser: User | null = null;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  const requestBody = (await request.json()) as {
    dealId: number;
    pdfName: string;
    taxYear: number;
  };
  const { dealId, pdfName, taxYear } = requestBody;
  if (!dealId) {
    return errorResponse('Missing required dealId', 400, { request });
  }
  if (!pdfName) {
    return errorResponse('Missing required pdfName', 400, { request });
  }
  if (!taxYear) {
    return errorResponse('Missing required taxYear', 400, { request });
  }
  const newPath = `deal-${dealId}/${pdfName}`;
  const { error } = await storageClient
    .from(`deal-documents`)
    .move(`tempPdfStorage/${pdfName}`, newPath);
  if (error) {
    return errorResponse(
      `unable to move file from temp storage to deal ${dealId}: ${error.name} - ${error.message}`,
      500,
      {
        request,
        extra: {
          name: error.name,
          message: error.message,
          cause: error.cause,
          stack: error.stack,
          from: `tempPdfStorage/${pdfName}`,
          to: newPath,
        },
      }
    );
  }
  try {
    const newDocEntry = await createDocumentEntry(
      'deal',
      dealId,
      pdfName,
      newPath,
      '',
      adminUser.id,
      DealDocumentType.K1,
      taxYear
    );

    return jsonResponse({
      success: true,
      document: newDocEntry,
    });
  } catch (error) {
    return errorResponse(
      `Error processing upload: ${getErrorMessage(error)}`,
      500,
      {
        request,
        extra: { error: getErrorMessage(error) },
      }
    );
  }
}
