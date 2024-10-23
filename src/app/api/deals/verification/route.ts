import { type AccreditationVerificationCreateSchema, zAccreditationVerificationCreateSchema } from "@/libs/accreditationVerification/schema";
import prisma from "@/libs/prisma";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import type { AccreditationVerifier } from "@prisma/client";
import type { NextRequest } from "next/server";

/**
 * Specify a AccreditationVerification details for a deal
 * @param request body with AccreditationVerificationCreateSchema
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
        const requestBody = (await request.json()) as AccreditationVerificationCreateSchema;
        let requestData: AccreditationVerificationCreateSchema;

        try {
            requestData = zAccreditationVerificationCreateSchema.parse(requestBody)
        } catch (parseError) {
            console.error("unable to parse POST body:\n", parseError);
            return jsonResponse({ error: "Input data malformatted" }, 400);
        }

        const { dealId, method, verifier} = requestData;

        // check if deal belongs to the user
        const dealToUpdate = await prisma.deal.findFirst({
            where: { id: dealId, organization: { ownerId: user.id } },
        });
        if (!dealToUpdate) {
            console.error(`You do not have access to deal id ${dealId} (POST)`);
            return jsonResponse({ error: `You do not have access to deal id ${dealId}` }, 404);
        }
        let newVerifier: AccreditationVerifier | undefined;
        if (verifier) {
            newVerifier = await prisma.accreditationVerifier.create({ data: verifier });
        }

        const newAccreditationVerification = await prisma.accreditationVerification.create({ data: {dealId, method, verifierId: newVerifier?.id ?? null} });
        return jsonResponse(newAccreditationVerification);
    } catch (error) {
        console.error("ERROR: unable to create AccreditationVerification:\n", error);
        return jsonResponse({ error: "Unable to create AccreditationVerification" }, 500);
    }
}
