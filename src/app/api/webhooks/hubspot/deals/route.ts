import type { DealUpdateSchema } from "@/app/api/utils-module/_globals";
import { updateDeal } from "@/app/api/utils-module/dealUtils";
import { getErrorMessage } from "@/app/api/utils-module/helpers";
import { getDealStageInt } from "@/app/api/utils-module/hubspotUtils";
import { isError } from "lodash";
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
    let hubspotRes;
    try {
         hubspotRes = arrHubspotWHRes.parse(await req.json())[0];
        } catch (err) {
            console.log("unable to parse hubspot webhook: ", err)
            console.log(await req.json());
            return new Response(JSON.stringify({ error: "unable to parse hubspot webhook" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        console.log(`HS webhook 1`, hubspotRes)
        // only update the DB if the change was made in the CRM_UI (and not by this app)
        if (hubspotRes?.propertyValue &&
            (hubspotRes?.changeSource === "CRM_UI" || hubspotRes?.changeSource === "CRM")) {

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
                dealBody.financingType = hubspotRes.propertyValue;
            }
            /* eslint-enable */

            const updatedDeal = updateDeal(dealBody)

            if (isError(updateDeal)) {
                return new Response(JSON.stringify({ error: getErrorMessage(updatedDeal) }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
            return new Response(JSON.stringify(updatedDeal), {
                headers: { "Content-Type": "application/json" },
            });
        }
        else {
            console.log("ignoring Hubspot Webhook payload becuase informatrion is missing");
            return new Response(JSON.stringify({ error: "ignoring Hubspot Webhook payload" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

};