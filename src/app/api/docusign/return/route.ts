import type { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { buildRedirectUrl } from '@/libs/dealflow/utils.server';
import Logger from '@/libs/logger';

interface DocuSignParams {
  documentTemplateId: string;
  userId: string;
  dealId: string;
  event: string; //From DocuSign "signing_complete" or "decline"
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Validate and extract URL parameters
function extractParams(request: NextRequest): DocuSignParams {
  const searchParams = request.nextUrl.searchParams;
  const params = {
    documentTemplateId: searchParams.get('documentTemplateId'),
    userId: searchParams.get('userId'),
    dealId: searchParams.get('dealId'),
    event: searchParams.get('event'),
  };

  if (
    !params.documentTemplateId ||
    !params.userId ||
    !params.dealId ||
    !params.event
  ) {
    throw new ValidationError(
      'Missing required parameters: documentTemplateId or userId or dealId or event'
    );
  }

  return params as DocuSignParams;
}

// Fetch project document with validation
async function getProjectDocument(documentTemplateId: string) {
  const projectDocument = await prisma.projectDocument.findFirst({
    where: {
      docusignTemplateId: documentTemplateId,
    },
    include: {
      project: true,
    },
  });

  if (!projectDocument) {
    throw new ValidationError('Project document not found');
  }

  return projectDocument;
}

// Create document event based on the event type
async function createDocumentEvent(
  params: DocuSignParams,
  request: NextRequest
) {
  if (params.event === 'signing_complete') {
    Logger.log({ message: 'Creating document event for signing_complete' });
    const existingDocusignEvent = await prisma.docusignEvent.findFirst({
      where: {
        dealId: parseInt(params.dealId),
        userId: parseInt(params.userId),
        templateId: params.documentTemplateId,
      },
    });

    if (existingDocusignEvent) {
      await prisma.docusignEvent.update({
        where: { id: existingDocusignEvent.id },
        data: {
          investorSignatureCompleted: true,
        },
      });
      return;
    } else {
      Logger.error(
        `Docusign Event not found for dealId ${params.dealId} and userId ${params.userId}`,
        request
      );
      return;
    }
  }
}

// Create error response
function createErrorResponse(error: unknown, request: NextRequest) {
  const status = error instanceof ValidationError ? 400 : 500;
  const message = error instanceof Error ? error.message : 'Unknown error';

  Logger.error('DocuSign return handler error', request, { error });
  return new Response(
    JSON.stringify({
      error: status === 400 ? message : 'Internal server error',
      details: status === 500 ? message : undefined,
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    // Extract and validate parameters
    const params = extractParams(request);

    // Get project document
    const projectDocument = await getProjectDocument(params.documentTemplateId);

    // Create document event if signature has been completed
    await createDocumentEvent(params, request);

    // Build and return redirect URL
    const redirectUrl = buildRedirectUrl(
      projectDocument.project.slug,
      params.dealId
    );

    return Response.redirect(redirectUrl.toString(), 303);
  } catch (error) {
    return createErrorResponse(error, request);
  }
}
