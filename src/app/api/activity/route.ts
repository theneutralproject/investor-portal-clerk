'use server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';

// Get activity feed items by logged in user
export async function GET(request: NextRequest) {
  const { userId, sessionClaims } = getAuth(request);
  if (!userId) {
    Logger.warn('User not authenticated');
    return errorResponse('User not authenticated', 401);
  }

  const dbUserId = sessionClaims?.metadata?.investorPortalId;

  if (!dbUserId) {
    return errorResponse('User not found', 404, {
      request,
      extra: { method: 'sessionClaims?.metadata?.investorPortalId' },
    });
  }
  try {
    // Get all activity items for logged user
    const activityItems = await prisma.activityFeedItem.findMany({
      where: { userId: dbUserId },
      orderBy: { dateCreated: 'desc' },
    });

    return jsonResponse(activityItems);
  } catch (error) {
    return errorResponse('Error fetching activity feed items', 500, {
      request,
      extra: { error },
    });
  }
}
