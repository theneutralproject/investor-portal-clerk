
import { getErrorMessage } from "../utils-module/helpers";
import { type DocusignEnvelopeSchema, jsonResponse, zDocusignEnvelope } from "../utils-module/_globals";
import { instantiateApiClient, makeEnvelope, makeRecipientViewRequest, refreshAccessToken } from '../utils-module/docusignUtils';
import { isError } from "lodash";
import prisma from "@/libs/prisma";
import { toWords } from "number-to-words";

export async function POST(req: Request) {
    let envelopeData: DocusignEnvelopeSchema;
    try {
        (envelopeData = zDocusignEnvelope.parse(await req.json()))
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

    /*
        numAUnits: z.number().optional(),
        numCUnits: z.number().optional(),
        investorName: z.string().optional(),
    */
   envelopeData.amountSpelledOut = toWords(envelopeData.amount);

    // get user from db
    const signer = await prisma.user.findFirst({
        where: { clerkId: envelopeData.clerkUserId },
        include: { address: true }
      });
      if (!signer) {
        console.error("Neutral user not found in api/deals");
        return jsonResponse({ error: `User record with clerkid ${envelopeData.clerkUserId} not found in prisma (GET)` }, 404);
      }
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

    const envelopesApi = await instantiateApiClient(accessTokenResponse.accessToken);
    // const templateId = "fec97532-95f5-4da8-a537-8d84b64409ba";  

    const envelope = makeEnvelope(envelopeData, signer);
    const envelopeResponse = await envelopesApi.createEnvelope(
        process.env.DOCUSIGN_API_ACCOUNT_ID!,
        { envelopeDefinition: envelope }
    ).catch((err) => {
        console.error("CANNOT CREATE ENVELOPE:", err)
        return new Error(getErrorMessage(err))
    })

    if (isError(envelopeResponse)) {
        console.error("returning error for bad envelopeResponse")
        return new Response(
            JSON.stringify(envelopeResponse),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const returnUrl = `${process.env.BASE_URL}/projects/${envelopeData.projectId}`
    // Create the recipient view for the Signing Ceremony
    const viewRequest = makeRecipientViewRequest(signer, returnUrl);
    const viewRequestResponse = await envelopesApi.createRecipientView(process.env.DOCUSIGN_API_ACCOUNT_ID!, envelopeResponse.envelopeId!,
        { recipientViewRequest: viewRequest });

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