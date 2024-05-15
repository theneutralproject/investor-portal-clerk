import prisma from "@/libs/prisma";
import { type UserJSON, type WebhookEvent } from "@clerk/nextjs/server";
import { Role, type User } from "@prisma/client";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { isError } from "lodash";

import {
  type HubspotContact,
  createOrUpdateContact,
} from "../utils-module/hubspotUtils";

async function validateRequest(request: Request) {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? ``);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

export async function POST(request: Request) {
  const { type, data } = await validateRequest(request);

  const {
    id,
    primary_email_address_id,
    email_addresses,
    primary_phone_number_id,
    first_name,
    last_name,
    phone_numbers,
  } = data as UserJSON;

  switch (type) {
    case "user.created": {
      console.log("clerk WH1 - user created");
      const email =
        email_addresses.find(({ id }) => id === primary_email_address_id)
          ?.email_address ?? "";
      const phonenumber =
        phone_numbers.find(({ id }) => id === primary_phone_number_id)
          ?.phone_number ?? "";

      /* Store/ update user in Hubspot**/
      const hsUserData = {
        email: email,
        properties: [
          { property: `userid`, value: id },
          { property: `firstname`, value: first_name },
          { property: `lastname`, value: last_name },
          { property: `phone`, value: phonenumber },
        ],
      } as HubspotContact;

      console.log("clerk WH2 - posting hsUserData", hsUserData);
      let hsUpdate;
       try{
        hsUpdate = await createOrUpdateContact(hsUserData);
      } catch (error) {
        console.error("Unable to create user in hubspot:\n", error);
        return new Response(JSON.stringify({ error: "Unable to create user in hubspot" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
       }
      const hubspotUserId = isError(hsUpdate) ? "" : hsUpdate.vid.toString();

      /* Store user in DB**/
      const DBUserData = {
        clerkId: id,
        email: email,
        role: Role.USER,
        firstName: first_name,
        lastName: last_name,
        phoneNumber: phonenumber,
        hubspotId: hubspotUserId,
      } as User;

      console.log("clerk WH4", DBUserData);
      try {
        await prisma.user.create({ data: DBUserData });
      } catch (error) {
        console.error("ERROR: Cannot create User in DB:\n", error);
        return new Response(JSON.stringify({ error: "Unable to create user in DB" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
       }
      break;
    }

    default: {
      console.error(`The event type: ${type} is not configured`);
    }
  }

  return new Response(JSON.stringify({ message: "success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
