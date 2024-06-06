
import { getIronSession } from "iron-session";
import { type SessionData, sessionOptions } from "./sessionConfig";
import { cookies } from "next/headers";
import type { DocusignPayloadSchema } from "./_globals";
import { type EnvelopeDefinition, ApiClient, EnvelopesApi, type Tabs, type TemplateRole, type Text as DSText, type RecipientViewRequest } from "docusign-esign";


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
            .catch((err: { response: { data: { error: string }; }; }) => {

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

// https://developers.docusign.com/docs/esign-rest-api/how-to/request-signature-template-remote/
export function makeEnvelope(envelopeData: DocusignPayloadSchema, templateId: string) {

    const { user, amount } = envelopeData;

    // create the envelope definition
    /* eslint-disable-next-line*/
    const env: EnvelopeDefinition = new docusign.EnvelopeDefinition() as EnvelopeDefinition;
    env.templateId = templateId;

    // UNSURE ABOUT THIS TYPE
    /* eslint-disable-next-line*/
    const amountTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "amount", value: amount.toString(),
    }) as DSText;
    /* eslint-disable-next-line*/
    const interestTab: DSText = docusign.Text.constructFromObject({
        tabLabel: "interest_percent", value: amount < 500000 ? "10%" : "12%",
    }) as DSText;

    // Pull together the existing and new tabs in a Tabs object:
    /* eslint-disable-next-line*/
    let signer1Tabs: Tabs = docusign.Tabs.constructFromObject({
        textTabs: [amountTab, interestTab],
    }) as Tabs;

    // Create template role elements to connect the signer and cc recipients to the template
    /* eslint-disable-next-line*/
    let signer1: TemplateRole = docusign.TemplateRole.constructFromObject({
        email: user.email,
        name: user.fullName,
        tabs: signer1Tabs,
        clientUserId: user.id,
        roleName: 'Investor',
    }) as TemplateRole;
    console.log(signer1)
    // Create a cc template role.
    // We're setting the parameters via setters
    // let cc1 = new docusign.TemplateRole();
    // cc1.email = "jonatanschumacher@gmail.com";
    // cc1.name = "Neutral Employee";
    // cc1.roleName = 'CC';

    // Add the TemplateRole objects to the envelope object
    env.templateRoles = [signer1 /*,cc1*/];
    env.status = 'sent'; // We want the envelope to be sent

    return env;
}

export function makeRecipientViewRequest(args: DocusignPayloadSchema) {
    /* eslint-disable-next-line*/
    let viewRequest: RecipientViewRequest = new docusign.RecipientViewRequest() as RecipientViewRequest;

    viewRequest.returnUrl = `${process.env.BASE_URL}/projects`;   //comes back with a query parameter. TODO: capture which project they came from
    viewRequest.authenticationMethod = 'none';

    // Recipient information must match embedded recipient info
    // we used to create the envelope.
    viewRequest.email = args.user.email;
    viewRequest.userName = args.user.fullName;
    viewRequest.clientUserId = args.user.id;

    return viewRequest;
}