import type { User } from "@prisma/client";
import { z } from "zod";
import { ProjectName } from "./_globals";
import { getErrorMessage } from "./helpers";
import { isError } from "lodash";

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

const zHsDealSearchObjectSchema = z.object({
  properties: z.object({
    amount: z.string()
  })
})

export const zHsDealSearchResultsSchema = z.object({
  total: z.number(),
  results: z.array(zHsDealSearchObjectSchema)
})

export async function createHubspotDealForContact(deal: HubspotDeal, contactHubspotId: string) {
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
  /* eslint-disable-next-line */
  const hsDealCreateRespBody = await resBody.json();
  try {
    const { dealId } = zHsDealSchema.parse(hsDealCreateRespBody);
    return dealId;
  } catch (error) {
    console.error("No good hs deal making:\n", error);
    return new Error(getErrorMessage(error));
  }
}



/* eslint-disable */
export function initDealPropsForProject(projectName: string, user: User, transactionId: string) {
  switch (projectName) {
    case ProjectName["The Edison"]: {
      return {
        properties: [
          { name: "dealname", value: `${projectName} | ${user.firstName} ${user.lastName}` },
          { name: "dealstage", value: EdisonDealStages[1]?.value ?? "" },
          { name: "investment_entity", value: InvestmentEntity[projectName].equity },
          { name: "project_name", value: projectName },
          { name: "amount", value: "0" },
          { name: "financing_type", value: "equity" },
          { name: "transaction_id", value: transactionId },
          { name: 'hubspot_owner_id', value: "345391171" /** CJ Fermanich */ },
        ]
      } as HubspotDeal
    }
    case ProjectName["519 W Main"]: {
      return {
        properties: [
          { name: "dealname", value: `${projectName} | ${user.firstName} ${user.lastName}` },
          { name: "dealstage", value: _519WMainDealStages[1]?.value ?? "" },
          { name: "investment_entity", value: InvestmentEntity[projectName].equity },
          { name: "project_name", value: projectName },
          { name: "amount", value: "0" },
          { name: "financing_type", value: "equity" },
          { name: "transaction_id", value: transactionId },
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


export async function getFundingAmount(projectName: ProjectName) {
  function getPayload(project: ProjectName) {
    switch (project) {
      case ProjectName["The Edison"]: {
        return {
          limit: 100, /**pagination - max=100 */
          after:0,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "dealstage",
                  operator: "EQ",
                  value: "contractsent" //146586773
                },
                {
                  propertyName: "project_name",
                  operator: "EQ",
                  value: "The Edison"
                },
              ]
            }
          ]
        };
      }
      case ProjectName["519 W Main"]: {
        return {
          limit: 100, /**pagination - max=100 */
          after:0,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "dealstage",
                  operator: "EQ",
                  value: "146586773"
                },
                {
                  propertyName: "project_name",
                  operator: "EQ",
                  value: "519 W Main"
                },
              ]
            }
          ]
        };

      }
      default: {
          console.error(`The project with name ${project} is not yet supported in getDealPropsForProject()`)
          return new Error(`The project with name ${project} is not yet supported in getDealPropsForProject()`);
      }
    }
  }


  /* eslint-disable-next-line */
  let totalAmountRaised = 0;
  let dealsFetched = 0;
  let totalDeals = 100;
  while (dealsFetched<totalDeals) {
    const payload = getPayload(projectName)
    if(isError(payload)) {
      return 25000000;
    }
    payload.after = dealsFetched;
    const resBody = await fetch(
      `https://api.hubapi.com/crm/v3/objects/deals/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    )
    
    /* eslint-disable-next-line */
    const hsDealCreateRespBody = await resBody.json();
    try {
      const { results, total } = zHsDealSearchResultsSchema.parse(hsDealCreateRespBody);
      totalDeals = total;
      dealsFetched += results.length
      totalAmountRaised+= results.map(r => parseFloat(r.properties.amount)).reduce((acc,cur) => acc + cur, 0)
    } catch (error) {
      console.error("could not compute updated deal closed amount:\n", error);
      return new Error(getErrorMessage(error));
    }
  }
  return totalAmountRaised;
}

/**
 * 
 * @param dealstage 
 * @returns dealstage integer of corresponding dealstage for any of our projects
 */
export function getDealStageInt(dealstage: string) {
  let pos = EdisonDealStages.map(e => e.value).indexOf(dealstage);

  if (pos === -1) {
    pos = _519WMainDealStages.map(e => e.value).indexOf(dealstage);
  }

  return pos;
}

export function getProjectNameFromDealStage(dealstage: string) {
  if(EdisonDealStages.map(e => e.value).indexOf(dealstage) >-1) return ProjectName["The Edison"];
  if(_519WMainDealStages.map(e => e.value).indexOf(dealstage) >-1) return ProjectName["519 W Main"];
  return new Error("project not yet supported");
};

const InvestmentEntity = {
  "The Edison": {
    equity: "North Edison LLC",
    debt: "Edison Project LLC",
  },
  "519 W Main": {
    equity: "Vanilla 301 LLC",
    debt: "Vanilla 301 LLC",
  }
}

export const EdisonDealStages = [
  { key: "aQualified", value: "appointmentscheduled" },
  { key: "bAwareness", value: "165518133" },
  { key: "cContractShared", value: "presentationscheduled" },
  { key: "dContractSigned", value: "decisionmakerboughtin" },
  { key: "eFunded", value: "contractsent" },
  { key: "fClosedLost", value: "closedlost" }
]

export const _519WMainDealStages = [
  { key: "aQualified", value: "146586769" },
  { key: "bAwareness", value: "165498481" },
  { key: "cContractShared", value: "146586771" },
  { key: "dContractSigned", value: "146586772" },
  { key: "eFunded", value: "146586773" },
  { key: "fClosedLost", value: "146586774" }
]


// deal contact association
//https://developers.hubspot.com/docs/api/crm/associations
//https://community.hubspot.com/t5/APIs-Integrations/Fetch-contacts-related-to-a-deal/m-p/550199
