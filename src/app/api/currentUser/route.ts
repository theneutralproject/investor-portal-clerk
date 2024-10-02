/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import prisma from "@/libs/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: NextRequest) {
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

    return new Response(JSON.stringify(neutralUser), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
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
    const { referralSource } = await request.json();

    if (!referralSource) {
      return new Response(JSON.stringify({ error: "Referral source is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { clerkId: id },
      data: { referralSource },
    });

    return new Response(JSON.stringify(updatedUser), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error updating referral source" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}