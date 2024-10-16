import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { createUserInDbAndHubspot } from "@/libs/user/utils";
import type { UserCreateSchema } from "@/libs/user/schema";

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
  console.log("clerk webhook received of type:", type)
  switch (type) {
    case "user.created": {
      const {
        id,
        primary_email_address_id,
        email_addresses,
        primary_phone_number_id,
        first_name,
        last_name,
        phone_numbers,
      } = data;

      const email = primary_email_address_id ? ((email_addresses.find(({ id }) => id === primary_email_address_id))?.email_address ?? "") : (email_addresses[0]?.email_address ?? "") 
      const phonenumber = primary_phone_number_id ? ((phone_numbers.find(({ id }) => id === primary_phone_number_id))?.phone_number ?? "") : (phone_numbers[0]?.phone_number ?? "")
      if(email === "") {
        // TODO: log this error. The user will not be created in the DB!
        console.error("No email found for user", data)
        return new Response("No email found for user"), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        };
      } 
      
      const newUserData = {
        clerkId: id,
        email: email,
        firstName: first_name,
        lastName: last_name,
        phoneNumber: phonenumber,
        address: undefined
      } as UserCreateSchema;

      /* Store user in DB**/
      try {
        await createUserInDbAndHubspot(newUserData)
        break;
      } catch (userCreateError) {
        return new Response(JSON.stringify(userCreateError), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

    }
    case "session.created": {
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
