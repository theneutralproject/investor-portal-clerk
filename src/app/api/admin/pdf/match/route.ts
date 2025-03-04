import {
  createDocumentEntry,
  getAdminFromRequest,
  matchDealWithPdf,
} from '@/libs/admin/utils.server';
import { zPdfBulkUploadSchema } from '@/libs/document/schema';
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
import { DealDocumentType, User } from '@prisma/client';
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
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    taxYear = parseInt(queryParams.get('taxYear') ?? '-1');
  } catch (error) {
    console.error('unable to read query params:', getErrorMessage(error));
    return jsonResponse(getErrorMessage(error), 500);
  }

  if (!taxYear || taxYear < 2018) {
    return jsonResponse(
      'taxYear query param is required and must be 2018 or later',
      400
    );
  }

  let pdfFiles: FormDataEntryValue[] = [];
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    pdfFiles = zPdfBulkUploadSchema.parse(files);
    const { data, error } = await storageClient
      .from(`deal-documents`)
      .list('tempPdfStorage');
    if (isError(error)) {
      console.error(getErrorMessage(error));
    }
    if (data?.length) {
      console.log('Deleting all files in tempPdfStorage folder');
      const deleteResult = await storageClient
        .from(`deal-documents`)
        .remove(data.map(file => `tempPdfStorage/${file.name}`));
      if (deleteResult.error) {
        console.error('COULD NOT DELETE:');
        console.error(getErrorMessage(deleteResult.error));
        return jsonResponse(
          { error: getErrorMessage(deleteResult.error) },
          500
        );
      }
    }
  } catch (error) {
    console.error('unable to read form data');
    return jsonResponse({ error: getErrorMessage(error) }, 500);
  }

  let deals: DealWithFullOrgAndSlimProject[] = [];
  try {
    // get all closed deals
    deals = await prisma.deal.findMany({
      where: {
        dealStage: DealStage.CLOSED,
        closingDate: { lt: new Date(`${taxYear + 1}-01-01`) },
      },
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
    console.error('unable to get deals from database');
    return jsonResponse({ error: getErrorMessage(error) }, 500);
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
          console.error(`unable to upload file ${name} to temp storage:`);
          console.error(error.message);
          console.error(error);
          return jsonResponse({ error: getErrorMessage(error) }, 500);
        }

        // match the files to the correct deal
        const match = await matchDealWithPdf(deals, file);
        retArr.push(match);
      } else {
        console.error('file is not instance of File');
        return jsonResponse({ error: 'file is not instance of File' }, 400);
      }
    });
    await Promise.all(matchPromises);
    return jsonResponse(retArr);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: getErrorMessage(err) }, 500);
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
    return errorResponse('Missing required dealId', 400);
  }
  const newPath = `deal-${dealId}/${pdfName}`;
  const { error } = await storageClient
    .from(`deal-documents`)
    .move(`tempPdfStorage/${pdfName}`, newPath);
  if (error) {
    console.error('unable to move file from temp storage to deal:');
    console.error(getErrorMessage(error));
    return jsonResponse({ error: getErrorMessage(error) }, 500);
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
    console.error('Error processing upload:', error);
    return errorResponse(getErrorMessage(error), 500);
  }
}
