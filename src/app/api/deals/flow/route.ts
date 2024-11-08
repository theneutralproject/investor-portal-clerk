'use server';
import { type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { errorResponse, jsonResponse } from "@/libs/utils";
import { z } from "zod";
import type {
  DealFinancingType,
  DocumentEvent,
  Organization,
  User,
} from "@prisma/client";
import prisma from "@/libs/prisma.server";

const QuerySchema = z.object({
  projectSlug: z.string().min(1),
  dealId: z.string().optional(),
});

async function fetchProjectDocuments(
  projectId: number,
  financingType: DealFinancingType | null,
  neutralUser: User | null
) {
  const documents = await prisma.projectDocument.findMany({
    where: {
      projectId: projectId,
      ...(financingType
        ? {
            OR: [
              { financingTypes: { has: financingType } },
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

  return results;
}

async function fetchProject(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      investmentStats: true,
      propertyStats: true,
      milestones: true,
      pictures: true,
    },
  });
}

async function fetchDeal(id: number) {
  return prisma.deal.findUnique({
    where: { id },
    include: {
      investmentStats: true,
      organization: true,
      document: true,
    },
  });
}

async function checkUserAccess(
  _userId: number,
  _dealOrganization: Organization
) {
  return _dealOrganization.ownerId === _userId;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryResult = QuerySchema.safeParse(
      Object.fromEntries(url.searchParams)
    );

    if (!queryResult.success) {
      return errorResponse("Invalid query parameters", 400);
    }

    const { projectSlug, dealId } = queryResult.data;

    const project = await fetchProject(projectSlug);
    if (!project) {
      return errorResponse("Project not found", 404);
    }

    // Return public project data if dealId is not provided or is "new"
    if (!dealId || dealId.toLowerCase() === "new") {
      return jsonResponse({ project });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return errorResponse("User not authenticated", 401);
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    if (!dbUser) {
      return errorResponse("User not found", 404);
    }

    const deal = await fetchDeal(parseInt(dealId, 10));
    if (!deal) {
      return errorResponse("Deal not found", 404);
    }

    if (deal.projectId !== project.id) {
      return errorResponse(
        "Deal does not belong to the specified project",
        403
      );
    }

    const hasAccess = await checkUserAccess(dbUser.id, deal.organization);
    if (!hasAccess) {
      return errorResponse("You do not have access to this deal", 403);
    }

    const documents = await fetchProjectDocuments(
      project.id,
      deal.investmentStats?.financingType ?? null,
      dbUser
    );

    return jsonResponse({
      project: {
        ...project,
        documents,
      },
      deal,
    });
  } catch (error) {
    console.error("Error in GET /api/deal:", error);
    return errorResponse("Internal server error", 500);
  }
}
