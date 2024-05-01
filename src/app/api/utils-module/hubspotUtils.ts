import type { User } from "@prisma/client";
import { z } from "zod";
import { ProjectName } from "./_globals";
import { getErrorMessage } from "./helpers";

export type HubspotContact = {
  properties: { property: string; value: string }[];
  email: string;
};

export type HubspotUserCreateResponse = {
  vid: number,
  isNew: boolean
}

export type HubspotDeal = {
  dealId?: number, //maybe hs_object_id instead of dealId
  properties: { name: string; value: string }[];
};

export const hubspotContactRes = z.object({
  vid: z.number(),
});

export async function createOrUpdateContact(hubspotContact: HubspotContact) {
  const signupDate = new Date(new Date().setUTCHours(0, 0, 0, 0))
    .getTime()
    .toString();
  hubspotContact.properties.push({
    property: "date_signed_up",
    value: signupDate,
  });

  return await fetch(
    `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${hubspotContact.email}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(hubspotContact),
    }
  ).then(async (response) => {
    try {
       // eslint-disable-next-line
      const resJson = await response.json();
      const hsRes = hubspotContactRes.parse(resJson)
      return hsRes;
    } catch (parseError) {
      console.error("ERROR: unable to parse HS response:\n", parseError);
      return new Error("unable to parse HS response")
    }

  }).catch((fetchError) => {
    console.error("ERROR: unable to update Hubspot contact:\n", fetchError);
    return new Error("unable to update hubspot contact")
  })
}

export const zHsDealSchema = z.object({
  dealId: z.number()
});

export async function createDealForContact(deal: HubspotDeal, contactHubspotId: string) {
  // first create a deal
  const { properties } = deal;

  const body = JSON.stringify({
    associations: {
      associatedVids: [
        contactHubspotId
      ]
    }, properties: properties
  });

  const resBody = await fetch(
    `https://api.hubapi.com/deals/v1/deal`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body,
    }
  )

  try {
    const { dealId } = zHsDealSchema.parse(await resBody.json());
    return dealId;
  } catch (error) {
    console.error("No good hs deal making:\n", error);
    return new Error(getErrorMessage(error));
  }
}



/* eslint-disable */
export function initDealPropsForProject(projectName: string, user: User) {
  switch (projectName) {
    case ProjectName["The Edison"]: {
      return {
        properties: [
          { name: "dealname", value: `${projectName} | ${user.firstName} ${user.lastName}` },
          { name: "dealstage", value: EdisonDealStages[1]?.value ?? "" },
          { name: "investment_entity", value: InvestmentEntity[projectName].equity },
          { name: "project_name", value: projectName },
          { name: "amount", value: "0" },
          { name: 'hubspot_owner_id', value: "345391171" /** CJ Fermanich */ },
        ]
      } as HubspotDeal
    }
    default: {
      console.error(`The project with name ${projectName} is not yet supported in getDealPropsForProject()`)
      return null;
    }
  }
}
/* eslint-enable */


/**
 * 
 * @param dealstage 
 * @returns dealstage integer of corresponding dealstage for any of our projects
 */
export function getDealStageInt(dealstage: string) {
  const pos = [...EdisonDealStages, ..._519WMainDealStages].map(e => e.value).indexOf(dealstage)
  return pos;
}

const InvestmentEntity = {
  "The Edison": {
    equity: "North Edison LLC",
    debt: "Edison Project LLC",
  }
}

export const EdisonDealStages = [
  { key: "aQualified", value: "appointmentscheduled" },
  { key: "bRapport", value: "qualifiedtobuy" },
  { key: "cAwareness", value: "165518133" },
  { key: "dContractShared", value: "presentationscheduled" },
  { key: "eContractSigned", value: "decisionmakerboughtin" },
  { key: "fFunded", value: "contractsent" },
  { key: "gClosedLost", value: "closedlost" }
]

export const _519WMainDealStages = [
  { key: "aQualified", value: "146586769" },
  { key: "bRapport", value: "146586770" },
  { key: "cAwareness", value: "165498481" },
  { key: "dContractShared", value: "146586771" },
  { key: "eContractSigned", value: "146586772" },
  { key: "fFunded", value: "146586773" },
  { key: "gClosedLost", value: "146586774" }
]


// deal contact association
//https://developers.hubspot.com/docs/api/crm/associations
//https://community.hubspot.com/t5/APIs-Integrations/Fetch-contacts-related-to-a-deal/m-p/550199
