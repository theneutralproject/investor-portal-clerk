import 'server-only';
import { type User, Deal, DealFinancingType, Project } from '@prisma/client';
import {
  type HubspotContactCreateUpdateSchema,
  type HubspotDealPropertiesCollection,
  zHsDealCreateResponse,
  type HubspotDealUpdate,
  zHsDealSearchResultsSchema,
  type HsDealCreateResponse,
} from './schema';
import type { DealUpdateSchema, DealCreateSchema } from '../deal/schema';
import { getErrorMessage } from '../utils.server';
import { getInvestmentEntity } from '../deal/utils';
import { Client } from '@hubspot/api-client';
import {
  FilterOperatorEnum,
  type SimplePublicObject,
  type PublicObjectSearchRequest,
} from '@hubspot/api-client/lib/codegen/crm/deals';
import {
  getSigningOrder,
  instantiateApiClientFromUserAndDeal,
} from '../docusign/utils.server';
import { Signer } from 'docusign-esign';

const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

export function formatDateForHubspot(date: Date) {
  return new Date(date.setUTCHours(0, 0, 0, 0)).getTime().toString();
}

export async function createHubspotContact(
  hubspotContact: HubspotContactCreateUpdateSchema
) {
  if (!hubspotContact.email) {
    throw new Error('email is required to create a contact in hubspot');
  }

  // check if contact already exists. if yes, update it
  const hsSearchResult = await hubspotClient.crm.contacts.searchApi.doSearch({
    limit: 1,
    properties: ['hs_object_id'],
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'email',
            operator: FilterOperatorEnum.Eq,
            value: hubspotContact.email,
          },
        ],
      },
    ],
  });

  if (hsSearchResult.total > 0) {
    console.log('Contact already exists. Updating it instead');
    const hsId = hsSearchResult.results[0]?.id.toString();
    console.log('hsId', hsId);
    if (!hsId) {
      console.error('ERROR: unable to get Hubspot contact id');
      throw new Error('unable to get hubspot contact id');
    }
    hubspotContact.hubspotId = hsId;
    try {
      await updateHubspotContact(hubspotContact);
      return hsId;
    } catch (error) {
      console.error('Unable to update user in hubspot2:\n', error);
      throw new Error(getErrorMessage(error));
    }
  }

  console.log('Creating new contact in hubspot');
  const signupDate = formatDateForHubspot(new Date());

  hubspotContact.properties.date_signed_up = signupDate;
  hubspotContact.properties.email = hubspotContact.email;
  try {
    const hubspotCreateResponse =
      await hubspotClient.crm.contacts.basicApi.create(hubspotContact);
    return hubspotCreateResponse.id;
  } catch (error) {
    console.error('Unable to create user in hubspot:\n', error);
    throw new Error(getErrorMessage(error));
  }
}

export async function updateHubspotContact(
  hubspotContact: HubspotContactCreateUpdateSchema
) {
  if (!hubspotContact.hubspotId) {
    throw new Error('hubspotId is required to update a contact in hubspot');
  }

  try {
    const hsUpdateRes = await hubspotClient.crm.contacts.basicApi.update(
      hubspotContact.hubspotId,
      hubspotContact
    );
    return hsUpdateRes.id;
  } catch (error) {
    console.error('Unable to update user in hubspot3:\n', error);
    throw new Error(getErrorMessage(error));
  }
}

export async function getHubspotContactsWithoutSignupDate() {
  const searchBody: PublicObjectSearchRequest = {
    limit: 100,
    properties: ['hs_object_id', 'email', 'date_signed_up', 'userid'],
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'date_signed_up',
            operator: FilterOperatorEnum.NotHasProperty,
          },
          {
            propertyName: 'userid',
            operator: FilterOperatorEnum.HasProperty,
          },
        ],
      },
    ],
  };
  try {
    const hsSearchResult =
      await hubspotClient.crm.contacts.searchApi.doSearch(searchBody);

    return hsSearchResult.results;
  } catch (error) {
    console.error(
      'Unable to get contacts without signup date from hubspot:\n',
      error
    );
    throw new Error(getErrorMessage(error));
  }
}

export async function shareProjectDocsWithUser(
  userHubspotId: number,
  slug: string
) {
  const body = JSON.stringify({
    hubspotId: userHubspotId,
    slug,
  });
  const url = process.env.HUBSPOT_SHARE_PROJECT_DOCS_WEBHOOK_URL!;
  console.log('url', url);
  try {
    const hsRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body,
    });
    return await hsRes.json();
  } catch (error) {
    console.error(
      'Unable to share project docs with user in hubspot:\n',
      error
    );
    throw new Error(getErrorMessage(error));
  }
}

