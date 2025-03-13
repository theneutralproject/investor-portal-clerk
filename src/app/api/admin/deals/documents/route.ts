import {
  createDocumentEntry,
  getAdminFromRequest,
} from '@/libs/admin/utils.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import type { NextRequest } from 'next/server';
import { zPdfBulkUploadSchema } from '@/libs/document/schema';
import { storageClient } from '@/libs/supabase';
import {
  type DealDocument,
  DealDocumentType,
  type Prisma,
  User,
} from '@prisma/client';
import prisma from '@/libs/prisma.server';
import Logger from '@/libs/logger';

/**
 * Get dealdocs with download URL by dealId
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

  let dealId: number | null = null;
  let includeTaxDocuments: string | null = null;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    dealId = parseInt(queryParams.get('dealId') ?? '');
    includeTaxDocuments = queryParams.get('includeTaxDocuments') ?? null;
  } catch (error) {
    console.error('unable to read query params:', getErrorMessage(error));
    return jsonResponse(getErrorMessage(error), 500);
  }

  if (!dealId) {
    return jsonResponse('dealId is required', 400);
  }
  try {
    const where: Prisma.DealDocumentWhereInput = {
      dealId: dealId,
    };
    if (includeTaxDocuments !== 'true') {
      where.type = { not: DealDocumentType.K1 };
    }

    const dealDocs = await prisma.dealDocument.findMany({
      where,
    });

    interface docWithUrl extends DealDocument {
      downloadUrl: string;
    }

    const fullDocsPromise = dealDocs.map(async doc => {
      const fullDoc = doc as docWithUrl;
      const storageRes = await storageClient
        .from('deal-documents')
        .createSignedUrl(doc.path, 60 * 60 * 24);
      fullDoc.downloadUrl = storageRes.data?.signedUrl ?? '';
      return fullDoc;
    });
    return Promise.all(fullDocsPromise)
      .then(fullDocs => {
        return jsonResponse(fullDocs);
      })
      .catch(error => {
        console.error('unable to get deal documents:', getErrorMessage(error));
        return jsonResponse(getErrorMessage(error), 500);
      });
  } catch (error) {
    console.error('unable to get deal documents:', getErrorMessage(error));
    return jsonResponse(getErrorMessage(error), 500);
  }
}

/**
 * Admin can upload up to 10 PDFs at a time
 * @param request formData with PdfDocumentCreateSchema
 * @returns
 */
export async function POST(request: NextRequest) {
  let adminUser: User | null = null;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let dealId: number | null = null;
  let queryTaxYear: string | null = null;
  let queryDocumentType: string | null = null;
  let taxYear: number | undefined = undefined;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    dealId = parseInt(queryParams.get('dealId') ?? '');
    queryDocumentType = queryParams.get('documentType') ?? null;
    queryTaxYear = queryParams.get('taxYear') ?? null;
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, { request });
  }

  if (!dealId) {
    return errorResponse('dealId query param is required', 400, { request });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const parsedFiles = zPdfBulkUploadSchema.parse(files);
    let documentType: DealDocumentType = DealDocumentType.INVESTMENT_DOCUMENT;
    if (queryDocumentType) documentType = queryDocumentType as DealDocumentType;
    if (documentType === DealDocumentType.K1) {
      if (!queryTaxYear) {
        return errorResponse(
          'taxYear query param is required for K1 documentType',
          400,
          { request }
        );
      }
      taxYear = parseInt(queryTaxYear);
    }

    for (const file of parsedFiles) {
      if (file instanceof File) {
        const { name, type } = file;
        const { data, error } = await storageClient
          .from('deal-documents')
          .upload(`deal-${dealId}/${name}`, file, { contentType: type });

        if (error) {
          console.error(`unable to upload file ${name}:`);
          console.error(error);
          return errorResponse(`unable to upload file: ${error.message}`, 500, {
            request,
            extra: { error },
          });
        }

        try {
          await createDocumentEntry(
            'deal',
            dealId,
            name,
            data.path,
            '',
            adminUser.id,
            documentType,
            taxYear
          );
        } catch (error) {
          console.error(
            'unable to createDocumentEntry:',
            getErrorMessage(error)
          );
          return errorResponse(getErrorMessage(error), 500, {
            request,
            extra: { error },
          });
        }
      } else {
        Logger.log({ message: 'file is not instance of File' }, request);
        return jsonResponse('invalid file', 400);
      }
    }
    return jsonResponse({
      message: `${parsedFiles.length} files uploaded successfully`,
    });
  } catch (error) {
    console.error('unable to read files:', getErrorMessage(error));
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }
}

/**
 * Delete a deal document by fileId
 * @param request
 * @returns
 */
export async function DELETE(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let fileId: number | null = null;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    fileId = parseInt(queryParams.get('fileId') ?? '');
  } catch (error) {
    console.error('unable to read query params:', getErrorMessage(error));
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }
  if (!fileId) {
    return errorResponse('fileId is required', 400, { request });
  }

  try {
    const res = await prisma.dealDocument.delete({
      where: {
        id: fileId,
      },
    });
    await storageClient.from('deal-documents').remove([`${res.path}`]);

    return jsonResponse(res);
  } catch (error) {
    return errorResponse('unable to get Deal Documents', 500, {
      request,
      extra: { error },
    });
  }
}
