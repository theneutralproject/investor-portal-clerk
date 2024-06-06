
import { getErrorMessage } from "../utils-module/helpers";
import { type DocusignPayloadSchema, zDocusignPayload } from "../utils-module/_globals";
import { instantiateApiClient, makeEnvelope, makeRecipientViewRequest, refreshAccessToken } from '../utils-module/docusignUtils';
import { isError } from "lodash";

export async function POST(req: Request) {
    let envelopeData: DocusignPayloadSchema;
    try {
        (envelopeData = zDocusignPayload.parse(await req.json()))
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
    const templateId = "fec97532-95f5-4da8-a537-8d84b64409ba";  // template in test docusign account. TODO: fetch from DB based on project

    const envelope = makeEnvelope(envelopeData, templateId);
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

    // Create the recipient view for the Signing Ceremony
    const viewRequest = makeRecipientViewRequest(envelopeData);
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
    
    console.log("viewRequestResponse", viewRequestResponse.url);

    return new Response(
        JSON.stringify(viewRequestResponse),
        {
            status: 201,
            headers: { "Content-Type": "application/json" },
        }
    );
}