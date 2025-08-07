import { NextRequest } from 'next/server';
import { User } from '@prisma/client';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { zDocumentDownloadSchema } from '@/libs/document/schema';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { APIError } from '@/libs/types';
import prisma from '@/libs/prisma.server';
import { storageClient } from '@/libs/supabase';

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
 *  - `404` if the document or file is not found
 *  - `500` if authentication fails or internal error occurs
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
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  if (!adminUser) {
    return errorResponse('admin user not found', 500, { request });
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

  const validationResult = zDocumentDownloadSchema.safeParse({
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
    const fileData: { name?: string; path?: string } = {};
    let fileDocument;
    const bucketName = `${entity}-documents`;

    if (entity === 'deal') {
      fileDocument = await prisma.dealDocument.findUnique({
        where: {
          id: docId,
        },
        select: {
          path: true,
          name: true,
        },
      });
      fileData.name = fileDocument?.name;
      fileData.path = fileDocument?.path;
    }

    if (entity === 'organization') {
      fileDocument = await prisma.organizationDocument.findUnique({
        where: {
          id: docId,
        },
        select: {
          path: true,
          name: true,
        },
      });
      fileData.name = fileDocument?.name;
      fileData.path = fileDocument?.path;
    }

    if (entity === 'project') {
      fileDocument = await prisma.projectDocument.findUnique({
        where: {
          id: docId,
        },
        select: {
          fileName: true,
          project: {
            select: {
              name: true,
            },
          },
        },
      });
      fileData.name = fileDocument?.fileName;
      fileData.path = fileDocument?.project.name.replaceAll(' ', '') || '';
    }

    if (!fileDocument) {
      throw new APIError(`Document from '${entity}' not found`, 404);
    }
    if (!fileData.name) {
      throw new APIError(`File name invalid for file`, 500);
    }
    if (!fileData.path) {
      throw new APIError(`Path invalid for file '${fileData.name}'`, 500);
    }

    const { data, error } = await storageClient
      .from(bucketName)
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
