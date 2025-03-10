import 'server-only';
/* @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-constructor */
//This file needs a lot of help with the eslint rules.

// https://www.youtube.com/watch?v=sqx8KbVa6Cw I followed much of this docusign tutorial

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import {
  type EnvelopeDefinition,
  ApiClient,
  EnvelopesApi,
  type Tabs,
  type TemplateRole,
  type RadioGroup,
  type Radio,
  type Text as DSText,
  type RecipientViewRequest,
  type InitialHere,
  type Checkbox,
} from 'docusign-esign';
import {
  Deal,
  DealOwnershipType,
  VerificationBasis,
  type Address,
  type User,
} from '@prisma/client';
import type {
  DealWithInvestmentStatsAndVerification,
  OrganizationWithFullMembersAndAddress,
  UserWithAddress,
} from '@/libs/types';
import { docusignOwnershipTypeEnum } from './schema';
import { type SessionData, sessionOptions } from '../session/utils';
import { toWords } from 'number-to-words';
import { isNull } from 'lodash';
import { getErrorMessage } from '../utils.server';
import { getFileContent, storageClient } from '../supabase';
import Logger from '../logger';

/* eslint-disable-next-line*/
const docusign = require('docusign-esign'); //https://github.com/docusign/docusign-esign-node-client/issues/332

/**
 * Retreives access token from session cookie, and if not found, returns a consentUrl that can be used to redirect user to give consent and return an access token.
 * @returns { accessToken: string; consentUrl: string; }
 */
export async function refreshAccessToken(
  userEmail: string,
  dealId: number,
  projectSlug: string
) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  console.log('session', session);
  const responseObj = {
    accessToken: '',
    consentUrl: '',
  };
  // session.docusignJwt = undefined; // TODO: delete this - only used for debugging
  if (session.docusignJwt && (session.docusignExpiresAt ?? 0) >= Date.now()) {
    console.log('reusing unexpired DS access token from session cookie');
    responseObj.accessToken = session.docusignJwt;
    return responseObj;
  }

  // if the access token is expired, generate a new one:
  console.log('generating a new DS access token');
  const dsApiClient: ApiClient = new ApiClient();
  try {
    dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!);
  } catch (err) {
    console.error(`Error setting base path for DocuSign API client: ${err}`);
    throw new Error(`Error setting base path for DocuSign API client: ${err}`);
  }

  let docusignJwtRes: {
    body: {
      consentUrl?: string;
      access_token?: string;
      expires_in?: number;
      accessToken?: string;
      expiresIn?: number;
    };
  };
  try {
    await storageClient.getBucket('env');
    const docusignRSAKey = await getFileContent('env', 'docusign.pem');
    if (!docusignRSAKey) {
      throw new Error('Docusign RSA Key not found');
    }
    docusignJwtRes = await dsApiClient
      .requestJWTUserToken(
        process.env.DOCUSIGN_INTEGRATION_KEY!,
        process.env.DOCUSIGN_USER_ID!,
        ['signature', 'impersonation'],
        Buffer.from(docusignRSAKey, 'utf8'),
        3600
      )
      .catch((err: { response: { data: { error: string } } }) => {
        // The user is not logged in
        const errMessage = err.response.data.error;
        Logger.log({ extra: err.response.data, message: errMessage });
        // expected DocuSign API problem - every user will see this once.
        if (errMessage === 'consent_required') {
          Logger.log({
            message:
              'caught error: consent required - redirecting to consent page',
          });
          ///https://www.docusign.com/blog/developers/oauth-jwt-granting-consent
          // https://www.youtube.com/watch?v=sBziZ2TfFVs
          // TODO: redirect to /tokenFromCode
          const consentUrl = `https://account.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=${process.env.DOCUSIGN_INTEGRATION_KEY}&redirect_uri=${process.env.BASE_URL}/api/docusign/tokenFromCode&login_hint=${userEmail}&state=dealId${dealId}projectSlug${projectSlug}`;
          return { body: { consentUrl } };
        } else {
          Logger.error(err.response.data.error);
          throw new Error(errMessage);
        }
      });
  } catch (err) {
    Logger.error(`Error getting Docusign JWT token: ${err}`);
    throw new Error(`Error getting Docusign JWT token: ${err}`);
  }

  if (docusignJwtRes.body.consentUrl) {
    console.warn('User needs to give consent to use docusign');
    responseObj.consentUrl = docusignJwtRes.body.consentUrl;
  } else {
    const { access_token, expires_in } = docusignJwtRes.body as {
      access_token: string;
      expires_in: number;
    };

    // store jwt in session
    session.docusignJwt = access_token;
    session.docusignExpiresAt = Date.now() + expires_in * 1000 - 60;
    await session.save();
    responseObj.accessToken = access_token;
  }
  return responseObj;
}

