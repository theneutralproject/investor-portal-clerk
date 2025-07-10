import { NextRequest } from 'next/server';
import { storageClient } from '@/libs/supabase';
import { User } from '@prisma/client';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { zPdfDocumentNoFileCreateSchema } from '@/libs/document/schema';
import { getAdminFromRequest } from '@/libs/admin/utils.server';

const STORAGE_URL = process.env.SUPABASE_STORAGE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

  const { type, organizationId, dealId, fileName } = validationResult.data;

  const id = type === 'deal' ? dealId : organizationId;
  if (!id) {
    return errorResponse(
      `${type === 'deal' ? 'Deal' : 'Organization'} ID is required`,
      400,
      { request }
    );
  }

  const folder = `${type}-${id}`;
  const bucketName = `${type}-documents`;

  const { data, error } = await storageClient
    .from(bucketName)
    .createSignedUploadUrl(`${folder}/${fileName}`);

  if (error) {
    return errorResponse(error.message, 500, { request });
  }

  return jsonResponse({
    t: SERVICE_KEY,
    u: STORAGE_URL,
    bucketName,
    fileName,
    uploadUrl: data.signedUrl,
    filePath: `${folder}/${fileName}`,
  });
}
