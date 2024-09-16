import prisma from "@/libs/prisma";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  let slug: string | undefined;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);

    slug = queryParams.get("slug") ?? undefined;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const projects = await prisma.project
    .findMany({
      where: { slug: slug },
      include: {
        pictures: true,
      },
    })
    .catch((findManyError) => {
      console.error(
        `Could not fetch projects with slug ${slug}: ${findManyError}`
      );
      return new Response(JSON.stringify({ error: "Projects not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    });

  if (!projects || projects.length === 0) {
    return new Response(JSON.stringify({ error: "Projects not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(projects), {
    headers: { "Content-Type": "application/json" },
  });
}