export async function refreshAccessTokenFromCode(code: string) {
  const dsApiClient: ApiClient = new ApiClient();
  try {
    dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!);
  } catch (err) {
    console.error(`Error setting base path for DocuSign API client: ${err}`);
    throw new Error(`Error setting base path for DocuSign API client: ${err}`);
  }
  try {
    console.log('getting docusignAccessTokenRes1');
    const docusignAccessTokenRes = await dsApiClient.generateAccessToken(
      process.env.DOCUSIGN_INTEGRATION_KEY!,
      process.env.DOCUSIGN_SECRET_KEY!,
      code
    );

    console.log(docusignAccessTokenRes);
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );
    session.docusignJwt = docusignAccessTokenRes.accessToken;
    session.docusignExpiresAt =
      Date.now() +
      parseInt(docusignAccessTokenRes.expiresIn ?? '3600') * 1000 -
      60;
    console.log('session has been updated:', session);
    await session.save();

    return docusignAccessTokenRes;
  } catch (err) {
    console.error(`Error getting Docusign JWT token: ${err}`);
    return err;
  }
}

/**
 *
 * @param deal Deal that the envelope is associated with
 * @param email Email of the deal owner
 * @param slug slug of the project the deal is associated with
 * @param envelopeId envelopeId in question
 * @returns
 */
export async function instantiateApiClientFromUserAndDeal(
  deal: Deal,
  email: string,
  slug: string,
  envelopeId: string
) {
  const accessTokenResponse = await refreshAccessToken(email, deal.id, slug);

  if (accessTokenResponse.consentUrl) {
    // we need to get consent from the user to share their data with docusign.
    // this should never happen as we already did this when the user signed the document
    const errorMessage = `Consent required to share data with docusign for envelopeId: ${envelopeId} - THIS SHOULD NEVER HAPPEN!`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  let envelopesApi;
  try {
    envelopesApi = await instantiateApiClientFromAccessToken(
      accessTokenResponse.accessToken
    );
  } catch (error) {
    console.error('Error instantiating envelopesApi:', getErrorMessage(error));
    throw error;
  }
  return envelopesApi;
}

export async function instantiateApiClientFromAccessToken(accessToken: string) {
  const dsApiClient = new ApiClient();
  dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!);
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
  return new EnvelopesApi(dsApiClient);
}

export async function createNewEnvelopeDefinition(
  envelopesApi: EnvelopesApi,
  templateId: string,
  deal: DealWithInvestmentStatsAndVerification,
  userWOrgsAndAddress: UserWithAddress,
  organization: OrganizationWithFullMembersAndAddress
) {
  const envelope = makeEnvelopeDefinition(
    templateId,
    organization,
    deal,
    userWOrgsAndAddress
  );
  try {
    const envelopeResponse = await envelopesApi.createEnvelope(
      process.env.DOCUSIGN_API_ACCOUNT_ID!,
      { envelopeDefinition: envelope }
    );
    return envelopeResponse;
  } catch (err) {
    console.error('CANNOT CREATE ENVELOPE:', err);
    // const { errorCode, message } = (
    //   err as { data: { errorCode: string; message: string } }
    // ).data;
    // console.log('errorCode', errorCode, message);
    // if (errorCode === 'USER_AUTHENTICATION_FAILED') {
    //   console.error(
    //     "'USER_AUTHENTICATION_FAILED' - need to clear session and re-authenticate"
    //   );
    //   const session = await getIronSession<SessionData>(
    //     cookies(),
    //     sessionOptions
    //   );
    //   session.docusignJwt = undefined;
    //   session.docusignExpiresAt = undefined;
    //   throw new Error('JWT was invalid and has been deleted. Try again');
    // } else {
    throw new Error('Failed to create envelope');
  }
}

