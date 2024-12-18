import { type User, DealFinancingType } from "@prisma/client";
import axios from "axios";
import { type HubspotContactCreateUpdateSchema, type HubspotDealPropertiesCollection, zHsDealCreateResponse, type HsDealDocsAccessedUpdateSchema, type HubspotDealUpdate, zHsDealSearchResultsSchema, type HsDealCreateResponse } from "./schema";
import type { DealUpdateSchema, DealCreateSchema } from "../deal/schema";
import { getErrorMessage } from "../utils";
import { getInvestmentEntity } from "../deal/utils";
import { ProjectName } from "../schema";
import { Client } from "@hubspot/api-client";
import { FilterOperatorEnum, type SimplePublicObject, type PublicObjectSearchRequest } from "@hubspot/api-client/lib/codegen/crm/deals";

const hubspotClient = new Client({ "accessToken": process.env.HUBSPOT_ACCESS_TOKEN });

export async function createHubspotContact(hubspotContact: HubspotContactCreateUpdateSchema) {

  if (!hubspotContact.email) {
    throw new Error("email is required to create a contact in hubspot")
  }

  // check if contact already exists. if yes, update it
  const hsSearchResult = await hubspotClient.crm.contacts.searchApi.doSearch({
    limit: 1,
    properties: ["hs_object_id"],
    filterGroups: [
      {
        filters: [
          {
            propertyName: "email",
            operator: FilterOperatorEnum.Eq,
            value: hubspotContact.email
          }
        ]
      }
    ]
  });

  if (hsSearchResult.total > 0) {
    console.log("Contact already exists. Updating it instead");
    const hsId = hsSearchResult.results[0]?.id.toString();
    if (!hsId) {
      console.error("ERROR: unable to get Hubspot contact id");
      throw new Error("unable to get hubspot contact id");
    }
    hubspotContact.hubspotId = hsId;
    await updateHubspotContact(hubspotContact);
    return hsId;
  }

  console.log("Creating new contact in hubspot");
  const signupDate = new Date(new Date().setUTCHours(0, 0, 0, 0))
    .getTime()
    .toString();

  hubspotContact.properties.date_signed_up = signupDate;
  hubspotContact.properties.email = hubspotContact.email;
  try {
    const hubspotCreateResponse = await hubspotClient.crm.contacts.basicApi.create(hubspotContact);
    return hubspotCreateResponse.id;
  } catch (error) {
    console.error("Unable to create user in hubspot:\n", error);
    throw new Error(getErrorMessage(error));
  }
};

export async function updateHubspotContact(hubspotContact: HubspotContactCreateUpdateSchema) {
  if (!hubspotContact.hubspotId) {
    throw new Error("hubspotId is required to update a contact in hubspot")
  }

  try {
    const hsUpdateRes = await hubspotClient.crm.contacts.basicApi.update(hubspotContact.hubspotId, hubspotContact);
    return hsUpdateRes.id;
  } catch (error) {
    console.error("Unable to update user in hubspot:\n", error);
    throw new Error(getErrorMessage(error));
  }
};

export async function getDealsWithContactsFromHubspot(hsIds: string[]) {

  let deals = [] as SimplePublicObject[];
  let contacts = [] as SimplePublicObject[];
  const dealSearchRequest = {
    limit: 100,
    properties: ["hs_object_id", "dealname", "dealstage", "amount", "project_name", "associations.contact.id", "associations.contact.vid", "associations.contact.hs_object_id"],
    filterGroups: [{
      filters: [
        {
          propertyName: "hs_object_id",
          operator: FilterOperatorEnum.In,
          values: hsIds
        }
      ]
    }]
  } as PublicObjectSearchRequest;

  try {
    const dealSearchRes = await hubspotClient.crm.deals.searchApi.doSearch(dealSearchRequest);
    console.log(`found ${dealSearchRes.results.length} deals`);
    deals = dealSearchRes.results ?? [];
  } catch (e) {
    console.error("Error", e);
  }

  const contactSearchRequest = {
    limit: 100,
    properties: ["hs_object_id", "email", "firstname", "lastname", "phone", "address", "city", "state", "zip", "country", "associations.deal", "associations.deal.hs_object_id"],
    filterGroups: [{
      filters: [
        {
          propertyName: "associations.deal",
          operator: FilterOperatorEnum.In,
          values: hsIds
        }
      ]
    }]
  } as PublicObjectSearchRequest;

  try {
    const contactSearchRes = await hubspotClient.crm.contacts.searchApi.doSearch(contactSearchRequest);
    console.log(`found ${contactSearchRes.results.length} contacts`);
    contacts = contactSearchRes.results ?? [];
  } catch (e) {
    console.error("Error", e);
  }

  // associate contacts with deals by dealname
  interface DealContact {
    deal: SimplePublicObject | undefined;
    contact: SimplePublicObject;
  }

  const dealContacts = contacts.map(c => {
    const first = c.properties.firstname?.toLowerCase() ?? "ljdfioqwehoeiufnil";
    const last = c.properties.lastname?.toLowerCase() ?? "ljdfioqwehoeiufnil";
    const dealmatch = deals.find(d => d.properties.dealname?.toLowerCase().includes(first) && d.properties.dealname?.toLowerCase().includes(last));
    if (!dealmatch) {
      console.error(`No deal found for contact ${c.properties.firstname} ${c.properties.lastname}, ${c.properties.hs_object_id}`);
    }

    return {
      deal: dealmatch,
      contact: c
    } as DealContact;
  });

  return { deals, contacts, dealContacts }
}

