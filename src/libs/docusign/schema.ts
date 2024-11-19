import { z } from "zod";

export enum docusignOwnershipTypeEnum {
  Individual = "ownershipTypeIndividual",
  Joint = "ownershipTypeJoint",
  Corporation = "ownershipTypeCorporation",
  RevocableGrantor = "ownershipTypeRevocable",
  Other = "ownershipTypeOther",
  Marital = "ownershipTypeMarital",
  Common = "ownershipTypeCommon",
  Partnership = "ownershipTypePartnership"
};

export const zDocusignEvelopeCreate = z.object({
  templateId: z.string(),
  dealId: z.number().int(),
});

export type DocusignEnvelopeCreateSchema = z.infer<typeof zDocusignEvelopeCreate>;

const zDocusignSigner = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().nullable(),
  title: z.string().nullable(),
  ssn: z.string().nullable()
});

export type DocusignSignerSchema = z.infer<typeof zDocusignSigner>;