export async function getHubspotContactByEmail(email: string) {
  const searchBody: PublicObjectSearchRequest = {
    limit: 1,
    properties: ['hs_object_id', 'email', 'date_signed_up', 'userid'],
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'email',
            operator: FilterOperatorEnum.Eq,
            value: email,
          },
        ],
      },
    ],
  };
  try {
    const hsSearchResult =
      await hubspotClient.crm.contacts.searchApi.doSearch(searchBody);

    return hsSearchResult.results[0] ?? null;
  } catch (error) {
    console.error('Unable to get contact from hubspot:\n', error);
    throw new Error(getErrorMessage(error));
  }
}

export async function getDealsWithContactsFromHubspot(hsIds: string[]) {
  let deals = [] as SimplePublicObject[];
  let contacts = [] as SimplePublicObject[];
  const dealSearchRequest = {
    limit: 100,
    properties: [
      'hs_object_id',
      'dealname',
      'dealstage',
      'amount',
      'project_name',
      'associations.contact.id',
      'associations.contact.vid',
      'associations.contact.hs_object_id',
    ],
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'hs_object_id',
            operator: FilterOperatorEnum.In,
            values: hsIds,
          },
        ],
      },
    ],
  } as PublicObjectSearchRequest;

  try {
    const dealSearchRes =
      await hubspotClient.crm.deals.searchApi.doSearch(dealSearchRequest);
    console.log(`found ${dealSearchRes.results.length} deals`);
    deals = dealSearchRes.results ?? [];
  } catch (e) {
    console.error('Error', e);
  }

  const contactSearchRequest = {
    limit: 100,
    properties: [
      'hs_object_id',
      'email',
      'firstname',
      'lastname',
      'phone',
      'address',
      'city',
      'state',
      'zip',
      'country',
      'associations.deal',
      'associations.deal.hs_object_id',
    ],
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'associations.deal',
            operator: FilterOperatorEnum.In,
            values: hsIds,
          },
        ],
      },
    ],
  } as PublicObjectSearchRequest;

  try {
    const contactSearchRes =
      await hubspotClient.crm.contacts.searchApi.doSearch(contactSearchRequest);
    console.log(`found ${contactSearchRes.results.length} contacts`);
    contacts = contactSearchRes.results ?? [];
  } catch (e) {
    console.error('Error', e);
  }

  // associate contacts with deals by dealname
  interface DealContact {
    deal: SimplePublicObject | undefined;
    contact: SimplePublicObject;
  }

  const dealContacts = contacts.map(c => {
    const first = c.properties.firstname?.toLowerCase() ?? 'ljdfioqwehoeiufnil';
    const last = c.properties.lastname?.toLowerCase() ?? 'ljdfioqwehoeiufnil';
    const dealmatch = deals.find(
      d =>
        d.properties.dealname?.toLowerCase().includes(first) &&
        d.properties.dealname?.toLowerCase().includes(last)
    );
    if (!dealmatch) {
      console.error(
        `No deal found for contact ${c.properties.firstname} ${c.properties.lastname}, ${c.properties.hs_object_id}`
      );
    }

    return {
      deal: dealmatch,
      contact: c,
    } as DealContact;
  });

  return { deals, contacts, dealContacts };
}

export async function getHubspotDealById(hsDealId: string) {
  try {
    const hsDeal = await hubspotClient.crm.deals.basicApi.getById(hsDealId, [
      'financing_type',
      'dealstage',
      'amount',
      'closedate',
      'date_signatures_completed',
    ]);
    return hsDeal;
  } catch (error) {
    console.error('unable to get deal from hubspot:\n', error);
    throw new Error(getErrorMessage(error));
  }
}

export async function getListOfHSDeals() {
  const lostDealstages = ['closedlost', '146586774', '257596003'];
  const publicObjectSearchRequest = {
    limit: 100,
    properties: [
      'hs_object_id',
      'dealname',
      'dealstage',
      'amount',
      'project_name',
    ],
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'dealstage',
            operator: FilterOperatorEnum.In,
            values: lostDealstages,
          },
        ],
      },
    ],
  } as PublicObjectSearchRequest;

  try {
    const apiResponse = await hubspotClient.crm.deals.searchApi.doSearch(
      publicObjectSearchRequest
    );
    return apiResponse.results;
  } catch (e) {
    console.error('Error', e);
  }
}