// export async function getListOfHSContacts(arrVids: string[]) {
//   ///https://api.hubapi.com/contacts/v1/contact/vids/batch/?vid=3234574&vid=3714024&hapikey=demo
//   const firstVid = arrVids.shift();
//   const vids = arrVids.map(v => v.trim()).join("&vid=");

//   console.log(`/contacts/v1/contact/vids/batch/?vid=${firstVid}&vid=${vids}`);

//   const response = await fetch(
//     `${process.env.HUBSPOT_API_BASE_URL}/contacts/v1/contact/vids/batch/?vid=${firstVid}&vid=${vids}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
//       },
//     }
//   )
//   const data = JSON.parse(await response.text());
//   if (response.status >= 300) {
//     console.error("ERROR: unable to get Hubspot contacts:\n", data);
//     throw new Error("unable to get hubspot contacts");
//   }
//   // console.log("data", data.keys());
//   return Object.keys(data);
// }

export async function getListOfHSDeals() {
  const lostDealstages = ["closedlost", "146586774", "257596003"];
  const publicObjectSearchRequest = {
    limit: 100,
    properties: ["hs_object_id", "dealname", "dealstage", "amount", "project_name"],
    filterGroups: [{
      filters: [
        {
          propertyName: "dealstage",
          operator: FilterOperatorEnum.In,
          values: lostDealstages
        }
      ]
    }]
  } as PublicObjectSearchRequest;

  try {
    const apiResponse = await hubspotClient.crm.deals.searchApi.doSearch(publicObjectSearchRequest);
    return apiResponse.results;
  } catch (e) {
    console.error("Error", e);
  }
}

