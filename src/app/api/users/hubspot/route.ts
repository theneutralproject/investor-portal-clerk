
import type { NextRequest } from "next/server";
import { isError } from "lodash";
import { type HubspotContact, zHsContactUpdateSchema } from "@/libs/hubspot/schema";
import { updateHubspotContact } from "@/libs/hubspot/utils";
import { getErrorMessage, jsonResponse } from "@/libs/utils";

/**
 * ! THIS ROUTE IS NOT CURRENTLY USED AND SHOULD BE DELETED
 * @deprecated Hubspot contacts are updated via the PUT api/users route
 *  */ 
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

    const hsResponse = await updateHubspotContact(hsContact);
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