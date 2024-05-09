import prisma from "@/libs/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import {
  createHubspotDealForContact,
  initDealPropsForProject,
} from "../utils-module/hubspotUtils";
import { isError } from "lodash";
import { getInvestmentEntity } from "../utils-module/dealUtils";
import { DealFinancingType } from "@prisma/client";

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
    console.log(`clerk id: ${user?.id}`)
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
      console.log("neutral user not found in api/deals")
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
        JSON.stringify([]),
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

    const neutralUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!neutralUser) {
      return jsonResponse({ error: "User record not found" }, 404);
    }

    const requestBody = (await (request as Request).json()) as {
      projectId: string;
      operation: string;
    };
    const { projectId, operation } = requestBody;
    if (!projectId) {
      return jsonResponse({ error: "Project ID is required" }, 400);
    }

    const projectIdAsInt = parseInt(projectId, 10);
    if (isNaN(projectIdAsInt)) {
      return jsonResponse({ error: "Invalid Project ID" }, 400);
    }

    const project = await prisma.project.findUnique({
      where: { id: projectIdAsInt },
    });
    if (!project) {
      return jsonResponse(
        { error: `Project with id ${projectId} not found in DB` },
        400
      );
    }

    let deal = await prisma.deal.findFirst({
      where: { userId: neutralUser.id, projectId: projectIdAsInt },
    });

    if (!deal) {
      console.log("no deal yet");
      const transactionId = `${project.name}-${neutralUser.lastName}-${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`.replace(/\s/g, '').toUpperCase();

      const hsDeal = initDealPropsForProject(project.name, neutralUser, transactionId);
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
        String(neutralUser.hubspotId)
      );
      if (isError(hsDealId)) {
        return jsonResponse({ error: "HS Deal cannot be created." }, 400);
      }

      deal = await prisma.deal.create({
        data: {
          userId: neutralUser.id,
          projectId: projectIdAsInt,
          dealStage: 0,
          amount: 0,
          hubspotId: hsDealId.toString(),
          financingType: DealFinancingType.equity,
          transactionId: transactionId,
          investmentEntity: getInvestmentEntity(project.name, DealFinancingType.equity) ?? ""
        },
      });
    }

    if (!["increment", "reset"].includes(operation)) {
      return jsonResponse({ error: "Invalid operation specified" }, 400);
    }

    if (operation === "reset") {
      await prisma.documentEvent.deleteMany({
        where: { userId: neutralUser.id },
      });
      deal.dealStage = 0;
    } else if (operation === "increment") {
      deal.dealStage++;
    }

    const updatedDeal = await prisma.deal.update({
      where: { id: deal.id },
      data: { dealStage: deal.dealStage },
    });

    return jsonResponse(updatedDeal);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Error processing request" }, 500);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
