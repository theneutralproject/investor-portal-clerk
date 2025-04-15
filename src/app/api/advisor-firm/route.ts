'use server';

import prisma from '@/libs/prisma.server';
import { getAuth } from '@clerk/nextjs/server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { NextRequest } from 'next/server';
import { Role } from '@prisma/client';
import Logger from '@/libs/logger';
import {
  AdvisorFirmCreateSchema,
  zAdvisorFirmCreateSchema,
} from '@/libs/advisorFirm/schema';

export async function POST(request: NextRequest) {
  const { userId: clerkId, sessionClaims } = getAuth(request);
  if (!clerkId) {
    return errorResponse('User not authenticated', 401, { request });
  }

  const clerkPortalId = sessionClaims?.metadata?.investorPortalId;

  const dbUser = await prisma.user.findFirst({
    where: {
      OR: [{ id: clerkPortalId }, { clerkId }],
    },
  });

  if (!dbUser) {
    return errorResponse('User not found', 404, {
      request,
    });
  }

  // TODO: Handle roles from clerk
  // const role = sessionClaims?.metadata?.role;

  if (dbUser.role !== Role.ADMIN) {
    return errorResponse(
      'Unauthorized: Only admins can create advisor firms',
      403,
      { request }
    );
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
