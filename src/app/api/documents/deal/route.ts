"use server";
import prisma from "@/libs/prisma.server";
import { getSupabaseDownloadUrl } from "@/libs/supabase";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs";
import { DealDocumentType } from "@prisma/client";

/**
 *
 * @param request Get documents for a deal
 * @returns
 */
export async function GET() {
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
      include: { organizationMember: true },
    });

    if (!neutralUser) {
      return new Response(
        JSON.stringify({ error: "User not associated with any organization" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const organizationIds = neutralUser.organizationMember.map(
      (om) => om.organizationId
    );

    const dealsWithDocuments = await prisma.deal.findMany({
      where: {
        organizationId: { in: organizationIds },
      },
      include: {
        document: true,
        project: true,
      },
    });

    const taxDocuments = [];
    const investmentDocuments = [];

    for (const deal of dealsWithDocuments) {
      for (const doc of deal.document) {
        const downloadUrl = await getSupabaseDownloadUrl(
          doc.path,
          "deal-documents"
        );
        const documentWithProjectName = {
          ...doc,
          projectName: deal.project?.name,
          downloadUrl,
        };
        if (doc.type === DealDocumentType.K1) {
          taxDocuments.push(documentWithProjectName);
        } else if (doc.type === DealDocumentType.INVESTMENT_DOCUMENT) {
          investmentDocuments.push(documentWithProjectName);
        }
      }
    }

    return jsonResponse({ taxDocuments, investmentDocuments });
  } catch (error) {
    console.error("Error getting deal documents: ", error);
    return new Response(
      JSON.stringify({ error: "Error getting deal documents" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
