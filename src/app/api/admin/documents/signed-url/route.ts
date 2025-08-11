import { NextRequest } from 'next/server';
import { User } from '@prisma/client';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { zDocumentSignedUrlCreateSchema } from '@/libs/document/schema';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import {
  createDocumentSignedUrl,
  getFolderName,
} from '@/libs/document/utils.server';
import { APIError } from '@/libs/types';

const STORAGE_URL = process.env.SUPABASE_STORAGE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * @function POST
 * @description
 * POST handler for generating a signed Supabase Storage URL for uploading documents.
 *
 * **Endpoint:** `POST /api/admin/documents/signed-url`
 *
 * This endpoint:
 *  - Authenticates the admin user using the request context.
 *  - Validates the request body against a discriminated Zod schema based on `entityType`.
 *  - Looks up the entity (project, deal, or organization) to determine the storage folder name.
 *  - Generates a signed Supabase upload URL scoped to the proper bucket and folder.
 *  - Returns metadata required to perform the upload client-side.
 *
 * @param {NextRequest} request - The incoming Next.js API request object
 *
 * @returns {Promise<Response>} JSON response:
 *  - `200 OK` with:
 *    ```ts
 *    {
 *      t: string; // Supabase service key
 *      u: string; // Supabase storage URL
 *      bucketName: string;
 *      fileName: string;
 *      uploadUrl: string;
 *      filePath: string; // Format: "<folder>/<fileName>"
 *    }
 *    ```
 *  - `400 Bad Request` if Zod validation fails
 *  - `401` if authentication fails
 *  - `404 Not Found` if the referenced entity (project, deal, or organization) does not exist
 *  - `500 Internal Server Error` if authentication fails or an unexpected error occurs
 *  - `500` if internal error occurs
 *
 * @throws Will return a JSON error response with appropriate status code and message if:
 *  - Admin authentication fails
 *  - Request validation fails
 *  - Referenced entity is not found
 *  - Supabase errors or internal logic fails
 *
 * @example
 * curl -X POST /api/admin/documents/signed-url \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *         "entityType": "deal",
 *         "entityId": 123,
 *         "fileName": "my-document.pdf"
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
  const validationResult = zDocumentSignedUrlCreateSchema.safeParse(payload);

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

  const { entityId, entityType, fileName } = validationResult.data;

  try {
    const folder = await getFolderName(entityType, entityId);
    const data = await createDocumentSignedUrl(
      entityType,
      entityId,
      fileName,
      folder
    );

    return jsonResponse({
      t: SERVICE_KEY,
      u: STORAGE_URL,
      bucketName: data?.bucketName,
      fileName,
      uploadUrl: data?.signedUrl,
      filePath: `${data?.folder}/${fileName}`,
    });
  } catch (error) {
    return errorResponse(
      (error as Error).message,
      (error as APIError).status || 500,
      { request }
    );
  }
}
