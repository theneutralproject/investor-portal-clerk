// https://www.youtube.com/watch?v=sqx8KbVa6Cw I followed much of this docusign tutorial

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
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
    type Checkbox
} from "docusign-esign";
import { DealOwnershipType, VerificationBasis, type Address, type User } from "@prisma/client";
import type { DealWithInvestmentStatsAndVerification, OrganizationWithFullMembersAndAddress, UserWithAddress } from "@/libs/types";
import { docusignOwnershipTypeEnum } from "./schema";
import { type SessionData, sessionOptions } from "../session/utils";
import { toWords } from "number-to-words";
import { isNull } from "lodash";

/* eslint-disable-next-line*/
const docusign = require("docusign-esign"); //https://github.com/docusign/docusign-esign-node-client/issues/332

export async function refreshAccessToken() {
    "use server";   // TODO: Ensure this does not break docusign!!!
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    const responseObj = {
        accessToken: "",
        consentUrl: ""
    };
    if (!(session.docusignJwt && (session.docusignExpiresAt ?? 0) > Date.now())) {
        console.log("generating a new DS access token");
        const dsApiClient: ApiClient = new ApiClient();
        dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!);
        // dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + process.env.DOCUSIGN_INTEGRATION_KEY);
        /* eslint-disable-next-line*/
        const results: { body: { consentUrl?: string, access_token?: string, expires_in?: number } } = await dsApiClient.requestJWTUserToken(
            process.env.DOCUSIGN_INTEGRATION_KEY!,
            process.env.DOCUSIGN_USER_ID!,
            ["signature"],
            // fs.readFileSync(path.join(__dirname, "private.key")), //TODO: save as DB file instead of secret
            Buffer.from(process.env.DOCUSIGN_RSA_PRIVATE_KEY!, 'utf8'),
            3600
        )
            .catch((err: { response: { data: { error: string } } }) => {

                // The user is not logged in
                const errMessage = err.response.data.error;

                // DocuSign API problem
                if (errMessage === 'consent_required') {
                    ///https://www.docusign.com/blog/developers/oauth-jwt-granting-consent
                    //SERVER/oauth/auth?response_type=code &scope=signature%20impersonation&client_id=CLIENT_ID &redirect_uri=REDIRECT_URI
                    const consentUrl = `https://account${process.env.NODE_ENV === "production" ? "" : "-d"}.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=${process.env.DOCUSIGN_INTEGRATION_KEY}&redirect_uri=${process.env.BASE_URL}/projects`
                    return { body: { consentUrl } };
                } else {
                    console.error(err)
                    return new Error("unknown Docusign error");
                }
            })

        /* eslint-disable */
        if (results.body.consentUrl) {
            responseObj.consentUrl = results.body.consentUrl
        }
        else {
            const { access_token, expires_in } = results.body as { access_token: string, expires_in: number };
            /* eslint-enable */

            // store jwt in session
            session.docusignJwt = access_token;
            session.docusignExpiresAt = Date.now() + (expires_in * 1000) - 60;
            await session.save();
            responseObj.accessToken = access_token;
        }
    } else {
        console.log("reusing unexpired DS access token")
        responseObj.accessToken = session.docusignJwt!;
    }
    return responseObj;
}

export async function instantiateApiClient(accessToken: string) {
    const dsApiClient = new ApiClient();
    dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!);
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    return new EnvelopesApi(dsApiClient);
}

const addressToCityStateZip = (a: Address | null) => {
    return a ? `${a.city}, ${a.state} ${a.zipcode}` : ""
};

const addressToOneLine = (a: Address | null) => {
    return a ? `${a.street}, ${a.city}, ${a.state} ${a.zipcode}` : ""
};

const getAddress = (org: OrganizationWithFullMembersAndAddress, deal: DealWithInvestmentStatsAndVerification, user: UserWithAddress) => {
    switch (deal.investmentStats.ownershipType) {
        case DealOwnershipType.INDIVIDUAL:
        case DealOwnershipType.MARITAL:
        case DealOwnershipType.JOINT:
            return user.address;
        default: return org.address ?? user.address;
    }
}

