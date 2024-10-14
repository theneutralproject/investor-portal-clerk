import { type User, DealFinancingType } from "@prisma/client";
import axios from "axios";
import { isError } from "lodash";
import { type HubspotContact, hubspotContactApiResponse, type HubspotDealPropertiesCollection, zHsDealCreateResponse, type HsDealDocsAccessedUpdateSchema, type HubspotDealUpdate, zHsDealSearchResultsSchema } from "./schema";
import { type DealCreateSchema} from "../deal/schema";
import { getErrorMessage } from "../utils";
import { getInvestmentEntity } from "../deal/utils";
import { ProjectName } from "../schema";



async function _createOrUpdateContact(hubspotContact: HubspotContact) {

  return await fetch(
    `${process.env.HUBSPOT_API_BASE_URL}/contacts/v1/contact/createOrUpdate/email/${hubspotContact.email}`,
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
      const hsRes = hubspotContactApiResponse.parse(resJson)
      return hsRes;
    } catch (parseError) {
      console.error("ERROR: unable to parse HS response:\n", parseError);
      return new Error("unable to parse HS response")
    }

  }).catch((fetchError) => {
    console.error("ERROR: unable to update Hubspot contact:\n", fetchError);
    return new Error("unable to update hubspot contact")
  })
};

export async function createOrUpdateHubspotContact(hubspotContact: HubspotContact) {
  const signupDate = new Date(new Date().setUTCHours(0, 0, 0, 0))
    .getTime()
    .toString();
  hubspotContact.properties.push({
    property: "date_signed_up",
    value: signupDate,
  });

  return await _createOrUpdateContact(hubspotContact);
};

export async function updateHubspotContact(hubspotContact: HubspotContact) {
  console.log("updating HS user", hubspotContact)
  return await _createOrUpdateContact(hubspotContact);
};

export async function createHubspotDealForContact(hubspotDeal: HubspotDealPropertiesCollection, contactHubspotId: string) {
  const { properties } = hubspotDeal;

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
  /* eslint-disable-next-line */
  const hsDealCreateRespBody = await resBody.json();
  try {
    const { dealId } = zHsDealCreateResponse.parse(hsDealCreateRespBody);
    return dealId;
  } catch (error) {
    console.error("No good hs deal making:\n", error);
    return new Error(getErrorMessage(error));
  }
}

export async function updateHubspotDealDocsAccessed(hsDealUpdateData: HsDealDocsAccessedUpdateSchema) {
  return await axios.post("/api/deals/hubspot", hsDealUpdateData);
}

export async function updateHubspotDealProperties(hsDealUpdateData: HubspotDealUpdate) {
  return await axios.put(`${process.env.BASE_URL}/api/deals/hubspot`, hsDealUpdateData);
}

/* eslint-disable */
export function initDealPropsForProject(projectName: string, user: User, dealData: DealCreateSchema) {

  switch (projectName) {
    case ProjectName["The Edison"]: {
      return {
        properties: [
          { name: "dealname", value: `${projectName} | ${user.firstName} ${user.lastName}` },
          { name: "dealstage", value: EdisonDealStages[dealData.dealStage ?? 1]?.value ?? "" },
          { name: "investment_entity", value: getInvestmentEntity(projectName, dealData.financingType ?? DealFinancingType.equity) },
          { name: "project_name", value: projectName },
          { name: "amount", value: "0" },
          { name: "financing_type", value: dealData.financingType ?? "equity" },
          { name: "transaction_id", value: dealData.transactionId! },
          { name: 'hubspot_owner_id', value: process.env.HUBSPOT_OWNER_ID}
        ]
      } as HubspotDealPropertiesCollection
    }
    case ProjectName["519 W Main"]: {
      return {
        properties: [
          { name: "dealname", value: `${projectName} | ${user.firstName} ${user.lastName}` },
          { name: "dealstage", value: _519WMainDealStages[dealData.dealStage ?? 1]?.value ?? "" },
          { name: "investment_entity", value: getInvestmentEntity(projectName, dealData.financingType ?? DealFinancingType.equity) },
          { name: "project_name", value: projectName },
          { name: "amount", value: "0" },
          { name: "financing_type", value: dealData.financingType ?? "equity" },
          { name: "transaction_id", value: dealData.transactionId! },
          { name: 'hubspot_owner_id', value: process.env.HUBSPOT_OWNER_ID},
        ]
      } as HubspotDealPropertiesCollection
    }
    default: {
      console.error(`The project with name ${projectName} is not yet supported in getDealPropsForProject()`)
      return null;
    }
  }
}
/* eslint-enable */

export async function associateContactWithDeal(contactId: string, dealId: string) {
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


export async function getFundingAmount(projectName: ProjectName) {
  function getPayload(project: ProjectName) {
    switch (project) {
      case ProjectName["The Edison"]: {
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
      case ProjectName["519 W Main"]: {
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
  while (dealsFetched < totalDeals) {
    const payload = getPayload(projectName)
    if (isError(payload)) {
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
  if (EdisonDealStages.map(e => e.value).indexOf(dealstage) > -1) return ProjectName["The Edison"];
  if (_519WMainDealStages.map(e => e.value).indexOf(dealstage) > -1) return ProjectName["519 W Main"];
  return new Error("project not yet supported");
};

export const EdisonDealStages = [
  { key: "aQualified", value: "appointmentscheduled" },
  { key: "bAwareness", value: "165518133" },
  { key: "cContractShared", value: "presentationscheduled" },
  { key: "dContractSigned", value: "decisionmakerboughtin" },
  { key: "eFunded", value: "contractsent" },
  { key: "fClosedLost", value: "closedlost" }
];

export const _519WMainDealStages = [
  { key: "aQualified", value: "146586769" },
  { key: "bAwareness", value: "165498481" },
  { key: "cContractShared", value: "146586771" },
  { key: "dContractSigned", value: "146586772" },
  { key: "eFunded", value: "146586773" },
  { key: "fClosedLost", value: "146586774" }
];

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
};

export enum DealToHubspotDealEnum {
  amount = "amount",
  financingType = "financing_type",
  dealStage = "dealstage",
};


