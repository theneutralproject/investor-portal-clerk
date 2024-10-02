// https://www.youtube.com/watch?v=sqx8KbVa6Cw I followed much of this docusign tutorial

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { type EnvelopeDefinition, ApiClient, EnvelopesApi, type Tabs, type TemplateRole, type Text as DSText, type RecipientViewRequest } from "docusign-esign";
import type { Address, User } from "@prisma/client";
import type { UserWithAddress } from "@/libs/prisma";
import { DocusignEnvelopeSchema } from "./schema";
import { SessionData, sessionOptions } from "../session/utils";

/* eslint-disable-next-line*/
const docusign = require("docusign-esign"); //https://github.com/docusign/docusign-esign-node-client/issues/332

export async function refreshAccessToken() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    const responseObj = {
        accessToken: "",
        consentUrl: ""
    };
    if (!(session.docusignJwt && (session.docusignExpiresAt ?? 0) > Date.now())) {
        console.log("attempting to generate a new access token");
        const dsApiClient: ApiClient = new ApiClient();
        dsApiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH!);
        // dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + process.env.DOCUSIGN_INTEGRATION_KEY);
        /* eslint-disable-next-line*/
        const results: { body: { consentUrl?: string, access_token?: string, expires_in?: number } } = await dsApiClient.requestJWTUserToken(
            process.env.DOCUSIGN_INTEGRATION_KEY!,
            process.env.DOCUSIGN_USER_ID!,
            ["signature"],
            // fs.readFileSync(path.join(__dirname, "private.key")),
            Buffer.from(process.env.DOCUSIGN_RSA_PRIVATE_KEY!, 'utf8'), //TODO: save as DB file instead of secret
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
            //.catch returned { consentUrl: string }
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
        console.log("reusing unexpired access token")
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

const addressToStreet = (a: Address | null) => {
    return a ? `${a.street}` : ""
}

// https://developers.docusign.com/docs/esign-rest-api/how-to/request-signature-template-remote/
export function makeEnvelope(envelopeData: DocusignEnvelopeSchema, signer: UserWithAddress) {

    const { amount, investorName, envelopeId, amountSpelledOut } = envelopeData;

    // create the envelope definition
    /* eslint-disable-next-line*/
    const env: EnvelopeDefinition = new docusign.EnvelopeDefinition() as EnvelopeDefinition;
    env.templateId = envelopeId;

    /* eslint-disable-next-line*/
    const amountTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "amount", value: amount.toString(),
    }) as DSText;

    /* eslint-disable-next-line*/
    const amountSpelledOutTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "amountSpelledOutTab", value: amountSpelledOut,
    }) as DSText;

    /* eslint-disable-next-line*/
    const numAUnitsTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "numAUnits", value: amount < 250000 ? `${amount / 100000}` : "0",
    }) as DSText;

    /* eslint-disable-next-line*/
    const numCUnitsTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "numCUnits", value: amount >= 250000 ? `${amount / 100000}` : "0",
    }) as DSText;

    /* eslint-disable-next-line*/
    const interestTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "interest", value: amount >= 250000 ? "12" : "10",
    }) as DSText;

    /* eslint-disable-next-line*/
    const investorNameTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "investorName", value: investorName,
    }) as DSText;

    const sharedTextTabs = [
        amountTab,
        amountSpelledOutTab,
        investorNameTab,
        numAUnitsTab,
        numCUnitsTab,
        interestTab
    ];

    /* eslint-disable-next-line*/
    const signer1TitleTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "title", value: signer.title ?? "",
    }) as DSText;


    /* eslint-disable-next-line*/
    const signer1SsnTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "ssn", value: signer.ssn /** or company.tin */,
    }) as DSText;


    /* eslint-disable-next-line*/
    const signer1AddressStreetTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "addressStreet", value: addressToStreet(signer.address),
    }) as DSText;

    /* eslint-disable-next-line*/
    const signer1AddressCityStateZipTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "addressCityStateZip", value: addressToCityStateZip(signer.address),
    }) as DSText;

    /* eslint-disable-next-line*/
    const signer1AddressOneLineTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "addressOneLine", value: addressToOneLine(signer.address),
    }) as DSText;

    /** TODO: State name from 2digit shorthand */

    /* eslint-disable-next-line*/
    const signer1PhoneNumberTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "phoneNumber", value: signer.phoneNumber,
    }) as DSText;

    // Pull together the existing and new tabs in a Tabs object:
    /* eslint-disable-next-line*/
    let signer1Tabs: Tabs = docusign.Tabs.constructFromObject({
        textTabs: [...sharedTextTabs,
        ...[
            signer1TitleTab,
            signer1SsnTab,
            signer1PhoneNumberTab,
            signer1AddressStreetTab,
            signer1AddressCityStateZipTab,
            signer1AddressOneLineTab
        ]
        ],
    }) as Tabs;

    /* eslint-disable-next-line*/
    const neutralSignerTabs: Tabs = docusign.Tabs.constructFromObject({
        textTabs: sharedTextTabs
    })

    // Create template role elements to connect the signer and cc recipients to the template
    /* eslint-disable-next-line*/
    // addressStreet
    // addressCityStateZip
    // ssn
    // phoneNumber
    // title
    // Accreditation Verifier role
    /* eslint-disable-next-line*/
    const signer1Role: TemplateRole = docusign.TemplateRole.constructFromObject({
        email: signer.email,
        name: `${signer.firstName} ${signer.lastName}`,
        tabs: signer1Tabs,
        clientUserId: signer.id.toString(),
        roleName: 'Signer',
    }) as TemplateRole;

    // co-signer
    if (envelopeData.coSigner) {
        console.log("\n\nTODO: build out cosigner logic")
        // const coSignerRole: TemplateRole = docusign.TemplateRole.constructFromObject({
        //     email: user.email,
        //     name: user.fullName,
        //     tabs: signer1Tabs,
        //     clientUserId: user.id,
        //     roleName: 'Co-Signer',
        // }) as TemplateRole;
    }
    if (envelopeData.accreditationVerifier) {
        console.log("\n\nTODO: build out accreditationVerifier logic")
    }

    /* eslint-disable-next-line*/
    const neutralSignerRole: TemplateRole = docusign.TemplateRole.constructFromObject({
        email: "jonatan@neutral.us",
        name: "Nate Helbach",
        tabs: neutralSignerTabs,
        clientUserId: "jonatan@neutral.us",
        roleName: 'Neutral Signer',
        title: "Authorized Agent"
    }) as TemplateRole;
    // Add the TemplateRole objects to the envelope object
    env.templateRoles = [signer1Role, /**coSigner, */ neutralSignerRole];
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
    viewRequest.clientUserId = signer.id.toString();

    return viewRequest;
}