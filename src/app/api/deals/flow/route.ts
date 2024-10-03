import { type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { jsonResponse } from "@/libs/utils";
import prisma from "@/libs/prisma";
import { z } from "zod";

const QuerySchema = z.object({
  projectSlug: z.string().min(1),
  dealId: z.string().optional(),
});

const errorResponse = (message: string, status: number) =>
  jsonResponse({ error: message }, status);

async function fetchProject(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      investmentStats: true,
      propertyStats: true,
      milestones: true,
      pictures: true,
      documents: {
        where: { documentType: "DOCUMENT" },
      },
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

async function fetchUser(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
    include: {
      Organization_organizationUsers: true,
      primaryOrganization: true,
    },
  });
}

async function checkUserAccess(userId: string, dealOrganizationId: number) {
  const dbUser = await fetchUser(userId);
  if (!dbUser) {
    throw new Error(`User record with clerkid ${userId} not found in prisma`);
  }

  const userOrganizationIds = [
    ...dbUser.Organization_organizationUsers.map((org) => org.id),
    dbUser.primaryOrganization?.id,
  ].filter(Boolean);

  return userOrganizationIds.includes(dealOrganizationId);
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

    const hasAccess = await checkUserAccess(clerkUser.id, deal.organizationId);
    if (!hasAccess) {
      return errorResponse("You do not have access to this deal", 403);
    }

    return jsonResponse({ project, deal });
  } catch (error) {
    console.error("Error in GET /api/deal:", error);
    return errorResponse("Internal server error", 500);
  }
}
