import prisma from "@/libs/prisma";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  console.log("1 - IN GET PROJECT", request.url)
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

  console.log("2 - IN GET PROJECT - ID:", parsedId)
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
