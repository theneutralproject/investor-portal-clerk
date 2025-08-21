import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { User } from '@prisma/client';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { zCustodianPlatformCreateSchema } from '@/libs/custodianPlatform/schema';

/**
 * @function POST
 * @description
 * Creates a new custodian platform entry linking an advisor to a project with a status.
 *
 * **Endpoint:** `POST /api/admin/custodian-platforms`
 *
 * This route:
 *  - Authenticates the admin user.
 *  - Validates the incoming body using Zod schema.
 *  - Creates a new `custodianPlatform` entry in the database.
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
 *  - `200` with `{ success: true, custodianPlatform }` on success
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
    zCustodianPlatformCreateSchema.safeParse(body);

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
    const newEntry = await prisma.custodianPlatform.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl,
        status: data.status,
        createdById: adminUser.id,
        // Handle advisor firm relations
        advisorFirms:
          data.advisorIds && data.advisorIds.length > 0
            ? {
                connect: data.advisorIds.map(id => ({ id })),
              }
            : undefined,
        // Handle project relations
        projects:
          data.projectIds && data.projectIds.length > 0
            ? {
                connect: data.projectIds.map(id => ({ id })),
              }
            : undefined,
      },
      include: {
        advisorFirms: true,
        projects: true,
      },
    });

    return jsonResponse({ success: true, data: newEntry });
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, { request });
  }
}

/**
 * @function GET
 * @description
 * Retrieves all custodian platform entries, including related advisor firm and project details.
 *
 * **Endpoint:** `GET /api/admin/custodian-platforms`
 *
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
    const platforms = await prisma.custodianPlatform.findMany({
      include: {
        advisorFirms: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
        projects: {
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
