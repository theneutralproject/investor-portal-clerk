import { error } from "console";
import { NextApiRequest, NextApiResponse } from "next";



/**
 * Use a POST request with a req.body HubspotContact Interface to create or edit a hubspot contact
 * @param req re.body must be of type hubspotcontact
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

        if(!req.body.email) return res.status(400).json({error: 'email is required in the request body'});
        const properties = req.body.properties
        if(properties && Array.isArray(properties) && properties.length > 0 ) {
            let propertiesInputIsValid = true;
            properties.forEach((p) => {
                if (!p.property || !p.value) propertiesInputIsValid = false;
            })
            if (!propertiesInputIsValid) return res.status(400).json({error: 'req.body.properties array is malformatted'});
        }

        const hubspotContact = JSON.parse(req.body) as HubspotContact;  // we verified above that this cast will work
        const signupDate = new Date(new Date().setUTCHours( 0,0, 0, 0)).getTime().toString();
        hubspotContact.properties.push({"property": "date_signed_up", "value": signupDate})

        
        console.log(`${JSON.stringify(hubspotContact)}`)
        const hubspotRes = await fetch(`https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${hsContact.email}`, {
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

        console.log("hubspotRes", hubspotRes);
        return res.status(201).send("success")
    }
}

// export async function POST() {
//     const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

// })