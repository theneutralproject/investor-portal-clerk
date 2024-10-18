import { type AccreditationVerifierCreateSchema, zAccreditationVerifierCreateSchema } from "@/libs/accreditationVerifier/schema";
import prisma from "@/libs/prisma";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

/**
 * Specify an AccreditationVerifier for a deal
 * @param request 
 * @returns 
 */
export async function POST(request: NextRequest) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
    });
    if (!user) {
        return jsonResponse({ error: `User record with clerkid ${clerkUser.id} not found in prisma (POST)` }, 404);
    }

    try {
        const requestBody = (await request.json()) as AccreditationVerifierCreateSchema;
        let requestData: AccreditationVerifierCreateSchema;

        try {
            requestData = zAccreditationVerifierCreateSchema.parse(requestBody)
        } catch (parseError) {
            console.error("unable to parse POST body:\n", parseError);
            return jsonResponse({ error: "Input data malformatted" }, 400);
        }

        const { dealId, ...data } = requestData;

        // update the deal if it belongs to the user
        const dealToUpdate = await prisma.deal.findFirst({
            where: { id: dealId, },
            include: { organization: true }
        });
        if (!dealToUpdate) {
            console.error(`Deal with id ${dealId} not found in prisma (POST)`);
            return jsonResponse({ error: `Deal with id ${dealId} not found in prisma (POST)` }, 404);
        }

        if (dealToUpdate.organization.ownerId !== user.id) {
            console.error(`User ${user.id} is not authorized to edit the deal with id ${dealId}:\n`);
            return jsonResponse({ error: "You are not the owner of the deal you are looking to edit" }, 401);
        }

        const newAccreditationVerifier = await prisma.accreditationVerifier.create({ data });

        await prisma.deal.update({
            where: { id: dealId },
            data: {
                accreditationVerifier: {
                    connect: { id: newAccreditationVerifier.id }
                }
            }
        });

        return jsonResponse(newAccreditationVerifier);
    } catch (error) {
        console.error("ERROR: unable to create AccreditationVerifier:\n", error);
        return jsonResponse({ error: "Unable to create AccreditationVerifier" }, 500);
    }
}