export async function createHubspotDeal(
  hubspotDeal: HubspotDealPropertiesCollection,
  contactHubspotId: string
) {
  const { properties } = hubspotDeal;
  console.log('HS Deal Properties', properties);
  const body = JSON.stringify({
    associations: {
      associatedVids: [contactHubspotId],
    },
    properties: properties,
  });

  const resBody = await fetch(
    `${process.env.HUBSPOT_API_BASE_URL}/deals/v1/deal`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body,
    }
  );

  const hsDealCreateRespBody = (await resBody.json()) as HsDealCreateResponse;
  try {
    const { dealId } = zHsDealCreateResponse.parse(hsDealCreateRespBody);
    return dealId.toString();
  } catch (error) {
    console.error('hubspot response error:\n', hsDealCreateRespBody);
    throw new Error(getErrorMessage(getErrorMessage(error)));
  }
}

/**
 * This function is used to trigger an (internal) Hubspot email notification when a signature is received in Docusign.
 * The hubspot deal has docusign specific properties that are updated by this function.
 * Then, a Hubspot workflow that monitors these properties is triggered to send an email notification.
 * @param deal
 * @param projectSlug
 * @param email
 * @param envelopeId
 * @param allSignaturesCompleted
 * @returns
 */
export async function updateHubspotDealFromDocusignEvent(
  deal: Deal,
  projectSlug: string,
  email: string,
  envelopeId: string,
  allSignaturesCompleted: boolean = false
) {
  const hsDealProps = {
    hubspotDealId: parseInt(deal.hubspotId, 10),
    properties: [
      {
        name: 'envelope_id1',
        value: envelopeId,
      },
    ],
  } as HubspotDealUpdate;

  if (allSignaturesCompleted) {
    // just update the deal in hubspot without checking for signer info
    hsDealProps.properties.push({
      name: 'all_signatures_completed',
      value: 'true',
    });
    hsDealProps.properties.push({
      name: 'number_signatures_remaining',
      value: '0',
    });
    return await updateHubspotDealProperties(hsDealProps);
  }
  /**********************************
   * if there are remaining signatures:
   */

  const envelopesApi = await instantiateApiClientFromUserAndDeal(
    deal,
    email,
    projectSlug,
    envelopeId
  );

  const signingOrder = await getSigningOrder(envelopesApi, envelopeId);
  const numberSignaturesRemaining =
    signingOrder.length - signingOrder.map(s => s.status).indexOf('sent');
  console.log('signingOrder', signingOrder);
  let currentSigner: Signer | undefined = undefined;
  const previousSigner = signingOrder
    .filter(s => s.status === 'completed' || s.status === 'signed')
    .pop(); // get last signer that has signed

  if (!previousSigner) {
    // no signatures yet. This should not be the case, but just in case
    currentSigner = signingOrder[0];
  } else {
    if (numberSignaturesRemaining !== 0) {
      currentSigner =
        signingOrder[signingOrder.length - numberSignaturesRemaining];
    }
  }

  hsDealProps.properties = hsDealProps.properties.concat([
    {
      name: 'current_signer_email',
      value: currentSigner?.email ?? 'N/A',
    },
    {
      name: 'previous_signer_email',
      value: previousSigner?.email ?? 'N/A',
    },
    {
      name: 'all_deal_signatures_complete', // TODO: check if this is correct
      value:
        signingOrder.filter(s => s.status === 'completed').length === 0
          ? 'true'
          : 'false',
    },
    {
      name: 'number_signatures_remaining',
      value: numberSignaturesRemaining.toString(),
    },
  ]);

  return await updateHubspotDealProperties(hsDealProps);
}

