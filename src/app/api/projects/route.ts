import prisma from "@/libs/prisma";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  let parsedId = undefined;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);

    const id = queryParams.get("id");

    if (id) {
      parsedId = parseInt(id, 10);
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const projects = await prisma.project.findMany({
    where: { id: parsedId },
    include: {
      pictures: true,
    },
  }).catch((findManyError) => {
    console.error(`Could not fetch projects with id ${parsedId}: ${findManyError}`)
    return new Response(JSON.stringify({ error: "Projects not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  })

  if (!projects) {
    return new Response(JSON.stringify({ error: "Projects not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(projects), {
    headers: { "Content-Type": "application/json" },
  });
}
