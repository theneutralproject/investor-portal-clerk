import type { HubspotDealUpdateSchema } from "@/app/api/utils-module/_globals";
import { updateDeal } from "@/app/api/utils-module/dealUtils";
import { getErrorMessage } from "@/app/api/utils-module/helpers";
import { getDealStageInt, getFundingAmount, getProjectNameFromDealStage } from "@/app/api/utils-module/hubspotUtils";
import prisma from "@/libs/prisma";
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
    if(!(req.headers.get("X-HubSpot-Signature-Version") && req.headers.get("X-HubSpot-Signature"))) {
      console.error(`HS webhook request is not coming from HS!`)
      return new Response(
        JSON.stringify({ message: "Ignoring HubSpot webhook" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (
      !payload?.propertyValue ||
      !(payload?.changeSource === "CRM_UI" || payload?.changeSource === "CRM")
    ) {
      console.log(
        `Ignoring HubSpot webhook: change source ${payload?.changeSource} is not the HS UI, or property value is missing.`
      );
      return new Response(
        JSON.stringify({ message: "Ignoring HubSpot webhook" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const dealBody: HubspotDealUpdateSchema = {
      hubspotId: payload.objectId.toString(),
    };
    let updateProjectFunding = false;
    switch (payload.propertyName) {
      case "dealstage":
        dealBody.dealStage = getDealStageInt(payload.propertyValue);
        if(dealBody.dealStage >= 3) {
          updateProjectFunding = true;
        }
        break;
      case "amount":
        dealBody.amount = parseFloat(payload.propertyValue);
        break;
      case "financing_type":
        dealBody.financingType = payload.propertyValue;
        break;
    }

    if(updateProjectFunding) {
      const projectToUpdate = getProjectNameFromDealStage(payload.propertyValue);
      if(!isError(projectToUpdate)) {
        const amountRaised = await getFundingAmount(projectToUpdate)
        if(isError(amountRaised)) {
          console.error(`unable to fetch deal amount raised for project ${projectToUpdate}: ${amountRaised.message}`);
        } else {
          console.log(`\attempting to update project funding tracker for ${projectToUpdate} to ${amountRaised}`)
          await prisma.project
          .update({
            where: { name: projectToUpdate },
            data: {investmentRaised: amountRaised},
          })
          .catch((error) => {
            console.error(error);
            // return Error("Failed to update deal with hubspot data");
          });
        }

      }
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
