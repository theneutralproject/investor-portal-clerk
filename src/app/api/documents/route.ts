import { zPdfDocumentCreateSchema } from "@/libs/document/schema";
import prisma, { type UserWithOrganizations } from "@/libs/prisma";
import { storageClient } from "@/libs/supabase";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import { DealFinancingType, type DocumentEvent, DealDocumentType } from "@prisma/client";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * 
 * @param request Get documents for a project
 * @returns 
 */
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id } = user;
    const neutralUser = await prisma.user.findUnique({
      where: { clerkId: id },
    });

    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    const projectId = parseInt(queryParams.get("projectId") ?? "", 10);
    const dealStage = parseInt(queryParams.get("dealStage") ?? "", 10);
    const financingType = queryParams.get("financingType") ?? "";

    if (isNaN(projectId)) {
      return new Response(JSON.stringify({ error: "Invalid Project ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isDealFinancingType = Object.values(DealFinancingType).includes(
      financingType as DealFinancingType
    );

    const documents = await prisma.projectDocument.findMany({
      where: {
        projectId: projectId,
        ...(dealStage ? { dealStage: dealStage } : {}),
        ...(isDealFinancingType
          ? {
            OR: [
              { financingTypes: { has: financingType as DealFinancingType } },
              { financingTypes: { equals: [] } },
            ],
          }
          : { financingTypes: { equals: [] } }),
      },
      include: {
        documentEvents: {
          where: { userId: neutralUser?.id },
        },
      },
    });

    const results = documents.map((doc) => ({
      ...doc,
      completed: doc.documentEvents.some(
        (event: DocumentEvent) => event.documentId === doc.id
      ),
    }));

    //Sort documents by link contains "youtube" first, and sort by making link contains "docusign" last
    results.sort((a, b) => {
      if (a.link.includes("youtube") && !b.link.includes("youtube")) {
        return -1;
      }
      if (!a.link.includes("youtube") && b.link.includes("youtube")) {
        return 1;
      }
      if (a.link.includes("docusign") && !b.link.includes("docusign")) {
        return 1;
      }
      if (!a.link.includes("docusign") && b.link.includes("docusign")) {
        return -1;
      }
      return 0;
    });

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function validateUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { organizationsOwned: true }
  }) as UserWithOrganizations;

  if (!dbUser) {
    throw new Error(`User record with clerkid ${user.id} not found in prisma`);
  }

  return dbUser;
}

async function validateAccess(dbUser: UserWithOrganizations, type: string, id: number) {
  if (type === 'deal') {
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      throw new Error('Deal not found');
    }
    if (!dbUser.organizationsOwned.some((org) => org.id === deal.organizationId)) {
      throw new Error('You are not the owner of the organization that the deal belongs to');
    }
  } else {
    if (!dbUser.organizationsOwned.some((org) => org.id === id)) {
      throw new Error('You are not the owner of the organization you are trying to upload a document for');
    }
  }
}

async function uploadFile(file: File, type: string, id: number): Promise<string> {
  const { data, error } = await storageClient
    .from(`${type}-documents`)
    .upload(`${type}-${id}/${file.name}`, file);
  if (error) {
    console.error('File upload error:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
  return data.path;
}

async function createDocumentEntry(type: string, id: number, name: string, path: string) {
  if (type === 'deal') {
    return await prisma.dealDocument.create({
      data: {
        dealId: id,
        name,
        path,
        type: DealDocumentType.VERIFICATION_ACCREDITATION
      }
    });
  } else {
    return await prisma.organizationDocument.create({
      data: {
        organizationId: id,
        name,
        path,
      }
    });
  }
}


/**
 * User can upload deal and org documents
 * We will use a different route for admins to upload documents
 * @param request formData with PdfDocumentCreateSchema
 * @returns 
 */
export async function POST(request: NextRequest) {
  try {
    // Validate user
    const dbUser = await validateUser();

    // Parse and validate request data
    const postData = zPdfDocumentCreateSchema.parse(
      await request.formData()
    );

    const { dealId, organizationId, file, type } = postData;

    // Validate required IDs
    if (type === 'deal' && !dealId) {
      return jsonResponse({ error: 'Deal ID is required' }, 400);
    }
    if (type === 'organization' && !organizationId) {
      return jsonResponse({ error: 'Organization ID is required' }, 400);
    }
    if (type !== 'deal' && type !== 'organization') {
      return jsonResponse({ error: 'Invalid document type' }, 400);
    }

    const id = type === 'deal' ? dealId! : organizationId!;

    // Validate access
    await validateAccess(dbUser, type, id);

    // Upload file
    const path = await uploadFile(file, type, id);

    // Create document entry
    const newDocEntry = await createDocumentEntry(type, id, file.name, path);

    return jsonResponse({ newDocEntry });

  } catch (error) {
    console.error('Error processing document upload:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return jsonResponse({ error: message },
      error instanceof Error && error.message.includes('not found') ? 404 : 400
    );
  }
};
