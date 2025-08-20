import { NextRequest } from 'next/server';
import { User } from '@prisma/client';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { zDocumentFetchSchema } from '@/libs/document/schema';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { APIError } from '@/libs/types';
import { storageClient } from '@/libs/supabase';
import {
  deleteGenericDocument,
  getGenericDocument,
} from '@/libs/document/utils.server';
import { createChangeLog } from '@/libs/changelog/utils.server';

/**
 * @function GET
 * @description
 * GET handler for downloading a document file from Supabase Storage for an authenticated admin user.
 *
 * **Endpoint:** `GET /api/admin/documents?entity={entity}&docId={docId}`
 *
 * This route:
 *  - Authenticates the admin user.
 *  - Validates the `entity` and `docId` query parameters.
 *  - Retrieves the corresponding document metadata from the database.
 *  - Downloads the file from Supabase Storage based on the document path.
 *  - Returns the file as a downloadable response with appropriate headers.
 *
 * @queryParam {string} entity - The type of document entity (`deal`, `organization`, or `project`)
 * @queryParam {string | number} docId - The numeric ID of the document to download
 *
 * @param {NextRequest} request - The incoming request object from Next.js
 *
 * @returns {Promise<Response>} Response:
 *  - `200` with a file stream and headers to trigger download
 *  - `400` if query params are missing or invalid
 *  - `401` if authentication fails
 *  - `404` if the document or file is not found
 *  - `500` if internal error occurs
 *
 * @throws {APIError} Structured application-level error if validation, auth, or file resolution fails
 *
 * @example
 * curl -X GET "/api/admin/documents?entity=deal&docId=123"
 *   -H "Authorization: Bearer your-token"
 */
export async function GET(request: NextRequest): Promise<Response> {
  let adminUser: User | null = null;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 401, { request });
  }

  if (!adminUser) {
    return errorResponse('admin user not found', 401, { request });
  }

  const { searchParams } = new URL(request.url);

  const type = searchParams.get('entity');
  const id = searchParams.get('docId');

  if (!type) {
    return errorResponse('entity param is missing', 400, { request });
  }

  if (!id) {
    return errorResponse('docId param is missing', 400, { request });
  }

  const validationResult = zDocumentFetchSchema.safeParse({
    entity: type,
    docId: id,
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
  const { docId, entity } = validationResult.data;

  try {
    const fileData = await getGenericDocument(entity, docId);

    const { data, error } = await storageClient
      .from(fileData.bucketName)
      .download(fileData.path);

    if (error || !data) {
      throw new APIError('File not found', 404);
    }

    return new Response(data, {
      headers: {
        'Content-Type': data.type,
        'Content-Disposition': `attachment; filename="${fileData.name}"`,
      },
    });
  } catch (error) {
    return errorResponse(
      (error as Error).message,
      (error as APIError).status || 500,
      { request }
    );
  }
}

/**
 * @function DELETE
 * @description
 * DELETE handler for removing a document and its metadata from both Supabase Storage and the database.
 *
 * **Endpoint:** `DELETE /api/admin/documents?entity={entity}&docId={docId}`
 *
 * This route:
 *  - Authenticates the admin user.
 *  - Parses and validates the query parameters (`entity` and `docId`).
 *  - Fetches the file's metadata and location via `getGenericDocument`.
 *  - Deletes the file from Supabase Storage.
 *  - Deletes the document metadata from the database via `deleteGenericDocument`.
 *  - Returns success or a structured 4xx/5xx error response.
 *
 * @param {NextRequest} request - The incoming request object from Next.js
 *
 * @returns {Promise<Response>} JSON response:
 *  - `200` with `{ success: true, message }` on successful deletion
 *  - `400` if query params are missing or validation fails
 *  - `401` if authentication fails
 *  - `404` if the document or file is not found
 *  - `500` if internal error occurs
 *
 * @throws Will return a structured error response if validation, auth, or internal logic fails.
 *
 * @example
 * curl -X DELETE /api/admin/documents?entity=deal&docId=123
 */
export async function DELETE(request: NextRequest): Promise<Response> {
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

  const { searchParams } = new URL(request.url);

  const type = searchParams.get('entity');
  const id = searchParams.get('docId');

  if (!type) {
    return errorResponse('entity param is missing', 400, { request });
  }

  if (!id) {
    return errorResponse('docId param is missing', 400, { request });
  }

  const validationResult = zDocumentFetchSchema.safeParse({
    entity: type,
    docId: id,
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
  const { docId, entity } = validationResult.data;

  try {
    const fileData = await getGenericDocument(entity, docId);

    const { error: storageError } = await storageClient
      .from(fileData.bucketName)
      .remove([fileData.path]);

    if (storageError) {
      throw new APIError(
        `Failed to delete file in storage: ${storageError.message}`,
        500
      );
    }

    await createChangeLog({
      entityId: docId,
      entityName: `${entity}Document`.toUpperCase(),
      newValue: null,
      userId: adminUser.id,
    });

    await deleteGenericDocument(entity, docId);

    return jsonResponse(
      { success: true, message: 'Document deleted successfully' },
      200
    );
  } catch (error) {
    return errorResponse(
      (error as Error).message,
      (error as APIError).status || 500,
      { request }
    );
  }
}
