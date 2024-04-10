import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Use a POST request with a req.body HubspotContact Interface to create or edit a hubspot contact
 * @param req req.body must be of type HubspotContact
 * @param res 
 * @returns 
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        return res.status(405);
      }

    if (req.method === `POST`) {
        let hubspotContact:HubspotContact;
        try {
            // eslint-disable-next-line
            hubspotContact = JSON.parse(req.body) as HubspotContact;  
        } catch ( err ) {
            return res.status(400).json({error: err});
        }
        const { properties } = hubspotContact;

        if (properties && !Array.isArray(properties)) {
            return res.status(400).json({error: 'req.body.properties must be of type array'});
        }

        if(!hubspotContact.properties || !Array.isArray(hubspotContact.properties)){
            hubspotContact.properties = [];
        }

        const signupDate = new Date(new Date().setUTCHours( 0,0, 0, 0)).getTime().toString();
        hubspotContact.properties.push({"property": "date_signed_up", "value": signupDate})
        await fetch(`https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${hubspotContact.email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(hubspotContact)
        }).catch((err) => {
            console.log("hubspot post error", err);
            return res.status(400).send(err)
        });

        return res.status(201).send("success")
    }
}

// export async function POST() {
//     const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

// })