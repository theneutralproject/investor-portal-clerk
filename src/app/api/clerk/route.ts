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
      const email =
        email_addresses.find(({ id }) => id === primary_email_address_id)
          ?.email_address ?? "";
      const phonenumber =
        phone_numbers.find(({ id }) => id === primary_phone_number_id)
          ?.phone_number ?? "";

      /* Store/ update user in Hubspot**/
      const HSUserData = {
        email: email,
        properties: [
          { property: `userid`, value: id },
          { property: `firstname`, value: first_name },
          { property: `lastname`, value: last_name },
          { property: `phone`, value: phonenumber },
        ],
      } as HubspotContact;

      const hsUpdate = await createOrUpdateContact(HSUserData);
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

      try {
        await prisma.user.create({ data: DBUserData });
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error(`DB user create error: ${err}`);
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