export async function createHubspotDeal(hubspotDeal: HubspotDealPropertiesCollection, contactHubspotId: string) {
  const { properties } = hubspotDeal;
  console.log("HS Deal Properties", properties);
  const body = JSON.stringify({
    associations: {
      associatedVids: [
        contactHubspotId
      ]
    }, properties: properties
  });

  const resBody = await fetch(
    `${process.env.HUBSPOT_API_BASE_URL}/deals/v1/deal`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body,
    }
  )

  const hsDealCreateRespBody = (await resBody.json()) as HsDealCreateResponse;
  try {
    const { dealId } = zHsDealCreateResponse.parse(hsDealCreateRespBody);
    return dealId.toString();
  } catch (error) {
    console.error("No good hs deal making:\n", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function updateHubspotDealDocsAccessed(hsDealUpdateData: HsDealDocsAccessedUpdateSchema) {
  return await axios.post("/api/deals/hubspot", hsDealUpdateData);
}

export async function updateHubspotDealProperties(hsDealUpdateData: HubspotDealUpdate) {
  console.log("hsDealUpdateData", hsDealUpdateData);
  const body = JSON.stringify({
    properties: hsDealUpdateData.properties
  });
  return await fetch(
    `${process.env.HUBSPOT_API_BASE_URL}/deals/v1/deal/${hsDealUpdateData.hubspotDealId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body,
    }
  )
}

/* eslint-disable */
export function initHubspotDealProps(projectName: string, user: User, dealData: DealCreateSchema) {
  const properties = [
    { name: "dealname", value: `${projectName} | ${user.firstName} ${user.lastName}` },
    { name: "investment_entity", value: getInvestmentEntity(projectName, dealData.financingType ?? DealFinancingType.equity) },
    { name: "project_name", value: projectName },
    { name: "amount", value: `${dealData.amount ?? 0}` },
    { name: "transaction_id", value: dealData.transactionId! },
    { name: 'hubspot_owner_id', value: process.env.HUBSPOT_OWNER_ID }
  ]
  switch (projectName) {
    case ProjectName["The Edison"]: {
      return {
        properties: [...properties,
        ...[
          { name: "dealstage", value: EdisonDealStages[dealData.dealStage ?? 1]?.value ?? "" },
          { name: "financing_type", value: dealData.financingType ?? "equity" },
        ]]
      } as HubspotDealPropertiesCollection
    }
    case ProjectName["519 W Main"]: {
      return {
        properties: [...properties,
        ...[
          { name: "dealstage", value: _519WMainDealStages[dealData.dealStage ?? 1]?.value ?? "" },
          { name: "financing_type", value: dealData.financingType ?? "equity" },
        ]]
      } as HubspotDealPropertiesCollection
    }
    case ProjectName["Bakers Place"]: {
      return {
        properties: [...properties,
        ...[
          { name: "dealstage", value: BakersPlaceDealStages[dealData.dealStage ?? 1]?.value ?? "" },
          { name: "financing_type", value: dealData.financingType ?? "promissory_note_now" },
        ]]
      } as HubspotDealPropertiesCollection
    }
    default: {
      console.error(`The project with name ${projectName} is not yet supported in getDealPropsForProject()`)
      return null;
    }
  }
}
/* eslint-enable */

export function getHsDealPropsFromDeal(deal: DealUpdateSchema, projectSlug: string) {
  const { dealStage, hubspotId, investmentStats, signaturesCompletedDate } = deal;
  const hsReturnObject = {
    hubspotDealId: parseInt(hubspotId, 10),
    properties: []
  } as HubspotDealUpdate;
  if (dealStage) hsReturnObject.properties.push({ name: "dealstage", value: getHsDealStageStrFromInt(dealStage, projectSlug) });

  if (investmentStats?.amount) hsReturnObject.properties.push({ name: "amount", value: investmentStats?.amount.toString() });
  if (investmentStats?.financingType) hsReturnObject.properties.push({ name: "financing_type", value: investmentStats?.financingType });
  if (signaturesCompletedDate) hsReturnObject.properties.push({ name: "date_signatures_completed", value: signaturesCompletedDate.toISOString() });
  return hsReturnObject;
}

export async function associateContactWithDealInHubspot(contactId: string, dealId: string) {
  const body = JSON.stringify({
    fromObjectId: parseInt(contactId),
    toObjectId: parseInt(dealId),
    category: "HUBSPOT_DEFINED",
    definitionId: 4
  });

  return await fetch(
    `${process.env.HUBSPOT_API_BASE_URL}/crm-associations/v1/associations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body,
    }
  );
}

export async function getFundingAmount(projectSlug: string) {
  function _getPayload(slug: string) {
    switch (slug) {
      case "edison": {
        return {
          limit: 100, /**pagination - max=100 */
          after: 0,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "dealstage",
                  operator: "IN",
                  values: ["contractsent", "decisionmakerboughtin"]
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
      case "519": {
        return {
          limit: 100, /**pagination - max=100 */
          after: 0,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "dealstage",
                  operator: "IN",
                  values: ["146586773", "146586772"]
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
      case "bakers": {
        return {
          limit: 100, /**pagination - max=100 */
          after: 0,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "dealstage",
                  operator: "IN",
                  values: ["257596001", "257596003"]
                },
                {
                  propertyName: "project_name",
                  operator: "EQ",
                  value: "Bakers Place"
                },
              ]
            }
          ]
        };

      }
      default: {
        console.error(`The project with slug ${slug} is not yet supported in getFundingAmount()`)
        return new Error(`The project with slug ${slug} is not yet supported in getFundingAmount()`);
      }
    }
  }


  /* eslint-disable-next-line */
  let totalAmountRaised = 0;
  let dealsFetched = 0;
  let totalDeals = 100;
  while (dealsFetched < totalDeals) {
    const payload = _getPayload(projectSlug)
    if (payload instanceof Error) {
      return 25000000;
    }
    payload.after = dealsFetched;
    const resBody = await fetch(
      `${process.env.HUBSPOT_API_BASE_URL}/crm/v3/objects/deals/search`,
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
      totalAmountRaised += results.map(r => parseFloat(r.properties.amount)).reduce((acc, cur) => acc + cur, 0)
    } catch (error) {
      console.error("could not compute updated deal closed amount:\n", error);
      return new Error(getErrorMessage(error));
    }
  }
  return totalAmountRaised;
}

/**
 * 
 * @param hsDealStageStr 
 * @returns dealstage integer of corresponding dealstage for any of our projects
 */
export function getDealStageIntFromHSString(hsDealStageStr: string) {
  let pos = EdisonDealStages.map(e => e.value).indexOf(hsDealStageStr);
  if (pos === -1) {
    pos = _519WMainDealStages.map(e => e.value).indexOf(hsDealStageStr);
  }
  if (pos === -1) {
    pos = BakersPlaceDealStages.map(e => e.value).indexOf(hsDealStageStr);
  }
  if (pos === -1) {
    console.error(`dealStage ${hsDealStageStr} is not valid`)
    return -1;
  }
  return pos + 1;
}


export function getHsDealStageStrFromInt(dealStage: number, projectSlug: string) {
  if (dealStage < 0 || dealStage > 6) {
    console.error(`dealStage ${dealStage} is not valid`)
    return "null";
  }
  if (dealStage > 0) dealStage -= 1;
  switch (projectSlug) {
    case "edison": {
      return EdisonDealStages[dealStage]?.value ?? "null";
    }
    case "519": {
      return _519WMainDealStages[dealStage]?.value ?? "null";
    }
    case "bakers": {
      return BakersPlaceDealStages[dealStage]?.value ?? "null";
    }
    default: {
      console.error(`The project with slug ${projectSlug} is not yet supported in getHsDealStageStrFromInt()`)
      return "null";
    }
  }
}

export function getProjectSlugFromDealStage(dealstage: string) {
  if (EdisonDealStages.map(e => e.value).indexOf(dealstage) > -1) return "edison";
  if (_519WMainDealStages.map(e => e.value).indexOf(dealstage) > -1) return "519";
  if (BakersPlaceDealStages.map(e => e.value).indexOf(dealstage) > -1) return "bakers";
  return new Error("project not yet supported");
};

export const EdisonDealStages = [
  { key: "aQualified", value: "appointmentscheduled", intVal: 1 },
  { key: "bAwareness", value: "165518133", intVal: 2 },
  { key: "cContractShared", value: "presentationscheduled", intVal: 3 },
  { key: "dContractSigned", value: "decisionmakerboughtin", intVal: 4 },
  { key: "eFunded", value: "contractsent", intVal: 5 },
  { key: "fClosedLost", value: "closedlost", intVal: 6 }
];

export const _519WMainDealStages = [
  { key: "aQualified", value: "146586769", intVal: 1 },
  { key: "bAwareness", value: "165498481", intVal: 2 },
  { key: "cContractShared", value: "146586771", intVal: 3 },
  { key: "dContractSigned", value: "146586772", intVal: 4 },
  { key: "eFunded", value: "146586773", intVal: 5 },
  { key: "fClosedLost", value: "146586774", intVal: 6 }
];

export const BakersPlaceDealStages = [
  { key: "aQualified", value: "257595997", intVal: 1 },
  { key: "bAwareness", value: "257595998", intVal: 2 },
  { key: "cContractShared", value: "257595999", intVal: 3 },
  { key: "dContractSigned", value: "257596000", intVal: 4 },
  { key: "eFunded", value: "257596001", intVal: 5 },
  { key: "fClosedLost", value: "257596003", intVal: 6 }
]

export enum ReferralSource {
  EVENT_MAILER = "event_mailer",
  INVESTOR_EVENT = "investor_event",
  REFERRAL = "referral",
  NEUTRAL_TEAM_MEMBER = "neutral_team_member",
  GOOGLE_SEARCH = "google",
  ADVERTISEMENT_ONLINE = "advertisement_online",
  NEUTRAL_MAIL = "neutral_mail",
  NEWSLETTER = "newsletter",
  NEUTRAL_PODCAST = "neutral_podcast",
  FACEBOOK = "facebook",
  X = "x",
  LINKEDIN = "linkedin",
  INSTAGRAM = "instagram",
  OTHER = "other"
}

export enum HSDealPropNames {
  dealstage = 'dealstage',
  amount = 'amount',
  financing_type = 'financing_type',
  closedate = 'closedate',
};

export enum DealToHubspotDealEnum {
  amount = "amount",
  financingType = "financing_type",
  dealStage = "dealstage",
};