const getSsnOrTin = (org: OrganizationWithFullMembersAndAddress, deal: DealWithInvestmentStatsAndVerification, user: UserWithAddress) => {
    switch (deal.investmentStats.ownershipType) {
        case DealOwnershipType.INDIVIDUAL:
        case DealOwnershipType.MARITAL:
        case DealOwnershipType.JOINT:
            return user.ssn;
        default: return org.tin ?? user.ssn;
    }
}

const getInvestingEntityName = (org: OrganizationWithFullMembersAndAddress, deal: DealWithInvestmentStatsAndVerification, user: UserWithAddress) => {
    switch (deal.investmentStats.ownershipType) {
        case DealOwnershipType.INDIVIDUAL:
        case DealOwnershipType.MARITAL:
        case DealOwnershipType.JOINT:
            return `${user.firstName} ${user.lastName}`;
        default: return org.name;
    }
}

const getInitialHereTabs = (deal: DealWithInvestmentStatsAndVerification) => {
    let tabname = "initial_company";
    switch (deal.investmentStats.ownershipType) {
        case DealOwnershipType.INDIVIDUAL:
        case DealOwnershipType.MARITAL:
        case DealOwnershipType.JOINT:
            tabname = "initial_individual";
            break;
    }

    /* eslint-disable-next-line*/
    const companyOrIndividualTab: InitialHere = docusign.InitialHere.constructFromObject({
        tabLabel: tabname, optional: "false",
    }) as InitialHere;

    let basis = "init_verifier_networth";
    if (deal.accreditationVerification?.basis === "INCOME") basis = "init_verifier_income";
    if (deal.accreditationVerification?.basis === "OTHER") basis = "init_verifier_other";
    /* eslint-disable-next-line*/
    const VerificationBasisTab: InitialHere = docusign.InitialHere.constructFromObject({
        // TODO: this is not yet hooked up to the deal.accreditationVerification
        tabLabel: basis, optional: isNull(deal.accreditationVerification),
    }) as InitialHere;

    return [companyOrIndividualTab, VerificationBasisTab];
}

const getSignerCheckboxTabs = (deal: DealWithInvestmentStatsAndVerification) => {
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
    let tabLabel = "verification_irs";
    switch (deal.accreditationVerification?.basis) {
        case VerificationBasis.OTHER:
        case VerificationBasis.LICENSE:
            tabLabel = "verification_other";
            break;
    }

    /* eslint-disable-next-line*/
    const verificationMethodTab: Checkbox = docusign.Checkbox.constructFromObject({
        tabLabel, selected: "true",
    }) as Checkbox;
    return [verificationMethodTab];
}

const getSignerCompanyDetailsTabs = (org: OrganizationWithFullMembersAndAddress, deal: DealWithInvestmentStatsAndVerification, user: UserWithAddress) => {
    /* eslint-disable-next-line*/
    const stateNotOrgTab = docusign.Text.constructFromObject({
        tabLabel: "stateNotOrg", value: getAddress(org, deal, user)?.state ?? '',
        required: "true"
    }) as DSText;
    console.log(deal.investmentStats.ownershipType)
    switch (deal.investmentStats.ownershipType) {
        case DealOwnershipType.INDIVIDUAL:
        case DealOwnershipType.MARITAL:
        case DealOwnershipType.OTHER:
            console.log("getting individual details tabs")
            return [stateNotOrgTab];
        default:
            console.log("getting company details tabs", org.address)
            /* eslint-disable-next-line*/
            const corporationStateTab: DSText = docusign.Text.constructFromObject({
                tabLabel: "corporationState", value: getAddress(org, deal, user)?.state ?? '',
                required: "true"
            }) as DSText;

            /* eslint-disable-next-line*/
            const corporationCityTab: DSText = docusign.Text.constructFromObject({
                tabLabel: "corporationCity", value: getAddress(org, deal, user)?.city ?? '',
                required: "true"
            }) as DSText;

            /* eslint-disable-next-line*/
            const corporationFormationDateTab: DSText = docusign.Text.constructFromObject({
                tabLabel: "corporationFormationDate", value: org.dateOfCreation?.toDateString() ?? '',
                required: "true"
            }) as DSText;

            return [corporationStateTab, corporationCityTab, corporationFormationDateTab];
    }
}

