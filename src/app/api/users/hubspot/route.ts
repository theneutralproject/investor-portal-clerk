
import type { NextRequest } from "next/server";
import { HubspotContact, ReferralSource, updateContact, zHsContactUpdateSchema } from "../../utils-module/hubspotUtils";
import { jsonResponse } from "../../utils-module/_globals";
import { isError } from "lodash";
import { getErrorMessage } from "../../utils-module/helpers";

// used to update an existing user in hubspot
export async function PUT(request: NextRequest) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const requestBody = await request.json();

    let hsContact: HubspotContact;
    try {
        hsContact = zHsContactUpdateSchema.parse(requestBody)
    } catch (parseError) {
        console.error("ERROR: unable to parse PUT body:\n", parseError);
        return jsonResponse({ error: "Input data malformatted" }, 400);
    }

    const hsResponse = await updateContact(hsContact);
    if (isError(hsResponse)) {
        return new Response(
            JSON.stringify({ error: getErrorMessage(hsResponse) }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    return new Response(JSON.stringify(hsResponse), {
        headers: { "Content-Type": "application/json" },
    });
}