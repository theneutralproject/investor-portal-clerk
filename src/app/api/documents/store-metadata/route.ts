import {
  createDocumentEntry,
  getFileDetails,
  uploadFile,
} from '@/libs/admin/utils.server';
import { zPdfDocumentCreateSchema } from '@/libs/document/schema';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { UserWithOrganizations } from '@/libs/types';
import { jsonResponse, errorResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

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

  const { type, organizationId, dealId, file, key, dealDocumentType } =
    validationResult.data;

  const id = type === 'deal' ? dealId : organizationId;
  if (!id) {
    return errorResponse(
      `${type === 'deal' ? 'Deal' : 'Organization'} ID is required`,
      400,
      { request }
    );
  }

  const path = await uploadFile(file, type, id);

  const fileDetails = getFileDetails(file);
  const newDocEntry = await createDocumentEntry(
    type,
    id,
    fileDetails.name,
    path,
    key,
    dbUser.id,
    dealDocumentType
  );

  return jsonResponse({ success: true, document: newDocEntry });
}
