import { zPdfDocumentCreateSchema } from "@/libs/document/schema";
import prisma, { type UserWithOrganizations } from "@/libs/prisma";
import { storageClient } from "@/libs/supabase";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import {
  DealFinancingType,
  type DocumentEvent,
  DealDocumentType,
} from "@prisma/client";
import { type NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    results.sort((a, b) => {
      if (a.link.includes("youtube") && !b.link.includes("youtube")) return -1;
      if (!a.link.includes("youtube") && b.link.includes("youtube")) return 1;
      if (a.link.includes("docusign") && !b.link.includes("docusign")) return 1;
      if (!a.link.includes("docusign") && b.link.includes("docusign"))
        return -1;
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
    throw new Error("User not found");
  }

  const dbUser = (await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { organizationsOwned: true },
  })) as UserWithOrganizations;

  if (!dbUser) {
    throw new Error(`User record with clerkid ${user.id} not found in prisma`);
  }

  return dbUser;
}

async function validateAccess(
  dbUser: UserWithOrganizations,
  type: string,
  id: number
) {
  if (type === "deal") {
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      throw new Error("Deal not found");
    }
    if (
      !dbUser.organizationsOwned.some((org) => org.id === deal.organizationId)
    ) {
      throw new Error(
        "You are not the owner of the organization that the deal belongs to"
      );
    }
  } else {
    if (!dbUser.organizationsOwned.some((org) => org.id === id)) {
      throw new Error(
        "You are not the owner of the organization you are trying to upload a document for"
      );
    }
  }
}

async function uploadFile(
  file: File | Blob,
  type: string,
  id: number
): Promise<string> {
  const fileName = file instanceof File ? file.name : "blob-" + Date.now();
  try {
    const { data, error } = await storageClient
      .from(`${type}-documents`)
      .upload(`${type}-${id}/${fileName}`, file);

    if (error) {
      console.error("File upload error:", error);
      throw new Error(`File upload failed: ${error.message}`);
    }

    if (!data?.path) {
      throw new Error("No path returned from storage");
    }

    return data.path;
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error;
  }
}

async function createDocumentEntry(
  type: string,
  id: number,
  name: string,
  path: string,
  key: string
) {
  try {
    if (type === "deal") {
      return await prisma.dealDocument.create({
        data: {
          dealId: id,
          name,
          path,
          type: DealDocumentType.VERIFICATION_ACCREDITATION,
        },
      });
    } else {
      return await prisma.organizationDocument.create({
        data: {
          organizationId: id,
          name,
          path,
          key,
        },
      });
    }
  } catch (error) {
    console.error("Error creating document entry:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate user first
    const dbUser = await validateUser();

    // Get the form data
    const formData = await request.formData();

    // Log the received form data
    console.log("Received form data:", {
      keys: Array.from(formData.keys()),
      type: formData.get("type"),
      organizationId: formData.get("organizationId"),
      dealId: formData.get("dealId"),
      key: formData.get("key"),
      hasFile: formData.has("file"),
    });

    // Create the data object for validation
    const dataToValidate = {
      type: formData.get("type"),
      organizationId: formData.get("organizationId"),
      dealId: formData.get("dealId"),
      key: formData.get("key"),
      file: formData.get("file"),
    };

    // Validate the data
    const validationResult = zPdfDocumentCreateSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      console.error("Validation errors:", validationResult.error);
      return jsonResponse(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        400
      );
    }

    const { type, organizationId, dealId, file, key } = validationResult.data;

    // Additional validation
    const id = type === "deal" ? dealId : organizationId;
    if (!id) {
      return jsonResponse(
        {
          error: `${type === "deal" ? "Deal" : "Organization"} ID is required`,
        },
        400
      );
    }

    // Validate access
    await validateAccess(dbUser, type, id);

    // Upload file
    const path = await uploadFile(file, type, id);

    // Create document entry
    const fileName = file instanceof File ? file.name : "blob-" + Date.now();
    const newDocEntry = await createDocumentEntry(
      type,
      id,
      fileName,
      path,
      key
    );

    return jsonResponse({
      success: true,
      document: newDocEntry,
    });
  } catch (error) {
    console.error("Error processing upload:", error);

    if (error instanceof z.ZodError) {
      return jsonResponse(
        {
          error: "Invalid data format",
          details: error.errors,
        },
        400
      );
    }

    return jsonResponse(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      500
    );
  }
}
