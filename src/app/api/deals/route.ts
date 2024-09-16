import prisma from "@/libs/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import {
  createHubspotDealForContact,
  initDealPropsForProject,
} from "../utils-module/hubspotUtils";
import { isError } from "lodash";
import { getInvestmentEntity, updateDeal } from "../utils-module/dealUtils";
import { DealFinancingType } from "@prisma/client";
import {
  type DealCreateSchema,
  type DealUpdateSchema,
  zDealCreateSchema,
  zDealUpdateSchema,
  jsonResponse,
} from "../utils-module/_globals";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const slug = new URLSearchParams(url.search).get("slug");

  if (!slug) {
    return jsonResponse({ error: "Project slug is required" }, 400);
  }

  try {
    const user = await currentUser();
    if (!user) {
      return jsonResponse({ error: "User not found" }, 404);
    }

    const neutralUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!neutralUser) {
      console.error("Neutral user not found in api/deals");
      return jsonResponse(
        {
          error: `User record with clerkid ${user.id} not found in prisma (GET)`,
        },
        404
      );
    }

    // Find the project based on the slug
    const project = await prisma.project.findUnique({
      where: { slug: slug },
    });

    if (!project) {
      return jsonResponse(
        { error: `Project with slug ${slug} not found` },
        404
      );
    }

    const deals = await prisma.deal.findFirst({
      where: { userId: neutralUser.id, projectId: project.id },
    });

    if (!deals) {
      return jsonResponse(null, 200); // Valid return with no deals found
    }

    return jsonResponse(deals);
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(errorMessage);
    return jsonResponse({ error: "Error fetching data: " + errorMessage }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return jsonResponse({ error: "User not found" }, 404);
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!dbUser) {
      return jsonResponse({ error: `User record with clerkid ${user.id} not found in prisma (POST)` }, 404);
    }

    const requestBody = (await request.json()) as DealCreateSchema;
    let dealData: DealCreateSchema;
    try {
      dealData = zDealCreateSchema.parse(requestBody);
    } catch (parseError) {
      console.error("ERROR: unable to parse POST body:\n", parseError);
      return jsonResponse({ error: "Input data malformatted" }, 400);
    }

    const project = await prisma.project.findUnique({
      where: { id: dealData.projectId },
    });
    if (!project) {
      return jsonResponse(
        { error: `Project with id ${dealData.projectId} not found in DB` },
        400
      );
    }

    dealData.transactionId = `${project.name}-${dbUser.lastName}-${Math.floor(
      Math.random() * 900 + 100
    )}`
      .replace(/\s/g, "")
      .toUpperCase();

    const hsDeal = initDealPropsForProject(project.name, dbUser, dealData);
    if (!hsDeal) {
      return jsonResponse(
        {
          error: "Deal cannot be created. Project not yet supported in Hubspot",
        },
        400
      );
    }

    const hsDealId = await createHubspotDealForContact(
      hsDeal,
      String(dbUser.hubspotId)
    );
    if (isError(hsDealId)) {
      return jsonResponse({ error: "HS Deal cannot be created." }, 400);
    }

    const deal = await prisma.deal.create({
      data: {
        userId: dbUser.id,
        projectId: dealData.projectId,
        dealStage: dealData.dealStage ?? 0,
        amount: 0,
        hubspotId: hsDealId.toString(),
        financingType: dealData.financingType ?? DealFinancingType.equity,
        transactionId: dealData.transactionId,
        investmentEntity:
          getInvestmentEntity(project.name, DealFinancingType.equity) ?? "",
      },
    });

    return jsonResponse(deal);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Error processing request" }, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const requestBody = await request.json();
    let deal: DealUpdateSchema;
    try {
      deal = zDealUpdateSchema.parse(requestBody);
    } catch (parseError) {
      console.error("ERROR: unable to parse PUT body:\n", parseError);
      return jsonResponse({ error: "Input data malformatted" }, 400);
    }

    const updatedDeal = await updateDeal(deal);
    return jsonResponse(updatedDeal);
  } catch (error) {
    console.error("Error updating deal:", error);
    return jsonResponse({ error: "Error updating deal" }, 500);
  }
}
