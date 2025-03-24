import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    Logger.warn('User not authenticated');
    return errorResponse('User not authenticated', 401);
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (!user) {
    return errorResponse(
      `User record with clerkid ${userId} not found in prisma (POST)`,
      404,
      { request }
    );
  }

  const hubspotAccessToken = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!hubspotAccessToken) {
    return errorResponse(`Missing hubspot token`, 500, { request });
  }

  if (!hubspotAccessToken || !user.email) {
    return errorResponse(`Missing user email`, 500, { request });
  }

  const res = await fetch(
    'https://api.hubapi.com/conversations/v3/visitor-identification/tokens/create',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hubspotAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }),
    }
  );

  const data = await res.json();

  if (res.ok) {
    return jsonResponse({
      ...data,
      email: user.email,
    });
  }

  return errorResponse(`Hubspot token generation failed`, 404, {
    request,
    extra: {
      data,
    },
  });
}
