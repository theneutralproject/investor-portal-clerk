import { createDocumentEntry } from '@/libs/admin/utils.server';
import { zPdfDocumentNoFileCreateSchema } from '@/libs/document/schema';
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

  const newDocEntry = await createDocumentEntry(
    type,
    id,
    fileName,
    path || payload.path,
    key,
    dbUser.id,
    dealDocumentType
  );

  return jsonResponse({ success: true, document: newDocEntry });
}