export async function updateHubspotDealProperties(
  hsDealUpdateData: HubspotDealUpdate
) {
  console.log('hsDealUpdateData', hsDealUpdateData);
  const body = JSON.stringify({
    properties: hsDealUpdateData.properties,
  });
  const hsRes = await fetch(
    `${process.env.HUBSPOT_API_BASE_URL}/deals/v1/deal/${hsDealUpdateData.hubspotDealId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body,
    }
  );

  if (hsRes.status >= 300) {
    console.error('Unable to update deal in hubspot:\n', hsRes);
    // throw new Error('unable to update deal in hubspot');
  }
  return hsRes;
}

/**
 * generate hubspot deal name based on user and project, and populate deal properties based on project
 * @param projectName
 * @param user
 * @param dealData
 * @returns
 */
export function initHubspotDealProps(
  project: Project,
  user: User,
  dealData: DealCreateSchema
) {
  const properties = [
    {
      name: 'dealname',
      value: `${project.displayName} | ${user.firstName} ${user.lastName}`,
    },
    {
      name: 'investment_entity',
      value: getInvestmentEntity(
        project.name,
        dealData.financingType ?? DealFinancingType.equity
      ),
    },
    { name: 'project_name', value: project.name },
    { name: 'amount', value: `${dealData.amount ?? 0}` },
    { name: 'transaction_id', value: dealData.transactionId! },
    { name: 'hubspot_owner_id', value: process.env.HUBSPOT_OWNER_ID },
  ];
  const hsDealStageString = getHsDealStageStrFromInt(
    dealData.dealStage ?? 1,
    project.slug
  );
  return {
    properties: [
      ...properties,
      ...[
        {
          name: 'dealstage',
          value: hsDealStageString,
        },
        {
          name: 'financing_type',
          value: dealData.financingType ?? 'equity',
        },
      ],
    ],
  } as HubspotDealPropertiesCollection;
}

export function getHsDealPropsFromDeal(
  deal: DealUpdateSchema,
  projectSlug: string
) {
  const {
    dealStage,
    hubspotId,
    investmentStats,
    signaturesCompletedDate,
    transactionId,
  } = deal;
  const hsReturnObject = {
    hubspotDealId: parseInt(hubspotId, 10),
    properties: [],
  } as HubspotDealUpdate;

  hsReturnObject.properties.push({
    name: 'origin_source',
    value: 'Investor Portal',
  });

  if (transactionId)
    hsReturnObject.properties.push({
      name: 'transaction_id',
      value: transactionId,
    });

  if (dealStage)
    hsReturnObject.properties.push({
      name: 'dealstage',
      value: getHsDealStageStrFromInt(dealStage, projectSlug),
    });

  if (investmentStats?.amount)
    hsReturnObject.properties.push({
      name: 'amount',
      value: investmentStats?.amount.toString(),
    });
  if (investmentStats?.financingType)
    hsReturnObject.properties.push({
      name: 'financing_type',
      value: investmentStats?.financingType,
    });

  if ((investmentStats?.numberAUnits ?? 0) > 0) {
    hsReturnObject.properties.push({
      name: 'equity_unit',
      value: `A Unit`,
    });
  }

  if ((investmentStats?.numberCUnits ?? 0) > 0) {
    hsReturnObject.properties.push({
      name: 'equity_unit',
      value: `C Unit`,
    });
  }

  if (
    investmentStats?.financingType === 'promissory_note_now' &&
    investmentStats?.unitType
  ) {
    hsReturnObject.properties.push({
      name: 'pn_unit',
      value: investmentStats?.unitType === 'AUNIT' ? 'A Unit' : 'B Unit',
    });
  }

  if (signaturesCompletedDate)
    hsReturnObject.properties.push({
      name: 'date_signatures_completed',
      value: formatDateForHubspot(signaturesCompletedDate),
    });
  return hsReturnObject;
}

export async function associateContactWithDealInHubspot(
  contactId: string,
  dealId: string
) {
  const body = JSON.stringify({
    fromObjectId: parseInt(contactId),
    toObjectId: parseInt(dealId),
    category: 'HUBSPOT_DEFINED',
    definitionId: 4,
  });

  return await fetch(
    `${process.env.HUBSPOT_API_BASE_URL}/crm-associations/v1/associations`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body,
    }
  );
}

export async function getFundingAmount(projectSlug: string) {
  function _getPayload(slug: string) {
    switch (slug) {
      case 'edison': {
        return {
          limit: 100 /**pagination - max=100 */,
          after: 0,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'dealstage',
                  operator: 'IN',
                  values: ['contractsent', 'decisionmakerboughtin'],
                },
                {
                  propertyName: 'project_name',
                  operator: 'EQ',
                  value: 'The Edison',
                },
              ],
            },
          ],
        };
      }
      case '519': {
        return {
          limit: 100 /**pagination - max=100 */,
          after: 0,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'dealstage',
                  operator: 'IN',
                  values: ['146586773', '146586772'],
                },
                {
                  propertyName: 'project_name',
                  operator: 'EQ',
                  value: '519 W Main',
                },
              ],
            },
          ],
        };
      }
      case 'bakers': {
        return {
          limit: 100 /**pagination - max=100 */,
          after: 0,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'dealstage',
                  operator: 'IN',
                  values: ['257596001', '257596003'],
                },
                {
                  propertyName: 'project_name',
                  operator: 'EQ',
                  value: 'Bakers Place',
                },
              ],
            },
          ],
        };
      }
      default: {
        console.error(
          `The project with slug ${slug} is not yet supported in getFundingAmount()`
        );
        return new Error(
          `The project with slug ${slug} is not yet supported in getFundingAmount()`
        );
      }
    }
  }

  let totalAmountRaised = 0;
  let dealsFetched = 0;
  let totalDeals = 100;
  while (dealsFetched < totalDeals) {
    const payload = _getPayload(projectSlug);
    if (payload instanceof Error) {
      return 25000000;
    }
    payload.after = dealsFetched;
    const resBody = await fetch(
      `${process.env.HUBSPOT_API_BASE_URL}/crm/v3/objects/deals/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const hsDealCreateRespBody = await resBody.json();
    try {
      const { results, total } =
        zHsDealSearchResultsSchema.parse(hsDealCreateRespBody);
      totalDeals = total;
      dealsFetched += results.length;
      totalAmountRaised += results
        .map(r => parseFloat(r.properties.amount))
        .reduce((acc, cur) => acc + cur, 0);
    } catch (error) {
      console.error('could not compute updated deal closed amount:\n', error);
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
    console.error(`dealStage ${hsDealStageStr} is not valid`);
    return -1;
  }
  return pos + 1;
}

export function getHsDealStageStrFromInt(
  dealStage: number,
  projectSlug: string
) {
  if (dealStage < 0 || dealStage > 6) {
    console.error(`dealStage ${dealStage} is not valid`);
    return 'null';
  }
  if (dealStage > 0) dealStage -= 1; // convert to 0 based index
  switch (projectSlug) {
    case 'edison': {
      return EdisonDealStages[dealStage]?.value ?? 'null';
    }
    case '519': {
      return _519WMainDealStages[dealStage]?.value ?? 'null';
    }
    case 'bakers': {
      return BakersPlaceDealStages[dealStage]?.value ?? 'null';
    }
    default: {
      console.error(
        `The project with slug ${projectSlug} is not yet supported in getHsDealStageStrFromInt()`
      );
      return 'null';
    }
  }
}

export function getProjectSlugFromDealStage(dealstage: string) {
  if (EdisonDealStages.map(e => e.value).indexOf(dealstage) > -1)
    return 'edison';
  if (_519WMainDealStages.map(e => e.value).indexOf(dealstage) > -1)
    return '519';
  if (BakersPlaceDealStages.map(e => e.value).indexOf(dealstage) > -1)
    return 'bakers';
  throw new Error(
    'project not yet supported by getProjectSlugFromDealStage function'
  );
}

export function getFinancingType(hsFinancingType: string) {
  return hsFinancingType in DealFinancingType
    ? (hsFinancingType as keyof typeof DealFinancingType)
    : undefined;
}

export const EdisonDealStages = [
  { key: 'aQualified', value: 'appointmentscheduled', intVal: 1 },
  { key: 'bAwareness', value: '165518133', intVal: 2 },
  { key: 'cContractShared', value: 'presentationscheduled', intVal: 3 },
  { key: 'dContractSigned', value: 'decisionmakerboughtin', intVal: 4 },
  { key: 'eFunded', value: 'contractsent', intVal: 5 },
  { key: 'fClosedLost', value: 'closedlost', intVal: 6 },
];

export const _519WMainDealStages = [
  { key: 'aQualified', value: '146586769', intVal: 1 },
  { key: 'bAwareness', value: '165498481', intVal: 2 },
  { key: 'cContractShared', value: '146586771', intVal: 3 },
  { key: 'dContractSigned', value: '146586772', intVal: 4 },
  { key: 'eFunded', value: '146586773', intVal: 5 },
  { key: 'fClosedLost', value: '146586774', intVal: 6 },
];

export const BakersPlaceDealStages = [
  { key: 'aQualified', value: '257595997', intVal: 1 },
  { key: 'bAwareness', value: '257595998', intVal: 2 },
  { key: 'cContractShared', value: '257595999', intVal: 3 },
  { key: 'dContractSigned', value: '257596000', intVal: 4 },
  { key: 'eFunded', value: '257596001', intVal: 5 },
  { key: 'fClosedLost', value: '257596003', intVal: 6 },
];

export enum HSDealPropNames {
  dealstage = 'dealstage',
  amount = 'amount',
  financing_type = 'financing_type',
  closedate = 'closedate',
}
