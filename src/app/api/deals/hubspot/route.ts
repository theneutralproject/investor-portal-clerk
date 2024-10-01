import { HubspotDealUpdate, zHsUpdateDealSchema, HsDealDocsAccessedUpdateSchema, zHsDealDocsAccessedUpdateSchema } from "@/libs/hubspot/schema";
import { jsonResponse } from "@/libs/utils";
import type { NextRequest } from "next/server";
/**
 * This function is used to update any of the deal properties in hubspot
 * 
 * @param request 
 * @returns { message: "success" }
 */
export async function PUT(request: NextRequest) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const requestBody = await request.json();
        let deal: HubspotDealUpdate;
        try {
            deal = zHsUpdateDealSchema.parse(requestBody)
        } catch (parseError) {
            console.error("ERROR: unable to parse PUT body:\n", parseError);
            return jsonResponse({ error: "Input data malformatted" }, 400);
        }

        const body = JSON.stringify({
            properties: deal.properties
        });

        await fetch(
            `https://api.hubapi.com/deals/v1/deal/${deal.hubspotDealId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
                },
                body,
            }
        ).then(async (response) => response)
            .catch((err) => {
                const errorMessage = (err as Error).message;
                console.log("unable to update Hubspot deal:")
                console.log(err)
                return jsonResponse({ error: errorMessage ?? "unable to update HS deal" }, 500);
            })
        return jsonResponse({ message: "success" });
    } catch (error) {
        console.error("Error updating Hubspot deal:", error);
        return jsonResponse({ error: "Error updating Hubspot deal" }, 500);
    }
}


/**
 * This function is only used to update the `documents_accessed` property for a given deal
 * 
 * @param request (body must be of type HsDealDocsAccessedUpdateSchema)
 * @returns { message: "success" }
 * @throws { error: errorMessage }
 */
export async function POST(request: NextRequest) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const requestBody = await request.json();
        let deal: HsDealDocsAccessedUpdateSchema;
        try {
            deal = zHsDealDocsAccessedUpdateSchema.parse(requestBody)
        } catch (parseError) {
            console.error("ERROR: unable to parse POST body:\n", parseError);
            return jsonResponse({ error: "Input data malformatted" }, 400);
        }

        const body = JSON.stringify({
            "dealId": deal.dealId,
            "documents": deal.documentNames,
        });

        // we set up webhooks in hubspot in order to trigger an internal email notification
        // URL stems from workflow trigger "project_documents_accessed" and "finance_documents_accessed" webhook
        const url = deal.dealStage === 1
            ? `https://api-na1.hubapi.com/automation/v4/webhook-triggers/24164917/ICxJOU0`
            : 'https://api-na1.hubapi.com/automation/v4/webhook-triggers/24164917/sSDHS4I'
        await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
                },
                body,
            }
        ).then(async (response) => response)
            .catch((err) => {
                const errorMessage = (err as Error).message;
                console.log("unable to POST Hubspot deal:")
                console.log(err)
                return jsonResponse({ error: errorMessage ?? "unable to POST HS deal" }, 500);
            })
        return jsonResponse({ message: "success" });
    } catch (error) {
        console.error("Error updating Hubspot deal:", error);
        return jsonResponse({ error: "Error updating Hubspot deal" }, 500);
    }
}