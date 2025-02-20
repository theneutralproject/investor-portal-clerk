import { z } from 'zod';

export enum docusignOwnershipTypeEnum {
  Individual = 'ownershipTypeIndividual',
  Joint = 'ownershipTypeJoint',
  Corporation = 'ownershipTypeCorporation',
  RevocableGrantor = 'ownershipTypeRevocable',
  Other = 'ownershipTypeOther',
  Marital = 'ownershipTypeMarital',
  Common = 'ownershipTypeCommon',
  Partnership = 'ownershipTypePartnership',
}

export enum docusignSigningRoleEnum {
  SIGNER = 'Signer',
  COSIGNER = 'Co-Signer',
  NEUTRALSIGNER = 'Neutral Signer',
  ACCREDITATIONVERIFIER = 'Accreditation Verifier',
}

export const zDocusignEvelopeCreate = z.object({
  templateId: z.string(),
  dealId: z.number().int(),
});

export type DocusignEnvelopeCreateSchema = z.infer<
  typeof zDocusignEvelopeCreate
>;

export const zDocusignSigner = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().nullable(),
  title: z.string().nullable(),
  ssn: z.string().nullable(),
});
export type DocusignSignerSchema = z.infer<typeof zDocusignSigner>;
