import { zPdfDocumentCreateSchema } from "@/libs/document/schema";
import prisma from "@/libs/prisma";
import { storageClient } from "@/libs/supabase";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import { DealFinancingType, type DocumentEvent, DealDocumentType } from "@prisma/client";
import { type NextRequest } from "next/server";

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

/**
 * User can upload deal and org documents
 * We will use a different route for admins to upload documents
 * @param request formData with PdfDocumentCreateSchema
 * @returns 
 */
export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return jsonResponse({ error: "User not found" }, 404);
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { organizationsOwned: true }
  });
  if (!dbUser) {
    return jsonResponse({ error: `User record with clerkid ${user.id} not found in prisma (POST)` }, 404);
  }
  let postData;
  try {
    postData = zPdfDocumentCreateSchema.parse(await request.formData());
  } catch (parseError) {
    console.error("unable to parse POST body:\n", parseError);
    return jsonResponse({ error: `Input data malformatted: \n${(parseError as Error).message}` }, 400);
  }
  const { dealId, organizationId, file, type } = postData;
  if (type === "deal") {
    if (!dealId) return jsonResponse({ error: "Deal ID is required" }, 400);
    const deal = await prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) return jsonResponse({ error: "Deal not found" }, 404);
    if (!dbUser.organizationsOwned.some(org => org.id === deal.organizationId)) {
      return jsonResponse({ error: "You are not the owner of the organization that the deal belongs to" }, 403);
    }
  }

  if (type === "organization") {
    if (!organizationId) return jsonResponse({ error: "Organization ID is required" }, 400);
    if (!dbUser.organizationsOwned.some(org => org.id === organizationId)) {
      return jsonResponse({ error: "You are not the owner of the organization you are trying to upload a document for" }, 403);
    }
  }

  const id: number = type === "deal" ? dealId! : organizationId!;

  const name = file.name;
  const { data, error } = await storageClient.from(`${type}-documents`).upload(`${type}-${id}/${name}`, file);
  if (error) {
    console.error(error);
    return jsonResponse({ error: "File upload failed" }, 400);
  }
  const { path } = data;
  if (type === "deal") {
    try {
      const newDocEntry = await prisma.dealDocument.create({
        data: {
          dealId: id,
          name,
          path,
          type: DealDocumentType.VERIFICATION_ACCREDITATION
        }
      });
      return jsonResponse({ newDocEntry });
    }
    catch (error) {
      console.error(error);
      return jsonResponse({ error: "Error creating document entry" }, 400);
    }
  } else {
    try {
      const newDocEntry = await prisma.organizationDocument.create({
        data: {
          organizationId: id,
          name,
          path,
        }
      });

      return jsonResponse({ newDocEntry });
    } catch (error) {
      console.error(error);
      return jsonResponse({ error: "Error creating document entry" }, 400);
    }
  }
};
