/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import prisma from "@/libs/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: { url: string | URL }) {
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

    let parsedId = undefined;
    if (projectId) {
      parsedId = parseInt(projectId, 10);
    }

    const deals = await prisma.deal.findFirst({
      where: { userId: neutralUser?.id, projectId: parsedId },
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

    if (!neutralUser) {
      return new Response(JSON.stringify({ error: "User record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract projectId and operation from request body
    const requestBody = await request.json();
    const { projectId, operation } = requestBody;

    if (!projectId) {
      return new Response(JSON.stringify({ error: "Project ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const parsedId = parseInt(projectId as string, 10);
    if (isNaN(parsedId)) {
      return new Response(JSON.stringify({ error: "Invalid Project ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Retrieve or create the deal
    let deal = await prisma.deal.findFirst({
      where: { userId: neutralUser.id, projectId: parsedId },
    });

    // Create a new deal if not found
    if (!deal) {
      deal = await prisma.deal.create({
        data: {
          userId: neutralUser.id,
          projectId: parsedId,
          dealStage: 0, // Initialize dealStage
          amount: 0, // Initialize any other necessary fields
        },
      });
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