export async function getExistingEnvelopeDefinition(
  envelopesApi: EnvelopesApi,
  envelopeId: string
) {
  try {
    const envelopeResponse = await envelopesApi.getEnvelope(
      process.env.DOCUSIGN_API_ACCOUNT_ID!,
      envelopeId
    );
    return envelopeResponse;
  } catch (err) {
    console.error('CANNOT GET ENVELOPE:', err);
    throw new Error(getErrorMessage(err));
  }
}

/**
 * Fetch signing order of an envelope from DocuSign
 * @param {string} envelopeId - The ID of the envelope to fetch signing order
 * @returns {Promise<object>} - The signing order details
 */
export async function getSigningOrder(
  envelopesApi: EnvelopesApi,
  envelopeId: string
) {
  const accountId = process.env.DOCUSIGN_API_ACCOUNT_ID!;
  try {
    // Get envelope details
    const envelopeDetails = await envelopesApi.listRecipients(
      accountId,
      envelopeId
    );

    // Extract signing order
    const signers = envelopeDetails.signers ?? [];
    const signingOrder = signers
      .map(signer => ({
        name: signer.name,
        email: signer.email,
        routingOrder: signer.routingOrder,
        status: signer.status,
        role: signer.roleName,
        recipientId: signer.recipientId,
        dateSigned: signer.signedDateTime,
        // dateViewed: signer.deliveredDateTime,
        // dateSent: signer.sentDateTime,
      }))
      .sort(
        (a, b) =>
          parseInt(a.routingOrder ?? '1', 10) -
          parseInt(b.routingOrder ?? '2', 10)
      );

    return signingOrder;
  } catch (error) {
    console.error('Error fetching signing order:', error);
    throw error;
  }
}

const addressToCityStateZip = (a: Address | null) => {
  return a ? `${a.city}, ${a.state} ${a.zipcode}` : '';
};

const addressToOneLine = (a: Address | null) => {
  return a ? `${a.street}, ${a.city}, ${a.state} ${a.zipcode}` : '';
};

const getAddress = (
  org: OrganizationWithFullMembersAndAddress,
  deal: DealWithInvestmentStatsAndVerification,
  user: UserWithAddress
) => {
  switch (deal.investmentStats.ownershipType) {
    case DealOwnershipType.INDIVIDUAL:
    case DealOwnershipType.MARITAL:
    case DealOwnershipType.JOINT:
      return user.address;
    default:
      return org.address ?? user.address;
  }
};

const getSsnOrTin = (
  org: OrganizationWithFullMembersAndAddress,
  deal: DealWithInvestmentStatsAndVerification,
  user: UserWithAddress
) => {
  switch (deal.investmentStats.ownershipType) {
    case DealOwnershipType.INDIVIDUAL:
    case DealOwnershipType.MARITAL:
    case DealOwnershipType.JOINT:
      return user.ssn;
    default:
      return org.tin ?? user.ssn;
  }
};

const getInvestingEntityName = (
  org: OrganizationWithFullMembersAndAddress,
  deal: DealWithInvestmentStatsAndVerification,
  user: UserWithAddress
) => {
  switch (deal.investmentStats.ownershipType) {
    case DealOwnershipType.INDIVIDUAL:
    case DealOwnershipType.MARITAL:
    case DealOwnershipType.JOINT:
      return `${user.firstName} ${user.lastName}`;
    default:
      return org.name;
  }
};

