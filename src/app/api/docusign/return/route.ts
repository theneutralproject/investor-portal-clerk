import type { NextRequest } from "next/server";
import { DocumentEventType } from "@prisma/client";
import prisma from "@/libs/prisma";

interface DocuSignParams {
  documentId: string;
  userId: string;
  dealId: string;
  event: string;
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Validate and extract URL parameters
function extractParams(request: NextRequest): DocuSignParams {
  const searchParams = request.nextUrl.searchParams;
  const params = {
    documentId: searchParams.get("documentId"),
    userId: searchParams.get("userId"),
    dealId: searchParams.get("dealId"),
    event: searchParams.get("event"),
  };

  if (!params.documentId || !params.userId || !params.dealId || !params.event) {
    throw new ValidationError(
      "Missing required parameters: documentId or userId or dealId or event"
    );
  }

  return params as DocuSignParams;
}

// Fetch project document with validation
async function getProjectDocument(documentId: string) {
  const projectDocument = await prisma.projectDocument.findUnique({
    where: {
      id: parseInt(documentId),
    },
    include: {
      project: true,
    },
  });

  if (!projectDocument) {
    throw new ValidationError("Project document not found");
  }

  return projectDocument;
}

// Create document event based on the event type
async function createDocumentEvent(params: DocuSignParams) {
  if (params.event === "signing_complete") {
    await prisma.documentEvent.create({
      data: {
        userId: parseInt(params.userId),
        documentId: parseInt(params.documentId),
        date: new Date(),
        type: DocumentEventType.SIGN,
      },
    });
  }
}

// Build redirect URL
function buildRedirectUrl(projectSlug: string, dealId: string): URL {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error("BASE_URL environment variable is not set");
  }
  return new URL(`/dealflow/${projectSlug}/${dealId}/review`, baseUrl);
}

// Create error response
function createErrorResponse(error: unknown) {
  const status = error instanceof ValidationError ? 400 : 500;
  const message = error instanceof Error ? error.message : "Unknown error";

  console.error("DocuSign return handler error:", error);

  return new Response(
    JSON.stringify({
      error: status === 400 ? message : "Internal server error",
      details: status === 500 ? message : undefined,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    // Extract and validate parameters
    const params = extractParams(request);

    // Get project document
    const projectDocument = await getProjectDocument(params.documentId);

    // Create document event if applicable
    await createDocumentEvent(params);

    // Build and return redirect URL
    const redirectUrl = buildRedirectUrl(
      projectDocument.project.slug,
      params.dealId
    );

    return Response.redirect(redirectUrl.toString(), 303);
  } catch (error) {
    return createErrorResponse(error);
  }
}
