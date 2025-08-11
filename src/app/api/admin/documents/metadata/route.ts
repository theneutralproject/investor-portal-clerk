import { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import {
  zDocumentCreateGenericSchema,
  zDocumentFetchSchema,
  zDocumentUpdateGenericSchema,
} from '@/libs/document/schema';
import Logger from '@/libs/logger';
import {
  jsonResponse,
  errorResponse,
  getErrorMessage,
} from '@/libs/utils.server';
import {
  createGenericDocumentEntry,
  getGenericDocument,
  updateGenericDocumentEntry,
} from '@/libs/document/utils.server';
import { createChangeLog } from '@/libs/changelog/utils.server';

/**
 * @function POST
 * @description
 * POST handler for creating a document metadata entry in the database.
 *
 * **Endpoint:** `POST /api/admin/documents/metadata`
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
 * curl -X POST /api/admin/documents/metadata \
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

    await createChangeLog({
      entityId: newDocEntry.id,
      entityName: `${payload.type}Document`.toUpperCase(),
      newValue: newDocEntry,
      previousValue: null,
      userId: adminUser.id,
    });

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

/**
 * @function PUT
 * @description
 * PUT handler for updating a document metadata entry in the database.
 *
 * **Endpoint:** `PUT /api/admin/documents/metadata?entity={entity}&docId={docId}`
 *
 * This route:
 *  - Authenticates the admin user.
 *  - Validates `entity` and `docId` query parameters.
 *  - Parses and validates the request body against a discriminated Zod schema.
 *  - Ensures the referenced document exists.
 *  - Updates the document based on the `type` provided.
 *  - Returns success with the updated document metadata, or a 4xx/5xx error response.
 *
 * @param {NextRequest} request - The incoming request object from Next.js
 *
 * @returns {Promise<Response>} JSON response:
 *  - `200` with `{ success: true, document }` on success
 *  - `400` if query or body validation fails
 *  - `401` if authentication fails
 *  - `500` if internal error occurs
 *
 * @throws Will throw a generic error if authentication fails or internal logic errors occur.
 *
 * @example
 * curl -X PUT '/api/admin/documents/metadata?entity=deal&docId=123' \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *         "dealDocumentType": "K1",
 *         "taxYear": 2022
 *       }'
 */
export async function PUT(request: NextRequest): Promise<Response> {
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

  const queryParamsValidationResult = zDocumentFetchSchema.safeParse({
    entity: type,
    docId: id,
  });

  if (!queryParamsValidationResult.success) {
    Logger.error('Validation errors:', request, {
      validationError: queryParamsValidationResult.error,
    });
    return jsonResponse(
      {
        error: 'Validation failed',
        details: queryParamsValidationResult.error.format(),
      },
      400
    );
  }
  const { docId, entity } = queryParamsValidationResult.data;

  const payload = await request.json();
  const validationResult = zDocumentUpdateGenericSchema.safeParse({
    ...payload,
    type: entity,
  });

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
    // Check if document exists
    await getGenericDocument(entity, docId);

    const updatedDocEntry = await updateGenericDocumentEntry(
      docId,
      validationResult.data
    );

    await createChangeLog({
      entityId: updatedDocEntry.id,
      entityName: `${entity}Document`.toUpperCase(),
      newValue: updatedDocEntry,
      previousValue: null,
      userId: adminUser.id,
    });

    return jsonResponse({ success: true, document: updatedDocEntry });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return errorResponse(
      `An error has occurred while trying to update document metadata: ${errorMessage}`,
      500,
      {
        request,
        extra: { error, errorMessage },
      }
    );
  }
}
