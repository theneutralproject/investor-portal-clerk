import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { DealStage } from '@/libs/deal/schema';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { storageClient } from '@/libs/supabase';
import {
  getErrorMessage,
  jsonResponse,
  errorResponse,
} from '@/libs/utils.server';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';

/**
 * Get deals with documents
 */
export async function GET(request: NextRequest) {
  console.log('GET /api/admin/deals/documents');
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let projectSlug: string | null = null;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    projectSlug = queryParams.get('projectSlug') ?? null;
  } catch (error) {
    console.error('unable to read query params:', getErrorMessage(error));
    return jsonResponse(getErrorMessage(error), 500);
  }

  const where: Prisma.DealWhereInput = {
    dealStage: DealStage.CLOSED,
  };
  if (projectSlug) {
    where.project = {
      slug: projectSlug,
    };
  }
  try {
    const dealsWithDocs = await prisma.deal.findMany({
      where,
      include: {
        document: true,
      },
    });

    return jsonResponse(dealsWithDocs);
  } catch (error) {
    return errorResponse(
      `unable to get Deals: ${getErrorMessage(error)}`,
      500,
      {
        request,
        extra: { error: getErrorMessage(error) },
      }
    );
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
