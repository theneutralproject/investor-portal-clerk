'use server';

import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { NextRequest } from 'next/server';
import Logger from '@/libs/logger';
import {
  AdvisorFirmCreateSchema,
  zAdvisorFirmCreateSchema,
} from '@/libs/advisorFirm/schema';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { APIError } from '@/libs/types';

export async function POST(request: NextRequest) {
  let dbUser;
  try {
    dbUser = await getAdminFromRequest(request);
  } catch (error) {
    const apiError: APIError = error as APIError;
    Logger.log({ message: getErrorMessage(error) }, request);
    return errorResponse(getErrorMessage(error), apiError.status || 500, {
      request,
    });
  }

  let data: AdvisorFirmCreateSchema;
  const body = await request.json();

  Logger.log(
    {
      message: `User '${dbUser.email}' with id: '${dbUser.id}' is attempting to create new advisor firm`,
      extra: body,
    },
    request
  );

  try {
    data = zAdvisorFirmCreateSchema.parse(body);
  } catch (error) {
    return errorResponse('Invalid request body', 400, {
      request,
      extra: {
        error,
      },
    });
  }

  try {
    const newFirm = await prisma.advisorFirm.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl,
      },
    });

    return jsonResponse(newFirm);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, { request });
  }
}
