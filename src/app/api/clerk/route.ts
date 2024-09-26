import prisma from "@/libs/prisma";
import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";
import { Role, type User } from "@prisma/client";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { isError, toLower, startCase } from "lodash";

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
  console.log("webhook received of type:", type)
  switch (type) {
    case "user.created": {
      console.log("clerk WH1 - user created");

      const {
        id,
        primary_email_address_id,
        email_addresses,
        primary_phone_number_id,
        first_name,
        last_name,
        phone_numbers,
      } = data;
      const email =
        email_addresses.find(({ id }) => id === primary_email_address_id)
          ?.email_address ?? "";
      const phonenumber = primary_phone_number_id ? ((phone_numbers.find(({ id }) => id === primary_phone_number_id)) ?? "") : (phone_numbers[0]?.phone_number ?? "")

      /* Store/ update user in Hubspot**/
      const hsUserData = {
        email: email,
        properties: [
          { property: `userid`, value: id },
          { property: `firstname`, value: startCase(first_name) },
          { property: `lastname`, value: startCase(toLower(last_name)) },
          { property: `phone`, value: phonenumber },
        ],
      } as HubspotContact;

      console.log("clerk WH2 - posting hsUserData", hsUserData);
      let hsUpdate;
      try {
        hsUpdate = await createOrUpdateContact(hsUserData);
      } catch (error) {
        console.error("Unable to create user in hubspot:\n", error);
        return new Response(JSON.stringify({ error: "Unable to create user in hubspot" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      const hubspotUserId = isError(hsUpdate) ? "" : hsUpdate.vid.toString()


      /* Store user in DB**/
      const newUserData = {
        clerkId: id,
        email: email,
        role: Role.USER,
        firstName: startCase(first_name),
        lastName: startCase(toLower(last_name)),
        phoneNumber: phonenumber,
        hubspotId: hubspotUserId,
      } as User;


      console.log("clerk WH4", newUserData);
      try {
        // create a personal org:
        const userOrg = await prisma.organization.create({
          data: {
            name: `${newUserData.firstName} ${newUserData.lastName}'s Org`,
          }
        });

        newUserData.userOrgId = userOrg.id;
        const dbUser = await prisma.user.create({
          data: {
            ...newUserData, organization: { connect: [{ id: userOrg.id }] }
          }
        });

        await prisma.organization.update({ 
          where: { id: userOrg.id },
          data: { ownerId: dbUser.id }
        });
        
        await clerkClient.users.updateUser(id, { firstName: startCase(first_name), lastName: startCase(toLower(last_name)) })
      } catch (error) {
        console.error("ERROR: Cannot create User in DB:\n", error);
        return new Response(JSON.stringify({ error: "Unable to create user in DB" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      break;
    }
    case "session.created": {
      console.log("clerk WH1 - session created");
      break;
    }

    case "session.ended": /** FALL THROUGH SWITCHES */
    case "session.revoked":
    case "session.removed": {
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