const getInitialHereTabs = (deal: DealWithInvestmentStatsAndVerification) => {
  let tabname = 'initial_company';
  switch (deal.investmentStats.ownershipType) {
    case DealOwnershipType.INDIVIDUAL:
    case DealOwnershipType.MARITAL:
    case DealOwnershipType.JOINT:
      tabname = 'initial_individual';
      break;
  }

  const companyOrIndividualTab: InitialHere =
    docusign.InitialHere.constructFromObject({
      tabLabel: tabname,
      optional: 'false',
    }) as InitialHere;

  let basis = 'init_verifier_networth';
  if (deal.accreditationVerification?.basis === 'INCOME')
    basis = 'init_verifier_income';
  if (deal.accreditationVerification?.basis === 'OTHER')
    basis = 'init_verifier_other';

  const VerificationBasisTab: InitialHere =
    docusign.InitialHere.constructFromObject({
      // TODO: this is not yet hooked up to the deal.accreditationVerification
      tabLabel: basis,
      optional: isNull(deal.accreditationVerification),
    }) as InitialHere;

  return [companyOrIndividualTab, VerificationBasisTab];
};

const getSignerCheckboxTabs = (
  deal: DealWithInvestmentStatsAndVerification
) => {
  /**
   * CHECKBOXES:
   * verification_irs &&
   * verification_w2
   * verification_1099
   * verification_1065
   * verification_1040
   * or
   * verification_other
   *
   */
  let tabLabel = 'verification_irs';
  switch (deal.accreditationVerification?.basis) {
    case VerificationBasis.OTHER:
    case VerificationBasis.LICENSE:
      tabLabel = 'verification_other';
      break;
  }

  const verificationMethodTab: Checkbox = docusign.Checkbox.constructFromObject(
    {
      tabLabel,
      selected: 'true',
    }
  ) as Checkbox;
  return [verificationMethodTab];
};

const getSignerCompanyDetailsTabs = (
  org: OrganizationWithFullMembersAndAddress,
  deal: DealWithInvestmentStatsAndVerification,
  user: UserWithAddress
) => {
  const stateNotOrgTab = docusign.Text.constructFromObject({
    tabLabel: 'stateNotOrg',
    value: getAddress(org, deal, user)?.state ?? '',
    required: 'true',
  }) as DSText;
  console.log(deal.investmentStats.ownershipType);
  switch (deal.investmentStats.ownershipType) {
    case DealOwnershipType.INDIVIDUAL:
    case DealOwnershipType.MARITAL:
    case DealOwnershipType.OTHER:
      console.log('getting individual details tabs');
      return [stateNotOrgTab];
    default:
      console.log('getting company details tabs', org.address);

      const corporationStateTab: DSText = docusign.Text.constructFromObject({
        tabLabel: 'corporationState',
        value: getAddress(org, deal, user)?.state ?? '',
        required: 'true',
      }) as DSText;

      const corporationCityTab: DSText = docusign.Text.constructFromObject({
        tabLabel: 'corporationCity',
        value: getAddress(org, deal, user)?.city ?? '',
        required: 'true',
      }) as DSText;

      const corporationFormationDateTab: DSText =
        docusign.Text.constructFromObject({
          tabLabel: 'corporationFormationDate',
          value: org.dateOfCreation?.toDateString() ?? '',
          required: 'true',
        }) as DSText;

      return [
        corporationStateTab,
        corporationCityTab,
        corporationFormationDateTab,
      ];
  }
};

