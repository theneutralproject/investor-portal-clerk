import { NextRequest } from 'next/server';
import { storageClient } from '@/libs/supabase';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/libs/prisma.server';
import { zPdfDocumentCreateSchema } from '@/libs/document/schema';
import { validateAccess } from '@/libs/document/utils.server';
import { UserWithOrganizations } from '@/libs/types';
import { getFileDetails } from '@/libs/admin/utils.server';

const STORAGE_URL = process.env.SUPABASE_STORAGE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return errorResponse('User not authenticated', 401, { request });
  }

  const dbUser = (await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { organizationsOwned: true },
  })) as UserWithOrganizations;
  if (!dbUser) {
    return errorResponse(`User record not found`, 404, { request });
  }

  const formData = await request.formData();
  const dataToValidate = {
    type: formData.get('type'),
    organizationId: formData.get('organizationId'),
    dealId: formData.get('dealId'),
    key: formData.get('key'),
    file: formData.get('file'),
    dealDocumentType: formData.get('dealDocumentType'),
  };

  const validationResult = zPdfDocumentCreateSchema.safeParse(dataToValidate);

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

  const { type, organizationId, dealId, file } = validationResult.data;

  const id = type === 'deal' ? dealId : organizationId;
  if (!id) {
    return errorResponse(
      `${type === 'deal' ? 'Deal' : 'Organization'} ID is required`,
      400,
      { request }
    );
  }

  await validateAccess(dbUser, type, id);

  const folder = `${type}-${id}`;
  const bucketName = `${type}-documents`;
  const fileDetails = getFileDetails(file);
  const fileName = fileDetails.name;

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
