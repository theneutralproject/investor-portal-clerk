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

/**
 * GET /api/admin/advisor-firms
 *
 * Fetch all advisor firms from the system.
 * Only accessible by admin users.
 *
 * @param request - Next.js API request
 * @returns A list of advisor firms
 */
export async function GET(request: NextRequest) {
  let adminUser;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.warn('Unauthorized request: admin not found', request);
    return errorResponse(getErrorMessage(error), 401, { request });
  }

  try {
    const advisorFirms = await prisma.advisorFirm.findMany({
      include: {
        employees: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        clientOrganizations: true,
      },
    });

    Logger.log(
      {
        message: `Admin ${adminUser.email} fetched ${advisorFirms.length} advisor firms`,
        extra: { userId: adminUser.id },
      },
      request
    );

    return jsonResponse(advisorFirms);
  } catch (error) {
    return errorResponse('Failed to fetch advisor firms', 500, {
      request,
      extra: { error },
    });
  }
}
