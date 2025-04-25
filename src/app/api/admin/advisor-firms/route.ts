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
  AdvisorFirmsResponse,
  zAdvisorFirmCreateSchema,
} from '@/libs/advisorFirm/schema';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { APIError } from '@/libs/types';

/**
 * POST /api/admin/advisor-firms
 *
 * Creates a new Advisor Firm.
 * Only accessible by users with the ADMIN role, authenticated via getAdminFromRequest.
 *
 * Expected request body:
 * {
 *   name: string;
 *   logoUrl: string;
 * }
 *
 * Validates the request body with zod schema `zAdvisorFirmCreateSchema`,
 * then creates a new AdvisorFirm record in the database.
 *
 * Returns:
 * - 201 Created with the AdvisorFirm object
 * - 400 Bad Request for schema validation errors
 * - 401/403 for unauthorized access
 * - 500 for unexpected server errors
 *
 * @param request - Next.js API request
 * @returns JSON response with the created advisor firm or error message
 */
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
 * Retrieves a paginated list of all Advisor Firms.
 * Only accessible by users with the ADMIN role, authenticated via getAdminFromRequest.
 *
 * Accepts pagination via query parameters:
 * - `page`: page number (default: 1)
 * - `limit`: number of items per page (default: 20)
 *
 * Includes:
 * - advisor firm employees with basic user details
 * - associated client organizations
 *
 * Returns:
 * - 200 OK with the advisor firms and pagination info
 * - 401 Unauthorized if the user is not authenticated as admin
 * - 500 Internal Server Error for unexpected issues
 *
 * @param request - Next.js API request
 * @returns JSON response with advisor firms and pagination metadata
 */
export async function GET(request: NextRequest) {
  let adminUser;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.warn('Unauthorized request: admin not found', request);
    return errorResponse(getErrorMessage(error), 401, { request });
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') || '1');
  const limit = Number(url.searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  try {
    const [advisorFirms, total] = await Promise.all([
      prisma.advisorFirm.findMany({
        skip,
        take: limit,
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
      }),
      prisma.advisorFirm.count(),
    ]);

    Logger.log(
      {
        message: `Admin ${adminUser.email} fetched advisor firms (page ${page})`,
        extra: { userId: adminUser.id, page, limit },
      },
      request
    );

    const response: AdvisorFirmsResponse = {
      advisorFirms,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + advisorFirms.length < total,
      },
    };

    return jsonResponse(response);
  } catch (error) {
    return errorResponse('Failed to fetch advisor firms', 500, {
      request,
      extra: { error },
    });
  }
}
