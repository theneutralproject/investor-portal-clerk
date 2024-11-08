'use server';
import type { DocumentEventCreateSchema } from "@/libs/document/schema";
import prisma from "@/libs/prisma.server";
import { currentUser } from "@clerk/nextjs";
import type { NextRequest } from "next/server";

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
  
      const requestBody = (await request.json()) as DocumentEventCreateSchema;
      const { documentId, type } = requestBody;
  
      if (!documentId || !type) {
        return new Response(
          JSON.stringify({
            error: "All parameters (documentId, type) are required",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
  
      // Create the document event
      const documentEvent = await prisma.documentEvent.create({
        data: {
          userId: neutralUser.id,
          documentId,
          date: new Date(),
          type,
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