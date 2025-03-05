'use server';
import type { DocumentEventCreateSchema } from '@/libs/document/schema';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

// Create a DocumentEvent for the given document and user
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return errorResponse('Clerk user not found', 404, { request });
    }

    const neutralUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!neutralUser) {
      return errorResponse('User not found in database', 404, { request });
    }

    const requestBody = (await request.json()) as DocumentEventCreateSchema;
    const { documentId, type } = requestBody;

    if (!documentId || !type) {
      return errorResponse(
        'All parameters (documentId, type) are required',
        400,
        { request }
      );
    }

    // Create the document event
    const documentEvent = await prisma.documentEvent.create({
      data: {
        userId: neutralUser.id,
        documentId,
        date: new Date(),
        type,
      },
    });
    return jsonResponse(documentEvent, 201);
  } catch (error) {
    return errorResponse('Error creating document event', 500, {
      request,
      extra: { error },
    });
  }
}
