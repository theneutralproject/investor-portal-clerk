import { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import {
  createDocumentEntry,
  getAdminFromRequest,
} from '@/libs/admin/utils.server';
import { zPdfDocumentNoFileCreateSchema } from '@/libs/document/schema';
import Logger from '@/libs/logger';
import {
  jsonResponse,
  errorResponse,
  getErrorMessage,
} from '@/libs/utils.server';

export async function POST(request: NextRequest) {
  let adminUser: User | null = null;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  if (!adminUser) {
    return errorResponse('admin user not found', 500, { request });
  }

  const payload = await request.json();
  const validationResult = zPdfDocumentNoFileCreateSchema.safeParse(payload);

  Logger.log({
    message: 'Logging payload',
    extra: payload,
  });

  if (!validationResult.success) {
    Logger.error('Validation errors:', request, {
      validationError: validationResult.error,
    });
    return jsonResponse(
      {
        error: 'Validation failed',
        details: validationResult.error.format(),
      },
      400
    );
  }

  const {
    type,
    organizationId,
    dealId,
    key,
    dealDocumentType,
    fileName,
    path,
  } = validationResult.data;

  Logger.log({
    message: 'Logging validationResult',
    extra: validationResult.data,
  });

  const id = type === 'deal' ? dealId : organizationId;
  if (!id) {
    return errorResponse(
      `${type === 'deal' ? 'Deal' : 'Organization'} ID is required`,
      400,
      { request }
    );
  }

  try {
    const newDocEntry = await createDocumentEntry(
      type,
      id,
      fileName,
      path || payload.path,
      key,
      adminUser.id,
      dealDocumentType,
      payload.taxYear
    );

    return jsonResponse({ success: true, document: newDocEntry });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return errorResponse(
      `An error has occurred while trying to store document metadata: ${errorMessage}`,
      500,
      {
        request,
        extra: { error, errorMessage },
      }
    );
  }
}
