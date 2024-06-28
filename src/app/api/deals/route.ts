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
import { DealCreateSchema, DealUpdateSchema, zDealCreateSchema, zDealUpdateSchema } from "../utils-module/_globals";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const projectId = new URLSearchParams(url.search).get("projectId");

  if (!projectId) {
    return new Response(JSON.stringify({ error: "Project ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const projectIdAsInt = parseInt(projectId, 10);
  if (isNaN(projectIdAsInt)) {
    return new Response(JSON.stringify({ error: "Invalid Project ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const neutralUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!neutralUser) {
      console.error("neutral user not found in api/deals")
      return new Response(JSON.stringify({ error: "User record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const deals = await prisma.deal.findFirst({
      where: { userId: neutralUser.id, projectId: projectIdAsInt },
      // include: { project: true },
    });

    if (!deals) {
      return new Response(
        // JSON.stringify({ error: "No deals found for this project" }),
        JSON.stringify(null),
        {
          status: 200, //Valid return
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(deals), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return new Response(
      JSON.stringify({ error: "Error fetching data: " + errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
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
      return jsonResponse({ error: "User record not found" }, 404);
    }

    // eslint-disable-next-line
  const requestBody = (await (request as Request).json())  as DealCreateSchema;
  let dealData: DealCreateSchema;
  try {
    dealData = zDealCreateSchema.parse(requestBody)
  } catch (parseError) {
    console.error("ERROR: unable to parse PUT body:\n", parseError);
    return jsonResponse({ error: "input data malformatted" }, 400);
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

      const transactionId = `${project.name}-${dbUser.lastName}-${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`.replace(/\s/g, '').toUpperCase();

      const hsDeal = initDealPropsForProject(project.name, dbUser, transactionId);
      if (!hsDeal) {
        return jsonResponse(
          {
            error:
              "Deal cannot be created. Project not yet supported in Hubspot",
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
          transactionId: transactionId,
          investmentEntity: getInvestmentEntity(project.name, DealFinancingType.equity) ?? ""
        },
      });

      return jsonResponse(deal);

  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Error processing request" }, 500);
  }
}

export async function PUT(request:NextRequest) {
  // eslint-disable-next-line
  const requestBody = (await (request as Request).json())
  let deal: DealUpdateSchema;
  try {
    deal = zDealUpdateSchema.parse(requestBody)
  } catch (parseError) {
    console.error("ERROR: unable to parse PUT body:\n", parseError);
    return jsonResponse({ error: "input data malformatted" }, 400);
  }
  const updatedDeal = await updateDeal(deal);
  return jsonResponse(updatedDeal);

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
