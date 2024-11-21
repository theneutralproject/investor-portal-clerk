"use server";
import prisma from "@/libs/prisma.server";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs";
import { DealDocumentType } from "@prisma/client";
import { includes } from "lodash";

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

    const userDeals = await prisma.deal.findMany({
      where: {
        organizationId: {
          in: neutralUser?.organizationMember.map((om) => om.organizationId),
        },
      },
    });

    // for these deals, get the documents
    const dealDocuments = await prisma.dealDocument.findMany({
      where: {
        dealId: { in: userDeals.map((deal) => deal.id) },
      },
    });

    const taxDocuments = dealDocuments.filter(
      (doc) => doc.type === DealDocumentType.K1
    );
    const projects = await prisma.project.findMany();
    const investmentDocuments = dealDocuments
      .filter((doc) => doc.type === DealDocumentType.INVESTMENT_DOCUMENT)
      .map((doc) => {
        const deal = userDeals.find((d) => d.id === doc.dealId);
        if (!deal) {
          return doc;
        }
        return {
          ...doc,
          projectName: projects.find((p) => p.id === deal.projectId)?.name,
        };
      });

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
