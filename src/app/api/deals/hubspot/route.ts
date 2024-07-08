import { NextRequest } from "next/server";
import { zHsDealUpdateSchema, type HsDealUpdateSchema } from "../../utils-module/hubspotUtils";
import { jsonResponse } from "../../utils-module/_globals";

export async function PUT(request: NextRequest) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const requestBody = await request.json();
        let deal: HsDealUpdateSchema;
        try {
            deal = zHsDealUpdateSchema.parse(requestBody)
        } catch (parseError) {
            console.error("ERROR: unable to parse PUT body:\n", parseError);
            return jsonResponse({ error: "Input data malformatted" }, 400);
        }

        const body = JSON.stringify({
            "properties": [{
                name: deal.dealStage === 1 ? 'project_documents_accessed' : 'investment_documents_accessed',
                value: deal.documentNames
            }]
        });

        await fetch(
            `https://api.hubapi.com/deals/v1/deal/${deal.dealId}`,
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