import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { zAdvisorProjectPlatformCreateSchema } from '@/libs/advisorProjectPlatform/schema';
import { User } from '@prisma/client';

export async function POST(request: NextRequest) {
  let adminUser: User | null = null;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 401);
  }

  if (!adminUser) {
    return errorResponse('Restricted Access', 401, { request });
  }

  const body = await request.json();

  Logger.log(
    {
      message: `User '${adminUser.email}' with id: '${adminUser.id}' is attempting to create advisor project platform`,
      extra: body,
    },
    request
  );

  const { error, data, success } =
    zAdvisorProjectPlatformCreateSchema.safeParse(body);

  if (!success) {
    Logger.error('Validation errors:', request, {
      validationError: error,
    });
    return jsonResponse(
      {
        error: 'Validation failed',
        details: error.format(),
      },
      400
    );
  }

  try {
    const newEntry = await prisma.advisorProjectPlatform.create({
      data: {
        advisorId: data.advisorId,
        projectId: data.projectId,
        status: data.status,
        createdById: adminUser.id,
      },
    });

    return jsonResponse({ success: true, advisorProjectPlatform: newEntry });
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, { request });
  }
}

export async function GET(request: NextRequest) {
  let adminUser: User | null = null;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 401);
  }

  if (!adminUser) {
    return errorResponse('Restricted Access', 401, { request });
  }

  try {
    const platforms = await prisma.advisorProjectPlatform.findMany({
      include: {
        advisorFirm: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return jsonResponse({ success: true, data: platforms });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    Logger.error('Failed to fetch advisor project platforms', request, {
      error,
      errorMessage,
    });
    return errorResponse('Internal Server Error', 500, { request });
  }
}
