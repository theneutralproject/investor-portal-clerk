import type { DealUpdateSchema } from "@/app/api/utils-module/_globals";
import { updateDeal } from "@/app/api/utils-module/dealUtils";
import { getErrorMessage } from "@/app/api/utils-module/helpers";
import { getDealStageInt } from "@/app/api/utils-module/hubspotUtils";
import { type Deal } from "@prisma/client";
import { isError } from "lodash";
import { z } from "zod";

const hubspotWHDealRes = z.object({
  objectId: z.number(), // hubspot deal id
  changeSource: z.string(), // we only care about changes made in the UI "CRM_UI"
  propertyName: z.string(), //we use this to figure out which deal prop we need to update on our end
  propertyValue: z.string(),
});
const arrHubspotWHRes = z.array(hubspotWHDealRes);

/* 
    this webhook is called when a deal property is changed in hubspot 
    [dealstage, amount, investment_entity, dealname, dealtype, financing_type]
**/
export async function POST(req: Request): Promise<Response> {
  try {
    const payload = arrHubspotWHRes.parse(await req.json())[0];
    console.log(`HS webhook 1`, payload);

    if (
      !payload?.propertyValue ||
      !(payload?.changeSource === "CRM_UI" || payload?.changeSource === "CRM")
    ) {
      console.log(
        "Ignoring HubSpot webhook: change source is invalid or property value is missing."
      );
      return new Response(
        JSON.stringify({ error: "Ignoring HubSpot webhook" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const dealBody: DealUpdateSchema = {
      hubspotId: payload.objectId.toString(),
    };

    switch (payload.propertyName) {
      case "dealstage":
        dealBody.dealStage = getDealStageInt(payload.propertyValue);
        break;
      case "amount":
        dealBody.amount = parseFloat(payload.propertyValue);
        break;
      case "financing_type":
        dealBody.financingType = payload.propertyValue;
        break;
    }

    const updatedDeal: Deal | Error = await updateDeal(dealBody);

    if (isError(updatedDeal)) {
      return new Response(
        JSON.stringify({ error: getErrorMessage(updatedDeal) }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(updatedDeal), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error parsing HubSpot webhook: ", error);
    return new Response(
      JSON.stringify({ error: "Unable to parse HubSpot webhook" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