// https://developers.docusign.com/docs/esign-rest-api/how-to/request-signature-template-remote/
export function makeEnvelope(envelopeId: string, org: OrganizationWithFullMembersAndAddress, deal: DealWithInvestmentStatsAndVerification, signer: UserWithAddress) {
    const coSigners = org.members.filter(m => m.userId !== org.ownerId).map(m => m.user as UserWithAddress);
    const accreditationVerifier = deal.accreditationVerification?.verifier;

    const { amount, numberAUnits, numberCUnits } = deal.investmentStats;
    const amountSpelledOut = toWords(amount);
    const investingEntityName = getInvestingEntityName(org, deal, signer);


    /* eslint-disable-next-line*/
    const env: EnvelopeDefinition = new docusign.EnvelopeDefinition() as EnvelopeDefinition;
    env.templateId = envelopeId;

    // SHARED TABS

    /* eslint-disable-next-line*/
    const amountTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "amount", value: amount.toString(),
    }) as DSText;

    /* eslint-disable-next-line*/
    const amountSpelledOutTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "amountSpelledOut", value: amountSpelledOut,
    }) as DSText;

    /* eslint-disable-next-line*/
    const numberAUnitsTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "numberAUnits", value: numberAUnits?.toString() ?? "",
    }) as DSText;

    /* eslint-disable-next-line*/
    const numberCUnitsTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "numberCUnits", value: numberCUnits?.toString() ?? "",
    }) as DSText;

    /* eslint-disable-next-line*/
    const interestTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "interest", value: amount >= 250000 ? "12" : "10",
    }) as DSText;

    /* eslint-disable-next-line*/
    const investingEntityNameTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "investingEntityName", value: investingEntityName,
    }) as DSText;

    const sharedTextTabs = [
        amountTab,
        amountSpelledOutTab,
        investingEntityNameTab,
        numberAUnitsTab,
        numberCUnitsTab,
        interestTab
    ];

    /* eslint-disable-next-line*/
    const signer1SsnTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "ssn", value: getSsnOrTin(org, deal, signer),
    }) as DSText;


    /* eslint-disable-next-line*/
    const signer1AddressStreetTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "addressStreet", value: getAddress(org, deal, signer)?.street ?? "",
    }) as DSText;

    /* eslint-disable-next-line*/
    const signer1AddressCityStateZipTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "addressCityStateZip", value: addressToCityStateZip(getAddress(org, deal, signer)),
    }) as DSText;

    /* eslint-disable-next-line*/
    const signer1AddressOneLineTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "addressOneLine", value: addressToOneLine(getAddress(org, deal, signer)),
    }) as DSText;

    /* eslint-disable-next-line*/
    const signer1State: DSText = docusign.Text.constructFromObject({
        tabLabel: "state", value: getAddress(org, deal, signer)?.state,
    }) as DSText;

    /* eslint-disable-next-line*/
    const signer1PhoneNumberTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "phoneNumber", value: signer.phoneNumber,
    }) as DSText;

    // Ownership type
    const ownershipType = getOwnershipTypeFromDeal(deal.investmentStats.ownershipType);
    /* eslint-disable-next-line*/
    const signer1OwnershipTypeTab: RadioGroup = docusign.RadioGroup.constructFromObject({
        groupName: "ownershipType",
        /* eslint-disable-next-line*/
        radios: [docusign.Radio.constructFromObject({
            value: ownershipType,
            selected: "true",
            locked: "true",
            required: "false",
        }) as Radio],
    }) as RadioGroup;

    // Combine the existing and new tabs in a Tabs object:
    /* eslint-disable-next-line*/
    let signer1Tabs: Tabs = docusign.Tabs.constructFromObject({
        textTabs: [...sharedTextTabs,
        ...[
            // signer1TitleTab,
            signer1SsnTab,
            signer1PhoneNumberTab,
            signer1AddressStreetTab,
            signer1AddressCityStateZipTab,
            signer1AddressOneLineTab,
            signer1State,
            ...getSignerCompanyDetailsTabs(org, deal, signer)
        ]
        ],
        radioGroupTabs: [signer1OwnershipTypeTab],
        initialHereTabs: getInitialHereTabs(deal),
        checkboxTabs: getSignerCheckboxTabs(deal),
    }) as Tabs;
    /* eslint-disable-next-line*/
    const neutralSignerTitleTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "title", value: "Authorized Agent",
    }) as DSText;
    /* eslint-disable-next-line*/
    const neutralSignerTabs: Tabs = docusign.Tabs.constructFromObject({
        textTabs: [...sharedTextTabs,
        ...[neutralSignerTitleTab]
        ]
    })

    /* eslint-disable-next-line*/
    const signer1Role: TemplateRole = docusign.TemplateRole.constructFromObject({
        email: signer.email,
        name: `${signer.firstName} ${signer.lastName}`,
        tabs: signer1Tabs,
        clientUserId: `signer-${signer.id.toString()}`,
        roleName: 'Signer',
    }) as TemplateRole;

    // TODO: Dont hardcode this
    /* eslint-disable-next-line*/
    const neutralSignerRole: TemplateRole = docusign.TemplateRole.constructFromObject({
        email: "jonatan@neutral.us",
        name: "Nate Helbach",
        tabs: neutralSignerTabs,
        clientUserId: "jonatan@neutral.us",
        roleName: 'Neutral Signer',
    }) as TemplateRole;

    env.templateRoles = [signer1Role, neutralSignerRole];

    // co-signer
    if (coSigners.length > 0) {
        const coSigner = coSigners[0];
        /* eslint-disable-next-line*/
        const coSignerRole1: TemplateRole = docusign.TemplateRole.constructFromObject({
            email: coSigner!.email,
            name: `${coSigner!.firstName} ${coSigner!.lastName}`,
            clientUserId: `cosigner-${coSigner!.id.toString()}`,
            roleName: 'Co-Signer',
        }) as TemplateRole;
        env.templateRoles.push(coSignerRole1);
    }
    if (accreditationVerifier) {
        /* eslint-disable-next-line*/
        const accreditationVerifierRole: TemplateRole = docusign.TemplateRole.constructFromObject({
            email: accreditationVerifier.email,
            name: `${accreditationVerifier.firstName} ${accreditationVerifier.lastName}`,
            clientUserId: `accver-${accreditationVerifier.id.toString()}`,
            roleName: 'Accreditation Verifier',
        }) as TemplateRole;
        env.templateRoles.push(accreditationVerifierRole);
    }


    env.status = 'sent'; // We want the envelope to be sent

    return env;
}

export function makeRecipientViewRequest(signer: User, returnUrl: string) {

    /* eslint-disable-next-line*/
    let viewRequest: RecipientViewRequest = new docusign.RecipientViewRequest() as RecipientViewRequest;

    viewRequest.returnUrl = `${returnUrl}`;   //comes back with a query parameter. TODO: capture which project they came from
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
        case DealOwnershipType.INDIVIDUAL: return docusignOwnershipTypeEnum.Individual;
        case DealOwnershipType.JOINT: return docusignOwnershipTypeEnum.Joint;
        case DealOwnershipType.CORPORATION: return docusignOwnershipTypeEnum.Corporation;
        case DealOwnershipType.PARTNERSHIP: return docusignOwnershipTypeEnum.Partnership;
        case DealOwnershipType.COMMON: return docusignOwnershipTypeEnum.Common;
        case DealOwnershipType.MARITAL: return docusignOwnershipTypeEnum.Marital;
        default: return docusignOwnershipTypeEnum.Other;
    }
}