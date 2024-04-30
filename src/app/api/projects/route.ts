import prisma from "@/libs/prisma";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);

    const id = queryParams.get("id");

    let parsedId = undefined;
    if (id) {
      parsedId = parseInt(id, 10);
    }

    const projects = await prisma.project.findMany({
      where: { id: parsedId },
      include: {
        pictures: true,
      },
    });

    if (!projects) {
      return new Response(JSON.stringify({ error: "Projects not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(projects), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
