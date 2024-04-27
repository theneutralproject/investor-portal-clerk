/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import prisma from "@/libs/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import { createDealForContact, initDealPropsForProject } from "../utils-module/hubspotUtils";
import { getErrorMessage } from "../utils-module/helpers";
import { isError } from "lodash";
import  { zDealUpdateSchema } from "../utils-module/_globals";

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

    const projectId = queryParams.get("projectId");

    let projectIdAsInt = -1;
    if (projectId) {
      projectIdAsInt = parseInt(projectId, 10);
    } else {
      return new Response(JSON.stringify({ error: "Project ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deals = await prisma.deal.findFirst({
      where: { userId: neutralUser?.id, projectId: projectIdAsInt },
    });

    return new Response(JSON.stringify(deals), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
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

  if (!neutralUser) {
    return new Response(JSON.stringify({ error: "User record not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Extract projectId and operation from request body
    const requestBody = await request.json();
    const { projectId, operation } = requestBody;

    if (!projectId) {
      return new Response(JSON.stringify({ error: "Project ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const projectIdAsInt = parseInt(projectId as string, 10);
    if (isNaN(projectIdAsInt)) {
      return new Response(JSON.stringify({ error: "Invalid Project ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const project = await prisma.project.findUnique({ where: { id: projectIdAsInt } });
    if (!project) {
      return new Response(JSON.stringify({ error: `Project with id ${projectId} not found in DB` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }


    // Retrieve or create the deal
    let deal = await prisma.deal.findFirst({
      where: { userId: neutralUser.id, projectId: projectIdAsInt },
    });

    // Create a new deal if not found
    if (!deal) {
      //TODO: Create Deal in Hubspot. Then get the ID. Then create deal in prisma DB
      const hsDeal = initDealPropsForProject(project.name, neutralUser);
      if (!hsDeal) {
        return new Response(
          JSON.stringify({ error: "Deal cannot be created. Project not yet suported in Hubspot" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      try {
        try {
          // const { dealId } = zHsDealSchema.parse(await createDealForContact(hsDeal, neutralUser.hubspotId))
          const dealId = await createDealForContact(hsDeal, neutralUser.hubspotId)

          if(isError(dealId)) {
            return new Response(
              JSON.stringify({ error: "HS Deal cannot be created." }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          deal =  await prisma.deal.create({
            data: {
              userId: neutralUser.id,
              projectId: projectIdAsInt,
              dealStage: 0, // Initialize dealStage
              amount: 0, // Initialize any other necessary fields
              hubspotId: dealId.toString()
            },
          });
        } catch (err) {
          return new Error(getErrorMessage(err));
        }

      } catch (err) {
        return new Error(getErrorMessage(err))
      }
    }

    // Determine operation and apply it to the dealStage
    switch (operation) {
      case "increment":
        deal.dealStage++;
        break;
      case "reset":
        //For this user, delete all DocumentEvent
        await prisma.documentEvent.deleteMany({
          where: {
            userId: neutralUser.id,
          },
        });

        deal.dealStage = 0;
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid operation specified" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
    }


    // TODO: update Hubspot dealstage


    // Update the deal in the database
    const updatedDeal = await prisma.deal.update({
      where: { id: deal.id },
      data: { dealStage: deal.dealStage },
    });

    return new Response(JSON.stringify(updatedDeal), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error processing request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request: NextRequest) {
  const { hubspotId, dealStage, amount, financingType } = zDealUpdateSchema.parse(await request.json());

  /* eslint-disable */
  interface PartialDeal {
    [key: string]: any
  }
  /* eslint-enable */

  const data: PartialDeal = {}
  if (dealStage) {
    data.dealStage = dealStage
  }

  if (amount) {
    data.amount = amount
  }

  if (financingType) {
    data.financingType = financingType
  }
  const updatedDeal = await prisma.deal.update({
    where: { hubspotId: hubspotId },
    data: data
  }).catch((err) => {
    console.error(err);
    return new Response(JSON.stringify({ error: getErrorMessage(err) }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  });

  return new Response(JSON.stringify(updatedDeal), {
    headers: { "Content-Type": "application/json" },
  });
}