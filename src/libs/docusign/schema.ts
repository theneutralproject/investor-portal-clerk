import { z } from "zod";


// todo: hook this up in docusignUtils
enum ownershipTypeEnum {
  Individual = "ownershipTypeIndividual",
  Joint = "ownershipTypeJoint",
  Corporation = "ownershipTypeCorporation",
  RevocableGrantor = "ownershipTypeRevocable",
  Other = "ownershipTypeOther",
  Marital = "ownershipTypeMarital",
  Common = "ownershipTypeCommon",
  Partnership = "ownershipTypePartnership"
};

export const zDocusignEnvelope = z.object({
  envelopeId: z.string(),
  projectId: z.number().int(),
  clerkUserId: z.string(),
  amount: z.number().min(0),
  amountSpelledOut: z.string().optional(),
  numAUnits: z.number().optional(),
  numCUnits: z.number().optional(),
  investorName: z.string().optional(),
  ownershipType: z.nativeEnum(ownershipTypeEnum).optional(),
  ownershipTypeOtherValue: z.string().optional(),
  coSigner: z.object({
    email: z.string(),
    fullName: z.string()
  }).optional(),
  accreditationVerifier: z.object({
    email: z.string(),
    fullName: z.string()
  }).optional()
});

export type DocusignEnvelopeSchema = z.infer<typeof zDocusignEnvelope>;

const zDocusignSigner = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().nullable(),
  title: z.string().nullable(),
  ssn: z.string().nullable()
});

export type DocusignSignerSchema = z.infer<typeof zDocusignSigner>;