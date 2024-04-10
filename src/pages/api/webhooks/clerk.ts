import { Webhook } from "svix";
import { buffer } from "micro";
import { env } from "@/env";
import { db } from "@/server/db";

import type { WebhookEvent } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getBaseUrl } from "@/utils/api";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405);
  }

  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add a web hook secret");
  }

  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "error occured - no svix headers" });
  }

  const body = (await buffer(req)).toString();

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).json({ Error: err });
  }

  const eventType = evt.type;

  switch (eventType) {
    case "user.created": {
      const { id, primary_email_address_id, email_addresses, primary_phone_number_id, first_name, last_name, phone_numbers } = evt.data;

      const email = email_addresses.find((e) => e.id === primary_email_address_id)?.email_address;
      const phonenumber = primary_phone_number_id ? phone_numbers.find((p) => p.id === primary_phone_number_id)?.phone_number : '';

      const count = await db.profile.count({
        where: {
          userId: id,
        },
      });

      const HSUserData = {
        email: email!,
        properties: [
          { property: `userId`, value: id },
          { property: `firstname`, value: first_name },
          { property: `lastname`, value: last_name },
          { property: `phone`, value: phonenumber },
        ]
      } as HubspotContact

      const DBUserData = {
        userId: id,
        email: email!,
        firstname: first_name,
        lastname: last_name,
        phone: phonenumber
      } as UserProfile

      if (!count) {
        await db.profile.create({
          data: DBUserData,
        });
        console.log(`clerk calling ${getBaseUrl()}/api/hubspot/contacts for user ${DBUserData.userId}`)
        await fetch(`${getBaseUrl()}/api/hubspot/contacts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/ json' },
          body: JSON.stringify(HSUserData)
        }).catch((err) => {
          console.log("Clerk could not call Hubspot:")
          console.log(err);

        })
      }
      break;
    }

    default: {
      console.error(`The event type: ${eventType} is not configured`);
    }
  }

  return res.status(200).json({ response: "Success" });
}
