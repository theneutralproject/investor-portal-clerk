/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import prisma from "@/libs/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";

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
    const projectId = parseInt(queryParams.get("projectId") ?? "", 10);

    if (isNaN(projectId)) {
      return new Response(JSON.stringify({ error: "Invalid Project ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const documents = await prisma.document.findMany({
      where: { projectId: projectId },
      include: {
        documentEvents: {
          where: { userId: neutralUser?.id },
        },
      },
    });

    const results = documents.map((doc) => ({
      ...doc,
      completed: doc.documentEvents.some(
        (event) => event.documentId === doc.id
      ),
    }));

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Create a DocumentEvent for the given document and user
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

    const requestBody = await request.json();
    const { projectId, documentId, type } = requestBody;

    if (!projectId || !documentId || !type) {
      return new Response(
        JSON.stringify({
          error: "All parameters (projectId, documentId, type) are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const parsedProjectId = parseInt(String(projectId), 10);
    const parsedDocumentId = parseInt(String(documentId), 10);
    if (isNaN(parsedProjectId) || isNaN(parsedDocumentId)) {
      return new Response(JSON.stringify({ error: "Invalid IDs" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create the document event
    const documentEvent = await prisma.documentEvent.create({
      data: {
        userId: neutralUser.id,
        documentId: parsedDocumentId,
        date: new Date(),
        type: type,
      },
    });

    return new Response(JSON.stringify(documentEvent), {
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
