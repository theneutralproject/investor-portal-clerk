import prisma from "@/libs/prisma";
import { currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";

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