import type { zDealUpdateSchema } from "@/app/api/deals/route";
import { getDealStageInt } from "@/app/api/utils-module/hubspotUtils";
import axios from "axios";
import { z } from "zod";
const hubspotWHDealRes = z.object({
    objectId: z.number(),   // hubspot deal id
    changeSource: z.string(), // we only care about changes made in the UI "CRM_UI"
    propertyName: z.string(),   //we use this to figure out which deal prop we need to update on our end
    propertyValue: z.string(),
});

const arrHubspotWHRes = z.array(hubspotWHDealRes)

/* 
    this webhook is called when a deal property is changed in hubspot 
    [dealstage, amount, investment_entity, dealname, dealtype, financing_type]
**/
export async function POST(req: Request) {
    try {
        const hubspotRes = arrHubspotWHRes.parse(await req.json())[0];

        // only update the DB if the change was made in the CRM_UI (and not by this app)
        if (hubspotRes?.propertyValue && hubspotRes?.changeSource === "CRM_UI") {
            const url = `/api/deals`;

            type DealUpdateSchema = z.infer<typeof zDealUpdateSchema>

            const dealBody: DealUpdateSchema = {
                hubspotId: hubspotRes.objectId.toString(),
            }

            /* eslint-disable */
            if (hubspotRes.propertyName === 'dealstage') {
                dealBody.dealStage = getDealStageInt(hubspotRes.propertyValue);
            }

            if (hubspotRes.propertyName === 'amount') {
                dealBody.amount = parseFloat(hubspotRes.propertyValue);
            }

            if (hubspotRes.propertyName === 'financing_type') {
                dealBody.financingType === hubspotRes.propertyValue;
            }
            /* eslint-enable */

            return axios.put(url, dealBody);
        }
    } catch (err) {
        console.log("unable to parse hubspot webhook: ", err)
        console.log(await req.json());
        return new Response(JSON.stringify({ error: "unable to parse hubspot webhook" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }
};