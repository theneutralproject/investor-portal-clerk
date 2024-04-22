import prisma from "@/libs/prisma";
import { type UserJSON, type WebhookEvent } from "@clerk/nextjs/server";
import { Role, type User } from "@prisma/client";
import { headers } from "next/headers";
import { Webhook } from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET ?? ``;

async function validateRequest(request: Request) {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
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

      // const HSUserData = {
      //   email: email!,
      //   properties: [
      //     { property: `clerkId`, value: id },
      //     { property: `firstname`, value: first_name },
      //     { property: `lastname`, value: last_name },
      //     { property: `phone`, value: phonenumber },
      //   ],
      // };

      const DBUserData = {
        clerkId: id,
        email: email!,
        role: Role.USER,
        firstName: first_name,
        lastName: last_name,
        phoneNumber: phonenumber,
      } as User;

      await prisma.user.create({
        data: DBUserData,
      });

      // await fetch(`${getBaseUrl()}/api/hubspot/contacts`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/ json" },
      // body: JSON.stringify(HSUserData),
      break;
    }

    default: {
      console.error(`The event type: ${type} is not configured`);
    }
  }

  return Response.json({ message: "Received" });
}
