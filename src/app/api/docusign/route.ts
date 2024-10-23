import { isError } from "lodash";
import prisma from "@/libs/prisma";
import { type DocusignEnvelopeCreateSchema, zDocusignEvelopeCreate } from '@/libs/docusign/schema';
import { getErrorMessage, jsonResponse } from '@/libs/utils';
import { refreshAccessToken, instantiateApiClient, makeEnvelope, makeRecipientViewRequest } from "@/libs/docusign/utils";
import { currentUser } from "@clerk/nextjs/server";
import { decryptData } from "@/libs/encryption/utils";

export async function POST(req: Request) {

    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "User not found" }, 404);
    }

    const userWOrgsAndAddress = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: {
            address: true,
            organizationMember: {
                include: {
                    user: true
                }
            },
        }
    });
    if (!userWOrgsAndAddress) {
        console.error("Neutral user not found in api/deals");
        return jsonResponse(
            {
                error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
            },
            404
        );
    }
    if (userWOrgsAndAddress.ssn) userWOrgsAndAddress.ssn = decryptData(userWOrgsAndAddress.ssn);

    let payload: DocusignEnvelopeCreateSchema;
    try {
        (payload = zDocusignEvelopeCreate.parse(await req.json()))
    } catch (err) {
        console.error("Error parsing Docusign POST payload: ", getErrorMessage(err));
        return new Response(
            JSON.stringify({ error: "Unable to parse Docusign POST payload:", err }),
            {
                status: 404,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    // get deal from db that belongs to the user's organization
    const deal = await prisma.deal.findFirst({
        where: {
            id: payload.dealId,
            organizationId: { in: userWOrgsAndAddress.organizationMember.filter(om => om.type === "OWNER").map(om => om.organizationId) }
        }, include: {
            investmentStats: true,
            accreditationVerification: { include: { verifier: true } },
            organization: { include: { members: { include: { user: true } }, address: true } },
            project: true
        }
    });

    if (!deal?.investmentStats) {
        console.error(`Deal with id ${payload.dealId} not found in user's organization`);
        return jsonResponse({ error: `Deal with id ${payload.dealId} not found in user's organization` }, 404);
    }

    if (deal.organization.tin) deal.organization.tin = decryptData(deal.organization.tin);

    const accessTokenResponse = await refreshAccessToken();
    if (accessTokenResponse.consentUrl) {
        // we need to get consent from the user to share their data with docusign. 
        return new Response(
            JSON.stringify({ consentUrl: accessTokenResponse.consentUrl }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const envelopesApi = await instantiateApiClient(accessTokenResponse.accessToken)
    const envelope = makeEnvelope(
        payload.envelopeId,
        deal.organization,
        { ...deal, accreditationVerification: deal.accreditationVerification, investmentStats: deal.investmentStats },
        userWOrgsAndAddress
    );
    const envelopeResponse = await envelopesApi.createEnvelope(
        process.env.DOCUSIGN_API_ACCOUNT_ID!,
        { envelopeDefinition: envelope }
    ).catch((err) => {
        console.error("CANNOT CREATE ENVELOPE:", getErrorMessage(err));
        return new Error(getErrorMessage(err));
    })

    if (isError(envelopeResponse)) {
        console.error("returning error for bad envelopeResponse")
        return new Response(
            JSON.stringify("unable to create envelope"),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    // TODO: route to the correct sub page after signing
    const returnUrl = `${process.env.BASE_URL}/projects/${deal.project.slug}`
    // Create the recipient view for the Signing Ceremony
    const viewRequest = makeRecipientViewRequest(userWOrgsAndAddress, returnUrl);
    const viewRequestResponse = await envelopesApi.createRecipientView(process.env.DOCUSIGN_API_ACCOUNT_ID!, envelopeResponse.envelopeId!,
        { recipientViewRequest: viewRequest })
        .catch((err) => {
            console.error("CANNOT CREATE RECIPIENT VIEW:", getErrorMessage(err));
            return new Error(getErrorMessage(err));
        });

    if (isError(viewRequestResponse)) {
        console.error("returning error for bad makeRecipientViewRequest")
        return new Response(
            JSON.stringify(viewRequestResponse.message),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    return new Response(
        JSON.stringify(viewRequestResponse),
        {
            status: 201,
            headers: { "Content-Type": "application/json" },
        }
    );
}