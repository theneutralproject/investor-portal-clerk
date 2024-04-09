// TODO: MOVE THIS TO pages/api/hubspot/contact and create a PUT method that either edits a field on a user, or creates the user

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

// https://github.com/HubSpot/hubspot-api-nodejs
import { Client } from "@hubspot/api-client";
const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export const hubspotRouter = createTRPCRouter({
    captureAccountCreation: protectedProcedure.query(async ({ ctx }) => {
        // const { db, auth } = ctx;
        console.log("CALLING HUBSPOT?!?")
        //hubspotClient.
        await fetch('https://api.hubapi.com/crm/v3/objects/deals?limit=10',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
                }
            }).then((res) => {
                console.log("GOIT HS RES")
                console.log("HS Response:", res.body)
            }).catch((err) => {
                console.log("GOT HS ERR")
                console.error(`error`, err)
                return err;
            })

    }),
});
