import { Role } from "@prisma/client";
import { NextApiRequest } from "next";

export {};

declare global {
  interface HubspotContactProperty {
    property: string;
    value: string | number | boolean;
  }

  interface HubspotContact {
    email: string;
    properties: Array<HubspotContactProperty>?;
  }

  interface HubspotContactNextApiRequest extends NextApiRequest {
    body: HubspotContact;
  }
}
