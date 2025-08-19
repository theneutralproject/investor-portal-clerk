import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { AdvisorProjectBroker } from '@/libs/types';
import { Status } from '@prisma/client';

/**
 * GET handler to fetch all advisor project platform entries by project ID.
 *
 * @param {NextRequest} request - The incoming Next.js API request.
 * @param {Object} paramsWrapper - An object containing the dynamic route params.
 * @param {Promise<{ id: string }>} paramsWrapper.params - A promise that resolves to an object with the `id` route parameter (projectId).
 *
 * @returns {Promise<Response>} A JSON response containing the list of advisor project platform records, 
 * or an error response if the projectId is invalid or a server error occurs.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const projectId = parseInt(id, 10);

  if (!projectId || isNaN(projectId))
    return errorResponse('projectId is invalid', 400, { request });

  try {
    const platforms: AdvisorProjectBroker[] = await prisma.advisorProjectPlatform.findMany({
      where: {
        projectId,
        NOT: {
          status: Status.INACTIVE, // filter out INACTIVE
        },
      },
      orderBy: {
        status: 'asc', // will bring ACTIVE first (assuming alphabetical order)
      },
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