// https://developers.docusign.com/docs/esign-rest-api/how-to/request-signature-template-remote/
export function makeEnvelopeDefinition(
  templateId: string,
  org: OrganizationWithFullMembersAndAddress,
  deal: DealWithInvestmentStatsAndVerification,
  signer: UserWithAddress
) {
  const coSigners = org.members
    .filter(m => m.userId !== org.ownerId)
    .map(m => m.user as UserWithAddress);
  const accreditationVerifier = deal.accreditationVerification?.verifier;

  const { amount, numberAUnits, numberCUnits, debtInterestRatePerc } =
    deal.investmentStats;
  const amountSpelledOut = toWords(amount);
  const interestSpelledOut = `${toWords(debtInterestRatePerc ?? 0)} Percent`;
  const investingEntityName = getInvestingEntityName(org, deal, signer);

  const env: EnvelopeDefinition =
    new docusign.EnvelopeDefinition() as EnvelopeDefinition;
  env.templateId = templateId;

  // SHARED TABS

  const amountTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'amount',
    value: amount.toString(),
  }) as DSText;

  const amountSpelledOutTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'amountSpelledOut',
    value: amountSpelledOut,
  }) as DSText;

  const numberAUnitsTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'numberAUnits',
    value: numberAUnits?.toString() ?? '',
  }) as DSText;

  const numberCUnitsTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'numberCUnits',
    value: numberCUnits?.toString() ?? '',
  }) as DSText;

  const interestTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'interest',
    value: debtInterestRatePerc?.toString() ?? '',
  }) as DSText;

  const interestSpelledOutTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'interestSpelledOut',
    value: interestSpelledOut,
  }) as DSText;

  const investingEntityNameTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'investingEntityName',
    value: investingEntityName,
  }) as DSText;

  const sharedTextTabs = [
    amountTab,
    amountSpelledOutTab,
    investingEntityNameTab,
    numberAUnitsTab,
    numberCUnitsTab,
    interestTab,
    interestSpelledOutTab,
  ];

  const signer1SsnTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'ssn',
    value: getSsnOrTin(org, deal, signer),
  }) as DSText;

  const signer1AddressStreetTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'addressStreet',
    value: getAddress(org, deal, signer)?.street ?? '',
  }) as DSText;

  const signer1AddressCityStateZipTab: DSText =
    docusign.Text.constructFromObject({
      tabLabel: 'addressCityStateZip',
      value: addressToCityStateZip(getAddress(org, deal, signer)),
    }) as DSText;

  const signer1AddressOneLineTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'addressOneLine',
    value: addressToOneLine(getAddress(org, deal, signer)),
  }) as DSText;

  const signer1State: DSText = docusign.Text.constructFromObject({
    tabLabel: 'state',
    value: getAddress(org, deal, signer)?.state,
  }) as DSText;

  const signer1PhoneNumberTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'phoneNumber',
    value: signer.phoneNumber,
  }) as DSText;

  // Ownership type
  const ownershipType = getOwnershipTypeFromDeal(
    deal.investmentStats.ownershipType
  );

  const signer1OwnershipTypeTab: RadioGroup =
    docusign.RadioGroup.constructFromObject({
      groupName: 'ownershipType',

      radios: [
        docusign.Radio.constructFromObject({
          value: ownershipType,
          selected: 'true',
          locked: 'true',
          required: 'false',
        }) as Radio,
      ],
    }) as RadioGroup;

  // Combine the existing and new tabs in a Tabs object:
  /* eslint-disable-next-line*/
  let signer1Tabs: Tabs = docusign.Tabs.constructFromObject({
    textTabs: [
      ...sharedTextTabs,
      ...[
        // signer1TitleTab,
        signer1SsnTab,
        signer1PhoneNumberTab,
        signer1AddressStreetTab,
        signer1AddressCityStateZipTab,
        signer1AddressOneLineTab,
        signer1State,
        ...getSignerCompanyDetailsTabs(org, deal, signer),
      ],
    ],
    radioGroupTabs: [signer1OwnershipTypeTab],
    initialHereTabs: getInitialHereTabs(deal),
    checkboxTabs: getSignerCheckboxTabs(deal),
  }) as Tabs;

  const neutralSignerTitleTab: DSText = docusign.Text.constructFromObject({
    tabLabel: 'title',
    value: 'Authorized Agent',
  }) as DSText;

  const neutralSignerTabs: Tabs = docusign.Tabs.constructFromObject({
    textTabs: [...sharedTextTabs, ...[neutralSignerTitleTab]],
  });

  const signer1Role: TemplateRole = docusign.TemplateRole.constructFromObject({
    email: signer.email,
    name: `${signer.firstName} ${signer.lastName}`,
    tabs: signer1Tabs,
    clientUserId: `signer-${signer.id.toString()}`, // must set this, so they can innitiate signing from our app
    roleName: 'Signer',
  }) as TemplateRole;

  const neutralSignerRole: TemplateRole =
    docusign.TemplateRole.constructFromObject({
      email: 'nate@neutral.us',
      name: 'Nate Helbach',
      tabs: neutralSignerTabs,
      // clientUserId: 'nate@neutral.us', must not set this, so they receive an email
      roleName: 'Neutral Signer',
    }) as TemplateRole;

  env.templateRoles = [signer1Role, neutralSignerRole];

  // co-signer
  if (coSigners.length > 0) {
    const coSigner = coSigners[0];

    const coSignerRole1: TemplateRole =
      docusign.TemplateRole.constructFromObject({
        email: coSigner!.email,
        name: `${coSigner!.firstName} ${coSigner!.lastName}`,
        // clientUserId: `cosigner-${coSigner!.id.toString()}`, must not set this, so they receive an email
        roleName: 'Co-Signer',
      }) as TemplateRole;
    env.templateRoles.push(coSignerRole1);
  }
  if (accreditationVerifier) {
    const accreditationVerifierRole: TemplateRole =
      docusign.TemplateRole.constructFromObject({
        email: accreditationVerifier.email,
        name: `${accreditationVerifier.firstName} ${accreditationVerifier.lastName}`,
        // clientUserId: `accver-${accreditationVerifier.id.toString()}`, must not set this, so they receive an email
        roleName: 'Accreditation Verifier',
      }) as TemplateRole;
    env.templateRoles.push(accreditationVerifierRole);
  }

  env.status = 'sent'; // We want the envelope to be sent

  return env;
}

