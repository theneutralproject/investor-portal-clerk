'use server';

import { getAdminFromRequest } from '@/libs/admin/utils.server';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import axios from 'axios';
import type { NextRequest } from 'next/server';

/**
 * Impersonates a user by generating a Clerk actor token.
 *
 * This endpoint is only accessible to authenticated admin users. It allows the
 * admin to impersonate another user by generating a short-lived actor token
 * using Clerk’s API.
 *
 * @param {NextRequest} request - The incoming HTTP request.
 * @param {Object} params - Route parameters object.
 * @param {Promise<{ id: string }>} params.params - A promise that resolves to an object containing the user ID to impersonate.
 * @returns {Promise<Response>} A JSON response containing the Clerk actor token or an error response.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userParamId = (await params).id;

  if (!userParamId || Number.isNaN(parseInt(userParamId, 10))) {
    return errorResponse('User id not valid', 404, { request });
  }

  const userId = parseInt(userParamId, 10);
  let adminUser;

  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    return errorResponse(
      `Failed to authenticate requesting user: ${getErrorMessage(error)}`,
      401,
      {
        extra: {
          error,
        },
        request,
      }
    );
  }

  const requestingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!requestingUser) {
    return errorResponse('Requesting user not found', 404, { request });
  }

  const clerkApiUrl = `https://api.clerk.com/v1/actor_tokens`;

  const response = await axios.post(
    clerkApiUrl,
    {
      user_id: requestingUser.clerkId,
      expires_in_seconds: 3600,
      actor: {
        sub: adminUser.clerkId,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  Logger.log(
    {
      message: `Requesting user #${adminUser.id} (clerkId: ${adminUser.clerkId}) is impersonating user ${userId} (clerkId: ${requestingUser.clerkId})`,
      extra: {
        data: response.data,
      },
    },
    request
  );

  return jsonResponse(response.data, 200);
}
