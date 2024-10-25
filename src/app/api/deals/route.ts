import prisma from "@/libs/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import { isError } from "lodash";
import { DealFinancingType } from "@prisma/client";
import {
  type DealCreateSchema,
  type DealUpdateSchema,
  zDealCreateSchema,
  zDealUpdateSchema,
} from "../../../libs/deal/schema";
import type { HubspotDealUpdate } from "@/libs/hubspot/schema";
import { initDealPropsForProject, createHubspotDealForContact, DealToHubspotDealEnum, updateHubspotDealProperties } from "@/libs/hubspot/utils";
import { jsonResponse } from "@/libs/utils";
import { getInvestmentEntity, updateDeal } from "@/libs/deal/utils";
import { getEquityStatsFromProject } from "@/libs/project/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * 
 * @param request 
 * @returns Deal for a given project, if the user is a member of the organization that owns the deal
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const slug = new URLSearchParams(url.search).get("slug");

  if (!slug) {
    return jsonResponse({ error: "Project slug is required" }, 400);
  }

  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return jsonResponse({ error: "User not found" }, 404);
    }
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    if (!dbUser) {
      console.error("Neutral user not found in api/deals");
      return jsonResponse(
        {
          error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
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

    const userOrgs = await prisma.organization.findMany({
      where: { members: { some: { userId: dbUser.id } } },
    });

    const deals = await prisma.deal.findMany({
      where: { organizationId: { in: userOrgs.map((org) => org.id) }, projectId: project.id },
      include: { investmentStats: true }
    });

    if (!deals || deals.length === 0) {
      return jsonResponse(null, 200); // Valid return with no deals found
    }


    // only return deals for organizations (1) that the user is the owner of, or (2) that are completed, and the user is a member of its organization
    return jsonResponse(deals.filter(deal => deal.dealStage === 5 || userOrgs.some(org => org.id === deal.organizationId && org.ownerId === dbUser.id))[0] ?? null);

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
      include: { investmentStats: true }
    });
    if (!project || !project.investmentStats || !project.equityReturnsFile) {
      return jsonResponse(
        { error: `Project with id ${dealData.projectId} not found in DB` },
        400
      );
    }

    // only create a deal if the user is the owner of the organization
    if (dealData.organizationId) {
      const org = await prisma.organization.findFirst({
        where: { id: dealData.organizationId, ownerId: dbUser.id }
      });
      if (!org) {
        return jsonResponse(
          {
            error: `Deal cannot be created. User is not the owner of the organization`,
          },
          403
        );
      }
    }

    if (!dealData.organizationId) {
      // use the default organization:
      const userOrg = await prisma.organization.findFirst({
        where: { ownerId: dbUser.id }
      });
      if (userOrg) {
        dealData.organizationId = userOrg.id;
      }
      else return jsonResponse(
        {
          error: `Deal cannot be created. No Owner Org was found for the User w ID ${dbUser.id}`,
        },
        500
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

    if (!dealData.financingType) dealData.financingType = DealFinancingType.equity;
    let minInvestmentAmount = 5000;
    if (dealData.financingType === DealFinancingType.equity) minInvestmentAmount = project.investmentStats?.equityMinInvestment ?? 5000;
    else minInvestmentAmount = project.investmentStats?.debtMinInvestment ?? 5000;

    if (!dealData.amount) dealData.amount = minInvestmentAmount;
    const equityDetails = await getEquityStatsFromProject(dealData.amount, project.equityReturnsFile, project.investmentStats.cUnitThresholdAmount);
    if (isError(equityDetails)) {
        console.error(
            `Failed to get equity stats during deal creation`
        );
        return jsonResponse({ error: "Failed to get equity stats during deal creation" }, 500);
    }
    const { unitType, shareOfEquity, numberAUnits, numberCUnits } = equityDetails;

    const deal = await prisma.deal.create({
      data: {
        organizationId: dealData.organizationId,
        projectId: dealData.projectId,
        dealStage: dealData.dealStage ?? 0,
        hubspotId: hsDealId.toString(),
        transactionId: dealData.transactionId,
        investmentEntity:
          getInvestmentEntity(project.name, dealData.financingType) ?? "",
      },
    });

    await prisma.dealInvestmentStats.create({
      data: {
        dealId: deal.id,
        amount: dealData.amount,
        financingType: dealData.financingType,
        unitType,
        shareOfEquity,
        numberAUnits,
        numberCUnits,
        /**all other fields have postgresql defaults */
      }
    })

    return jsonResponse(deal);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Error processing request" }, 500);
  }
}

/**
 * Update a deal in the DB, and also trigger a deal update in hubspot
 * @param request 
 * @returns updated Deal
 */
export async function PUT(request: NextRequest) {
  try {
    const requestBody = await request.json() as DealUpdateSchema;
    let deal: DealUpdateSchema;
    try {
      deal = zDealUpdateSchema.parse(requestBody);

    } catch (parseError) {
      console.error("ERROR: unable to parse PUT body:\n", parseError);
      return jsonResponse({ error: "Input data malformatted" }, 400);
    }

    const hsDeal: HubspotDealUpdate = {
      hubspotDealId: parseInt(deal.hubspotId, 10),
      properties: []
    }
    for (const prop in deal) {
      if (Object.prototype.hasOwnProperty.call(deal, prop)) {
        if (prop in DealToHubspotDealEnum && deal[prop as keyof DealUpdateSchema]?.toString().length) {
          hsDeal.properties.push({
            name: DealToHubspotDealEnum[prop as keyof typeof DealToHubspotDealEnum],
            value: deal[prop as keyof DealUpdateSchema]?.toString() ?? ""
          })
        }
      }
    }

    const updatedDeal = await updateDeal(deal);

    // also update the deal in hubspot:
    await updateHubspotDealProperties(hsDeal);

    return jsonResponse(updatedDeal);
  } catch (error) {
    console.error("Error updating deal:", error);
    return jsonResponse({ error: "Error updating deal" }, 500);
  }
}