export function makeRecipientViewRequest(signer: User, returnUrl: string) {
  /* eslint-disable-next-line*/
  let viewRequest: RecipientViewRequest =
    new docusign.RecipientViewRequest() as RecipientViewRequest;

  viewRequest.returnUrl = `${returnUrl}`; //comes back with a query parameter. TODO: capture which project they came from
  viewRequest.authenticationMethod = 'none';

  // Recipient information must match embedded recipient info
  // we used to create the envelope.
  viewRequest.email = signer.email;
  viewRequest.userName = `${signer.firstName} ${signer.lastName}`;
  viewRequest.clientUserId = `signer-${signer.id.toString()}`;

  return viewRequest;
}

export function getOwnershipTypeFromDeal(ownershipType: DealOwnershipType) {
  switch (ownershipType) {
    case DealOwnershipType.INDIVIDUAL:
      return docusignOwnershipTypeEnum.Individual;
    case DealOwnershipType.JOINT:
      return docusignOwnershipTypeEnum.Joint;
    case DealOwnershipType.CORPORATION:
      return docusignOwnershipTypeEnum.Corporation;
    case DealOwnershipType.PARTNERSHIP:
      return docusignOwnershipTypeEnum.Partnership;
    case DealOwnershipType.COMMON:
      return docusignOwnershipTypeEnum.Common;
    case DealOwnershipType.MARITAL:
      return docusignOwnershipTypeEnum.Marital;
    default:
      return docusignOwnershipTypeEnum.Other;
  }
}

export async function getEnvelopeAsPdfFileBuffer(
  envelopesApi: EnvelopesApi,
  envelopeId: string,
  fileName: string
) {
  // https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopedocuments/get/
  // returns all documents in the envelope as a single combined PDF
  const envelopeAsBase64String = await envelopesApi.getDocument(
    process.env.DOCUSIGN_API_ACCOUNT_ID!,
    envelopeId,
    'combined',
    { certificate: 'false' }
  );
  const mimeType = 'application/pdf';
  const blob = new Blob([envelopeAsBase64String], { type: mimeType });

  // Create a File from the Blob
  const file = new File([blob], fileName, { type: mimeType });

  return file;
  // return Buffer.from(envelopeAsBase64String, 'base64');
  // return envelopeAsBase64String
}

export interface AccessTokenResponse {
  consentUrl?: string;
  accessToken?: string;
}
