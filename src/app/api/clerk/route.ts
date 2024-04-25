import prisma from "@/libs/prisma";
import { type UserJSON, type WebhookEvent } from "@clerk/nextjs/server";
import { Role, type User } from "@prisma/client";
import { headers } from "next/headers";
import { Webhook } from "svix";

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
  const payload = await validateRequest(request);
  const { type, data } = payload;

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
      const email = email_addresses.find(
        (e) => e.id === primary_email_address_id
      )?.email_address;
      const phonenumber = primary_phone_number_id
        ? phone_numbers.find((p) => p.id === primary_phone_number_id)
            ?.phone_number
        : "";

      /* Store user in Prisma**/
      const DBUserData = {
        clerkId: id,
        email: email!,
        role: Role.USER,
        firstName: first_name,
        lastName: last_name,
        phoneNumber: phonenumber,
      } as User;

      await prisma.user
        .create({
          data: DBUserData,
        })
        .catch((err) => {
          console.log(`DB user create error: ${err}`);
        });

      /* Store/ update user in Hubspot**/
      const HSUserData = {
        email: email!,
        properties: [
          { property: `userid`, value: id },
          { property: `firstname`, value: first_name },
          { property: `lastname`, value: last_name },
          { property: `phone`, value: phonenumber },
        ],
      } as HubspotContact;
      await createOrUpdateContact(HSUserData).catch((err) => {
        console.log(`hubspot user create error: ${err}`);
      });

      break;
    }

    default: {
      console.error(`The event type: ${type} is not configured`);
    }
  }

  return new Response(JSON.stringify({ message: "success" }), {
    headers: { "Content-Type": "application/json" },
  });
}
