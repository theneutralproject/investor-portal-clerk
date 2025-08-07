import { NextRequest } from 'next/server';
import { User } from '@prisma/client';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { zDocumentSignedUrlCreateSchema } from '@/libs/document/schema';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import {
  createDocumentSignedUrl,
  getFolderName,
} from '@/libs/document/utils.server';
import { APIError } from '@/libs/types';

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
  const validationResult = zDocumentSignedUrlCreateSchema.safeParse(payload);

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

  const { entityId, entityType, fileName } = validationResult.data;

  try {
    const folder = await getFolderName(entityType, entityId);
    const data = await createDocumentSignedUrl(
      entityType,
      entityId,
      fileName,
      folder
    );

    return jsonResponse({
      t: SERVICE_KEY,
      u: STORAGE_URL,
      bucketName: data?.bucketName,
      fileName,
      uploadUrl: data?.signedUrl,
      filePath: `${data?.folder}/${fileName}`,
    });
  } catch (error) {
    return errorResponse(
      (error as Error).message,
      (error as APIError).status || 500,
      { request }
    );
  }
}
