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

/**
 * @function POST
 * @description
 * Creates a new advisor-project platform entry linking an advisor to a project with a status.
 *
 * **Endpoint:** `POST /api/admin/advisor-project-platform`
 *
 * This route:
 *  - Authenticates the admin user.
 *  - Validates the incoming body using Zod schema.
 *  - Creates a new `advisorProjectPlatform` entry in the database.
 *
 * @param {NextRequest} request - The incoming request object containing JSON with:
 * ```json
 * {
 *   "advisorId": 1,
 *   "projectId": 2,
 *   "status": "enabled"
 * }
 * ```
 *
 * @returns {Promise<Response>} JSON response:
 *  - `200` with `{ success: true, advisorProjectPlatform }` on success
 *  - `400` if validation fails
 *  - `401` if authentication fails
 *  - `500` on internal error
 */
export async function POST(request: NextRequest): Promise<Response> {
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

/**
 * @function GET
 * @description
 * Retrieves all advisor-project platform entries, including related advisor firm and project details.
 *
 * **Endpoint:** `GET /api/admin/advisor-project-platform`
 *
 * This route:
 *  - Authenticates the admin user.
 *  - Returns all `advisorProjectPlatform` records, including:
 *    - `advisorFirm`: id, name, logoUrl
 *    - `project`: id, name
 *    - `createdBy`: id, email
 *
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<Response>} JSON response:
 *  - `200` with `{ success: true, data: [...] }` on success
 *  - `401` if authentication fails
 *  - `500` on internal server error
 */
export async function GET(request: NextRequest): Promise<Response> {
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
