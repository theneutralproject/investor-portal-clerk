'use server';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  uploadFile,
  getFileDetails,
  createDocumentEntry,
} from '@/libs/admin/utils.server';
import { zPdfDocumentCreateSchema } from '@/libs/document/schema';
import prisma from '@/libs/prisma.server';
import type { UserWithOrganizations } from '@/libs/types';
import {
  jsonResponse,
  errorResponse,
  getErrorMessage,
} from '@/libs/utils.server';
import Logger from '@/libs/logger';

async function validateUser(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    throw new Error('User not found');
  }

  const dbUser = (await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { organizationsOwned: true },
  })) as UserWithOrganizations;

  if (!dbUser) {
    throw new Error(`User record with clerkid ${userId} not found in prisma`);
  }

  return dbUser;
}

async function validateAccess(
  dbUser: UserWithOrganizations,
  type: string,
  id: number
) {
  if (type === 'deal') {
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      throw new Error('Deal not found');
    }
    if (
      !dbUser.organizationsOwned.some(org => org.id === deal.organizationId)
    ) {
      throw new Error(
        'You are not the owner of the organization that the deal belongs to'
      );
    }
  } else {
    if (!dbUser.organizationsOwned.some(org => org.id === id)) {
      throw new Error(
        'You are not the owner of the organization you are trying to upload a document for'
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const dbUser = await validateUser(request);
    const formData = await request.formData();

    console.log('Received form data:', {
      keys: Array.from(formData.keys()),
      type: formData.get('type'),
      organizationId: formData.get('organizationId'),
      dealId: formData.get('dealId'),
      key: formData.get('key'),
      hasFile: formData.has('file'),
      dealDocumentType: formData.get('dealDocumentType'),
    });

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

    await validateAccess(dbUser, type, id);
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
  } catch (error) {
    Logger.error('Error uploading document:', request, { error });

    if (error instanceof z.ZodError) {
      return jsonResponse(
        { error: 'Invalid data format', details: error.errors },
        400
      );
    }
    return errorResponse(getErrorMessage(error), 500);
  }
}
