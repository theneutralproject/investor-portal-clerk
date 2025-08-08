import { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { zDocumentCreateGenericSchema } from '@/libs/document/schema';
import Logger from '@/libs/logger';
import {
  jsonResponse,
  errorResponse,
  getErrorMessage,
} from '@/libs/utils.server';
import { createGenericDocumentEntry } from '@/libs/document/utils.server';

/**
 * @function POST
 * @description
 * POST handler for creating a document metadata entry in the database.
 *
 * **Endpoint:** `POST /api/admin/documents/store-metadata`
 *
 * This route:
 *  - Authenticates the admin user.
 *  - Parses and validates the request body against a discriminated Zod schema.
 *  - Calls the appropriate document creation method based on `type`.
 *  - Returns success with the created document metadata, or a 4xx/5xx error response.
 *
 * @param {NextRequest} request - The incoming request object from Next.js
 *
 * @returns {Promise<Response>} JSON response:
 *  - `200` with `{ success: true, document }` on success
 *  - `400` if validation fails
 *  - `401` if authentication fails
 *  - `500` if internal error occurs
 *
 * @throws Will throw a generic error if authentication fails or internal logic errors occur.
 *
 * @example
 * curl -X POST /api/admin/documents/store-metadata \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *         "type": "deal",
 *         "dealId": 123,
 *         "name": "My Deal Doc",
 *         "path": "/some/path.pdf",
 *         "key": "abc123",
 *         "dealDocumentType": "VERIFICATION_ACCREDITATION"
 *       }'
 */
export async function POST(request: NextRequest): Promise<Response> {
  let adminUser: User | null = null;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 401, { request });
  }

  if (!adminUser) {
    return errorResponse('admin user not found', 401, { request });
  }

  const payload = await request.json();
  const validationResult = zDocumentCreateGenericSchema.safeParse(payload);

  Logger.log({
    message: 'Logging payload',
    extra: payload,
  });

  if (!validationResult.success) {
    Logger.error('Validation errors:', request, {
      validationError: validationResult.error,
    });
    return jsonResponse(
      {
        error: 'Validation failed',
        details: validationResult.error.format(),
      },
      400
    );
  }

  Logger.log({
    message: 'Logging validationResult',
    extra: validationResult.data,
  });

  try {
    const newDocEntry = await createGenericDocumentEntry(
      validationResult.data,
      adminUser.id
    );

    return jsonResponse({ success: true, document: newDocEntry });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return errorResponse(
      `An error has occurred while trying to store document metadata: ${errorMessage}`,
      500,
      {
        request,
        extra: { error, errorMessage },
      }
    );
  }
}
