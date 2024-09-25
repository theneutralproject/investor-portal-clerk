import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','clerkId','role','email','firstName','lastName','phoneNumber','hubspotId','addressId','ssn','title','organizationId']);

export const DealScalarFieldEnumSchema = z.enum(['id','projectId','dealStage','amount','financingType','hubspotId','transactionId','investmentEntity','numberAUnits','numberCUnits','ownershipType','ownershipTypeOtherValue','accreditationVerifierId','organizationId']);

export const OrganizationScalarFieldEnumSchema = z.enum(['id','name','tin','dateOfCreation','juristication','addressId']);

export const AccreditationVerifierScalarFieldEnumSchema = z.enum(['id','firstName','lastName','title','phoneNumber']);

export const DealDocumentScalarFieldEnumSchema = z.enum(['id','name','link','type','dealId']);

export const OrganizationDocumentScalarFieldEnumSchema = z.enum(['id','name','link','organizationId']);

export const ProjectScalarFieldEnumSchema = z.enum(['id','name','location','investmentGoal','investmentRaised','tags','status','description','buildingAvgRent','buildingAvgUnitSize','buildingCommSqFt','buildingUnits','debtInterestRate','debtMinInvestment','debtPaymentFreq','debtTermMonths','equityIRR','equityMinInvestment','equityPaymentFreq','equityTermMonths','marketHighlights','youtubeUrl','preferredReturn','targetEquityMultiple','slug']);

export const ProjectMilestonesScalarFieldEnumSchema = z.enum(['id','projectId','equityContribution','financialClosing','groundBreakingCeremony','startVerticalConstruction','toppingOut','preLeasing','fullEnclosure','temporaryOccupancy','grandOpening','stabilized','refinance','sale']);

export const PicturesScalarFieldEnumSchema = z.enum(['id','projectId','url','type']);

export const DocumentScalarFieldEnumSchema = z.enum(['id','name','fileName','description','link','projectId','dealStage','financingTypes','documentType','docusignTemplateId']);

export const DocumentEventScalarFieldEnumSchema = z.enum(['id','userId','documentId','date','type']);

export const AddressScalarFieldEnumSchema = z.enum(['id','street','city','zipcode','state']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const DealDocumentTypeSchema = z.enum(['K1','VERIFICATION_ACCREDITATION']);

export type DealDocumentTypeType = `${z.infer<typeof DealDocumentTypeSchema>}`

export const RoleSchema = z.enum(['ADMIN','USER']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const StatusSchema = z.enum(['ACTIVE','INACTIVE','UPCOMING']);

export type StatusType = `${z.infer<typeof StatusSchema>}`

export const PictureTypeSchema = z.enum(['HEADER','GALLERY','OTHER','CARD']);

export type PictureTypeType = `${z.infer<typeof PictureTypeSchema>}`

export const DocumentTypeSchema = z.enum(['YOUTUBE','DOCUSIGN','DOCUMENT']);

export type DocumentTypeType = `${z.infer<typeof DocumentTypeSchema>}`

export const DocumentEventTypeSchema = z.enum(['VIEW','DOWNLOAD','SIGN']);

export type DocumentEventTypeType = `${z.infer<typeof DocumentEventTypeSchema>}`

export const DealFinancingTypeSchema = z.enum(['equity','promissory_note_now','promissory_to_equity','promissory_note_at_closing']);

export type DealFinancingTypeType = `${z.infer<typeof DealFinancingTypeSchema>}`

export const DealOwnershipTypeSchema = z.enum(['INDIVIDUAL','JOINT','CORPROTATION','TRUST','OTHER','MARITAL','COMMON','PARTNERSHIP']);

export type DealOwnershipTypeType = `${z.infer<typeof DealOwnershipTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.number().int(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().nullable(),
  hubspotId: z.string(),
  addressId: z.number().int().nullable(),
  ssn: z.string().nullable(),
  title: z.string().nullable(),
  organizationId: z.number().int(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// DEAL SCHEMA
/////////////////////////////////////////

export const DealSchema = z.object({
  financingType: DealFinancingTypeSchema.nullable(),
  ownershipType: DealOwnershipTypeSchema.nullable(),
  id: z.number().int(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string(),
  /**
   * the project, i.e. Edison LLC
   */
  investmentEntity: z.string(),
  numberAUnits: z.number().nullable(),
  numberCUnits: z.number().nullable(),
  ownershipTypeOtherValue: z.string().nullable(),
  accreditationVerifierId: z.number().int().nullable(),
  organizationId: z.number().int(),
})

export type Deal = z.infer<typeof DealSchema>

/////////////////////////////////////////
// ORGANIZATION SCHEMA
/////////////////////////////////////////

/**
 * if deal.ownershipType === 'CORPROTATION', 'PARTNERSHIP', 'TRUST', create an Company
 */
export const OrganizationSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  tin: z.string().nullable(),
  dateOfCreation: z.coerce.date().nullable(),
  juristication: z.string().nullable(),
  addressId: z.number().int().nullable(),
})

export type Organization = z.infer<typeof OrganizationSchema>

/////////////////////////////////////////
// ACCREDITATION VERIFIER SCHEMA
/////////////////////////////////////////

export const AccreditationVerifierSchema = z.object({
  id: z.number().int(),
  firstName: z.string(),
  lastName: z.string(),
  title: z.string(),
  phoneNumber: z.string(),
})

export type AccreditationVerifier = z.infer<typeof AccreditationVerifierSchema>

/////////////////////////////////////////
// DEAL DOCUMENT SCHEMA
/////////////////////////////////////////

/**
 * deal specific documents such as tax forms, accreditation verification etc
 */
export const DealDocumentSchema = z.object({
  type: DealDocumentTypeSchema,
  id: z.number().int(),
  name: z.string(),
  link: z.string(),
  dealId: z.number().int(),
})

export type DealDocument = z.infer<typeof DealDocumentSchema>

/////////////////////////////////////////
// ORGANIZATION DOCUMENT SCHEMA
/////////////////////////////////////////

/**
 * used for business verification letters and such
 */
export const OrganizationDocumentSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  link: z.string(),
  organizationId: z.number().int(),
})

export type OrganizationDocument = z.infer<typeof OrganizationDocumentSchema>

/////////////////////////////////////////
// PROJECT SCHEMA
/////////////////////////////////////////

export const ProjectSchema = z.object({
  status: StatusSchema,
  id: z.number().int(),
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number(),
  investmentRaised: z.number(),
  tags: z.string(),
  description: z.string(),
  buildingAvgRent: z.number().int(),
  buildingAvgUnitSize: z.number().int(),
  buildingCommSqFt: z.number().int(),
  buildingUnits: z.number().int(),
  debtInterestRate: z.string(),
  debtMinInvestment: z.number().int(),
  debtPaymentFreq: z.string(),
  debtTermMonths: z.number().int(),
  equityIRR: z.number(),
  equityMinInvestment: z.number().int(),
  equityPaymentFreq: z.string(),
  equityTermMonths: z.number().int(),
  marketHighlights: z.string(),
  youtubeUrl: z.string(),
  preferredReturn: z.string(),
  targetEquityMultiple: z.number(),
  slug: z.string().nullable(),
})

export type Project = z.infer<typeof ProjectSchema>

/////////////////////////////////////////
// PROJECT MILESTONES SCHEMA
/////////////////////////////////////////

export const ProjectMilestonesSchema = z.object({
  id: z.number().int(),
  projectId: z.number().int(),
  equityContribution: z.coerce.date(),
  financialClosing: z.coerce.date(),
  groundBreakingCeremony: z.coerce.date().nullable(),
  startVerticalConstruction: z.coerce.date().nullable(),
  toppingOut: z.coerce.date().nullable(),
  preLeasing: z.coerce.date().nullable(),
  fullEnclosure: z.coerce.date().nullable(),
  temporaryOccupancy: z.coerce.date(),
  grandOpening: z.coerce.date(),
  stabilized: z.coerce.date(),
  refinance: z.coerce.date(),
  sale: z.coerce.date(),
})

export type ProjectMilestones = z.infer<typeof ProjectMilestonesSchema>

/////////////////////////////////////////
// PICTURES SCHEMA
/////////////////////////////////////////

/**
 * Project specific pictures
 */
export const PicturesSchema = z.object({
  type: PictureTypeSchema,
  id: z.number().int(),
  projectId: z.number().int(),
  url: z.string(),
})

export type Pictures = z.infer<typeof PicturesSchema>

/////////////////////////////////////////
// DOCUMENT SCHEMA
/////////////////////////////////////////

/**
 * project documents that all logged in users can see
 */
export const DocumentSchema = z.object({
  financingTypes: DealFinancingTypeSchema.array(),
  documentType: DocumentTypeSchema,
  id: z.number().int(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().nullable(),
  link: z.string(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  docusignTemplateId: z.string().nullable(),
})

export type Document = z.infer<typeof DocumentSchema>

/////////////////////////////////////////
// DOCUMENT EVENT SCHEMA
/////////////////////////////////////////

/**
 * used to track who accessed which document when
 */
export const DocumentEventSchema = z.object({
  type: DocumentEventTypeSchema,
  id: z.number().int(),
  userId: z.number().int(),
  documentId: z.number().int(),
  date: z.coerce.date(),
})

export type DocumentEvent = z.infer<typeof DocumentEventSchema>

/////////////////////////////////////////
// ADDRESS SCHEMA
/////////////////////////////////////////

export const AddressSchema = z.object({
  id: z.number().int(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
})

export type Address = z.infer<typeof AddressSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  documentEvents: z.union([z.boolean(),z.lazy(() => DocumentEventFindManyArgsSchema)]).optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  organization: z.boolean().optional(),
  documentEvents: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  clerkId: z.boolean().optional(),
  role: z.boolean().optional(),
  email: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  hubspotId: z.boolean().optional(),
  addressId: z.boolean().optional(),
  ssn: z.boolean().optional(),
  title: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  documentEvents: z.union([z.boolean(),z.lazy(() => DocumentEventFindManyArgsSchema)]).optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DEAL
//------------------------------------------------------

export const DealIncludeSchema: z.ZodType<Prisma.DealInclude> = z.object({
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  AccreditationVerifier: z.union([z.boolean(),z.lazy(() => AccreditationVerifierArgsSchema)]).optional(),
  document: z.union([z.boolean(),z.lazy(() => DealDocumentFindManyArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DealCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const DealArgsSchema: z.ZodType<Prisma.DealDefaultArgs> = z.object({
  select: z.lazy(() => DealSelectSchema).optional(),
  include: z.lazy(() => DealIncludeSchema).optional(),
}).strict();

export const DealCountOutputTypeArgsSchema: z.ZodType<Prisma.DealCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DealCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DealCountOutputTypeSelectSchema: z.ZodType<Prisma.DealCountOutputTypeSelect> = z.object({
  document: z.boolean().optional(),
}).strict();

export const DealSelectSchema: z.ZodType<Prisma.DealSelect> = z.object({
  id: z.boolean().optional(),
  projectId: z.boolean().optional(),
  dealStage: z.boolean().optional(),
  amount: z.boolean().optional(),
  financingType: z.boolean().optional(),
  hubspotId: z.boolean().optional(),
  transactionId: z.boolean().optional(),
  investmentEntity: z.boolean().optional(),
  numberAUnits: z.boolean().optional(),
  numberCUnits: z.boolean().optional(),
  ownershipType: z.boolean().optional(),
  ownershipTypeOtherValue: z.boolean().optional(),
  accreditationVerifierId: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  AccreditationVerifier: z.union([z.boolean(),z.lazy(() => AccreditationVerifierArgsSchema)]).optional(),
  document: z.union([z.boolean(),z.lazy(() => DealDocumentFindManyArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DealCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORGANIZATION
//------------------------------------------------------

export const OrganizationIncludeSchema: z.ZodType<Prisma.OrganizationInclude> = z.object({
  members: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  document: z.union([z.boolean(),z.lazy(() => OrganizationDocumentFindManyArgsSchema)]).optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrganizationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const OrganizationArgsSchema: z.ZodType<Prisma.OrganizationDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationSelectSchema).optional(),
  include: z.lazy(() => OrganizationIncludeSchema).optional(),
}).strict();

export const OrganizationCountOutputTypeArgsSchema: z.ZodType<Prisma.OrganizationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OrganizationCountOutputTypeSelectSchema: z.ZodType<Prisma.OrganizationCountOutputTypeSelect> = z.object({
  members: z.boolean().optional(),
  deals: z.boolean().optional(),
  document: z.boolean().optional(),
}).strict();

export const OrganizationSelectSchema: z.ZodType<Prisma.OrganizationSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  tin: z.boolean().optional(),
  dateOfCreation: z.boolean().optional(),
  juristication: z.boolean().optional(),
  addressId: z.boolean().optional(),
  members: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  document: z.union([z.boolean(),z.lazy(() => OrganizationDocumentFindManyArgsSchema)]).optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrganizationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ACCREDITATION VERIFIER
//------------------------------------------------------

export const AccreditationVerifierIncludeSchema: z.ZodType<Prisma.AccreditationVerifierInclude> = z.object({
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AccreditationVerifierCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const AccreditationVerifierArgsSchema: z.ZodType<Prisma.AccreditationVerifierDefaultArgs> = z.object({
  select: z.lazy(() => AccreditationVerifierSelectSchema).optional(),
  include: z.lazy(() => AccreditationVerifierIncludeSchema).optional(),
}).strict();

export const AccreditationVerifierCountOutputTypeArgsSchema: z.ZodType<Prisma.AccreditationVerifierCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => AccreditationVerifierCountOutputTypeSelectSchema).nullish(),
}).strict();

export const AccreditationVerifierCountOutputTypeSelectSchema: z.ZodType<Prisma.AccreditationVerifierCountOutputTypeSelect> = z.object({
  deals: z.boolean().optional(),
}).strict();

export const AccreditationVerifierSelectSchema: z.ZodType<Prisma.AccreditationVerifierSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  title: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AccreditationVerifierCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DEAL DOCUMENT
//------------------------------------------------------

export const DealDocumentIncludeSchema: z.ZodType<Prisma.DealDocumentInclude> = z.object({
  deal: z.union([z.boolean(),z.lazy(() => DealArgsSchema)]).optional(),
}).strict()

export const DealDocumentArgsSchema: z.ZodType<Prisma.DealDocumentDefaultArgs> = z.object({
  select: z.lazy(() => DealDocumentSelectSchema).optional(),
  include: z.lazy(() => DealDocumentIncludeSchema).optional(),
}).strict();

export const DealDocumentSelectSchema: z.ZodType<Prisma.DealDocumentSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  link: z.boolean().optional(),
  type: z.boolean().optional(),
  dealId: z.boolean().optional(),
  deal: z.union([z.boolean(),z.lazy(() => DealArgsSchema)]).optional(),
}).strict()

// ORGANIZATION DOCUMENT
//------------------------------------------------------

export const OrganizationDocumentIncludeSchema: z.ZodType<Prisma.OrganizationDocumentInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

export const OrganizationDocumentArgsSchema: z.ZodType<Prisma.OrganizationDocumentDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationDocumentSelectSchema).optional(),
  include: z.lazy(() => OrganizationDocumentIncludeSchema).optional(),
}).strict();

export const OrganizationDocumentSelectSchema: z.ZodType<Prisma.OrganizationDocumentSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  link: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

// PROJECT
//------------------------------------------------------

export const ProjectIncludeSchema: z.ZodType<Prisma.ProjectInclude> = z.object({
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  documents: z.union([z.boolean(),z.lazy(() => DocumentFindManyArgsSchema)]).optional(),
  pictures: z.union([z.boolean(),z.lazy(() => PicturesFindManyArgsSchema)]).optional(),
  projectMilestones: z.union([z.boolean(),z.lazy(() => ProjectMilestonesArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProjectCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ProjectArgsSchema: z.ZodType<Prisma.ProjectDefaultArgs> = z.object({
  select: z.lazy(() => ProjectSelectSchema).optional(),
  include: z.lazy(() => ProjectIncludeSchema).optional(),
}).strict();

export const ProjectCountOutputTypeArgsSchema: z.ZodType<Prisma.ProjectCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProjectCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProjectCountOutputTypeSelectSchema: z.ZodType<Prisma.ProjectCountOutputTypeSelect> = z.object({
  deals: z.boolean().optional(),
  documents: z.boolean().optional(),
  pictures: z.boolean().optional(),
}).strict();

export const ProjectSelectSchema: z.ZodType<Prisma.ProjectSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  location: z.boolean().optional(),
  investmentGoal: z.boolean().optional(),
  investmentRaised: z.boolean().optional(),
  tags: z.boolean().optional(),
  status: z.boolean().optional(),
  description: z.boolean().optional(),
  buildingAvgRent: z.boolean().optional(),
  buildingAvgUnitSize: z.boolean().optional(),
  buildingCommSqFt: z.boolean().optional(),
  buildingUnits: z.boolean().optional(),
  debtInterestRate: z.boolean().optional(),
  debtMinInvestment: z.boolean().optional(),
  debtPaymentFreq: z.boolean().optional(),
  debtTermMonths: z.boolean().optional(),
  equityIRR: z.boolean().optional(),
  equityMinInvestment: z.boolean().optional(),
  equityPaymentFreq: z.boolean().optional(),
  equityTermMonths: z.boolean().optional(),
  marketHighlights: z.boolean().optional(),
  youtubeUrl: z.boolean().optional(),
  preferredReturn: z.boolean().optional(),
  targetEquityMultiple: z.boolean().optional(),
  slug: z.boolean().optional(),
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  documents: z.union([z.boolean(),z.lazy(() => DocumentFindManyArgsSchema)]).optional(),
  pictures: z.union([z.boolean(),z.lazy(() => PicturesFindManyArgsSchema)]).optional(),
  projectMilestones: z.union([z.boolean(),z.lazy(() => ProjectMilestonesArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProjectCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROJECT MILESTONES
//------------------------------------------------------

export const ProjectMilestonesIncludeSchema: z.ZodType<Prisma.ProjectMilestonesInclude> = z.object({
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
}).strict()

export const ProjectMilestonesArgsSchema: z.ZodType<Prisma.ProjectMilestonesDefaultArgs> = z.object({
  select: z.lazy(() => ProjectMilestonesSelectSchema).optional(),
  include: z.lazy(() => ProjectMilestonesIncludeSchema).optional(),
}).strict();

export const ProjectMilestonesSelectSchema: z.ZodType<Prisma.ProjectMilestonesSelect> = z.object({
  id: z.boolean().optional(),
  projectId: z.boolean().optional(),
  equityContribution: z.boolean().optional(),
  financialClosing: z.boolean().optional(),
  groundBreakingCeremony: z.boolean().optional(),
  startVerticalConstruction: z.boolean().optional(),
  toppingOut: z.boolean().optional(),
  preLeasing: z.boolean().optional(),
  fullEnclosure: z.boolean().optional(),
  temporaryOccupancy: z.boolean().optional(),
  grandOpening: z.boolean().optional(),
  stabilized: z.boolean().optional(),
  refinance: z.boolean().optional(),
  sale: z.boolean().optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
}).strict()

// PICTURES
//------------------------------------------------------

export const PicturesIncludeSchema: z.ZodType<Prisma.PicturesInclude> = z.object({
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
}).strict()

export const PicturesArgsSchema: z.ZodType<Prisma.PicturesDefaultArgs> = z.object({
  select: z.lazy(() => PicturesSelectSchema).optional(),
  include: z.lazy(() => PicturesIncludeSchema).optional(),
}).strict();

export const PicturesSelectSchema: z.ZodType<Prisma.PicturesSelect> = z.object({
  id: z.boolean().optional(),
  projectId: z.boolean().optional(),
  url: z.boolean().optional(),
  type: z.boolean().optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
}).strict()

// DOCUMENT
//------------------------------------------------------

export const DocumentIncludeSchema: z.ZodType<Prisma.DocumentInclude> = z.object({
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  documentEvents: z.union([z.boolean(),z.lazy(() => DocumentEventFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DocumentCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const DocumentArgsSchema: z.ZodType<Prisma.DocumentDefaultArgs> = z.object({
  select: z.lazy(() => DocumentSelectSchema).optional(),
  include: z.lazy(() => DocumentIncludeSchema).optional(),
}).strict();

export const DocumentCountOutputTypeArgsSchema: z.ZodType<Prisma.DocumentCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DocumentCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DocumentCountOutputTypeSelectSchema: z.ZodType<Prisma.DocumentCountOutputTypeSelect> = z.object({
  documentEvents: z.boolean().optional(),
}).strict();

export const DocumentSelectSchema: z.ZodType<Prisma.DocumentSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  fileName: z.boolean().optional(),
  description: z.boolean().optional(),
  link: z.boolean().optional(),
  projectId: z.boolean().optional(),
  dealStage: z.boolean().optional(),
  financingTypes: z.boolean().optional(),
  documentType: z.boolean().optional(),
  docusignTemplateId: z.boolean().optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  documentEvents: z.union([z.boolean(),z.lazy(() => DocumentEventFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DocumentCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DOCUMENT EVENT
//------------------------------------------------------

export const DocumentEventIncludeSchema: z.ZodType<Prisma.DocumentEventInclude> = z.object({
  document: z.union([z.boolean(),z.lazy(() => DocumentArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const DocumentEventArgsSchema: z.ZodType<Prisma.DocumentEventDefaultArgs> = z.object({
  select: z.lazy(() => DocumentEventSelectSchema).optional(),
  include: z.lazy(() => DocumentEventIncludeSchema).optional(),
}).strict();

export const DocumentEventSelectSchema: z.ZodType<Prisma.DocumentEventSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  documentId: z.boolean().optional(),
  date: z.boolean().optional(),
  type: z.boolean().optional(),
  document: z.union([z.boolean(),z.lazy(() => DocumentArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ADDRESS
//------------------------------------------------------

export const AddressIncludeSchema: z.ZodType<Prisma.AddressInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AddressCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const AddressArgsSchema: z.ZodType<Prisma.AddressDefaultArgs> = z.object({
  select: z.lazy(() => AddressSelectSchema).optional(),
  include: z.lazy(() => AddressIncludeSchema).optional(),
}).strict();

export const AddressCountOutputTypeArgsSchema: z.ZodType<Prisma.AddressCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => AddressCountOutputTypeSelectSchema).nullish(),
}).strict();

export const AddressCountOutputTypeSelectSchema: z.ZodType<Prisma.AddressCountOutputTypeSelect> = z.object({
  user: z.boolean().optional(),
  organization: z.boolean().optional(),
}).strict();

export const AddressSelectSchema: z.ZodType<Prisma.AddressSelect> = z.object({
  id: z.boolean().optional(),
  street: z.boolean().optional(),
  city: z.boolean().optional(),
  zipcode: z.boolean().optional(),
  state: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AddressCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  organization: z.lazy(() => OrganizationListRelationFilterSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional(),
  address: z.union([ z.lazy(() => AddressNullableRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ssn: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByRelationAggregateInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventOrderByRelationAggregateInputSchema).optional(),
  address: z.lazy(() => AddressOrderByWithRelationInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    clerkId: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.number().int(),
    clerkId: z.string(),
  }),
  z.object({
    id: z.number().int(),
    email: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    clerkId: z.string(),
    email: z.string(),
  }),
  z.object({
    clerkId: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  clerkId: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  organization: z.lazy(() => OrganizationListRelationFilterSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional(),
  address: z.union([ z.lazy(() => AddressNullableRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ssn: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  addressId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const DealWhereInputSchema: z.ZodType<Prisma.DealWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DealWhereInputSchema),z.lazy(() => DealWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealWhereInputSchema),z.lazy(() => DealWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  financingType: z.union([ z.lazy(() => EnumDealFinancingTypeNullableFilterSchema),z.lazy(() => DealFinancingTypeSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transactionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  numberAUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  numberCUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeNullableFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accreditationVerifierId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  AccreditationVerifier: z.union([ z.lazy(() => AccreditationVerifierNullableRelationFilterSchema),z.lazy(() => AccreditationVerifierWhereInputSchema) ]).optional().nullable(),
  document: z.lazy(() => DealDocumentListRelationFilterSchema).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict();

export const DealOrderByWithRelationInputSchema: z.ZodType<Prisma.DealOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  numberCUnits: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accreditationVerifierId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional(),
  AccreditationVerifier: z.lazy(() => AccreditationVerifierOrderByWithRelationInputSchema).optional(),
  document: z.lazy(() => DealDocumentOrderByRelationAggregateInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional()
}).strict();

export const DealWhereUniqueInputSchema: z.ZodType<Prisma.DealWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    hubspotId: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    hubspotId: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  hubspotId: z.string().optional(),
  AND: z.union([ z.lazy(() => DealWhereInputSchema),z.lazy(() => DealWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealWhereInputSchema),z.lazy(() => DealWhereInputSchema).array() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  amount: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  financingType: z.union([ z.lazy(() => EnumDealFinancingTypeNullableFilterSchema),z.lazy(() => DealFinancingTypeSchema) ]).optional().nullable(),
  transactionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  numberAUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  numberCUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeNullableFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accreditationVerifierId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  AccreditationVerifier: z.union([ z.lazy(() => AccreditationVerifierNullableRelationFilterSchema),z.lazy(() => AccreditationVerifierWhereInputSchema) ]).optional().nullable(),
  document: z.lazy(() => DealDocumentListRelationFilterSchema).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict());

export const DealOrderByWithAggregationInputSchema: z.ZodType<Prisma.DealOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  numberCUnits: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accreditationVerifierId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DealCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DealAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DealMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DealMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DealSumOrderByAggregateInputSchema).optional()
}).strict();

export const DealScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DealScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DealScalarWhereWithAggregatesInputSchema),z.lazy(() => DealScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealScalarWhereWithAggregatesInputSchema),z.lazy(() => DealScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  financingType: z.union([ z.lazy(() => EnumDealFinancingTypeNullableWithAggregatesFilterSchema),z.lazy(() => DealFinancingTypeSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  transactionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  numberAUnits: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  numberCUnits: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeNullableWithAggregatesFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  accreditationVerifierId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const OrganizationWhereInputSchema: z.ZodType<Prisma.OrganizationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tin: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dateOfCreation: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  juristication: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  members: z.lazy(() => UserListRelationFilterSchema).optional(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional(),
  document: z.lazy(() => OrganizationDocumentListRelationFilterSchema).optional(),
  address: z.union([ z.lazy(() => AddressNullableRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
}).strict();

export const OrganizationOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tin: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateOfCreation: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  juristication: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  addressId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  members: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
  deals: z.lazy(() => DealOrderByRelationAggregateInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentOrderByRelationAggregateInputSchema).optional(),
  address: z.lazy(() => AddressOrderByWithRelationInputSchema).optional()
}).strict();

export const OrganizationWhereUniqueInputSchema: z.ZodType<Prisma.OrganizationWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tin: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dateOfCreation: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  juristication: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  members: z.lazy(() => UserListRelationFilterSchema).optional(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional(),
  document: z.lazy(() => OrganizationDocumentListRelationFilterSchema).optional(),
  address: z.union([ z.lazy(() => AddressNullableRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
}).strict());

export const OrganizationOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tin: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateOfCreation: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  juristication: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  addressId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => OrganizationCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OrganizationAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrganizationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrganizationMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OrganizationSumOrderByAggregateInputSchema).optional()
}).strict();

export const OrganizationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrganizationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tin: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  dateOfCreation: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  juristication: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  addressId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const AccreditationVerifierWhereInputSchema: z.ZodType<Prisma.AccreditationVerifierWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccreditationVerifierWhereInputSchema),z.lazy(() => AccreditationVerifierWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccreditationVerifierWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccreditationVerifierWhereInputSchema),z.lazy(() => AccreditationVerifierWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional()
}).strict();

export const AccreditationVerifierOrderByWithRelationInputSchema: z.ZodType<Prisma.AccreditationVerifierOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  deals: z.lazy(() => DealOrderByRelationAggregateInputSchema).optional()
}).strict();

export const AccreditationVerifierWhereUniqueInputSchema: z.ZodType<Prisma.AccreditationVerifierWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => AccreditationVerifierWhereInputSchema),z.lazy(() => AccreditationVerifierWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccreditationVerifierWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccreditationVerifierWhereInputSchema),z.lazy(() => AccreditationVerifierWhereInputSchema).array() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional()
}).strict());

export const AccreditationVerifierOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccreditationVerifierOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AccreditationVerifierCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AccreditationVerifierAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccreditationVerifierMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccreditationVerifierMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AccreditationVerifierSumOrderByAggregateInputSchema).optional()
}).strict();

export const AccreditationVerifierScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccreditationVerifierScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccreditationVerifierScalarWhereWithAggregatesInputSchema),z.lazy(() => AccreditationVerifierScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccreditationVerifierScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccreditationVerifierScalarWhereWithAggregatesInputSchema),z.lazy(() => AccreditationVerifierScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const DealDocumentWhereInputSchema: z.ZodType<Prisma.DealDocumentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DealDocumentWhereInputSchema),z.lazy(() => DealDocumentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealDocumentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealDocumentWhereInputSchema),z.lazy(() => DealDocumentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDealDocumentTypeFilterSchema),z.lazy(() => DealDocumentTypeSchema) ]).optional(),
  dealId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  deal: z.union([ z.lazy(() => DealRelationFilterSchema),z.lazy(() => DealWhereInputSchema) ]).optional(),
}).strict();

export const DealDocumentOrderByWithRelationInputSchema: z.ZodType<Prisma.DealDocumentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  deal: z.lazy(() => DealOrderByWithRelationInputSchema).optional()
}).strict();

export const DealDocumentWhereUniqueInputSchema: z.ZodType<Prisma.DealDocumentWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => DealDocumentWhereInputSchema),z.lazy(() => DealDocumentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealDocumentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealDocumentWhereInputSchema),z.lazy(() => DealDocumentWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDealDocumentTypeFilterSchema),z.lazy(() => DealDocumentTypeSchema) ]).optional(),
  dealId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  deal: z.union([ z.lazy(() => DealRelationFilterSchema),z.lazy(() => DealWhereInputSchema) ]).optional(),
}).strict());

export const DealDocumentOrderByWithAggregationInputSchema: z.ZodType<Prisma.DealDocumentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DealDocumentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DealDocumentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DealDocumentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DealDocumentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DealDocumentSumOrderByAggregateInputSchema).optional()
}).strict();

export const DealDocumentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DealDocumentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DealDocumentScalarWhereWithAggregatesInputSchema),z.lazy(() => DealDocumentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealDocumentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealDocumentScalarWhereWithAggregatesInputSchema),z.lazy(() => DealDocumentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDealDocumentTypeWithAggregatesFilterSchema),z.lazy(() => DealDocumentTypeSchema) ]).optional(),
  dealId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const OrganizationDocumentWhereInputSchema: z.ZodType<Prisma.OrganizationDocumentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationDocumentWhereInputSchema),z.lazy(() => OrganizationDocumentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationDocumentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationDocumentWhereInputSchema),z.lazy(() => OrganizationDocumentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationDocumentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional()
}).strict();

export const OrganizationDocumentWhereUniqueInputSchema: z.ZodType<Prisma.OrganizationDocumentWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => OrganizationDocumentWhereInputSchema),z.lazy(() => OrganizationDocumentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationDocumentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationDocumentWhereInputSchema),z.lazy(() => OrganizationDocumentWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict());

export const OrganizationDocumentOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationDocumentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrganizationDocumentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OrganizationDocumentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrganizationDocumentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrganizationDocumentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OrganizationDocumentSumOrderByAggregateInputSchema).optional()
}).strict();

export const OrganizationDocumentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrganizationDocumentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationDocumentScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationDocumentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationDocumentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationDocumentScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationDocumentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const ProjectWhereInputSchema: z.ZodType<Prisma.ProjectWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investmentGoal: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  investmentRaised: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  tags: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  buildingAvgRent: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  buildingAvgUnitSize: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  buildingCommSqFt: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  buildingUnits: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  debtInterestRate: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  debtMinInvestment: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  debtPaymentFreq: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  debtTermMonths: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  equityIRR: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  equityMinInvestment: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  equityPaymentFreq: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  equityTermMonths: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  marketHighlights: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  youtubeUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  preferredReturn: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  targetEquityMultiple: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  slug: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional(),
  documents: z.lazy(() => DocumentListRelationFilterSchema).optional(),
  pictures: z.lazy(() => PicturesListRelationFilterSchema).optional(),
  projectMilestones: z.union([ z.lazy(() => ProjectMilestonesNullableRelationFilterSchema),z.lazy(() => ProjectMilestonesWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ProjectOrderByWithRelationInputSchema: z.ZodType<Prisma.ProjectOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgRent: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  buildingCommSqFt: z.lazy(() => SortOrderSchema).optional(),
  buildingUnits: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRate: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonths: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  marketHighlights: z.lazy(() => SortOrderSchema).optional(),
  youtubeUrl: z.lazy(() => SortOrderSchema).optional(),
  preferredReturn: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  slug: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deals: z.lazy(() => DealOrderByRelationAggregateInputSchema).optional(),
  documents: z.lazy(() => DocumentOrderByRelationAggregateInputSchema).optional(),
  pictures: z.lazy(() => PicturesOrderByRelationAggregateInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesOrderByWithRelationInputSchema).optional()
}).strict();

export const ProjectWhereUniqueInputSchema: z.ZodType<Prisma.ProjectWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string()
  }),
  z.object({
    id: z.number().int(),
    name: z.string(),
  }),
  z.object({
    id: z.number().int(),
    slug: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    name: z.string(),
    slug: z.string(),
  }),
  z.object({
    name: z.string(),
  }),
  z.object({
    slug: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  AND: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investmentGoal: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  investmentRaised: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  tags: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  buildingAvgRent: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  buildingAvgUnitSize: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  buildingCommSqFt: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  buildingUnits: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  debtInterestRate: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  debtMinInvestment: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  debtPaymentFreq: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  debtTermMonths: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  equityIRR: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  equityMinInvestment: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  equityPaymentFreq: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  equityTermMonths: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  marketHighlights: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  youtubeUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  preferredReturn: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  targetEquityMultiple: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional(),
  documents: z.lazy(() => DocumentListRelationFilterSchema).optional(),
  pictures: z.lazy(() => PicturesListRelationFilterSchema).optional(),
  projectMilestones: z.union([ z.lazy(() => ProjectMilestonesNullableRelationFilterSchema),z.lazy(() => ProjectMilestonesWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ProjectOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProjectOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgRent: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  buildingCommSqFt: z.lazy(() => SortOrderSchema).optional(),
  buildingUnits: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRate: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonths: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  marketHighlights: z.lazy(() => SortOrderSchema).optional(),
  youtubeUrl: z.lazy(() => SortOrderSchema).optional(),
  preferredReturn: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  slug: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ProjectCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProjectAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProjectMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProjectMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProjectSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProjectScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProjectScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  investmentGoal: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  investmentRaised: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  tags: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusWithAggregatesFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  buildingAvgRent: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  buildingAvgUnitSize: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  buildingCommSqFt: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  buildingUnits: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  debtInterestRate: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  debtMinInvestment: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  debtPaymentFreq: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  debtTermMonths: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  equityIRR: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  equityMinInvestment: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  equityPaymentFreq: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  equityTermMonths: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  marketHighlights: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  youtubeUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  preferredReturn: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  targetEquityMultiple: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  slug: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ProjectMilestonesWhereInputSchema: z.ZodType<Prisma.ProjectMilestonesWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectMilestonesWhereInputSchema),z.lazy(() => ProjectMilestonesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectMilestonesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectMilestonesWhereInputSchema),z.lazy(() => ProjectMilestonesWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  equityContribution: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  financialClosing: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  groundBreakingCeremony: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  startVerticalConstruction: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  toppingOut: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  preLeasing: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  fullEnclosure: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  temporaryOccupancy: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  grandOpening: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  stabilized: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  refinance: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  sale: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict();

export const ProjectMilestonesOrderByWithRelationInputSchema: z.ZodType<Prisma.ProjectMilestonesOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  equityContribution: z.lazy(() => SortOrderSchema).optional(),
  financialClosing: z.lazy(() => SortOrderSchema).optional(),
  groundBreakingCeremony: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startVerticalConstruction: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  toppingOut: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  preLeasing: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  fullEnclosure: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  temporaryOccupancy: z.lazy(() => SortOrderSchema).optional(),
  grandOpening: z.lazy(() => SortOrderSchema).optional(),
  stabilized: z.lazy(() => SortOrderSchema).optional(),
  refinance: z.lazy(() => SortOrderSchema).optional(),
  sale: z.lazy(() => SortOrderSchema).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional()
}).strict();

export const ProjectMilestonesWhereUniqueInputSchema: z.ZodType<Prisma.ProjectMilestonesWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    projectId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    projectId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  projectId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ProjectMilestonesWhereInputSchema),z.lazy(() => ProjectMilestonesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectMilestonesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectMilestonesWhereInputSchema),z.lazy(() => ProjectMilestonesWhereInputSchema).array() ]).optional(),
  equityContribution: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  financialClosing: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  groundBreakingCeremony: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  startVerticalConstruction: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  toppingOut: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  preLeasing: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  fullEnclosure: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  temporaryOccupancy: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  grandOpening: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  stabilized: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  refinance: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  sale: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict());

export const ProjectMilestonesOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProjectMilestonesOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  equityContribution: z.lazy(() => SortOrderSchema).optional(),
  financialClosing: z.lazy(() => SortOrderSchema).optional(),
  groundBreakingCeremony: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startVerticalConstruction: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  toppingOut: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  preLeasing: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  fullEnclosure: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  temporaryOccupancy: z.lazy(() => SortOrderSchema).optional(),
  grandOpening: z.lazy(() => SortOrderSchema).optional(),
  stabilized: z.lazy(() => SortOrderSchema).optional(),
  refinance: z.lazy(() => SortOrderSchema).optional(),
  sale: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProjectMilestonesCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProjectMilestonesAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProjectMilestonesMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProjectMilestonesMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProjectMilestonesSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProjectMilestonesScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProjectMilestonesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectMilestonesScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectMilestonesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectMilestonesScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectMilestonesScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectMilestonesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  equityContribution: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  financialClosing: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  groundBreakingCeremony: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  startVerticalConstruction: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  toppingOut: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  preLeasing: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  fullEnclosure: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  temporaryOccupancy: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  grandOpening: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  stabilized: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  refinance: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  sale: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PicturesWhereInputSchema: z.ZodType<Prisma.PicturesWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PicturesWhereInputSchema),z.lazy(() => PicturesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PicturesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PicturesWhereInputSchema),z.lazy(() => PicturesWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumPictureTypeFilterSchema),z.lazy(() => PictureTypeSchema) ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict();

export const PicturesOrderByWithRelationInputSchema: z.ZodType<Prisma.PicturesOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional()
}).strict();

export const PicturesWhereUniqueInputSchema: z.ZodType<Prisma.PicturesWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PicturesWhereInputSchema),z.lazy(() => PicturesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PicturesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PicturesWhereInputSchema),z.lazy(() => PicturesWhereInputSchema).array() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumPictureTypeFilterSchema),z.lazy(() => PictureTypeSchema) ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict());

export const PicturesOrderByWithAggregationInputSchema: z.ZodType<Prisma.PicturesOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PicturesCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PicturesAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PicturesMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PicturesMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PicturesSumOrderByAggregateInputSchema).optional()
}).strict();

export const PicturesScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PicturesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PicturesScalarWhereWithAggregatesInputSchema),z.lazy(() => PicturesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PicturesScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PicturesScalarWhereWithAggregatesInputSchema),z.lazy(() => PicturesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumPictureTypeWithAggregatesFilterSchema),z.lazy(() => PictureTypeSchema) ]).optional(),
}).strict();

export const DocumentWhereInputSchema: z.ZodType<Prisma.DocumentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DocumentWhereInputSchema),z.lazy(() => DocumentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocumentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocumentWhereInputSchema),z.lazy(() => DocumentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  fileName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  financingTypes: z.lazy(() => EnumDealFinancingTypeNullableListFilterSchema).optional(),
  documentType: z.union([ z.lazy(() => EnumDocumentTypeFilterSchema),z.lazy(() => DocumentTypeSchema) ]).optional(),
  docusignTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional()
}).strict();

export const DocumentOrderByWithRelationInputSchema: z.ZodType<Prisma.DocumentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  financingTypes: z.lazy(() => SortOrderSchema).optional(),
  documentType: z.lazy(() => SortOrderSchema).optional(),
  docusignTemplateId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventOrderByRelationAggregateInputSchema).optional()
}).strict();

export const DocumentWhereUniqueInputSchema: z.ZodType<Prisma.DocumentWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => DocumentWhereInputSchema),z.lazy(() => DocumentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocumentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocumentWhereInputSchema),z.lazy(() => DocumentWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  fileName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  financingTypes: z.lazy(() => EnumDealFinancingTypeNullableListFilterSchema).optional(),
  documentType: z.union([ z.lazy(() => EnumDocumentTypeFilterSchema),z.lazy(() => DocumentTypeSchema) ]).optional(),
  docusignTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional()
}).strict());

export const DocumentOrderByWithAggregationInputSchema: z.ZodType<Prisma.DocumentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  financingTypes: z.lazy(() => SortOrderSchema).optional(),
  documentType: z.lazy(() => SortOrderSchema).optional(),
  docusignTemplateId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => DocumentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DocumentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DocumentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DocumentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DocumentSumOrderByAggregateInputSchema).optional()
}).strict();

export const DocumentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DocumentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DocumentScalarWhereWithAggregatesInputSchema),z.lazy(() => DocumentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocumentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocumentScalarWhereWithAggregatesInputSchema),z.lazy(() => DocumentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  fileName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  link: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  projectId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  financingTypes: z.lazy(() => EnumDealFinancingTypeNullableListFilterSchema).optional(),
  documentType: z.union([ z.lazy(() => EnumDocumentTypeWithAggregatesFilterSchema),z.lazy(() => DocumentTypeSchema) ]).optional(),
  docusignTemplateId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const DocumentEventWhereInputSchema: z.ZodType<Prisma.DocumentEventWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DocumentEventWhereInputSchema),z.lazy(() => DocumentEventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocumentEventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocumentEventWhereInputSchema),z.lazy(() => DocumentEventWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  documentId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumDocumentEventTypeFilterSchema),z.lazy(() => DocumentEventTypeSchema) ]).optional(),
  document: z.union([ z.lazy(() => DocumentRelationFilterSchema),z.lazy(() => DocumentWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const DocumentEventOrderByWithRelationInputSchema: z.ZodType<Prisma.DocumentEventOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  documentId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  document: z.lazy(() => DocumentOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const DocumentEventWhereUniqueInputSchema: z.ZodType<Prisma.DocumentEventWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => DocumentEventWhereInputSchema),z.lazy(() => DocumentEventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocumentEventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocumentEventWhereInputSchema),z.lazy(() => DocumentEventWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  documentId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumDocumentEventTypeFilterSchema),z.lazy(() => DocumentEventTypeSchema) ]).optional(),
  document: z.union([ z.lazy(() => DocumentRelationFilterSchema),z.lazy(() => DocumentWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const DocumentEventOrderByWithAggregationInputSchema: z.ZodType<Prisma.DocumentEventOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  documentId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DocumentEventCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DocumentEventAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DocumentEventMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DocumentEventMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DocumentEventSumOrderByAggregateInputSchema).optional()
}).strict();

export const DocumentEventScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DocumentEventScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DocumentEventScalarWhereWithAggregatesInputSchema),z.lazy(() => DocumentEventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocumentEventScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocumentEventScalarWhereWithAggregatesInputSchema),z.lazy(() => DocumentEventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  documentId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumDocumentEventTypeWithAggregatesFilterSchema),z.lazy(() => DocumentEventTypeSchema) ]).optional(),
}).strict();

export const AddressWhereInputSchema: z.ZodType<Prisma.AddressWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  zipcode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.lazy(() => UserListRelationFilterSchema).optional(),
  organization: z.lazy(() => OrganizationListRelationFilterSchema).optional()
}).strict();

export const AddressOrderByWithRelationInputSchema: z.ZodType<Prisma.AddressOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  zipcode: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByRelationAggregateInputSchema).optional()
}).strict();

export const AddressWhereUniqueInputSchema: z.ZodType<Prisma.AddressWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  zipcode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.lazy(() => UserListRelationFilterSchema).optional(),
  organization: z.lazy(() => OrganizationListRelationFilterSchema).optional()
}).strict());

export const AddressOrderByWithAggregationInputSchema: z.ZodType<Prisma.AddressOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  zipcode: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AddressCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AddressAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AddressMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AddressMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AddressSumOrderByAggregateInputSchema).optional()
}).strict();

export const AddressScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AddressScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AddressScalarWhereWithAggregatesInputSchema),z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressScalarWhereWithAggregatesInputSchema),z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  street: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  zipcode: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  organizationId: z.number().int(),
  organization: z.lazy(() => OrganizationCreateNestedManyWithoutMembersInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  addressId: z.number().int().optional().nullable(),
  ssn: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  organizationId: z.number().int(),
  organization: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutMembersInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateManyWithoutMembersNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUncheckedUpdateManyWithoutMembersNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  addressId: z.number().int().optional().nullable(),
  ssn: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  organizationId: z.number().int()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealCreateInputSchema: z.ZodType<Prisma.DealCreateInput> = z.object({
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema),
  AccreditationVerifier: z.lazy(() => AccreditationVerifierCreateNestedOneWithoutDealsInputSchema).optional(),
  document: z.lazy(() => DealDocumentCreateNestedManyWithoutDealInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDealsInputSchema)
}).strict();

export const DealUncheckedCreateInputSchema: z.ZodType<Prisma.DealUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  accreditationVerifierId: z.number().int().optional().nullable(),
  organizationId: z.number().int(),
  document: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealUpdateInputSchema: z.ZodType<Prisma.DealUpdateInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  AccreditationVerifier: z.lazy(() => AccreditationVerifierUpdateOneWithoutDealsNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUpdateManyWithoutDealNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateInputSchema: z.ZodType<Prisma.DealUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerifierId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  document: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealCreateManyInputSchema: z.ZodType<Prisma.DealCreateManyInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  accreditationVerifierId: z.number().int().optional().nullable(),
  organizationId: z.number().int()
}).strict();

export const DealUpdateManyMutationInputSchema: z.ZodType<Prisma.DealUpdateManyMutationInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerifierId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateInputSchema: z.ZodType<Prisma.OrganizationCreateInput> = z.object({
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  members: z.lazy(() => UserCreateNestedManyWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutOrganizationInputSchema).optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  addressId: z.number().int().optional().nullable(),
  members: z.lazy(() => UserUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUpdateInputSchema: z.ZodType<Prisma.OrganizationUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  members: z.lazy(() => UserUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  members: z.lazy(() => UserUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationCreateManyInputSchema: z.ZodType<Prisma.OrganizationCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  addressId: z.number().int().optional().nullable()
}).strict();

export const OrganizationUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrganizationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccreditationVerifierCreateInputSchema: z.ZodType<Prisma.AccreditationVerifierCreateInput> = z.object({
  firstName: z.string(),
  lastName: z.string(),
  title: z.string(),
  phoneNumber: z.string(),
  deals: z.lazy(() => DealCreateNestedManyWithoutAccreditationVerifierInputSchema).optional()
}).strict();

export const AccreditationVerifierUncheckedCreateInputSchema: z.ZodType<Prisma.AccreditationVerifierUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  title: z.string(),
  phoneNumber: z.string(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutAccreditationVerifierInputSchema).optional()
}).strict();

export const AccreditationVerifierUpdateInputSchema: z.ZodType<Prisma.AccreditationVerifierUpdateInput> = z.object({
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutAccreditationVerifierNestedInputSchema).optional()
}).strict();

export const AccreditationVerifierUncheckedUpdateInputSchema: z.ZodType<Prisma.AccreditationVerifierUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutAccreditationVerifierNestedInputSchema).optional()
}).strict();

export const AccreditationVerifierCreateManyInputSchema: z.ZodType<Prisma.AccreditationVerifierCreateManyInput> = z.object({
  id: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  title: z.string(),
  phoneNumber: z.string()
}).strict();

export const AccreditationVerifierUpdateManyMutationInputSchema: z.ZodType<Prisma.AccreditationVerifierUpdateManyMutationInput> = z.object({
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccreditationVerifierUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccreditationVerifierUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealDocumentCreateInputSchema: z.ZodType<Prisma.DealDocumentCreateInput> = z.object({
  name: z.string(),
  link: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  deal: z.lazy(() => DealCreateNestedOneWithoutDocumentInputSchema)
}).strict();

export const DealDocumentUncheckedCreateInputSchema: z.ZodType<Prisma.DealDocumentUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  link: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  dealId: z.number().int()
}).strict();

export const DealDocumentUpdateInputSchema: z.ZodType<Prisma.DealDocumentUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  deal: z.lazy(() => DealUpdateOneRequiredWithoutDocumentNestedInputSchema).optional()
}).strict();

export const DealDocumentUncheckedUpdateInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealDocumentCreateManyInputSchema: z.ZodType<Prisma.DealDocumentCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  link: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  dealId: z.number().int()
}).strict();

export const DealDocumentUpdateManyMutationInputSchema: z.ZodType<Prisma.DealDocumentUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealDocumentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentCreateInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateInput> = z.object({
  name: z.string(),
  link: z.string(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDocumentInputSchema)
}).strict();

export const OrganizationDocumentUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  link: z.string(),
  organizationId: z.number().int()
}).strict();

export const OrganizationDocumentUpdateInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDocumentNestedInputSchema).optional()
}).strict();

export const OrganizationDocumentUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentCreateManyInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  link: z.string(),
  organizationId: z.number().int()
}).strict();

export const OrganizationDocumentUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectCreateInputSchema: z.ZodType<Prisma.ProjectCreateInput> = z.object({
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  buildingAvgRent: z.number().int().optional(),
  buildingAvgUnitSize: z.number().int().optional(),
  buildingCommSqFt: z.number().int().optional(),
  buildingUnits: z.number().int().optional(),
  debtInterestRate: z.string().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonths: z.number().int().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  preferredReturn: z.string().optional(),
  targetEquityMultiple: z.number().optional(),
  slug: z.string().optional().nullable(),
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesCreateNestedManyWithoutProjectInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  buildingAvgRent: z.number().int().optional(),
  buildingAvgUnitSize: z.number().int().optional(),
  buildingCommSqFt: z.number().int().optional(),
  buildingUnits: z.number().int().optional(),
  debtInterestRate: z.string().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonths: z.number().int().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  preferredReturn: z.string().optional(),
  targetEquityMultiple: z.number().optional(),
  slug: z.string().optional().nullable(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUpdateInputSchema: z.ZodType<Prisma.ProjectUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUpdateManyWithoutProjectNestedInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectCreateManyInputSchema: z.ZodType<Prisma.ProjectCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  buildingAvgRent: z.number().int().optional(),
  buildingAvgUnitSize: z.number().int().optional(),
  buildingCommSqFt: z.number().int().optional(),
  buildingUnits: z.number().int().optional(),
  debtInterestRate: z.string().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonths: z.number().int().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  preferredReturn: z.string().optional(),
  targetEquityMultiple: z.number().optional(),
  slug: z.string().optional().nullable()
}).strict();

export const ProjectUpdateManyMutationInputSchema: z.ZodType<Prisma.ProjectUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProjectUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProjectMilestonesCreateInputSchema: z.ZodType<Prisma.ProjectMilestonesCreateInput> = z.object({
  equityContribution: z.coerce.date(),
  financialClosing: z.coerce.date(),
  groundBreakingCeremony: z.coerce.date().optional().nullable(),
  startVerticalConstruction: z.coerce.date().optional().nullable(),
  toppingOut: z.coerce.date().optional().nullable(),
  preLeasing: z.coerce.date().optional().nullable(),
  fullEnclosure: z.coerce.date().optional().nullable(),
  temporaryOccupancy: z.coerce.date(),
  grandOpening: z.coerce.date(),
  stabilized: z.coerce.date(),
  refinance: z.coerce.date(),
  sale: z.coerce.date(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutProjectMilestonesInputSchema)
}).strict();

export const ProjectMilestonesUncheckedCreateInputSchema: z.ZodType<Prisma.ProjectMilestonesUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  equityContribution: z.coerce.date(),
  financialClosing: z.coerce.date(),
  groundBreakingCeremony: z.coerce.date().optional().nullable(),
  startVerticalConstruction: z.coerce.date().optional().nullable(),
  toppingOut: z.coerce.date().optional().nullable(),
  preLeasing: z.coerce.date().optional().nullable(),
  fullEnclosure: z.coerce.date().optional().nullable(),
  temporaryOccupancy: z.coerce.date(),
  grandOpening: z.coerce.date(),
  stabilized: z.coerce.date(),
  refinance: z.coerce.date(),
  sale: z.coerce.date()
}).strict();

export const ProjectMilestonesUpdateInputSchema: z.ZodType<Prisma.ProjectMilestonesUpdateInput> = z.object({
  equityContribution: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  financialClosing: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  groundBreakingCeremony: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startVerticalConstruction: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toppingOut: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preLeasing: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullEnclosure: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temporaryOccupancy: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  grandOpening: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  stabilized: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refinance: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sale: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutProjectMilestonesNestedInputSchema).optional()
}).strict();

export const ProjectMilestonesUncheckedUpdateInputSchema: z.ZodType<Prisma.ProjectMilestonesUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityContribution: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  financialClosing: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  groundBreakingCeremony: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startVerticalConstruction: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toppingOut: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preLeasing: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullEnclosure: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temporaryOccupancy: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  grandOpening: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  stabilized: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refinance: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sale: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectMilestonesCreateManyInputSchema: z.ZodType<Prisma.ProjectMilestonesCreateManyInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  equityContribution: z.coerce.date(),
  financialClosing: z.coerce.date(),
  groundBreakingCeremony: z.coerce.date().optional().nullable(),
  startVerticalConstruction: z.coerce.date().optional().nullable(),
  toppingOut: z.coerce.date().optional().nullable(),
  preLeasing: z.coerce.date().optional().nullable(),
  fullEnclosure: z.coerce.date().optional().nullable(),
  temporaryOccupancy: z.coerce.date(),
  grandOpening: z.coerce.date(),
  stabilized: z.coerce.date(),
  refinance: z.coerce.date(),
  sale: z.coerce.date()
}).strict();

export const ProjectMilestonesUpdateManyMutationInputSchema: z.ZodType<Prisma.ProjectMilestonesUpdateManyMutationInput> = z.object({
  equityContribution: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  financialClosing: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  groundBreakingCeremony: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startVerticalConstruction: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toppingOut: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preLeasing: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullEnclosure: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temporaryOccupancy: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  grandOpening: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  stabilized: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refinance: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sale: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectMilestonesUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProjectMilestonesUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityContribution: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  financialClosing: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  groundBreakingCeremony: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startVerticalConstruction: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toppingOut: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preLeasing: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullEnclosure: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temporaryOccupancy: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  grandOpening: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  stabilized: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refinance: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sale: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PicturesCreateInputSchema: z.ZodType<Prisma.PicturesCreateInput> = z.object({
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema),
  project: z.lazy(() => ProjectCreateNestedOneWithoutPicturesInputSchema)
}).strict();

export const PicturesUncheckedCreateInputSchema: z.ZodType<Prisma.PicturesUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema)
}).strict();

export const PicturesUpdateInputSchema: z.ZodType<Prisma.PicturesUpdateInput> = z.object({
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutPicturesNestedInputSchema).optional()
}).strict();

export const PicturesUncheckedUpdateInputSchema: z.ZodType<Prisma.PicturesUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PicturesCreateManyInputSchema: z.ZodType<Prisma.PicturesCreateManyInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema)
}).strict();

export const PicturesUpdateManyMutationInputSchema: z.ZodType<Prisma.PicturesUpdateManyMutationInput> = z.object({
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PicturesUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PicturesUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocumentCreateInputSchema: z.ZodType<Prisma.DocumentCreateInput> = z.object({
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDocumentsInputSchema),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutDocumentInputSchema).optional()
}).strict();

export const DocumentUncheckedCreateInputSchema: z.ZodType<Prisma.DocumentUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutDocumentInputSchema).optional()
}).strict();

export const DocumentUpdateInputSchema: z.ZodType<Prisma.DocumentUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDocumentsNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutDocumentNestedInputSchema).optional()
}).strict();

export const DocumentUncheckedUpdateInputSchema: z.ZodType<Prisma.DocumentUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutDocumentNestedInputSchema).optional()
}).strict();

export const DocumentCreateManyInputSchema: z.ZodType<Prisma.DocumentCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable()
}).strict();

export const DocumentUpdateManyMutationInputSchema: z.ZodType<Prisma.DocumentUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DocumentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DocumentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DocumentEventCreateInputSchema: z.ZodType<Prisma.DocumentEventCreateInput> = z.object({
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema),
  document: z.lazy(() => DocumentCreateNestedOneWithoutDocumentEventsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutDocumentEventsInputSchema)
}).strict();

export const DocumentEventUncheckedCreateInputSchema: z.ZodType<Prisma.DocumentEventUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  documentId: z.number().int(),
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema)
}).strict();

export const DocumentEventUpdateInputSchema: z.ZodType<Prisma.DocumentEventUpdateInput> = z.object({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => EnumDocumentEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  document: z.lazy(() => DocumentUpdateOneRequiredWithoutDocumentEventsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDocumentEventsNestedInputSchema).optional()
}).strict();

export const DocumentEventUncheckedUpdateInputSchema: z.ZodType<Prisma.DocumentEventUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  documentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => EnumDocumentEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocumentEventCreateManyInputSchema: z.ZodType<Prisma.DocumentEventCreateManyInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  documentId: z.number().int(),
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema)
}).strict();

export const DocumentEventUpdateManyMutationInputSchema: z.ZodType<Prisma.DocumentEventUpdateManyMutationInput> = z.object({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => EnumDocumentEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocumentEventUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DocumentEventUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  documentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => EnumDocumentEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AddressCreateInputSchema: z.ZodType<Prisma.AddressCreateInput> = z.object({
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  user: z.lazy(() => UserCreateNestedManyWithoutAddressInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateInputSchema: z.ZodType<Prisma.AddressUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  user: z.lazy(() => UserUncheckedCreateNestedManyWithoutAddressInputSchema).optional(),
  organization: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUpdateInputSchema: z.ZodType<Prisma.AddressUpdateInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateManyWithoutAddressNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUncheckedUpdateManyWithoutAddressNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUncheckedUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressCreateManyInputSchema: z.ZodType<Prisma.AddressCreateManyInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string()
}).strict();

export const AddressUpdateManyMutationInputSchema: z.ZodType<Prisma.AddressUpdateManyMutationInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AddressUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const OrganizationListRelationFilterSchema: z.ZodType<Prisma.OrganizationListRelationFilter> = z.object({
  every: z.lazy(() => OrganizationWhereInputSchema).optional(),
  some: z.lazy(() => OrganizationWhereInputSchema).optional(),
  none: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const DocumentEventListRelationFilterSchema: z.ZodType<Prisma.DocumentEventListRelationFilter> = z.object({
  every: z.lazy(() => DocumentEventWhereInputSchema).optional(),
  some: z.lazy(() => DocumentEventWhereInputSchema).optional(),
  none: z.lazy(() => DocumentEventWhereInputSchema).optional()
}).strict();

export const AddressNullableRelationFilterSchema: z.ZodType<Prisma.AddressNullableRelationFilter> = z.object({
  is: z.lazy(() => AddressWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AddressWhereInputSchema).optional().nullable()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const OrganizationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentEventOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DocumentEventOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const EnumDealFinancingTypeNullableFilterSchema: z.ZodType<Prisma.EnumDealFinancingTypeNullableFilter> = z.object({
  equals: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  in: z.lazy(() => DealFinancingTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealFinancingTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NestedEnumDealFinancingTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumDealOwnershipTypeNullableFilterSchema: z.ZodType<Prisma.EnumDealOwnershipTypeNullableFilter> = z.object({
  equals: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  in: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NestedEnumDealOwnershipTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const ProjectRelationFilterSchema: z.ZodType<Prisma.ProjectRelationFilter> = z.object({
  is: z.lazy(() => ProjectWhereInputSchema).optional(),
  isNot: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const AccreditationVerifierNullableRelationFilterSchema: z.ZodType<Prisma.AccreditationVerifierNullableRelationFilter> = z.object({
  is: z.lazy(() => AccreditationVerifierWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AccreditationVerifierWhereInputSchema).optional().nullable()
}).strict();

export const DealDocumentListRelationFilterSchema: z.ZodType<Prisma.DealDocumentListRelationFilter> = z.object({
  every: z.lazy(() => DealDocumentWhereInputSchema).optional(),
  some: z.lazy(() => DealDocumentWhereInputSchema).optional(),
  none: z.lazy(() => DealDocumentWhereInputSchema).optional()
}).strict();

export const OrganizationRelationFilterSchema: z.ZodType<Prisma.OrganizationRelationFilter> = z.object({
  is: z.lazy(() => OrganizationWhereInputSchema).optional(),
  isNot: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const DealDocumentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DealDocumentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealCountOrderByAggregateInputSchema: z.ZodType<Prisma.DealCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  ownershipTypeOtherValue: z.lazy(() => SortOrderSchema).optional(),
  accreditationVerifierId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DealAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  accreditationVerifierId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DealMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  ownershipTypeOtherValue: z.lazy(() => SortOrderSchema).optional(),
  accreditationVerifierId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealMinOrderByAggregateInputSchema: z.ZodType<Prisma.DealMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  ownershipTypeOtherValue: z.lazy(() => SortOrderSchema).optional(),
  accreditationVerifierId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealSumOrderByAggregateInputSchema: z.ZodType<Prisma.DealSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  accreditationVerifierId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumDealFinancingTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDealFinancingTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  in: z.lazy(() => DealFinancingTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealFinancingTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NestedEnumDealFinancingTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealFinancingTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealFinancingTypeNullableFilterSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const EnumDealOwnershipTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDealOwnershipTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  in: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NestedEnumDealOwnershipTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealOwnershipTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealOwnershipTypeNullableFilterSchema).optional()
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const UserListRelationFilterSchema: z.ZodType<Prisma.UserListRelationFilter> = z.object({
  every: z.lazy(() => UserWhereInputSchema).optional(),
  some: z.lazy(() => UserWhereInputSchema).optional(),
  none: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const DealListRelationFilterSchema: z.ZodType<Prisma.DealListRelationFilter> = z.object({
  every: z.lazy(() => DealWhereInputSchema).optional(),
  some: z.lazy(() => DealWhereInputSchema).optional(),
  none: z.lazy(() => DealWhereInputSchema).optional()
}).strict();

export const OrganizationDocumentListRelationFilterSchema: z.ZodType<Prisma.OrganizationDocumentListRelationFilter> = z.object({
  every: z.lazy(() => OrganizationDocumentWhereInputSchema).optional(),
  some: z.lazy(() => OrganizationDocumentWhereInputSchema).optional(),
  none: z.lazy(() => OrganizationDocumentWhereInputSchema).optional()
}).strict();

export const UserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DealOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationDocumentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tin: z.lazy(() => SortOrderSchema).optional(),
  dateOfCreation: z.lazy(() => SortOrderSchema).optional(),
  juristication: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tin: z.lazy(() => SortOrderSchema).optional(),
  dateOfCreation: z.lazy(() => SortOrderSchema).optional(),
  juristication: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tin: z.lazy(() => SortOrderSchema).optional(),
  dateOfCreation: z.lazy(() => SortOrderSchema).optional(),
  juristication: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const AccreditationVerifierCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerifierCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccreditationVerifierAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerifierAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccreditationVerifierMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerifierMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccreditationVerifierMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerifierMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccreditationVerifierSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerifierSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumDealDocumentTypeFilterSchema: z.ZodType<Prisma.EnumDealDocumentTypeFilter> = z.object({
  equals: z.lazy(() => DealDocumentTypeSchema).optional(),
  in: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  notIn: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => NestedEnumDealDocumentTypeFilterSchema) ]).optional(),
}).strict();

export const DealRelationFilterSchema: z.ZodType<Prisma.DealRelationFilter> = z.object({
  is: z.lazy(() => DealWhereInputSchema).optional(),
  isNot: z.lazy(() => DealWhereInputSchema).optional()
}).strict();

export const DealDocumentCountOrderByAggregateInputSchema: z.ZodType<Prisma.DealDocumentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealDocumentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DealDocumentAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealDocumentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DealDocumentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealDocumentMinOrderByAggregateInputSchema: z.ZodType<Prisma.DealDocumentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealDocumentSumOrderByAggregateInputSchema: z.ZodType<Prisma.DealDocumentSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumDealDocumentTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDealDocumentTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealDocumentTypeSchema).optional(),
  in: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  notIn: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => NestedEnumDealDocumentTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealDocumentTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealDocumentTypeFilterSchema).optional()
}).strict();

export const OrganizationDocumentCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationDocumentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationDocumentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationDocumentMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationDocumentSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const EnumStatusFilterSchema: z.ZodType<Prisma.EnumStatusFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
}).strict();

export const DocumentListRelationFilterSchema: z.ZodType<Prisma.DocumentListRelationFilter> = z.object({
  every: z.lazy(() => DocumentWhereInputSchema).optional(),
  some: z.lazy(() => DocumentWhereInputSchema).optional(),
  none: z.lazy(() => DocumentWhereInputSchema).optional()
}).strict();

export const PicturesListRelationFilterSchema: z.ZodType<Prisma.PicturesListRelationFilter> = z.object({
  every: z.lazy(() => PicturesWhereInputSchema).optional(),
  some: z.lazy(() => PicturesWhereInputSchema).optional(),
  none: z.lazy(() => PicturesWhereInputSchema).optional()
}).strict();

export const ProjectMilestonesNullableRelationFilterSchema: z.ZodType<Prisma.ProjectMilestonesNullableRelationFilter> = z.object({
  is: z.lazy(() => ProjectMilestonesWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProjectMilestonesWhereInputSchema).optional().nullable()
}).strict();

export const DocumentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DocumentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PicturesOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PicturesOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgRent: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  buildingCommSqFt: z.lazy(() => SortOrderSchema).optional(),
  buildingUnits: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRate: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonths: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  marketHighlights: z.lazy(() => SortOrderSchema).optional(),
  youtubeUrl: z.lazy(() => SortOrderSchema).optional(),
  preferredReturn: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgRent: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  buildingCommSqFt: z.lazy(() => SortOrderSchema).optional(),
  buildingUnits: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonths: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgRent: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  buildingCommSqFt: z.lazy(() => SortOrderSchema).optional(),
  buildingUnits: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRate: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonths: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  marketHighlights: z.lazy(() => SortOrderSchema).optional(),
  youtubeUrl: z.lazy(() => SortOrderSchema).optional(),
  preferredReturn: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgRent: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  buildingCommSqFt: z.lazy(() => SortOrderSchema).optional(),
  buildingUnits: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRate: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonths: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  marketHighlights: z.lazy(() => SortOrderSchema).optional(),
  youtubeUrl: z.lazy(() => SortOrderSchema).optional(),
  preferredReturn: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgRent: z.lazy(() => SortOrderSchema).optional(),
  buildingAvgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  buildingCommSqFt: z.lazy(() => SortOrderSchema).optional(),
  buildingUnits: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonths: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const EnumStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterSchema).optional()
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const ProjectMilestonesCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMilestonesCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  equityContribution: z.lazy(() => SortOrderSchema).optional(),
  financialClosing: z.lazy(() => SortOrderSchema).optional(),
  groundBreakingCeremony: z.lazy(() => SortOrderSchema).optional(),
  startVerticalConstruction: z.lazy(() => SortOrderSchema).optional(),
  toppingOut: z.lazy(() => SortOrderSchema).optional(),
  preLeasing: z.lazy(() => SortOrderSchema).optional(),
  fullEnclosure: z.lazy(() => SortOrderSchema).optional(),
  temporaryOccupancy: z.lazy(() => SortOrderSchema).optional(),
  grandOpening: z.lazy(() => SortOrderSchema).optional(),
  stabilized: z.lazy(() => SortOrderSchema).optional(),
  refinance: z.lazy(() => SortOrderSchema).optional(),
  sale: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectMilestonesAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMilestonesAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectMilestonesMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMilestonesMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  equityContribution: z.lazy(() => SortOrderSchema).optional(),
  financialClosing: z.lazy(() => SortOrderSchema).optional(),
  groundBreakingCeremony: z.lazy(() => SortOrderSchema).optional(),
  startVerticalConstruction: z.lazy(() => SortOrderSchema).optional(),
  toppingOut: z.lazy(() => SortOrderSchema).optional(),
  preLeasing: z.lazy(() => SortOrderSchema).optional(),
  fullEnclosure: z.lazy(() => SortOrderSchema).optional(),
  temporaryOccupancy: z.lazy(() => SortOrderSchema).optional(),
  grandOpening: z.lazy(() => SortOrderSchema).optional(),
  stabilized: z.lazy(() => SortOrderSchema).optional(),
  refinance: z.lazy(() => SortOrderSchema).optional(),
  sale: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectMilestonesMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMilestonesMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  equityContribution: z.lazy(() => SortOrderSchema).optional(),
  financialClosing: z.lazy(() => SortOrderSchema).optional(),
  groundBreakingCeremony: z.lazy(() => SortOrderSchema).optional(),
  startVerticalConstruction: z.lazy(() => SortOrderSchema).optional(),
  toppingOut: z.lazy(() => SortOrderSchema).optional(),
  preLeasing: z.lazy(() => SortOrderSchema).optional(),
  fullEnclosure: z.lazy(() => SortOrderSchema).optional(),
  temporaryOccupancy: z.lazy(() => SortOrderSchema).optional(),
  grandOpening: z.lazy(() => SortOrderSchema).optional(),
  stabilized: z.lazy(() => SortOrderSchema).optional(),
  refinance: z.lazy(() => SortOrderSchema).optional(),
  sale: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectMilestonesSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMilestonesSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const EnumPictureTypeFilterSchema: z.ZodType<Prisma.EnumPictureTypeFilter> = z.object({
  equals: z.lazy(() => PictureTypeSchema).optional(),
  in: z.lazy(() => PictureTypeSchema).array().optional(),
  notIn: z.lazy(() => PictureTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => NestedEnumPictureTypeFilterSchema) ]).optional(),
}).strict();

export const PicturesCountOrderByAggregateInputSchema: z.ZodType<Prisma.PicturesCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PicturesAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PicturesAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PicturesMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PicturesMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PicturesMinOrderByAggregateInputSchema: z.ZodType<Prisma.PicturesMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PicturesSumOrderByAggregateInputSchema: z.ZodType<Prisma.PicturesSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPictureTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPictureTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PictureTypeSchema).optional(),
  in: z.lazy(() => PictureTypeSchema).array().optional(),
  notIn: z.lazy(() => PictureTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => NestedEnumPictureTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPictureTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPictureTypeFilterSchema).optional()
}).strict();

export const EnumDealFinancingTypeNullableListFilterSchema: z.ZodType<Prisma.EnumDealFinancingTypeNullableListFilter> = z.object({
  equals: z.lazy(() => DealFinancingTypeSchema).array().optional().nullable(),
  has: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hasEvery: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  hasSome: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const EnumDocumentTypeFilterSchema: z.ZodType<Prisma.EnumDocumentTypeFilter> = z.object({
  equals: z.lazy(() => DocumentTypeSchema).optional(),
  in: z.lazy(() => DocumentTypeSchema).array().optional(),
  notIn: z.lazy(() => DocumentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => NestedEnumDocumentTypeFilterSchema) ]).optional(),
}).strict();

export const DocumentCountOrderByAggregateInputSchema: z.ZodType<Prisma.DocumentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  financingTypes: z.lazy(() => SortOrderSchema).optional(),
  documentType: z.lazy(() => SortOrderSchema).optional(),
  docusignTemplateId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DocumentAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DocumentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  documentType: z.lazy(() => SortOrderSchema).optional(),
  docusignTemplateId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentMinOrderByAggregateInputSchema: z.ZodType<Prisma.DocumentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  documentType: z.lazy(() => SortOrderSchema).optional(),
  docusignTemplateId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentSumOrderByAggregateInputSchema: z.ZodType<Prisma.DocumentSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumDocumentTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDocumentTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DocumentTypeSchema).optional(),
  in: z.lazy(() => DocumentTypeSchema).array().optional(),
  notIn: z.lazy(() => DocumentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => NestedEnumDocumentTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDocumentTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDocumentTypeFilterSchema).optional()
}).strict();

export const EnumDocumentEventTypeFilterSchema: z.ZodType<Prisma.EnumDocumentEventTypeFilter> = z.object({
  equals: z.lazy(() => DocumentEventTypeSchema).optional(),
  in: z.lazy(() => DocumentEventTypeSchema).array().optional(),
  notIn: z.lazy(() => DocumentEventTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => NestedEnumDocumentEventTypeFilterSchema) ]).optional(),
}).strict();

export const DocumentRelationFilterSchema: z.ZodType<Prisma.DocumentRelationFilter> = z.object({
  is: z.lazy(() => DocumentWhereInputSchema).optional(),
  isNot: z.lazy(() => DocumentWhereInputSchema).optional()
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const DocumentEventCountOrderByAggregateInputSchema: z.ZodType<Prisma.DocumentEventCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  documentId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentEventAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DocumentEventAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  documentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentEventMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DocumentEventMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  documentId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentEventMinOrderByAggregateInputSchema: z.ZodType<Prisma.DocumentEventMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  documentId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentEventSumOrderByAggregateInputSchema: z.ZodType<Prisma.DocumentEventSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  documentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumDocumentEventTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDocumentEventTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DocumentEventTypeSchema).optional(),
  in: z.lazy(() => DocumentEventTypeSchema).array().optional(),
  notIn: z.lazy(() => DocumentEventTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => NestedEnumDocumentEventTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDocumentEventTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDocumentEventTypeFilterSchema).optional()
}).strict();

export const AddressCountOrderByAggregateInputSchema: z.ZodType<Prisma.AddressCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  zipcode: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AddressAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  zipcode: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressMinOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  zipcode: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressSumOrderByAggregateInputSchema: z.ZodType<Prisma.AddressSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationCreateNestedManyWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateNestedManyWithoutMembersInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationCreateWithoutMembersInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocumentEventCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutUserInputSchema),z.lazy(() => DocumentEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AddressCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateNestedManyWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateNestedManyWithoutMembersInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationCreateWithoutMembersInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutUserInputSchema),z.lazy(() => DocumentEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const OrganizationUpdateManyWithoutMembersNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithoutMembersNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationCreateWithoutMembersInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutMembersInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutMembersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutMembersInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutMembersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutMembersInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutMembersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DocumentEventUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.DocumentEventUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutUserInputSchema),z.lazy(() => DocumentEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DocumentEventUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DocumentEventUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DocumentEventUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DocumentEventUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DocumentEventUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => DocumentEventUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DocumentEventScalarWhereInputSchema),z.lazy(() => DocumentEventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AddressUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.AddressUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => AddressUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AddressUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => AddressUpdateWithoutUserInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const OrganizationUncheckedUpdateManyWithoutMembersNestedInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutMembersNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationCreateWithoutMembersInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutMembersInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutMembersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutMembersInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutMembersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutMembersInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutMembersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.DocumentEventUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutUserInputSchema),z.lazy(() => DocumentEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DocumentEventUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DocumentEventUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DocumentEventUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DocumentEventUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DocumentEventUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => DocumentEventUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DocumentEventScalarWhereInputSchema),z.lazy(() => DocumentEventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectCreateNestedOneWithoutDealsInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutDealsInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const AccreditationVerifierCreateNestedOneWithoutDealsInputSchema: z.ZodType<Prisma.AccreditationVerifierCreateNestedOneWithoutDealsInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerifierCreateWithoutDealsInputSchema),z.lazy(() => AccreditationVerifierUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerifierCreateOrConnectWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => AccreditationVerifierWhereUniqueInputSchema).optional()
}).strict();

export const DealDocumentCreateNestedManyWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentCreateNestedManyWithoutDealInput> = z.object({
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutDealInputSchema),z.lazy(() => DealDocumentCreateWithoutDealInputSchema).array(),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema),z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealDocumentCreateManyDealInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationCreateNestedOneWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutDealsInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDealsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUncheckedCreateNestedManyWithoutDealInput> = z.object({
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutDealInputSchema),z.lazy(() => DealDocumentCreateWithoutDealInputSchema).array(),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema),z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealDocumentCreateManyDealInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumDealFinancingTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DealFinancingTypeSchema).optional().nullable()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumDealOwnershipTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DealOwnershipTypeSchema).optional().nullable()
}).strict();

export const ProjectUpdateOneRequiredWithoutDealsNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutDealsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutDealsInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutDealsInputSchema),z.lazy(() => ProjectUpdateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutDealsInputSchema) ]).optional(),
}).strict();

export const AccreditationVerifierUpdateOneWithoutDealsNestedInputSchema: z.ZodType<Prisma.AccreditationVerifierUpdateOneWithoutDealsNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerifierCreateWithoutDealsInputSchema),z.lazy(() => AccreditationVerifierUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerifierCreateOrConnectWithoutDealsInputSchema).optional(),
  upsert: z.lazy(() => AccreditationVerifierUpsertWithoutDealsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AccreditationVerifierWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AccreditationVerifierWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AccreditationVerifierWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AccreditationVerifierUpdateToOneWithWhereWithoutDealsInputSchema),z.lazy(() => AccreditationVerifierUpdateWithoutDealsInputSchema),z.lazy(() => AccreditationVerifierUncheckedUpdateWithoutDealsInputSchema) ]).optional(),
}).strict();

export const DealDocumentUpdateManyWithoutDealNestedInputSchema: z.ZodType<Prisma.DealDocumentUpdateManyWithoutDealNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutDealInputSchema),z.lazy(() => DealDocumentCreateWithoutDealInputSchema).array(),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema),z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealDocumentUpsertWithWhereUniqueWithoutDealInputSchema),z.lazy(() => DealDocumentUpsertWithWhereUniqueWithoutDealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealDocumentCreateManyDealInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealDocumentUpdateWithWhereUniqueWithoutDealInputSchema),z.lazy(() => DealDocumentUpdateWithWhereUniqueWithoutDealInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealDocumentUpdateManyWithWhereWithoutDealInputSchema),z.lazy(() => DealDocumentUpdateManyWithWhereWithoutDealInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealDocumentScalarWhereInputSchema),z.lazy(() => DealDocumentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutDealsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDealsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutDealsInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutDealsInputSchema),z.lazy(() => OrganizationUpdateWithoutDealsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutDealsInputSchema) ]).optional(),
}).strict();

export const DealDocumentUncheckedUpdateManyWithoutDealNestedInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateManyWithoutDealNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutDealInputSchema),z.lazy(() => DealDocumentCreateWithoutDealInputSchema).array(),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema),z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealDocumentUpsertWithWhereUniqueWithoutDealInputSchema),z.lazy(() => DealDocumentUpsertWithWhereUniqueWithoutDealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealDocumentCreateManyDealInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealDocumentUpdateWithWhereUniqueWithoutDealInputSchema),z.lazy(() => DealDocumentUpdateWithWhereUniqueWithoutDealInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealDocumentUpdateManyWithWhereWithoutDealInputSchema),z.lazy(() => DealDocumentUpdateManyWithWhereWithoutDealInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealDocumentScalarWhereInputSchema),z.lazy(() => DealDocumentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DealCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.DealCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutOrganizationInputSchema),z.lazy(() => DealCreateWithoutOrganizationInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationDocumentCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationDocumentCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AddressCreateNestedOneWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressCreateNestedOneWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrganizationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutOrganizationInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional()
}).strict();

export const UserUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DealUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutOrganizationInputSchema),z.lazy(() => DealCreateWithoutOrganizationInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationDocumentCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const UserUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DealUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.DealUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutOrganizationInputSchema),z.lazy(() => DealCreateWithoutOrganizationInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => DealUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => DealUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => DealUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationDocumentUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationDocumentUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationDocumentCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationDocumentUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationDocumentUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationDocumentScalarWhereInputSchema),z.lazy(() => OrganizationDocumentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AddressUpdateOneWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.AddressUpdateOneWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrganizationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutOrganizationInputSchema).optional(),
  upsert: z.lazy(() => AddressUpsertWithoutOrganizationInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AddressUpdateToOneWithWhereWithoutOrganizationInputSchema),z.lazy(() => AddressUpdateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutOrganizationInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DealUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutOrganizationInputSchema),z.lazy(() => DealCreateWithoutOrganizationInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => DealUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => DealUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => DealUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationDocumentUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationDocumentUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationDocumentCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationDocumentUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationDocumentUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationDocumentScalarWhereInputSchema),z.lazy(() => OrganizationDocumentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DealCreateNestedManyWithoutAccreditationVerifierInputSchema: z.ZodType<Prisma.DealCreateNestedManyWithoutAccreditationVerifierInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealCreateWithoutAccreditationVerifierInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutAccreditationVerifierInputSchema),z.lazy(() => DealCreateOrConnectWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyAccreditationVerifierInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DealUncheckedCreateNestedManyWithoutAccreditationVerifierInputSchema: z.ZodType<Prisma.DealUncheckedCreateNestedManyWithoutAccreditationVerifierInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealCreateWithoutAccreditationVerifierInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutAccreditationVerifierInputSchema),z.lazy(() => DealCreateOrConnectWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyAccreditationVerifierInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DealUpdateManyWithoutAccreditationVerifierNestedInputSchema: z.ZodType<Prisma.DealUpdateManyWithoutAccreditationVerifierNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealCreateWithoutAccreditationVerifierInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutAccreditationVerifierInputSchema),z.lazy(() => DealCreateOrConnectWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealUpsertWithWhereUniqueWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUpsertWithWhereUniqueWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyAccreditationVerifierInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealUpdateWithWhereUniqueWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUpdateWithWhereUniqueWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealUpdateManyWithWhereWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUpdateManyWithWhereWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DealUncheckedUpdateManyWithoutAccreditationVerifierNestedInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyWithoutAccreditationVerifierNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealCreateWithoutAccreditationVerifierInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutAccreditationVerifierInputSchema),z.lazy(() => DealCreateOrConnectWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealUpsertWithWhereUniqueWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUpsertWithWhereUniqueWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyAccreditationVerifierInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealUpdateWithWhereUniqueWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUpdateWithWhereUniqueWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealUpdateManyWithWhereWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUpdateManyWithWhereWithoutAccreditationVerifierInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DealCreateNestedOneWithoutDocumentInputSchema: z.ZodType<Prisma.DealCreateNestedOneWithoutDocumentInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutDocumentInputSchema),z.lazy(() => DealUncheckedCreateWithoutDocumentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealCreateOrConnectWithoutDocumentInputSchema).optional(),
  connect: z.lazy(() => DealWhereUniqueInputSchema).optional()
}).strict();

export const EnumDealDocumentTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDealDocumentTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DealDocumentTypeSchema).optional()
}).strict();

export const DealUpdateOneRequiredWithoutDocumentNestedInputSchema: z.ZodType<Prisma.DealUpdateOneRequiredWithoutDocumentNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutDocumentInputSchema),z.lazy(() => DealUncheckedCreateWithoutDocumentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealCreateOrConnectWithoutDocumentInputSchema).optional(),
  upsert: z.lazy(() => DealUpsertWithoutDocumentInputSchema).optional(),
  connect: z.lazy(() => DealWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DealUpdateToOneWithWhereWithoutDocumentInputSchema),z.lazy(() => DealUpdateWithoutDocumentInputSchema),z.lazy(() => DealUncheckedUpdateWithoutDocumentInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateNestedOneWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutDocumentInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDocumentInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDocumentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutDocumentInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationUpdateOneRequiredWithoutDocumentNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutDocumentNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDocumentInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDocumentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutDocumentInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutDocumentInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutDocumentInputSchema),z.lazy(() => OrganizationUpdateWithoutDocumentInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutDocumentInputSchema) ]).optional(),
}).strict();

export const DealCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.DealCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutProjectInputSchema),z.lazy(() => DealCreateWithoutProjectInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema),z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocumentCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.DocumentCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => DocumentCreateWithoutProjectInputSchema),z.lazy(() => DocumentCreateWithoutProjectInputSchema).array(),z.lazy(() => DocumentUncheckedCreateWithoutProjectInputSchema),z.lazy(() => DocumentUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentCreateOrConnectWithoutProjectInputSchema),z.lazy(() => DocumentCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentWhereUniqueInputSchema),z.lazy(() => DocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PicturesCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.PicturesCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => PicturesCreateWithoutProjectInputSchema),z.lazy(() => PicturesCreateWithoutProjectInputSchema).array(),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema),z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PicturesCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectMilestonesCreateNestedOneWithoutProjectInputSchema: z.ZodType<Prisma.ProjectMilestonesCreateNestedOneWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectMilestonesCreateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectMilestonesCreateOrConnectWithoutProjectInputSchema).optional(),
  connect: z.lazy(() => ProjectMilestonesWhereUniqueInputSchema).optional()
}).strict();

export const DealUncheckedCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.DealUncheckedCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutProjectInputSchema),z.lazy(() => DealCreateWithoutProjectInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema),z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocumentUncheckedCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUncheckedCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => DocumentCreateWithoutProjectInputSchema),z.lazy(() => DocumentCreateWithoutProjectInputSchema).array(),z.lazy(() => DocumentUncheckedCreateWithoutProjectInputSchema),z.lazy(() => DocumentUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentCreateOrConnectWithoutProjectInputSchema),z.lazy(() => DocumentCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentWhereUniqueInputSchema),z.lazy(() => DocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PicturesUncheckedCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.PicturesUncheckedCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => PicturesCreateWithoutProjectInputSchema),z.lazy(() => PicturesCreateWithoutProjectInputSchema).array(),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema),z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PicturesCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema: z.ZodType<Prisma.ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectMilestonesCreateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectMilestonesCreateOrConnectWithoutProjectInputSchema).optional(),
  connect: z.lazy(() => ProjectMilestonesWhereUniqueInputSchema).optional()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => StatusSchema).optional()
}).strict();

export const DealUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.DealUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutProjectInputSchema),z.lazy(() => DealCreateWithoutProjectInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema),z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => DealUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => DealUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => DealUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DocumentUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.DocumentUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => DocumentCreateWithoutProjectInputSchema),z.lazy(() => DocumentCreateWithoutProjectInputSchema).array(),z.lazy(() => DocumentUncheckedCreateWithoutProjectInputSchema),z.lazy(() => DocumentUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentCreateOrConnectWithoutProjectInputSchema),z.lazy(() => DocumentCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DocumentUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => DocumentUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DocumentWhereUniqueInputSchema),z.lazy(() => DocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DocumentWhereUniqueInputSchema),z.lazy(() => DocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DocumentWhereUniqueInputSchema),z.lazy(() => DocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DocumentWhereUniqueInputSchema),z.lazy(() => DocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DocumentUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => DocumentUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DocumentUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => DocumentUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DocumentScalarWhereInputSchema),z.lazy(() => DocumentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PicturesUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.PicturesUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => PicturesCreateWithoutProjectInputSchema),z.lazy(() => PicturesCreateWithoutProjectInputSchema).array(),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema),z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PicturesUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => PicturesUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PicturesCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PicturesUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => PicturesUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PicturesUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => PicturesUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PicturesScalarWhereInputSchema),z.lazy(() => PicturesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectMilestonesUpdateOneWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectMilestonesCreateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectMilestonesCreateOrConnectWithoutProjectInputSchema).optional(),
  upsert: z.lazy(() => ProjectMilestonesUpsertWithoutProjectInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProjectMilestonesWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProjectMilestonesWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProjectMilestonesWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectMilestonesUpdateToOneWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUpdateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedUpdateWithoutProjectInputSchema) ]).optional(),
}).strict();

export const DealUncheckedUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutProjectInputSchema),z.lazy(() => DealCreateWithoutProjectInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema),z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => DealUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => DealUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => DealUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DocumentUncheckedUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.DocumentUncheckedUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => DocumentCreateWithoutProjectInputSchema),z.lazy(() => DocumentCreateWithoutProjectInputSchema).array(),z.lazy(() => DocumentUncheckedCreateWithoutProjectInputSchema),z.lazy(() => DocumentUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentCreateOrConnectWithoutProjectInputSchema),z.lazy(() => DocumentCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DocumentUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => DocumentUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DocumentWhereUniqueInputSchema),z.lazy(() => DocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DocumentWhereUniqueInputSchema),z.lazy(() => DocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DocumentWhereUniqueInputSchema),z.lazy(() => DocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DocumentWhereUniqueInputSchema),z.lazy(() => DocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DocumentUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => DocumentUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DocumentUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => DocumentUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DocumentScalarWhereInputSchema),z.lazy(() => DocumentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PicturesUncheckedUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.PicturesUncheckedUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => PicturesCreateWithoutProjectInputSchema),z.lazy(() => PicturesCreateWithoutProjectInputSchema).array(),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema),z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PicturesUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => PicturesUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PicturesCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PicturesUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => PicturesUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PicturesUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => PicturesUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PicturesScalarWhereInputSchema),z.lazy(() => PicturesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectMilestonesCreateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectMilestonesCreateOrConnectWithoutProjectInputSchema).optional(),
  upsert: z.lazy(() => ProjectMilestonesUpsertWithoutProjectInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProjectMilestonesWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProjectMilestonesWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProjectMilestonesWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectMilestonesUpdateToOneWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUpdateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedUpdateWithoutProjectInputSchema) ]).optional(),
}).strict();

export const ProjectCreateNestedOneWithoutProjectMilestonesInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutProjectMilestonesInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutProjectMilestonesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutProjectMilestonesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutProjectMilestonesInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const ProjectUpdateOneRequiredWithoutProjectMilestonesNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutProjectMilestonesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutProjectMilestonesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutProjectMilestonesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutProjectMilestonesInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutProjectMilestonesInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutProjectMilestonesInputSchema),z.lazy(() => ProjectUpdateWithoutProjectMilestonesInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutProjectMilestonesInputSchema) ]).optional(),
}).strict();

export const ProjectCreateNestedOneWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutPicturesInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutPicturesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutPicturesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutPicturesInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const EnumPictureTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPictureTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PictureTypeSchema).optional()
}).strict();

export const ProjectUpdateOneRequiredWithoutPicturesNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutPicturesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutPicturesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutPicturesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutPicturesInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutPicturesInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutPicturesInputSchema),z.lazy(() => ProjectUpdateWithoutPicturesInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutPicturesInputSchema) ]).optional(),
}).strict();

export const DocumentCreatefinancingTypesInputSchema: z.ZodType<Prisma.DocumentCreatefinancingTypesInput> = z.object({
  set: z.lazy(() => DealFinancingTypeSchema).array()
}).strict();

export const ProjectCreateNestedOneWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutDocumentsInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutDocumentsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDocumentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutDocumentsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const DocumentEventCreateNestedManyWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventCreateNestedManyWithoutDocumentInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyDocumentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocumentEventUncheckedCreateNestedManyWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventUncheckedCreateNestedManyWithoutDocumentInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyDocumentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocumentUpdatefinancingTypesInputSchema: z.ZodType<Prisma.DocumentUpdatefinancingTypesInput> = z.object({
  set: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  push: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
}).strict();

export const EnumDocumentTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDocumentTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DocumentTypeSchema).optional()
}).strict();

export const ProjectUpdateOneRequiredWithoutDocumentsNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutDocumentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutDocumentsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDocumentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutDocumentsInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutDocumentsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutDocumentsInputSchema),z.lazy(() => ProjectUpdateWithoutDocumentsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutDocumentsInputSchema) ]).optional(),
}).strict();

export const DocumentEventUpdateManyWithoutDocumentNestedInputSchema: z.ZodType<Prisma.DocumentEventUpdateManyWithoutDocumentNestedInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DocumentEventUpsertWithWhereUniqueWithoutDocumentInputSchema),z.lazy(() => DocumentEventUpsertWithWhereUniqueWithoutDocumentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyDocumentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DocumentEventUpdateWithWhereUniqueWithoutDocumentInputSchema),z.lazy(() => DocumentEventUpdateWithWhereUniqueWithoutDocumentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DocumentEventUpdateManyWithWhereWithoutDocumentInputSchema),z.lazy(() => DocumentEventUpdateManyWithWhereWithoutDocumentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DocumentEventScalarWhereInputSchema),z.lazy(() => DocumentEventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DocumentEventUncheckedUpdateManyWithoutDocumentNestedInputSchema: z.ZodType<Prisma.DocumentEventUncheckedUpdateManyWithoutDocumentNestedInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DocumentEventUpsertWithWhereUniqueWithoutDocumentInputSchema),z.lazy(() => DocumentEventUpsertWithWhereUniqueWithoutDocumentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyDocumentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DocumentEventUpdateWithWhereUniqueWithoutDocumentInputSchema),z.lazy(() => DocumentEventUpdateWithWhereUniqueWithoutDocumentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DocumentEventUpdateManyWithWhereWithoutDocumentInputSchema),z.lazy(() => DocumentEventUpdateManyWithWhereWithoutDocumentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DocumentEventScalarWhereInputSchema),z.lazy(() => DocumentEventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DocumentCreateNestedOneWithoutDocumentEventsInputSchema: z.ZodType<Prisma.DocumentCreateNestedOneWithoutDocumentEventsInput> = z.object({
  create: z.union([ z.lazy(() => DocumentCreateWithoutDocumentEventsInputSchema),z.lazy(() => DocumentUncheckedCreateWithoutDocumentEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DocumentCreateOrConnectWithoutDocumentEventsInputSchema).optional(),
  connect: z.lazy(() => DocumentWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDocumentEventsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDocumentEventsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDocumentEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDocumentEventsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumDocumentEventTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDocumentEventTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DocumentEventTypeSchema).optional()
}).strict();

export const DocumentUpdateOneRequiredWithoutDocumentEventsNestedInputSchema: z.ZodType<Prisma.DocumentUpdateOneRequiredWithoutDocumentEventsNestedInput> = z.object({
  create: z.union([ z.lazy(() => DocumentCreateWithoutDocumentEventsInputSchema),z.lazy(() => DocumentUncheckedCreateWithoutDocumentEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DocumentCreateOrConnectWithoutDocumentEventsInputSchema).optional(),
  upsert: z.lazy(() => DocumentUpsertWithoutDocumentEventsInputSchema).optional(),
  connect: z.lazy(() => DocumentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DocumentUpdateToOneWithWhereWithoutDocumentEventsInputSchema),z.lazy(() => DocumentUpdateWithoutDocumentEventsInputSchema),z.lazy(() => DocumentUncheckedUpdateWithoutDocumentEventsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutDocumentEventsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDocumentEventsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDocumentEventsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDocumentEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDocumentEventsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutDocumentEventsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutDocumentEventsInputSchema),z.lazy(() => UserUpdateWithoutDocumentEventsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDocumentEventsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserCreateWithoutAddressInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema),z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutAddressInputSchema),z.lazy(() => OrganizationCreateWithoutAddressInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutAddressInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserCreateWithoutAddressInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema),z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUncheckedCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutAddressInputSchema),z.lazy(() => OrganizationCreateWithoutAddressInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutAddressInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateManyWithoutAddressNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserCreateWithoutAddressInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema),z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutAddressInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUpdateManyWithoutAddressNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutAddressInputSchema),z.lazy(() => OrganizationCreateWithoutAddressInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutAddressInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutAddressInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedUpdateManyWithoutAddressNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserCreateWithoutAddressInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema),z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutAddressInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUncheckedUpdateManyWithoutAddressNestedInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutAddressInputSchema),z.lazy(() => OrganizationCreateWithoutAddressInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutAddressInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutAddressInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumDealFinancingTypeNullableFilterSchema: z.ZodType<Prisma.NestedEnumDealFinancingTypeNullableFilter> = z.object({
  equals: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  in: z.lazy(() => DealFinancingTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealFinancingTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NestedEnumDealFinancingTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumDealOwnershipTypeNullableFilterSchema: z.ZodType<Prisma.NestedEnumDealOwnershipTypeNullableFilter> = z.object({
  equals: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  in: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NestedEnumDealOwnershipTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumDealFinancingTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDealFinancingTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  in: z.lazy(() => DealFinancingTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealFinancingTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NestedEnumDealFinancingTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealFinancingTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealFinancingTypeNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedEnumDealOwnershipTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDealOwnershipTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  in: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NestedEnumDealOwnershipTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealOwnershipTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealOwnershipTypeNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumDealDocumentTypeFilterSchema: z.ZodType<Prisma.NestedEnumDealDocumentTypeFilter> = z.object({
  equals: z.lazy(() => DealDocumentTypeSchema).optional(),
  in: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  notIn: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => NestedEnumDealDocumentTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDealDocumentTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDealDocumentTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealDocumentTypeSchema).optional(),
  in: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  notIn: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => NestedEnumDealDocumentTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealDocumentTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealDocumentTypeFilterSchema).optional()
}).strict();

export const NestedEnumStatusFilterSchema: z.ZodType<Prisma.NestedEnumStatusFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedEnumStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterSchema).optional()
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedEnumPictureTypeFilterSchema: z.ZodType<Prisma.NestedEnumPictureTypeFilter> = z.object({
  equals: z.lazy(() => PictureTypeSchema).optional(),
  in: z.lazy(() => PictureTypeSchema).array().optional(),
  notIn: z.lazy(() => PictureTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => NestedEnumPictureTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumPictureTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPictureTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PictureTypeSchema).optional(),
  in: z.lazy(() => PictureTypeSchema).array().optional(),
  notIn: z.lazy(() => PictureTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => NestedEnumPictureTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPictureTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPictureTypeFilterSchema).optional()
}).strict();

export const NestedEnumDocumentTypeFilterSchema: z.ZodType<Prisma.NestedEnumDocumentTypeFilter> = z.object({
  equals: z.lazy(() => DocumentTypeSchema).optional(),
  in: z.lazy(() => DocumentTypeSchema).array().optional(),
  notIn: z.lazy(() => DocumentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => NestedEnumDocumentTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDocumentTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDocumentTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DocumentTypeSchema).optional(),
  in: z.lazy(() => DocumentTypeSchema).array().optional(),
  notIn: z.lazy(() => DocumentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => NestedEnumDocumentTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDocumentTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDocumentTypeFilterSchema).optional()
}).strict();

export const NestedEnumDocumentEventTypeFilterSchema: z.ZodType<Prisma.NestedEnumDocumentEventTypeFilter> = z.object({
  equals: z.lazy(() => DocumentEventTypeSchema).optional(),
  in: z.lazy(() => DocumentEventTypeSchema).array().optional(),
  notIn: z.lazy(() => DocumentEventTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => NestedEnumDocumentEventTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDocumentEventTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDocumentEventTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DocumentEventTypeSchema).optional(),
  in: z.lazy(() => DocumentEventTypeSchema).array().optional(),
  notIn: z.lazy(() => DocumentEventTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => NestedEnumDocumentEventTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDocumentEventTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDocumentEventTypeFilterSchema).optional()
}).strict();

export const OrganizationCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutMembersInput> = z.object({
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  deals: z.lazy(() => DealCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutOrganizationInputSchema).optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutMembersInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  addressId: z.number().int().optional().nullable(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]),
}).strict();

export const DocumentEventCreateWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventCreateWithoutUserInput> = z.object({
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema),
  document: z.lazy(() => DocumentCreateNestedOneWithoutDocumentEventsInputSchema)
}).strict();

export const DocumentEventUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  documentId: z.number().int(),
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema)
}).strict();

export const DocumentEventCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => DocumentEventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const DocumentEventCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.DocumentEventCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DocumentEventCreateManyUserInputSchema),z.lazy(() => DocumentEventCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AddressCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateWithoutUserInput> = z.object({
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  organization: z.lazy(() => OrganizationCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  organization: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const OrganizationUpsertWithWhereUniqueWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpsertWithWhereUniqueWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]),
}).strict();

export const OrganizationUpdateWithWhereUniqueWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpdateWithWhereUniqueWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]),
}).strict();

export const OrganizationUpdateManyWithWhereWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithWhereWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateManyMutationInputSchema),z.lazy(() => OrganizationUncheckedUpdateManyWithoutMembersInputSchema) ]),
}).strict();

export const OrganizationScalarWhereInputSchema: z.ZodType<Prisma.OrganizationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tin: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dateOfCreation: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  juristication: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const DocumentEventUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => DocumentEventWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DocumentEventUpdateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const DocumentEventUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => DocumentEventWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DocumentEventUpdateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const DocumentEventUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => DocumentEventScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DocumentEventUpdateManyMutationInputSchema),z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const DocumentEventScalarWhereInputSchema: z.ZodType<Prisma.DocumentEventScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DocumentEventScalarWhereInputSchema),z.lazy(() => DocumentEventScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocumentEventScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocumentEventScalarWhereInputSchema),z.lazy(() => DocumentEventScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  documentId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumDocumentEventTypeFilterSchema),z.lazy(() => DocumentEventTypeSchema) ]).optional(),
}).strict();

export const AddressUpsertWithoutUserInputSchema: z.ZodType<Prisma.AddressUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => AddressUpdateWithoutUserInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => AddressWhereInputSchema).optional()
}).strict();

export const AddressUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AddressUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AddressWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AddressUpdateWithoutUserInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AddressUpdateWithoutUserInputSchema: z.ZodType<Prisma.AddressUpdateWithoutUserInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUncheckedUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const ProjectCreateWithoutDealsInputSchema: z.ZodType<Prisma.ProjectCreateWithoutDealsInput> = z.object({
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  buildingAvgRent: z.number().int().optional(),
  buildingAvgUnitSize: z.number().int().optional(),
  buildingCommSqFt: z.number().int().optional(),
  buildingUnits: z.number().int().optional(),
  debtInterestRate: z.string().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonths: z.number().int().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  preferredReturn: z.string().optional(),
  targetEquityMultiple: z.number().optional(),
  slug: z.string().optional().nullable(),
  documents: z.lazy(() => DocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesCreateNestedManyWithoutProjectInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutDealsInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutDealsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  buildingAvgRent: z.number().int().optional(),
  buildingAvgUnitSize: z.number().int().optional(),
  buildingCommSqFt: z.number().int().optional(),
  buildingUnits: z.number().int().optional(),
  debtInterestRate: z.string().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonths: z.number().int().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  preferredReturn: z.string().optional(),
  targetEquityMultiple: z.number().optional(),
  slug: z.string().optional().nullable(),
  documents: z.lazy(() => DocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutDealsInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutDealsInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDealsInputSchema) ]),
}).strict();

export const AccreditationVerifierCreateWithoutDealsInputSchema: z.ZodType<Prisma.AccreditationVerifierCreateWithoutDealsInput> = z.object({
  firstName: z.string(),
  lastName: z.string(),
  title: z.string(),
  phoneNumber: z.string()
}).strict();

export const AccreditationVerifierUncheckedCreateWithoutDealsInputSchema: z.ZodType<Prisma.AccreditationVerifierUncheckedCreateWithoutDealsInput> = z.object({
  id: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  title: z.string(),
  phoneNumber: z.string()
}).strict();

export const AccreditationVerifierCreateOrConnectWithoutDealsInputSchema: z.ZodType<Prisma.AccreditationVerifierCreateOrConnectWithoutDealsInput> = z.object({
  where: z.lazy(() => AccreditationVerifierWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccreditationVerifierCreateWithoutDealsInputSchema),z.lazy(() => AccreditationVerifierUncheckedCreateWithoutDealsInputSchema) ]),
}).strict();

export const DealDocumentCreateWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentCreateWithoutDealInput> = z.object({
  name: z.string(),
  link: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema)
}).strict();

export const DealDocumentUncheckedCreateWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUncheckedCreateWithoutDealInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  link: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema)
}).strict();

export const DealDocumentCreateOrConnectWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentCreateOrConnectWithoutDealInput> = z.object({
  where: z.lazy(() => DealDocumentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutDealInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema) ]),
}).strict();

export const DealDocumentCreateManyDealInputEnvelopeSchema: z.ZodType<Prisma.DealDocumentCreateManyDealInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DealDocumentCreateManyDealInputSchema),z.lazy(() => DealDocumentCreateManyDealInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationCreateWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutDealsInput> = z.object({
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  members: z.lazy(() => UserCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutOrganizationInputSchema).optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutDealsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  addressId: z.number().int().optional().nullable(),
  members: z.lazy(() => UserUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutDealsInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDealsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDealsInputSchema) ]),
}).strict();

export const ProjectUpsertWithoutDealsInputSchema: z.ZodType<Prisma.ProjectUpsertWithoutDealsInput> = z.object({
  update: z.union([ z.lazy(() => ProjectUpdateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutDealsInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectCreateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDealsInputSchema) ]),
  where: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const ProjectUpdateToOneWithWhereWithoutDealsInputSchema: z.ZodType<Prisma.ProjectUpdateToOneWithWhereWithoutDealsInput> = z.object({
  where: z.lazy(() => ProjectWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectUpdateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutDealsInputSchema) ]),
}).strict();

export const ProjectUpdateWithoutDealsInputSchema: z.ZodType<Prisma.ProjectUpdateWithoutDealsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  documents: z.lazy(() => DocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUpdateManyWithoutProjectNestedInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutDealsInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutDealsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  documents: z.lazy(() => DocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const AccreditationVerifierUpsertWithoutDealsInputSchema: z.ZodType<Prisma.AccreditationVerifierUpsertWithoutDealsInput> = z.object({
  update: z.union([ z.lazy(() => AccreditationVerifierUpdateWithoutDealsInputSchema),z.lazy(() => AccreditationVerifierUncheckedUpdateWithoutDealsInputSchema) ]),
  create: z.union([ z.lazy(() => AccreditationVerifierCreateWithoutDealsInputSchema),z.lazy(() => AccreditationVerifierUncheckedCreateWithoutDealsInputSchema) ]),
  where: z.lazy(() => AccreditationVerifierWhereInputSchema).optional()
}).strict();

export const AccreditationVerifierUpdateToOneWithWhereWithoutDealsInputSchema: z.ZodType<Prisma.AccreditationVerifierUpdateToOneWithWhereWithoutDealsInput> = z.object({
  where: z.lazy(() => AccreditationVerifierWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AccreditationVerifierUpdateWithoutDealsInputSchema),z.lazy(() => AccreditationVerifierUncheckedUpdateWithoutDealsInputSchema) ]),
}).strict();

export const AccreditationVerifierUpdateWithoutDealsInputSchema: z.ZodType<Prisma.AccreditationVerifierUpdateWithoutDealsInput> = z.object({
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccreditationVerifierUncheckedUpdateWithoutDealsInputSchema: z.ZodType<Prisma.AccreditationVerifierUncheckedUpdateWithoutDealsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealDocumentUpsertWithWhereUniqueWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUpsertWithWhereUniqueWithoutDealInput> = z.object({
  where: z.lazy(() => DealDocumentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DealDocumentUpdateWithoutDealInputSchema),z.lazy(() => DealDocumentUncheckedUpdateWithoutDealInputSchema) ]),
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutDealInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema) ]),
}).strict();

export const DealDocumentUpdateWithWhereUniqueWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUpdateWithWhereUniqueWithoutDealInput> = z.object({
  where: z.lazy(() => DealDocumentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DealDocumentUpdateWithoutDealInputSchema),z.lazy(() => DealDocumentUncheckedUpdateWithoutDealInputSchema) ]),
}).strict();

export const DealDocumentUpdateManyWithWhereWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUpdateManyWithWhereWithoutDealInput> = z.object({
  where: z.lazy(() => DealDocumentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DealDocumentUpdateManyMutationInputSchema),z.lazy(() => DealDocumentUncheckedUpdateManyWithoutDealInputSchema) ]),
}).strict();

export const DealDocumentScalarWhereInputSchema: z.ZodType<Prisma.DealDocumentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DealDocumentScalarWhereInputSchema),z.lazy(() => DealDocumentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealDocumentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealDocumentScalarWhereInputSchema),z.lazy(() => DealDocumentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDealDocumentTypeFilterSchema),z.lazy(() => DealDocumentTypeSchema) ]).optional(),
  dealId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const OrganizationUpsertWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutDealsInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutDealsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutDealsInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDealsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDealsInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutDealsInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutDealsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutDealsInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutDealsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  members: z.lazy(() => UserUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutDealsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  members: z.lazy(() => UserUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserCreateWithoutOrganizationInput> = z.object({
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  organizationId: z.number().int(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  addressId: z.number().int().optional().nullable(),
  ssn: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  organizationId: z.number().int(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const DealCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.DealCreateWithoutOrganizationInput> = z.object({
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema),
  AccreditationVerifier: z.lazy(() => AccreditationVerifierCreateNestedOneWithoutDealsInputSchema).optional(),
  document: z.lazy(() => DealDocumentCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  accreditationVerifierId: z.number().int().optional().nullable(),
  document: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.DealCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealCreateWithoutOrganizationInputSchema),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const DealCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.DealCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DealCreateManyOrganizationInputSchema),z.lazy(() => DealCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationDocumentCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateWithoutOrganizationInput> = z.object({
  name: z.string(),
  link: z.string()
}).strict();

export const OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  link: z.string()
}).strict();

export const OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationDocumentCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.OrganizationDocumentCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationDocumentCreateManyOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AddressCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressCreateWithoutOrganizationInput> = z.object({
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  user: z.lazy(() => UserCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  user: z.lazy(() => UserUncheckedCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const UserUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const UserUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrganizationInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const UserUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema),z.lazy(() => UserUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const UserScalarWhereInputSchema: z.ZodType<Prisma.UserScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const DealUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DealUpdateWithoutOrganizationInputSchema),z.lazy(() => DealUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => DealCreateWithoutOrganizationInputSchema),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const DealUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DealUpdateWithoutOrganizationInputSchema),z.lazy(() => DealUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const DealUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => DealScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DealUpdateManyMutationInputSchema),z.lazy(() => DealUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const DealScalarWhereInputSchema: z.ZodType<Prisma.DealScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  financingType: z.union([ z.lazy(() => EnumDealFinancingTypeNullableFilterSchema),z.lazy(() => DealFinancingTypeSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transactionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  numberAUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  numberCUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeNullableFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accreditationVerifierId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const OrganizationDocumentUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationDocumentUpdateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationDocumentUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationDocumentUpdateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationDocumentUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationDocumentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationDocumentUpdateManyMutationInputSchema),z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationDocumentScalarWhereInputSchema: z.ZodType<Prisma.OrganizationDocumentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationDocumentScalarWhereInputSchema),z.lazy(() => OrganizationDocumentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationDocumentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationDocumentScalarWhereInputSchema),z.lazy(() => OrganizationDocumentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const AddressUpsertWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressUpsertWithoutOrganizationInput> = z.object({
  update: z.union([ z.lazy(() => AddressUpdateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => AddressCreateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrganizationInputSchema) ]),
  where: z.lazy(() => AddressWhereInputSchema).optional()
}).strict();

export const AddressUpdateToOneWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressUpdateToOneWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => AddressWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AddressUpdateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const AddressUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressUpdateWithoutOrganizationInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUncheckedUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const DealCreateWithoutAccreditationVerifierInputSchema: z.ZodType<Prisma.DealCreateWithoutAccreditationVerifierInput> = z.object({
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema),
  document: z.lazy(() => DealDocumentCreateNestedManyWithoutDealInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDealsInputSchema)
}).strict();

export const DealUncheckedCreateWithoutAccreditationVerifierInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutAccreditationVerifierInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  organizationId: z.number().int(),
  document: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealCreateOrConnectWithoutAccreditationVerifierInputSchema: z.ZodType<Prisma.DealCreateOrConnectWithoutAccreditationVerifierInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealCreateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerifierInputSchema) ]),
}).strict();

export const DealCreateManyAccreditationVerifierInputEnvelopeSchema: z.ZodType<Prisma.DealCreateManyAccreditationVerifierInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DealCreateManyAccreditationVerifierInputSchema),z.lazy(() => DealCreateManyAccreditationVerifierInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DealUpsertWithWhereUniqueWithoutAccreditationVerifierInputSchema: z.ZodType<Prisma.DealUpsertWithWhereUniqueWithoutAccreditationVerifierInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DealUpdateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUncheckedUpdateWithoutAccreditationVerifierInputSchema) ]),
  create: z.union([ z.lazy(() => DealCreateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerifierInputSchema) ]),
}).strict();

export const DealUpdateWithWhereUniqueWithoutAccreditationVerifierInputSchema: z.ZodType<Prisma.DealUpdateWithWhereUniqueWithoutAccreditationVerifierInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DealUpdateWithoutAccreditationVerifierInputSchema),z.lazy(() => DealUncheckedUpdateWithoutAccreditationVerifierInputSchema) ]),
}).strict();

export const DealUpdateManyWithWhereWithoutAccreditationVerifierInputSchema: z.ZodType<Prisma.DealUpdateManyWithWhereWithoutAccreditationVerifierInput> = z.object({
  where: z.lazy(() => DealScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DealUpdateManyMutationInputSchema),z.lazy(() => DealUncheckedUpdateManyWithoutAccreditationVerifierInputSchema) ]),
}).strict();

export const DealCreateWithoutDocumentInputSchema: z.ZodType<Prisma.DealCreateWithoutDocumentInput> = z.object({
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema),
  AccreditationVerifier: z.lazy(() => AccreditationVerifierCreateNestedOneWithoutDealsInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDealsInputSchema)
}).strict();

export const DealUncheckedCreateWithoutDocumentInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutDocumentInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  accreditationVerifierId: z.number().int().optional().nullable(),
  organizationId: z.number().int()
}).strict();

export const DealCreateOrConnectWithoutDocumentInputSchema: z.ZodType<Prisma.DealCreateOrConnectWithoutDocumentInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealCreateWithoutDocumentInputSchema),z.lazy(() => DealUncheckedCreateWithoutDocumentInputSchema) ]),
}).strict();

export const DealUpsertWithoutDocumentInputSchema: z.ZodType<Prisma.DealUpsertWithoutDocumentInput> = z.object({
  update: z.union([ z.lazy(() => DealUpdateWithoutDocumentInputSchema),z.lazy(() => DealUncheckedUpdateWithoutDocumentInputSchema) ]),
  create: z.union([ z.lazy(() => DealCreateWithoutDocumentInputSchema),z.lazy(() => DealUncheckedCreateWithoutDocumentInputSchema) ]),
  where: z.lazy(() => DealWhereInputSchema).optional()
}).strict();

export const DealUpdateToOneWithWhereWithoutDocumentInputSchema: z.ZodType<Prisma.DealUpdateToOneWithWhereWithoutDocumentInput> = z.object({
  where: z.lazy(() => DealWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DealUpdateWithoutDocumentInputSchema),z.lazy(() => DealUncheckedUpdateWithoutDocumentInputSchema) ]),
}).strict();

export const DealUpdateWithoutDocumentInputSchema: z.ZodType<Prisma.DealUpdateWithoutDocumentInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  AccreditationVerifier: z.lazy(() => AccreditationVerifierUpdateOneWithoutDealsNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutDocumentInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutDocumentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerifierId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutDocumentInput> = z.object({
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  members: z.lazy(() => UserCreateNestedManyWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealCreateNestedManyWithoutOrganizationInputSchema).optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutDocumentInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  addressId: z.number().int().optional().nullable(),
  members: z.lazy(() => UserUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutDocumentInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDocumentInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDocumentInputSchema) ]),
}).strict();

export const OrganizationUpsertWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutDocumentInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutDocumentInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutDocumentInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDocumentInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDocumentInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutDocumentInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutDocumentInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutDocumentInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutDocumentInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  members: z.lazy(() => UserUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutDocumentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  members: z.lazy(() => UserUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const DealCreateWithoutProjectInputSchema: z.ZodType<Prisma.DealCreateWithoutProjectInput> = z.object({
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  AccreditationVerifier: z.lazy(() => AccreditationVerifierCreateNestedOneWithoutDealsInputSchema).optional(),
  document: z.lazy(() => DealDocumentCreateNestedManyWithoutDealInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDealsInputSchema)
}).strict();

export const DealUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  accreditationVerifierId: z.number().int().optional().nullable(),
  organizationId: z.number().int(),
  document: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.DealCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealCreateWithoutProjectInputSchema),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const DealCreateManyProjectInputEnvelopeSchema: z.ZodType<Prisma.DealCreateManyProjectInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DealCreateManyProjectInputSchema),z.lazy(() => DealCreateManyProjectInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DocumentCreateWithoutProjectInputSchema: z.ZodType<Prisma.DocumentCreateWithoutProjectInput> = z.object({
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutDocumentInputSchema).optional()
}).strict();

export const DocumentUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutDocumentInputSchema).optional()
}).strict();

export const DocumentCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.DocumentCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => DocumentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DocumentCreateWithoutProjectInputSchema),z.lazy(() => DocumentUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const DocumentCreateManyProjectInputEnvelopeSchema: z.ZodType<Prisma.DocumentCreateManyProjectInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DocumentCreateManyProjectInputSchema),z.lazy(() => DocumentCreateManyProjectInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PicturesCreateWithoutProjectInputSchema: z.ZodType<Prisma.PicturesCreateWithoutProjectInput> = z.object({
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema)
}).strict();

export const PicturesUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.PicturesUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema)
}).strict();

export const PicturesCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.PicturesCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => PicturesWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PicturesCreateWithoutProjectInputSchema),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const PicturesCreateManyProjectInputEnvelopeSchema: z.ZodType<Prisma.PicturesCreateManyProjectInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PicturesCreateManyProjectInputSchema),z.lazy(() => PicturesCreateManyProjectInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProjectMilestonesCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectMilestonesCreateWithoutProjectInput> = z.object({
  equityContribution: z.coerce.date(),
  financialClosing: z.coerce.date(),
  groundBreakingCeremony: z.coerce.date().optional().nullable(),
  startVerticalConstruction: z.coerce.date().optional().nullable(),
  toppingOut: z.coerce.date().optional().nullable(),
  preLeasing: z.coerce.date().optional().nullable(),
  fullEnclosure: z.coerce.date().optional().nullable(),
  temporaryOccupancy: z.coerce.date(),
  grandOpening: z.coerce.date(),
  stabilized: z.coerce.date(),
  refinance: z.coerce.date(),
  sale: z.coerce.date()
}).strict();

export const ProjectMilestonesUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectMilestonesUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  equityContribution: z.coerce.date(),
  financialClosing: z.coerce.date(),
  groundBreakingCeremony: z.coerce.date().optional().nullable(),
  startVerticalConstruction: z.coerce.date().optional().nullable(),
  toppingOut: z.coerce.date().optional().nullable(),
  preLeasing: z.coerce.date().optional().nullable(),
  fullEnclosure: z.coerce.date().optional().nullable(),
  temporaryOccupancy: z.coerce.date(),
  grandOpening: z.coerce.date(),
  stabilized: z.coerce.date(),
  refinance: z.coerce.date(),
  sale: z.coerce.date()
}).strict();

export const ProjectMilestonesCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.ProjectMilestonesCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectMilestonesWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectMilestonesCreateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const DealUpsertWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.DealUpsertWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DealUpdateWithoutProjectInputSchema),z.lazy(() => DealUncheckedUpdateWithoutProjectInputSchema) ]),
  create: z.union([ z.lazy(() => DealCreateWithoutProjectInputSchema),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const DealUpdateWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.DealUpdateWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DealUpdateWithoutProjectInputSchema),z.lazy(() => DealUncheckedUpdateWithoutProjectInputSchema) ]),
}).strict();

export const DealUpdateManyWithWhereWithoutProjectInputSchema: z.ZodType<Prisma.DealUpdateManyWithWhereWithoutProjectInput> = z.object({
  where: z.lazy(() => DealScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DealUpdateManyMutationInputSchema),z.lazy(() => DealUncheckedUpdateManyWithoutProjectInputSchema) ]),
}).strict();

export const DocumentUpsertWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUpsertWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => DocumentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DocumentUpdateWithoutProjectInputSchema),z.lazy(() => DocumentUncheckedUpdateWithoutProjectInputSchema) ]),
  create: z.union([ z.lazy(() => DocumentCreateWithoutProjectInputSchema),z.lazy(() => DocumentUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const DocumentUpdateWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUpdateWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => DocumentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DocumentUpdateWithoutProjectInputSchema),z.lazy(() => DocumentUncheckedUpdateWithoutProjectInputSchema) ]),
}).strict();

export const DocumentUpdateManyWithWhereWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUpdateManyWithWhereWithoutProjectInput> = z.object({
  where: z.lazy(() => DocumentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DocumentUpdateManyMutationInputSchema),z.lazy(() => DocumentUncheckedUpdateManyWithoutProjectInputSchema) ]),
}).strict();

export const DocumentScalarWhereInputSchema: z.ZodType<Prisma.DocumentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DocumentScalarWhereInputSchema),z.lazy(() => DocumentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocumentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocumentScalarWhereInputSchema),z.lazy(() => DocumentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  fileName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  financingTypes: z.lazy(() => EnumDealFinancingTypeNullableListFilterSchema).optional(),
  documentType: z.union([ z.lazy(() => EnumDocumentTypeFilterSchema),z.lazy(() => DocumentTypeSchema) ]).optional(),
  docusignTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const PicturesUpsertWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.PicturesUpsertWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => PicturesWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PicturesUpdateWithoutProjectInputSchema),z.lazy(() => PicturesUncheckedUpdateWithoutProjectInputSchema) ]),
  create: z.union([ z.lazy(() => PicturesCreateWithoutProjectInputSchema),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const PicturesUpdateWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.PicturesUpdateWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => PicturesWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PicturesUpdateWithoutProjectInputSchema),z.lazy(() => PicturesUncheckedUpdateWithoutProjectInputSchema) ]),
}).strict();

export const PicturesUpdateManyWithWhereWithoutProjectInputSchema: z.ZodType<Prisma.PicturesUpdateManyWithWhereWithoutProjectInput> = z.object({
  where: z.lazy(() => PicturesScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PicturesUpdateManyMutationInputSchema),z.lazy(() => PicturesUncheckedUpdateManyWithoutProjectInputSchema) ]),
}).strict();

export const PicturesScalarWhereInputSchema: z.ZodType<Prisma.PicturesScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PicturesScalarWhereInputSchema),z.lazy(() => PicturesScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PicturesScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PicturesScalarWhereInputSchema),z.lazy(() => PicturesScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumPictureTypeFilterSchema),z.lazy(() => PictureTypeSchema) ]).optional(),
}).strict();

export const ProjectMilestonesUpsertWithoutProjectInputSchema: z.ZodType<Prisma.ProjectMilestonesUpsertWithoutProjectInput> = z.object({
  update: z.union([ z.lazy(() => ProjectMilestonesUpdateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedUpdateWithoutProjectInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectMilestonesCreateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedCreateWithoutProjectInputSchema) ]),
  where: z.lazy(() => ProjectMilestonesWhereInputSchema).optional()
}).strict();

export const ProjectMilestonesUpdateToOneWithWhereWithoutProjectInputSchema: z.ZodType<Prisma.ProjectMilestonesUpdateToOneWithWhereWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectMilestonesWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectMilestonesUpdateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedUpdateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectMilestonesUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectMilestonesUpdateWithoutProjectInput> = z.object({
  equityContribution: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  financialClosing: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  groundBreakingCeremony: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startVerticalConstruction: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toppingOut: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preLeasing: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullEnclosure: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temporaryOccupancy: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  grandOpening: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  stabilized: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refinance: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sale: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectMilestonesUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectMilestonesUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityContribution: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  financialClosing: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  groundBreakingCeremony: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startVerticalConstruction: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toppingOut: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preLeasing: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullEnclosure: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temporaryOccupancy: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  grandOpening: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  stabilized: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  refinance: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sale: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectCreateWithoutProjectMilestonesInputSchema: z.ZodType<Prisma.ProjectCreateWithoutProjectMilestonesInput> = z.object({
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  buildingAvgRent: z.number().int().optional(),
  buildingAvgUnitSize: z.number().int().optional(),
  buildingCommSqFt: z.number().int().optional(),
  buildingUnits: z.number().int().optional(),
  debtInterestRate: z.string().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonths: z.number().int().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  preferredReturn: z.string().optional(),
  targetEquityMultiple: z.number().optional(),
  slug: z.string().optional().nullable(),
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutProjectMilestonesInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutProjectMilestonesInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  buildingAvgRent: z.number().int().optional(),
  buildingAvgUnitSize: z.number().int().optional(),
  buildingCommSqFt: z.number().int().optional(),
  buildingUnits: z.number().int().optional(),
  debtInterestRate: z.string().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonths: z.number().int().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  preferredReturn: z.string().optional(),
  targetEquityMultiple: z.number().optional(),
  slug: z.string().optional().nullable(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutProjectMilestonesInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutProjectMilestonesInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutProjectMilestonesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutProjectMilestonesInputSchema) ]),
}).strict();

export const ProjectUpsertWithoutProjectMilestonesInputSchema: z.ZodType<Prisma.ProjectUpsertWithoutProjectMilestonesInput> = z.object({
  update: z.union([ z.lazy(() => ProjectUpdateWithoutProjectMilestonesInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutProjectMilestonesInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectCreateWithoutProjectMilestonesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutProjectMilestonesInputSchema) ]),
  where: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const ProjectUpdateToOneWithWhereWithoutProjectMilestonesInputSchema: z.ZodType<Prisma.ProjectUpdateToOneWithWhereWithoutProjectMilestonesInput> = z.object({
  where: z.lazy(() => ProjectWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectUpdateWithoutProjectMilestonesInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutProjectMilestonesInputSchema) ]),
}).strict();

export const ProjectUpdateWithoutProjectMilestonesInputSchema: z.ZodType<Prisma.ProjectUpdateWithoutProjectMilestonesInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutProjectMilestonesInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutProjectMilestonesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectCreateWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectCreateWithoutPicturesInput> = z.object({
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  buildingAvgRent: z.number().int().optional(),
  buildingAvgUnitSize: z.number().int().optional(),
  buildingCommSqFt: z.number().int().optional(),
  buildingUnits: z.number().int().optional(),
  debtInterestRate: z.string().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonths: z.number().int().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  preferredReturn: z.string().optional(),
  targetEquityMultiple: z.number().optional(),
  slug: z.string().optional().nullable(),
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutPicturesInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  buildingAvgRent: z.number().int().optional(),
  buildingAvgUnitSize: z.number().int().optional(),
  buildingCommSqFt: z.number().int().optional(),
  buildingUnits: z.number().int().optional(),
  debtInterestRate: z.string().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonths: z.number().int().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  preferredReturn: z.string().optional(),
  targetEquityMultiple: z.number().optional(),
  slug: z.string().optional().nullable(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutPicturesInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutPicturesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutPicturesInputSchema) ]),
}).strict();

export const ProjectUpsertWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectUpsertWithoutPicturesInput> = z.object({
  update: z.union([ z.lazy(() => ProjectUpdateWithoutPicturesInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutPicturesInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectCreateWithoutPicturesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutPicturesInputSchema) ]),
  where: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const ProjectUpdateToOneWithWhereWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectUpdateToOneWithWhereWithoutPicturesInput> = z.object({
  where: z.lazy(() => ProjectWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectUpdateWithoutPicturesInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutPicturesInputSchema) ]),
}).strict();

export const ProjectUpdateWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectUpdateWithoutPicturesInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutPicturesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectCreateWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectCreateWithoutDocumentsInput> = z.object({
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  buildingAvgRent: z.number().int().optional(),
  buildingAvgUnitSize: z.number().int().optional(),
  buildingCommSqFt: z.number().int().optional(),
  buildingUnits: z.number().int().optional(),
  debtInterestRate: z.string().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonths: z.number().int().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  preferredReturn: z.string().optional(),
  targetEquityMultiple: z.number().optional(),
  slug: z.string().optional().nullable(),
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesCreateNestedManyWithoutProjectInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutDocumentsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  buildingAvgRent: z.number().int().optional(),
  buildingAvgUnitSize: z.number().int().optional(),
  buildingCommSqFt: z.number().int().optional(),
  buildingUnits: z.number().int().optional(),
  debtInterestRate: z.string().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonths: z.number().int().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  preferredReturn: z.string().optional(),
  targetEquityMultiple: z.number().optional(),
  slug: z.string().optional().nullable(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutDocumentsInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutDocumentsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDocumentsInputSchema) ]),
}).strict();

export const DocumentEventCreateWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventCreateWithoutDocumentInput> = z.object({
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutDocumentEventsInputSchema)
}).strict();

export const DocumentEventUncheckedCreateWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventUncheckedCreateWithoutDocumentInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema)
}).strict();

export const DocumentEventCreateOrConnectWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventCreateOrConnectWithoutDocumentInput> = z.object({
  where: z.lazy(() => DocumentEventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema) ]),
}).strict();

export const DocumentEventCreateManyDocumentInputEnvelopeSchema: z.ZodType<Prisma.DocumentEventCreateManyDocumentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DocumentEventCreateManyDocumentInputSchema),z.lazy(() => DocumentEventCreateManyDocumentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProjectUpsertWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectUpsertWithoutDocumentsInput> = z.object({
  update: z.union([ z.lazy(() => ProjectUpdateWithoutDocumentsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutDocumentsInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectCreateWithoutDocumentsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDocumentsInputSchema) ]),
  where: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const ProjectUpdateToOneWithWhereWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectUpdateToOneWithWhereWithoutDocumentsInput> = z.object({
  where: z.lazy(() => ProjectWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectUpdateWithoutDocumentsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutDocumentsInputSchema) ]),
}).strict();

export const ProjectUpdateWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectUpdateWithoutDocumentsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUpdateManyWithoutProjectNestedInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutDocumentsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingAvgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingCommSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  buildingUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRate: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  preferredReturn: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  projectMilestones: z.lazy(() => ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const DocumentEventUpsertWithWhereUniqueWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventUpsertWithWhereUniqueWithoutDocumentInput> = z.object({
  where: z.lazy(() => DocumentEventWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DocumentEventUpdateWithoutDocumentInputSchema),z.lazy(() => DocumentEventUncheckedUpdateWithoutDocumentInputSchema) ]),
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema) ]),
}).strict();

export const DocumentEventUpdateWithWhereUniqueWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventUpdateWithWhereUniqueWithoutDocumentInput> = z.object({
  where: z.lazy(() => DocumentEventWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DocumentEventUpdateWithoutDocumentInputSchema),z.lazy(() => DocumentEventUncheckedUpdateWithoutDocumentInputSchema) ]),
}).strict();

export const DocumentEventUpdateManyWithWhereWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventUpdateManyWithWhereWithoutDocumentInput> = z.object({
  where: z.lazy(() => DocumentEventScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DocumentEventUpdateManyMutationInputSchema),z.lazy(() => DocumentEventUncheckedUpdateManyWithoutDocumentInputSchema) ]),
}).strict();

export const DocumentCreateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.DocumentCreateWithoutDocumentEventsInput> = z.object({
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDocumentsInputSchema)
}).strict();

export const DocumentUncheckedCreateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.DocumentUncheckedCreateWithoutDocumentEventsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable()
}).strict();

export const DocumentCreateOrConnectWithoutDocumentEventsInputSchema: z.ZodType<Prisma.DocumentCreateOrConnectWithoutDocumentEventsInput> = z.object({
  where: z.lazy(() => DocumentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DocumentCreateWithoutDocumentEventsInputSchema),z.lazy(() => DocumentUncheckedCreateWithoutDocumentEventsInputSchema) ]),
}).strict();

export const UserCreateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserCreateWithoutDocumentEventsInput> = z.object({
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  organizationId: z.number().int(),
  organization: z.lazy(() => OrganizationCreateNestedManyWithoutMembersInputSchema).optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDocumentEventsInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  addressId: z.number().int().optional().nullable(),
  ssn: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  organizationId: z.number().int(),
  organization: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutMembersInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDocumentEventsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutDocumentEventsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDocumentEventsInputSchema) ]),
}).strict();

export const DocumentUpsertWithoutDocumentEventsInputSchema: z.ZodType<Prisma.DocumentUpsertWithoutDocumentEventsInput> = z.object({
  update: z.union([ z.lazy(() => DocumentUpdateWithoutDocumentEventsInputSchema),z.lazy(() => DocumentUncheckedUpdateWithoutDocumentEventsInputSchema) ]),
  create: z.union([ z.lazy(() => DocumentCreateWithoutDocumentEventsInputSchema),z.lazy(() => DocumentUncheckedCreateWithoutDocumentEventsInputSchema) ]),
  where: z.lazy(() => DocumentWhereInputSchema).optional()
}).strict();

export const DocumentUpdateToOneWithWhereWithoutDocumentEventsInputSchema: z.ZodType<Prisma.DocumentUpdateToOneWithWhereWithoutDocumentEventsInput> = z.object({
  where: z.lazy(() => DocumentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DocumentUpdateWithoutDocumentEventsInputSchema),z.lazy(() => DocumentUncheckedUpdateWithoutDocumentEventsInputSchema) ]),
}).strict();

export const DocumentUpdateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.DocumentUpdateWithoutDocumentEventsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDocumentsNestedInputSchema).optional()
}).strict();

export const DocumentUncheckedUpdateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.DocumentUncheckedUpdateWithoutDocumentEventsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUpsertWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserUpsertWithoutDocumentEventsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutDocumentEventsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDocumentEventsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutDocumentEventsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDocumentEventsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDocumentEventsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutDocumentEventsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDocumentEventsInputSchema) ]),
}).strict();

export const UserUpdateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserUpdateWithoutDocumentEventsInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateManyWithoutMembersNestedInputSchema).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDocumentEventsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUncheckedUpdateManyWithoutMembersNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateWithoutAddressInput> = z.object({
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  organizationId: z.number().int(),
  organization: z.lazy(() => OrganizationCreateNestedManyWithoutMembersInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAddressInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAddressInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  organizationId: z.number().int(),
  organization: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutMembersInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAddressInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const UserCreateManyAddressInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyAddressInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserCreateManyAddressInputSchema),z.lazy(() => UserCreateManyAddressInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationCreateWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutAddressInput> = z.object({
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  members: z.lazy(() => UserCreateNestedManyWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutAddressInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  members: z.lazy(() => UserUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutAddressInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const OrganizationCreateManyAddressInputEnvelopeSchema: z.ZodType<Prisma.OrganizationCreateManyAddressInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationCreateManyAddressInputSchema),z.lazy(() => OrganizationCreateManyAddressInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithWhereUniqueWithoutAddressInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutAddressInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutAddressInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAddressInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const UserUpdateWithWhereUniqueWithoutAddressInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutAddressInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutAddressInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAddressInputSchema) ]),
}).strict();

export const UserUpdateManyWithWhereWithoutAddressInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutAddressInput> = z.object({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema),z.lazy(() => UserUncheckedUpdateManyWithoutAddressInputSchema) ]),
}).strict();

export const OrganizationUpsertWithWhereUniqueWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUpsertWithWhereUniqueWithoutAddressInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutAddressInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const OrganizationUpdateWithWhereUniqueWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUpdateWithWhereUniqueWithoutAddressInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutAddressInputSchema) ]),
}).strict();

export const OrganizationUpdateManyWithWhereWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithWhereWithoutAddressInput> = z.object({
  where: z.lazy(() => OrganizationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateManyMutationInputSchema),z.lazy(() => OrganizationUncheckedUpdateManyWithoutAddressInputSchema) ]),
}).strict();

export const DocumentEventCreateManyUserInputSchema: z.ZodType<Prisma.DocumentEventCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  documentId: z.number().int(),
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema)
}).strict();

export const OrganizationUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutMembersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateManyWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutMembersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DocumentEventUpdateWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventUpdateWithoutUserInput> = z.object({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => EnumDocumentEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  document: z.lazy(() => DocumentUpdateOneRequiredWithoutDocumentEventsNestedInputSchema).optional()
}).strict();

export const DocumentEventUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  documentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => EnumDocumentEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocumentEventUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  documentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => EnumDocumentEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealDocumentCreateManyDealInputSchema: z.ZodType<Prisma.DealDocumentCreateManyDealInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  link: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema)
}).strict();

export const DealDocumentUpdateWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUpdateWithoutDealInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealDocumentUncheckedUpdateWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateWithoutDealInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealDocumentUncheckedUpdateManyWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateManyWithoutDealInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealCreateManyOrganizationInputSchema: z.ZodType<Prisma.DealCreateManyOrganizationInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  accreditationVerifierId: z.number().int().optional().nullable()
}).strict();

export const OrganizationDocumentCreateManyOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateManyOrganizationInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  link: z.string()
}).strict();

export const UserUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrganizationInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUpdateWithoutOrganizationInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  AccreditationVerifier: z.lazy(() => AccreditationVerifierUpdateOneWithoutDealsNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerifierId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  document: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerifierId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrganizationDocumentUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateWithoutOrganizationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealCreateManyAccreditationVerifierInputSchema: z.ZodType<Prisma.DealCreateManyAccreditationVerifierInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  organizationId: z.number().int()
}).strict();

export const DealUpdateWithoutAccreditationVerifierInputSchema: z.ZodType<Prisma.DealUpdateWithoutAccreditationVerifierInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUpdateManyWithoutDealNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutAccreditationVerifierInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutAccreditationVerifierInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  document: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateManyWithoutAccreditationVerifierInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyWithoutAccreditationVerifierInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealCreateManyProjectInputSchema: z.ZodType<Prisma.DealCreateManyProjectInput> = z.object({
  id: z.number().int().optional(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  accreditationVerifierId: z.number().int().optional().nullable(),
  organizationId: z.number().int()
}).strict();

export const DocumentCreateManyProjectInputSchema: z.ZodType<Prisma.DocumentCreateManyProjectInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable()
}).strict();

export const PicturesCreateManyProjectInputSchema: z.ZodType<Prisma.PicturesCreateManyProjectInput> = z.object({
  id: z.number().int().optional(),
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema)
}).strict();

export const DealUpdateWithoutProjectInputSchema: z.ZodType<Prisma.DealUpdateWithoutProjectInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  AccreditationVerifier: z.lazy(() => AccreditationVerifierUpdateOneWithoutDealsNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUpdateManyWithoutDealNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerifierId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  document: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateManyWithoutProjectInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerifierId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocumentUpdateWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUpdateWithoutProjectInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutDocumentNestedInputSchema).optional()
}).strict();

export const DocumentUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutDocumentNestedInputSchema).optional()
}).strict();

export const DocumentUncheckedUpdateManyWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUncheckedUpdateManyWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PicturesUpdateWithoutProjectInputSchema: z.ZodType<Prisma.PicturesUpdateWithoutProjectInput> = z.object({
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PicturesUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.PicturesUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PicturesUncheckedUpdateManyWithoutProjectInputSchema: z.ZodType<Prisma.PicturesUncheckedUpdateManyWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocumentEventCreateManyDocumentInputSchema: z.ZodType<Prisma.DocumentEventCreateManyDocumentInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema)
}).strict();

export const DocumentEventUpdateWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventUpdateWithoutDocumentInput> = z.object({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => EnumDocumentEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDocumentEventsNestedInputSchema).optional()
}).strict();

export const DocumentEventUncheckedUpdateWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventUncheckedUpdateWithoutDocumentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => EnumDocumentEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocumentEventUncheckedUpdateManyWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventUncheckedUpdateManyWithoutDocumentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => EnumDocumentEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateManyAddressInputSchema: z.ZodType<Prisma.UserCreateManyAddressInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  organizationId: z.number().int()
}).strict();

export const OrganizationCreateManyAddressInputSchema: z.ZodType<Prisma.OrganizationCreateManyAddressInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable()
}).strict();

export const UserUpdateWithoutAddressInputSchema: z.ZodType<Prisma.UserUpdateWithoutAddressInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateManyWithoutMembersNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAddressInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAddressInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUncheckedUpdateManyWithoutMembersNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateManyWithoutAddressInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutAddressInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutAddressInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  members: z.lazy(() => UserUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutAddressInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  members: z.lazy(() => UserUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateManyWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutAddressInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const DealFindFirstArgsSchema: z.ZodType<Prisma.DealFindFirstArgs> = z.object({
  select: DealSelectSchema.optional(),
  include: DealIncludeSchema.optional(),
  where: DealWhereInputSchema.optional(),
  orderBy: z.union([ DealOrderByWithRelationInputSchema.array(),DealOrderByWithRelationInputSchema ]).optional(),
  cursor: DealWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DealScalarFieldEnumSchema,DealScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DealFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DealFindFirstOrThrowArgs> = z.object({
  select: DealSelectSchema.optional(),
  include: DealIncludeSchema.optional(),
  where: DealWhereInputSchema.optional(),
  orderBy: z.union([ DealOrderByWithRelationInputSchema.array(),DealOrderByWithRelationInputSchema ]).optional(),
  cursor: DealWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DealScalarFieldEnumSchema,DealScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DealFindManyArgsSchema: z.ZodType<Prisma.DealFindManyArgs> = z.object({
  select: DealSelectSchema.optional(),
  include: DealIncludeSchema.optional(),
  where: DealWhereInputSchema.optional(),
  orderBy: z.union([ DealOrderByWithRelationInputSchema.array(),DealOrderByWithRelationInputSchema ]).optional(),
  cursor: DealWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DealScalarFieldEnumSchema,DealScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DealAggregateArgsSchema: z.ZodType<Prisma.DealAggregateArgs> = z.object({
  where: DealWhereInputSchema.optional(),
  orderBy: z.union([ DealOrderByWithRelationInputSchema.array(),DealOrderByWithRelationInputSchema ]).optional(),
  cursor: DealWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DealGroupByArgsSchema: z.ZodType<Prisma.DealGroupByArgs> = z.object({
  where: DealWhereInputSchema.optional(),
  orderBy: z.union([ DealOrderByWithAggregationInputSchema.array(),DealOrderByWithAggregationInputSchema ]).optional(),
  by: DealScalarFieldEnumSchema.array(),
  having: DealScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DealFindUniqueArgsSchema: z.ZodType<Prisma.DealFindUniqueArgs> = z.object({
  select: DealSelectSchema.optional(),
  include: DealIncludeSchema.optional(),
  where: DealWhereUniqueInputSchema,
}).strict() ;

export const DealFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DealFindUniqueOrThrowArgs> = z.object({
  select: DealSelectSchema.optional(),
  include: DealIncludeSchema.optional(),
  where: DealWhereUniqueInputSchema,
}).strict() ;

export const OrganizationFindFirstArgsSchema: z.ZodType<Prisma.OrganizationFindFirstArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrganizationFindFirstOrThrowArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationFindManyArgsSchema: z.ZodType<Prisma.OrganizationFindManyArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationAggregateArgsSchema: z.ZodType<Prisma.OrganizationAggregateArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationGroupByArgsSchema: z.ZodType<Prisma.OrganizationGroupByArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithAggregationInputSchema.array(),OrganizationOrderByWithAggregationInputSchema ]).optional(),
  by: OrganizationScalarFieldEnumSchema.array(),
  having: OrganizationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationFindUniqueArgsSchema: z.ZodType<Prisma.OrganizationFindUniqueArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrganizationFindUniqueOrThrowArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const AccreditationVerifierFindFirstArgsSchema: z.ZodType<Prisma.AccreditationVerifierFindFirstArgs> = z.object({
  select: AccreditationVerifierSelectSchema.optional(),
  include: AccreditationVerifierIncludeSchema.optional(),
  where: AccreditationVerifierWhereInputSchema.optional(),
  orderBy: z.union([ AccreditationVerifierOrderByWithRelationInputSchema.array(),AccreditationVerifierOrderByWithRelationInputSchema ]).optional(),
  cursor: AccreditationVerifierWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccreditationVerifierScalarFieldEnumSchema,AccreditationVerifierScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccreditationVerifierFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccreditationVerifierFindFirstOrThrowArgs> = z.object({
  select: AccreditationVerifierSelectSchema.optional(),
  include: AccreditationVerifierIncludeSchema.optional(),
  where: AccreditationVerifierWhereInputSchema.optional(),
  orderBy: z.union([ AccreditationVerifierOrderByWithRelationInputSchema.array(),AccreditationVerifierOrderByWithRelationInputSchema ]).optional(),
  cursor: AccreditationVerifierWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccreditationVerifierScalarFieldEnumSchema,AccreditationVerifierScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccreditationVerifierFindManyArgsSchema: z.ZodType<Prisma.AccreditationVerifierFindManyArgs> = z.object({
  select: AccreditationVerifierSelectSchema.optional(),
  include: AccreditationVerifierIncludeSchema.optional(),
  where: AccreditationVerifierWhereInputSchema.optional(),
  orderBy: z.union([ AccreditationVerifierOrderByWithRelationInputSchema.array(),AccreditationVerifierOrderByWithRelationInputSchema ]).optional(),
  cursor: AccreditationVerifierWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccreditationVerifierScalarFieldEnumSchema,AccreditationVerifierScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccreditationVerifierAggregateArgsSchema: z.ZodType<Prisma.AccreditationVerifierAggregateArgs> = z.object({
  where: AccreditationVerifierWhereInputSchema.optional(),
  orderBy: z.union([ AccreditationVerifierOrderByWithRelationInputSchema.array(),AccreditationVerifierOrderByWithRelationInputSchema ]).optional(),
  cursor: AccreditationVerifierWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccreditationVerifierGroupByArgsSchema: z.ZodType<Prisma.AccreditationVerifierGroupByArgs> = z.object({
  where: AccreditationVerifierWhereInputSchema.optional(),
  orderBy: z.union([ AccreditationVerifierOrderByWithAggregationInputSchema.array(),AccreditationVerifierOrderByWithAggregationInputSchema ]).optional(),
  by: AccreditationVerifierScalarFieldEnumSchema.array(),
  having: AccreditationVerifierScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccreditationVerifierFindUniqueArgsSchema: z.ZodType<Prisma.AccreditationVerifierFindUniqueArgs> = z.object({
  select: AccreditationVerifierSelectSchema.optional(),
  include: AccreditationVerifierIncludeSchema.optional(),
  where: AccreditationVerifierWhereUniqueInputSchema,
}).strict() ;

export const AccreditationVerifierFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccreditationVerifierFindUniqueOrThrowArgs> = z.object({
  select: AccreditationVerifierSelectSchema.optional(),
  include: AccreditationVerifierIncludeSchema.optional(),
  where: AccreditationVerifierWhereUniqueInputSchema,
}).strict() ;

export const DealDocumentFindFirstArgsSchema: z.ZodType<Prisma.DealDocumentFindFirstArgs> = z.object({
  select: DealDocumentSelectSchema.optional(),
  include: DealDocumentIncludeSchema.optional(),
  where: DealDocumentWhereInputSchema.optional(),
  orderBy: z.union([ DealDocumentOrderByWithRelationInputSchema.array(),DealDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: DealDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DealDocumentScalarFieldEnumSchema,DealDocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DealDocumentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DealDocumentFindFirstOrThrowArgs> = z.object({
  select: DealDocumentSelectSchema.optional(),
  include: DealDocumentIncludeSchema.optional(),
  where: DealDocumentWhereInputSchema.optional(),
  orderBy: z.union([ DealDocumentOrderByWithRelationInputSchema.array(),DealDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: DealDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DealDocumentScalarFieldEnumSchema,DealDocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DealDocumentFindManyArgsSchema: z.ZodType<Prisma.DealDocumentFindManyArgs> = z.object({
  select: DealDocumentSelectSchema.optional(),
  include: DealDocumentIncludeSchema.optional(),
  where: DealDocumentWhereInputSchema.optional(),
  orderBy: z.union([ DealDocumentOrderByWithRelationInputSchema.array(),DealDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: DealDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DealDocumentScalarFieldEnumSchema,DealDocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DealDocumentAggregateArgsSchema: z.ZodType<Prisma.DealDocumentAggregateArgs> = z.object({
  where: DealDocumentWhereInputSchema.optional(),
  orderBy: z.union([ DealDocumentOrderByWithRelationInputSchema.array(),DealDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: DealDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DealDocumentGroupByArgsSchema: z.ZodType<Prisma.DealDocumentGroupByArgs> = z.object({
  where: DealDocumentWhereInputSchema.optional(),
  orderBy: z.union([ DealDocumentOrderByWithAggregationInputSchema.array(),DealDocumentOrderByWithAggregationInputSchema ]).optional(),
  by: DealDocumentScalarFieldEnumSchema.array(),
  having: DealDocumentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DealDocumentFindUniqueArgsSchema: z.ZodType<Prisma.DealDocumentFindUniqueArgs> = z.object({
  select: DealDocumentSelectSchema.optional(),
  include: DealDocumentIncludeSchema.optional(),
  where: DealDocumentWhereUniqueInputSchema,
}).strict() ;

export const DealDocumentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DealDocumentFindUniqueOrThrowArgs> = z.object({
  select: DealDocumentSelectSchema.optional(),
  include: DealDocumentIncludeSchema.optional(),
  where: DealDocumentWhereUniqueInputSchema,
}).strict() ;

export const OrganizationDocumentFindFirstArgsSchema: z.ZodType<Prisma.OrganizationDocumentFindFirstArgs> = z.object({
  select: OrganizationDocumentSelectSchema.optional(),
  include: OrganizationDocumentIncludeSchema.optional(),
  where: OrganizationDocumentWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationDocumentOrderByWithRelationInputSchema.array(),OrganizationDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationDocumentScalarFieldEnumSchema,OrganizationDocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationDocumentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrganizationDocumentFindFirstOrThrowArgs> = z.object({
  select: OrganizationDocumentSelectSchema.optional(),
  include: OrganizationDocumentIncludeSchema.optional(),
  where: OrganizationDocumentWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationDocumentOrderByWithRelationInputSchema.array(),OrganizationDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationDocumentScalarFieldEnumSchema,OrganizationDocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationDocumentFindManyArgsSchema: z.ZodType<Prisma.OrganizationDocumentFindManyArgs> = z.object({
  select: OrganizationDocumentSelectSchema.optional(),
  include: OrganizationDocumentIncludeSchema.optional(),
  where: OrganizationDocumentWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationDocumentOrderByWithRelationInputSchema.array(),OrganizationDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationDocumentScalarFieldEnumSchema,OrganizationDocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationDocumentAggregateArgsSchema: z.ZodType<Prisma.OrganizationDocumentAggregateArgs> = z.object({
  where: OrganizationDocumentWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationDocumentOrderByWithRelationInputSchema.array(),OrganizationDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationDocumentGroupByArgsSchema: z.ZodType<Prisma.OrganizationDocumentGroupByArgs> = z.object({
  where: OrganizationDocumentWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationDocumentOrderByWithAggregationInputSchema.array(),OrganizationDocumentOrderByWithAggregationInputSchema ]).optional(),
  by: OrganizationDocumentScalarFieldEnumSchema.array(),
  having: OrganizationDocumentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationDocumentFindUniqueArgsSchema: z.ZodType<Prisma.OrganizationDocumentFindUniqueArgs> = z.object({
  select: OrganizationDocumentSelectSchema.optional(),
  include: OrganizationDocumentIncludeSchema.optional(),
  where: OrganizationDocumentWhereUniqueInputSchema,
}).strict() ;

export const OrganizationDocumentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrganizationDocumentFindUniqueOrThrowArgs> = z.object({
  select: OrganizationDocumentSelectSchema.optional(),
  include: OrganizationDocumentIncludeSchema.optional(),
  where: OrganizationDocumentWhereUniqueInputSchema,
}).strict() ;

export const ProjectFindFirstArgsSchema: z.ZodType<Prisma.ProjectFindFirstArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereInputSchema.optional(),
  orderBy: z.union([ ProjectOrderByWithRelationInputSchema.array(),ProjectOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectScalarFieldEnumSchema,ProjectScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProjectFindFirstOrThrowArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereInputSchema.optional(),
  orderBy: z.union([ ProjectOrderByWithRelationInputSchema.array(),ProjectOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectScalarFieldEnumSchema,ProjectScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectFindManyArgsSchema: z.ZodType<Prisma.ProjectFindManyArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereInputSchema.optional(),
  orderBy: z.union([ ProjectOrderByWithRelationInputSchema.array(),ProjectOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectScalarFieldEnumSchema,ProjectScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectAggregateArgsSchema: z.ZodType<Prisma.ProjectAggregateArgs> = z.object({
  where: ProjectWhereInputSchema.optional(),
  orderBy: z.union([ ProjectOrderByWithRelationInputSchema.array(),ProjectOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectGroupByArgsSchema: z.ZodType<Prisma.ProjectGroupByArgs> = z.object({
  where: ProjectWhereInputSchema.optional(),
  orderBy: z.union([ ProjectOrderByWithAggregationInputSchema.array(),ProjectOrderByWithAggregationInputSchema ]).optional(),
  by: ProjectScalarFieldEnumSchema.array(),
  having: ProjectScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectFindUniqueArgsSchema: z.ZodType<Prisma.ProjectFindUniqueArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereUniqueInputSchema,
}).strict() ;

export const ProjectFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProjectFindUniqueOrThrowArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereUniqueInputSchema,
}).strict() ;

export const ProjectMilestonesFindFirstArgsSchema: z.ZodType<Prisma.ProjectMilestonesFindFirstArgs> = z.object({
  select: ProjectMilestonesSelectSchema.optional(),
  include: ProjectMilestonesIncludeSchema.optional(),
  where: ProjectMilestonesWhereInputSchema.optional(),
  orderBy: z.union([ ProjectMilestonesOrderByWithRelationInputSchema.array(),ProjectMilestonesOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectMilestonesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectMilestonesScalarFieldEnumSchema,ProjectMilestonesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectMilestonesFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProjectMilestonesFindFirstOrThrowArgs> = z.object({
  select: ProjectMilestonesSelectSchema.optional(),
  include: ProjectMilestonesIncludeSchema.optional(),
  where: ProjectMilestonesWhereInputSchema.optional(),
  orderBy: z.union([ ProjectMilestonesOrderByWithRelationInputSchema.array(),ProjectMilestonesOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectMilestonesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectMilestonesScalarFieldEnumSchema,ProjectMilestonesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectMilestonesFindManyArgsSchema: z.ZodType<Prisma.ProjectMilestonesFindManyArgs> = z.object({
  select: ProjectMilestonesSelectSchema.optional(),
  include: ProjectMilestonesIncludeSchema.optional(),
  where: ProjectMilestonesWhereInputSchema.optional(),
  orderBy: z.union([ ProjectMilestonesOrderByWithRelationInputSchema.array(),ProjectMilestonesOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectMilestonesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectMilestonesScalarFieldEnumSchema,ProjectMilestonesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectMilestonesAggregateArgsSchema: z.ZodType<Prisma.ProjectMilestonesAggregateArgs> = z.object({
  where: ProjectMilestonesWhereInputSchema.optional(),
  orderBy: z.union([ ProjectMilestonesOrderByWithRelationInputSchema.array(),ProjectMilestonesOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectMilestonesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectMilestonesGroupByArgsSchema: z.ZodType<Prisma.ProjectMilestonesGroupByArgs> = z.object({
  where: ProjectMilestonesWhereInputSchema.optional(),
  orderBy: z.union([ ProjectMilestonesOrderByWithAggregationInputSchema.array(),ProjectMilestonesOrderByWithAggregationInputSchema ]).optional(),
  by: ProjectMilestonesScalarFieldEnumSchema.array(),
  having: ProjectMilestonesScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectMilestonesFindUniqueArgsSchema: z.ZodType<Prisma.ProjectMilestonesFindUniqueArgs> = z.object({
  select: ProjectMilestonesSelectSchema.optional(),
  include: ProjectMilestonesIncludeSchema.optional(),
  where: ProjectMilestonesWhereUniqueInputSchema,
}).strict() ;

export const ProjectMilestonesFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProjectMilestonesFindUniqueOrThrowArgs> = z.object({
  select: ProjectMilestonesSelectSchema.optional(),
  include: ProjectMilestonesIncludeSchema.optional(),
  where: ProjectMilestonesWhereUniqueInputSchema,
}).strict() ;

export const PicturesFindFirstArgsSchema: z.ZodType<Prisma.PicturesFindFirstArgs> = z.object({
  select: PicturesSelectSchema.optional(),
  include: PicturesIncludeSchema.optional(),
  where: PicturesWhereInputSchema.optional(),
  orderBy: z.union([ PicturesOrderByWithRelationInputSchema.array(),PicturesOrderByWithRelationInputSchema ]).optional(),
  cursor: PicturesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PicturesScalarFieldEnumSchema,PicturesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PicturesFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PicturesFindFirstOrThrowArgs> = z.object({
  select: PicturesSelectSchema.optional(),
  include: PicturesIncludeSchema.optional(),
  where: PicturesWhereInputSchema.optional(),
  orderBy: z.union([ PicturesOrderByWithRelationInputSchema.array(),PicturesOrderByWithRelationInputSchema ]).optional(),
  cursor: PicturesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PicturesScalarFieldEnumSchema,PicturesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PicturesFindManyArgsSchema: z.ZodType<Prisma.PicturesFindManyArgs> = z.object({
  select: PicturesSelectSchema.optional(),
  include: PicturesIncludeSchema.optional(),
  where: PicturesWhereInputSchema.optional(),
  orderBy: z.union([ PicturesOrderByWithRelationInputSchema.array(),PicturesOrderByWithRelationInputSchema ]).optional(),
  cursor: PicturesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PicturesScalarFieldEnumSchema,PicturesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PicturesAggregateArgsSchema: z.ZodType<Prisma.PicturesAggregateArgs> = z.object({
  where: PicturesWhereInputSchema.optional(),
  orderBy: z.union([ PicturesOrderByWithRelationInputSchema.array(),PicturesOrderByWithRelationInputSchema ]).optional(),
  cursor: PicturesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PicturesGroupByArgsSchema: z.ZodType<Prisma.PicturesGroupByArgs> = z.object({
  where: PicturesWhereInputSchema.optional(),
  orderBy: z.union([ PicturesOrderByWithAggregationInputSchema.array(),PicturesOrderByWithAggregationInputSchema ]).optional(),
  by: PicturesScalarFieldEnumSchema.array(),
  having: PicturesScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PicturesFindUniqueArgsSchema: z.ZodType<Prisma.PicturesFindUniqueArgs> = z.object({
  select: PicturesSelectSchema.optional(),
  include: PicturesIncludeSchema.optional(),
  where: PicturesWhereUniqueInputSchema,
}).strict() ;

export const PicturesFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PicturesFindUniqueOrThrowArgs> = z.object({
  select: PicturesSelectSchema.optional(),
  include: PicturesIncludeSchema.optional(),
  where: PicturesWhereUniqueInputSchema,
}).strict() ;

export const DocumentFindFirstArgsSchema: z.ZodType<Prisma.DocumentFindFirstArgs> = z.object({
  select: DocumentSelectSchema.optional(),
  include: DocumentIncludeSchema.optional(),
  where: DocumentWhereInputSchema.optional(),
  orderBy: z.union([ DocumentOrderByWithRelationInputSchema.array(),DocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: DocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DocumentScalarFieldEnumSchema,DocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DocumentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DocumentFindFirstOrThrowArgs> = z.object({
  select: DocumentSelectSchema.optional(),
  include: DocumentIncludeSchema.optional(),
  where: DocumentWhereInputSchema.optional(),
  orderBy: z.union([ DocumentOrderByWithRelationInputSchema.array(),DocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: DocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DocumentScalarFieldEnumSchema,DocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DocumentFindManyArgsSchema: z.ZodType<Prisma.DocumentFindManyArgs> = z.object({
  select: DocumentSelectSchema.optional(),
  include: DocumentIncludeSchema.optional(),
  where: DocumentWhereInputSchema.optional(),
  orderBy: z.union([ DocumentOrderByWithRelationInputSchema.array(),DocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: DocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DocumentScalarFieldEnumSchema,DocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DocumentAggregateArgsSchema: z.ZodType<Prisma.DocumentAggregateArgs> = z.object({
  where: DocumentWhereInputSchema.optional(),
  orderBy: z.union([ DocumentOrderByWithRelationInputSchema.array(),DocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: DocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DocumentGroupByArgsSchema: z.ZodType<Prisma.DocumentGroupByArgs> = z.object({
  where: DocumentWhereInputSchema.optional(),
  orderBy: z.union([ DocumentOrderByWithAggregationInputSchema.array(),DocumentOrderByWithAggregationInputSchema ]).optional(),
  by: DocumentScalarFieldEnumSchema.array(),
  having: DocumentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DocumentFindUniqueArgsSchema: z.ZodType<Prisma.DocumentFindUniqueArgs> = z.object({
  select: DocumentSelectSchema.optional(),
  include: DocumentIncludeSchema.optional(),
  where: DocumentWhereUniqueInputSchema,
}).strict() ;

export const DocumentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DocumentFindUniqueOrThrowArgs> = z.object({
  select: DocumentSelectSchema.optional(),
  include: DocumentIncludeSchema.optional(),
  where: DocumentWhereUniqueInputSchema,
}).strict() ;

export const DocumentEventFindFirstArgsSchema: z.ZodType<Prisma.DocumentEventFindFirstArgs> = z.object({
  select: DocumentEventSelectSchema.optional(),
  include: DocumentEventIncludeSchema.optional(),
  where: DocumentEventWhereInputSchema.optional(),
  orderBy: z.union([ DocumentEventOrderByWithRelationInputSchema.array(),DocumentEventOrderByWithRelationInputSchema ]).optional(),
  cursor: DocumentEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DocumentEventScalarFieldEnumSchema,DocumentEventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DocumentEventFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DocumentEventFindFirstOrThrowArgs> = z.object({
  select: DocumentEventSelectSchema.optional(),
  include: DocumentEventIncludeSchema.optional(),
  where: DocumentEventWhereInputSchema.optional(),
  orderBy: z.union([ DocumentEventOrderByWithRelationInputSchema.array(),DocumentEventOrderByWithRelationInputSchema ]).optional(),
  cursor: DocumentEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DocumentEventScalarFieldEnumSchema,DocumentEventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DocumentEventFindManyArgsSchema: z.ZodType<Prisma.DocumentEventFindManyArgs> = z.object({
  select: DocumentEventSelectSchema.optional(),
  include: DocumentEventIncludeSchema.optional(),
  where: DocumentEventWhereInputSchema.optional(),
  orderBy: z.union([ DocumentEventOrderByWithRelationInputSchema.array(),DocumentEventOrderByWithRelationInputSchema ]).optional(),
  cursor: DocumentEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DocumentEventScalarFieldEnumSchema,DocumentEventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DocumentEventAggregateArgsSchema: z.ZodType<Prisma.DocumentEventAggregateArgs> = z.object({
  where: DocumentEventWhereInputSchema.optional(),
  orderBy: z.union([ DocumentEventOrderByWithRelationInputSchema.array(),DocumentEventOrderByWithRelationInputSchema ]).optional(),
  cursor: DocumentEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DocumentEventGroupByArgsSchema: z.ZodType<Prisma.DocumentEventGroupByArgs> = z.object({
  where: DocumentEventWhereInputSchema.optional(),
  orderBy: z.union([ DocumentEventOrderByWithAggregationInputSchema.array(),DocumentEventOrderByWithAggregationInputSchema ]).optional(),
  by: DocumentEventScalarFieldEnumSchema.array(),
  having: DocumentEventScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DocumentEventFindUniqueArgsSchema: z.ZodType<Prisma.DocumentEventFindUniqueArgs> = z.object({
  select: DocumentEventSelectSchema.optional(),
  include: DocumentEventIncludeSchema.optional(),
  where: DocumentEventWhereUniqueInputSchema,
}).strict() ;

export const DocumentEventFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DocumentEventFindUniqueOrThrowArgs> = z.object({
  select: DocumentEventSelectSchema.optional(),
  include: DocumentEventIncludeSchema.optional(),
  where: DocumentEventWhereUniqueInputSchema,
}).strict() ;

export const AddressFindFirstArgsSchema: z.ZodType<Prisma.AddressFindFirstArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema,AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AddressFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AddressFindFirstOrThrowArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema,AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AddressFindManyArgsSchema: z.ZodType<Prisma.AddressFindManyArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema,AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AddressAggregateArgsSchema: z.ZodType<Prisma.AddressAggregateArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AddressGroupByArgsSchema: z.ZodType<Prisma.AddressGroupByArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithAggregationInputSchema.array(),AddressOrderByWithAggregationInputSchema ]).optional(),
  by: AddressScalarFieldEnumSchema.array(),
  having: AddressScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AddressFindUniqueArgsSchema: z.ZodType<Prisma.AddressFindUniqueArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const AddressFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AddressFindUniqueOrThrowArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const DealCreateArgsSchema: z.ZodType<Prisma.DealCreateArgs> = z.object({
  select: DealSelectSchema.optional(),
  include: DealIncludeSchema.optional(),
  data: z.union([ DealCreateInputSchema,DealUncheckedCreateInputSchema ]),
}).strict() ;

export const DealUpsertArgsSchema: z.ZodType<Prisma.DealUpsertArgs> = z.object({
  select: DealSelectSchema.optional(),
  include: DealIncludeSchema.optional(),
  where: DealWhereUniqueInputSchema,
  create: z.union([ DealCreateInputSchema,DealUncheckedCreateInputSchema ]),
  update: z.union([ DealUpdateInputSchema,DealUncheckedUpdateInputSchema ]),
}).strict() ;

export const DealCreateManyArgsSchema: z.ZodType<Prisma.DealCreateManyArgs> = z.object({
  data: z.union([ DealCreateManyInputSchema,DealCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DealCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DealCreateManyAndReturnArgs> = z.object({
  data: z.union([ DealCreateManyInputSchema,DealCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DealDeleteArgsSchema: z.ZodType<Prisma.DealDeleteArgs> = z.object({
  select: DealSelectSchema.optional(),
  include: DealIncludeSchema.optional(),
  where: DealWhereUniqueInputSchema,
}).strict() ;

export const DealUpdateArgsSchema: z.ZodType<Prisma.DealUpdateArgs> = z.object({
  select: DealSelectSchema.optional(),
  include: DealIncludeSchema.optional(),
  data: z.union([ DealUpdateInputSchema,DealUncheckedUpdateInputSchema ]),
  where: DealWhereUniqueInputSchema,
}).strict() ;

export const DealUpdateManyArgsSchema: z.ZodType<Prisma.DealUpdateManyArgs> = z.object({
  data: z.union([ DealUpdateManyMutationInputSchema,DealUncheckedUpdateManyInputSchema ]),
  where: DealWhereInputSchema.optional(),
}).strict() ;

export const DealDeleteManyArgsSchema: z.ZodType<Prisma.DealDeleteManyArgs> = z.object({
  where: DealWhereInputSchema.optional(),
}).strict() ;

export const OrganizationCreateArgsSchema: z.ZodType<Prisma.OrganizationCreateArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  data: z.union([ OrganizationCreateInputSchema,OrganizationUncheckedCreateInputSchema ]),
}).strict() ;

export const OrganizationUpsertArgsSchema: z.ZodType<Prisma.OrganizationUpsertArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
  create: z.union([ OrganizationCreateInputSchema,OrganizationUncheckedCreateInputSchema ]),
  update: z.union([ OrganizationUpdateInputSchema,OrganizationUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrganizationCreateManyArgsSchema: z.ZodType<Prisma.OrganizationCreateManyArgs> = z.object({
  data: z.union([ OrganizationCreateManyInputSchema,OrganizationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationCreateManyInputSchema,OrganizationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationDeleteArgsSchema: z.ZodType<Prisma.OrganizationDeleteArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationUpdateArgsSchema: z.ZodType<Prisma.OrganizationUpdateArgs> = z.object({
  select: OrganizationSelectSchema.optional(),
  include: OrganizationIncludeSchema.optional(),
  data: z.union([ OrganizationUpdateInputSchema,OrganizationUncheckedUpdateInputSchema ]),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationUpdateManyArgsSchema: z.ZodType<Prisma.OrganizationUpdateManyArgs> = z.object({
  data: z.union([ OrganizationUpdateManyMutationInputSchema,OrganizationUncheckedUpdateManyInputSchema ]),
  where: OrganizationWhereInputSchema.optional(),
}).strict() ;

export const OrganizationDeleteManyArgsSchema: z.ZodType<Prisma.OrganizationDeleteManyArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
}).strict() ;

export const AccreditationVerifierCreateArgsSchema: z.ZodType<Prisma.AccreditationVerifierCreateArgs> = z.object({
  select: AccreditationVerifierSelectSchema.optional(),
  include: AccreditationVerifierIncludeSchema.optional(),
  data: z.union([ AccreditationVerifierCreateInputSchema,AccreditationVerifierUncheckedCreateInputSchema ]),
}).strict() ;

export const AccreditationVerifierUpsertArgsSchema: z.ZodType<Prisma.AccreditationVerifierUpsertArgs> = z.object({
  select: AccreditationVerifierSelectSchema.optional(),
  include: AccreditationVerifierIncludeSchema.optional(),
  where: AccreditationVerifierWhereUniqueInputSchema,
  create: z.union([ AccreditationVerifierCreateInputSchema,AccreditationVerifierUncheckedCreateInputSchema ]),
  update: z.union([ AccreditationVerifierUpdateInputSchema,AccreditationVerifierUncheckedUpdateInputSchema ]),
}).strict() ;

export const AccreditationVerifierCreateManyArgsSchema: z.ZodType<Prisma.AccreditationVerifierCreateManyArgs> = z.object({
  data: z.union([ AccreditationVerifierCreateManyInputSchema,AccreditationVerifierCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccreditationVerifierCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccreditationVerifierCreateManyAndReturnArgs> = z.object({
  data: z.union([ AccreditationVerifierCreateManyInputSchema,AccreditationVerifierCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccreditationVerifierDeleteArgsSchema: z.ZodType<Prisma.AccreditationVerifierDeleteArgs> = z.object({
  select: AccreditationVerifierSelectSchema.optional(),
  include: AccreditationVerifierIncludeSchema.optional(),
  where: AccreditationVerifierWhereUniqueInputSchema,
}).strict() ;

export const AccreditationVerifierUpdateArgsSchema: z.ZodType<Prisma.AccreditationVerifierUpdateArgs> = z.object({
  select: AccreditationVerifierSelectSchema.optional(),
  include: AccreditationVerifierIncludeSchema.optional(),
  data: z.union([ AccreditationVerifierUpdateInputSchema,AccreditationVerifierUncheckedUpdateInputSchema ]),
  where: AccreditationVerifierWhereUniqueInputSchema,
}).strict() ;

export const AccreditationVerifierUpdateManyArgsSchema: z.ZodType<Prisma.AccreditationVerifierUpdateManyArgs> = z.object({
  data: z.union([ AccreditationVerifierUpdateManyMutationInputSchema,AccreditationVerifierUncheckedUpdateManyInputSchema ]),
  where: AccreditationVerifierWhereInputSchema.optional(),
}).strict() ;

export const AccreditationVerifierDeleteManyArgsSchema: z.ZodType<Prisma.AccreditationVerifierDeleteManyArgs> = z.object({
  where: AccreditationVerifierWhereInputSchema.optional(),
}).strict() ;

export const DealDocumentCreateArgsSchema: z.ZodType<Prisma.DealDocumentCreateArgs> = z.object({
  select: DealDocumentSelectSchema.optional(),
  include: DealDocumentIncludeSchema.optional(),
  data: z.union([ DealDocumentCreateInputSchema,DealDocumentUncheckedCreateInputSchema ]),
}).strict() ;

export const DealDocumentUpsertArgsSchema: z.ZodType<Prisma.DealDocumentUpsertArgs> = z.object({
  select: DealDocumentSelectSchema.optional(),
  include: DealDocumentIncludeSchema.optional(),
  where: DealDocumentWhereUniqueInputSchema,
  create: z.union([ DealDocumentCreateInputSchema,DealDocumentUncheckedCreateInputSchema ]),
  update: z.union([ DealDocumentUpdateInputSchema,DealDocumentUncheckedUpdateInputSchema ]),
}).strict() ;

export const DealDocumentCreateManyArgsSchema: z.ZodType<Prisma.DealDocumentCreateManyArgs> = z.object({
  data: z.union([ DealDocumentCreateManyInputSchema,DealDocumentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DealDocumentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DealDocumentCreateManyAndReturnArgs> = z.object({
  data: z.union([ DealDocumentCreateManyInputSchema,DealDocumentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DealDocumentDeleteArgsSchema: z.ZodType<Prisma.DealDocumentDeleteArgs> = z.object({
  select: DealDocumentSelectSchema.optional(),
  include: DealDocumentIncludeSchema.optional(),
  where: DealDocumentWhereUniqueInputSchema,
}).strict() ;

export const DealDocumentUpdateArgsSchema: z.ZodType<Prisma.DealDocumentUpdateArgs> = z.object({
  select: DealDocumentSelectSchema.optional(),
  include: DealDocumentIncludeSchema.optional(),
  data: z.union([ DealDocumentUpdateInputSchema,DealDocumentUncheckedUpdateInputSchema ]),
  where: DealDocumentWhereUniqueInputSchema,
}).strict() ;

export const DealDocumentUpdateManyArgsSchema: z.ZodType<Prisma.DealDocumentUpdateManyArgs> = z.object({
  data: z.union([ DealDocumentUpdateManyMutationInputSchema,DealDocumentUncheckedUpdateManyInputSchema ]),
  where: DealDocumentWhereInputSchema.optional(),
}).strict() ;

export const DealDocumentDeleteManyArgsSchema: z.ZodType<Prisma.DealDocumentDeleteManyArgs> = z.object({
  where: DealDocumentWhereInputSchema.optional(),
}).strict() ;

export const OrganizationDocumentCreateArgsSchema: z.ZodType<Prisma.OrganizationDocumentCreateArgs> = z.object({
  select: OrganizationDocumentSelectSchema.optional(),
  include: OrganizationDocumentIncludeSchema.optional(),
  data: z.union([ OrganizationDocumentCreateInputSchema,OrganizationDocumentUncheckedCreateInputSchema ]),
}).strict() ;

export const OrganizationDocumentUpsertArgsSchema: z.ZodType<Prisma.OrganizationDocumentUpsertArgs> = z.object({
  select: OrganizationDocumentSelectSchema.optional(),
  include: OrganizationDocumentIncludeSchema.optional(),
  where: OrganizationDocumentWhereUniqueInputSchema,
  create: z.union([ OrganizationDocumentCreateInputSchema,OrganizationDocumentUncheckedCreateInputSchema ]),
  update: z.union([ OrganizationDocumentUpdateInputSchema,OrganizationDocumentUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrganizationDocumentCreateManyArgsSchema: z.ZodType<Prisma.OrganizationDocumentCreateManyArgs> = z.object({
  data: z.union([ OrganizationDocumentCreateManyInputSchema,OrganizationDocumentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationDocumentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationDocumentCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationDocumentCreateManyInputSchema,OrganizationDocumentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationDocumentDeleteArgsSchema: z.ZodType<Prisma.OrganizationDocumentDeleteArgs> = z.object({
  select: OrganizationDocumentSelectSchema.optional(),
  include: OrganizationDocumentIncludeSchema.optional(),
  where: OrganizationDocumentWhereUniqueInputSchema,
}).strict() ;

export const OrganizationDocumentUpdateArgsSchema: z.ZodType<Prisma.OrganizationDocumentUpdateArgs> = z.object({
  select: OrganizationDocumentSelectSchema.optional(),
  include: OrganizationDocumentIncludeSchema.optional(),
  data: z.union([ OrganizationDocumentUpdateInputSchema,OrganizationDocumentUncheckedUpdateInputSchema ]),
  where: OrganizationDocumentWhereUniqueInputSchema,
}).strict() ;

export const OrganizationDocumentUpdateManyArgsSchema: z.ZodType<Prisma.OrganizationDocumentUpdateManyArgs> = z.object({
  data: z.union([ OrganizationDocumentUpdateManyMutationInputSchema,OrganizationDocumentUncheckedUpdateManyInputSchema ]),
  where: OrganizationDocumentWhereInputSchema.optional(),
}).strict() ;

export const OrganizationDocumentDeleteManyArgsSchema: z.ZodType<Prisma.OrganizationDocumentDeleteManyArgs> = z.object({
  where: OrganizationDocumentWhereInputSchema.optional(),
}).strict() ;

export const ProjectCreateArgsSchema: z.ZodType<Prisma.ProjectCreateArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  data: z.union([ ProjectCreateInputSchema,ProjectUncheckedCreateInputSchema ]),
}).strict() ;

export const ProjectUpsertArgsSchema: z.ZodType<Prisma.ProjectUpsertArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereUniqueInputSchema,
  create: z.union([ ProjectCreateInputSchema,ProjectUncheckedCreateInputSchema ]),
  update: z.union([ ProjectUpdateInputSchema,ProjectUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProjectCreateManyArgsSchema: z.ZodType<Prisma.ProjectCreateManyArgs> = z.object({
  data: z.union([ ProjectCreateManyInputSchema,ProjectCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProjectCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProjectCreateManyInputSchema,ProjectCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectDeleteArgsSchema: z.ZodType<Prisma.ProjectDeleteArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  where: ProjectWhereUniqueInputSchema,
}).strict() ;

export const ProjectUpdateArgsSchema: z.ZodType<Prisma.ProjectUpdateArgs> = z.object({
  select: ProjectSelectSchema.optional(),
  include: ProjectIncludeSchema.optional(),
  data: z.union([ ProjectUpdateInputSchema,ProjectUncheckedUpdateInputSchema ]),
  where: ProjectWhereUniqueInputSchema,
}).strict() ;

export const ProjectUpdateManyArgsSchema: z.ZodType<Prisma.ProjectUpdateManyArgs> = z.object({
  data: z.union([ ProjectUpdateManyMutationInputSchema,ProjectUncheckedUpdateManyInputSchema ]),
  where: ProjectWhereInputSchema.optional(),
}).strict() ;

export const ProjectDeleteManyArgsSchema: z.ZodType<Prisma.ProjectDeleteManyArgs> = z.object({
  where: ProjectWhereInputSchema.optional(),
}).strict() ;

export const ProjectMilestonesCreateArgsSchema: z.ZodType<Prisma.ProjectMilestonesCreateArgs> = z.object({
  select: ProjectMilestonesSelectSchema.optional(),
  include: ProjectMilestonesIncludeSchema.optional(),
  data: z.union([ ProjectMilestonesCreateInputSchema,ProjectMilestonesUncheckedCreateInputSchema ]),
}).strict() ;

export const ProjectMilestonesUpsertArgsSchema: z.ZodType<Prisma.ProjectMilestonesUpsertArgs> = z.object({
  select: ProjectMilestonesSelectSchema.optional(),
  include: ProjectMilestonesIncludeSchema.optional(),
  where: ProjectMilestonesWhereUniqueInputSchema,
  create: z.union([ ProjectMilestonesCreateInputSchema,ProjectMilestonesUncheckedCreateInputSchema ]),
  update: z.union([ ProjectMilestonesUpdateInputSchema,ProjectMilestonesUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProjectMilestonesCreateManyArgsSchema: z.ZodType<Prisma.ProjectMilestonesCreateManyArgs> = z.object({
  data: z.union([ ProjectMilestonesCreateManyInputSchema,ProjectMilestonesCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectMilestonesCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProjectMilestonesCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProjectMilestonesCreateManyInputSchema,ProjectMilestonesCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectMilestonesDeleteArgsSchema: z.ZodType<Prisma.ProjectMilestonesDeleteArgs> = z.object({
  select: ProjectMilestonesSelectSchema.optional(),
  include: ProjectMilestonesIncludeSchema.optional(),
  where: ProjectMilestonesWhereUniqueInputSchema,
}).strict() ;

export const ProjectMilestonesUpdateArgsSchema: z.ZodType<Prisma.ProjectMilestonesUpdateArgs> = z.object({
  select: ProjectMilestonesSelectSchema.optional(),
  include: ProjectMilestonesIncludeSchema.optional(),
  data: z.union([ ProjectMilestonesUpdateInputSchema,ProjectMilestonesUncheckedUpdateInputSchema ]),
  where: ProjectMilestonesWhereUniqueInputSchema,
}).strict() ;

export const ProjectMilestonesUpdateManyArgsSchema: z.ZodType<Prisma.ProjectMilestonesUpdateManyArgs> = z.object({
  data: z.union([ ProjectMilestonesUpdateManyMutationInputSchema,ProjectMilestonesUncheckedUpdateManyInputSchema ]),
  where: ProjectMilestonesWhereInputSchema.optional(),
}).strict() ;

export const ProjectMilestonesDeleteManyArgsSchema: z.ZodType<Prisma.ProjectMilestonesDeleteManyArgs> = z.object({
  where: ProjectMilestonesWhereInputSchema.optional(),
}).strict() ;

export const PicturesCreateArgsSchema: z.ZodType<Prisma.PicturesCreateArgs> = z.object({
  select: PicturesSelectSchema.optional(),
  include: PicturesIncludeSchema.optional(),
  data: z.union([ PicturesCreateInputSchema,PicturesUncheckedCreateInputSchema ]),
}).strict() ;

export const PicturesUpsertArgsSchema: z.ZodType<Prisma.PicturesUpsertArgs> = z.object({
  select: PicturesSelectSchema.optional(),
  include: PicturesIncludeSchema.optional(),
  where: PicturesWhereUniqueInputSchema,
  create: z.union([ PicturesCreateInputSchema,PicturesUncheckedCreateInputSchema ]),
  update: z.union([ PicturesUpdateInputSchema,PicturesUncheckedUpdateInputSchema ]),
}).strict() ;

export const PicturesCreateManyArgsSchema: z.ZodType<Prisma.PicturesCreateManyArgs> = z.object({
  data: z.union([ PicturesCreateManyInputSchema,PicturesCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PicturesCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PicturesCreateManyAndReturnArgs> = z.object({
  data: z.union([ PicturesCreateManyInputSchema,PicturesCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PicturesDeleteArgsSchema: z.ZodType<Prisma.PicturesDeleteArgs> = z.object({
  select: PicturesSelectSchema.optional(),
  include: PicturesIncludeSchema.optional(),
  where: PicturesWhereUniqueInputSchema,
}).strict() ;

export const PicturesUpdateArgsSchema: z.ZodType<Prisma.PicturesUpdateArgs> = z.object({
  select: PicturesSelectSchema.optional(),
  include: PicturesIncludeSchema.optional(),
  data: z.union([ PicturesUpdateInputSchema,PicturesUncheckedUpdateInputSchema ]),
  where: PicturesWhereUniqueInputSchema,
}).strict() ;

export const PicturesUpdateManyArgsSchema: z.ZodType<Prisma.PicturesUpdateManyArgs> = z.object({
  data: z.union([ PicturesUpdateManyMutationInputSchema,PicturesUncheckedUpdateManyInputSchema ]),
  where: PicturesWhereInputSchema.optional(),
}).strict() ;

export const PicturesDeleteManyArgsSchema: z.ZodType<Prisma.PicturesDeleteManyArgs> = z.object({
  where: PicturesWhereInputSchema.optional(),
}).strict() ;

export const DocumentCreateArgsSchema: z.ZodType<Prisma.DocumentCreateArgs> = z.object({
  select: DocumentSelectSchema.optional(),
  include: DocumentIncludeSchema.optional(),
  data: z.union([ DocumentCreateInputSchema,DocumentUncheckedCreateInputSchema ]),
}).strict() ;

export const DocumentUpsertArgsSchema: z.ZodType<Prisma.DocumentUpsertArgs> = z.object({
  select: DocumentSelectSchema.optional(),
  include: DocumentIncludeSchema.optional(),
  where: DocumentWhereUniqueInputSchema,
  create: z.union([ DocumentCreateInputSchema,DocumentUncheckedCreateInputSchema ]),
  update: z.union([ DocumentUpdateInputSchema,DocumentUncheckedUpdateInputSchema ]),
}).strict() ;

export const DocumentCreateManyArgsSchema: z.ZodType<Prisma.DocumentCreateManyArgs> = z.object({
  data: z.union([ DocumentCreateManyInputSchema,DocumentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DocumentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DocumentCreateManyAndReturnArgs> = z.object({
  data: z.union([ DocumentCreateManyInputSchema,DocumentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DocumentDeleteArgsSchema: z.ZodType<Prisma.DocumentDeleteArgs> = z.object({
  select: DocumentSelectSchema.optional(),
  include: DocumentIncludeSchema.optional(),
  where: DocumentWhereUniqueInputSchema,
}).strict() ;

export const DocumentUpdateArgsSchema: z.ZodType<Prisma.DocumentUpdateArgs> = z.object({
  select: DocumentSelectSchema.optional(),
  include: DocumentIncludeSchema.optional(),
  data: z.union([ DocumentUpdateInputSchema,DocumentUncheckedUpdateInputSchema ]),
  where: DocumentWhereUniqueInputSchema,
}).strict() ;

export const DocumentUpdateManyArgsSchema: z.ZodType<Prisma.DocumentUpdateManyArgs> = z.object({
  data: z.union([ DocumentUpdateManyMutationInputSchema,DocumentUncheckedUpdateManyInputSchema ]),
  where: DocumentWhereInputSchema.optional(),
}).strict() ;

export const DocumentDeleteManyArgsSchema: z.ZodType<Prisma.DocumentDeleteManyArgs> = z.object({
  where: DocumentWhereInputSchema.optional(),
}).strict() ;

export const DocumentEventCreateArgsSchema: z.ZodType<Prisma.DocumentEventCreateArgs> = z.object({
  select: DocumentEventSelectSchema.optional(),
  include: DocumentEventIncludeSchema.optional(),
  data: z.union([ DocumentEventCreateInputSchema,DocumentEventUncheckedCreateInputSchema ]),
}).strict() ;

export const DocumentEventUpsertArgsSchema: z.ZodType<Prisma.DocumentEventUpsertArgs> = z.object({
  select: DocumentEventSelectSchema.optional(),
  include: DocumentEventIncludeSchema.optional(),
  where: DocumentEventWhereUniqueInputSchema,
  create: z.union([ DocumentEventCreateInputSchema,DocumentEventUncheckedCreateInputSchema ]),
  update: z.union([ DocumentEventUpdateInputSchema,DocumentEventUncheckedUpdateInputSchema ]),
}).strict() ;

export const DocumentEventCreateManyArgsSchema: z.ZodType<Prisma.DocumentEventCreateManyArgs> = z.object({
  data: z.union([ DocumentEventCreateManyInputSchema,DocumentEventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DocumentEventCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DocumentEventCreateManyAndReturnArgs> = z.object({
  data: z.union([ DocumentEventCreateManyInputSchema,DocumentEventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DocumentEventDeleteArgsSchema: z.ZodType<Prisma.DocumentEventDeleteArgs> = z.object({
  select: DocumentEventSelectSchema.optional(),
  include: DocumentEventIncludeSchema.optional(),
  where: DocumentEventWhereUniqueInputSchema,
}).strict() ;

export const DocumentEventUpdateArgsSchema: z.ZodType<Prisma.DocumentEventUpdateArgs> = z.object({
  select: DocumentEventSelectSchema.optional(),
  include: DocumentEventIncludeSchema.optional(),
  data: z.union([ DocumentEventUpdateInputSchema,DocumentEventUncheckedUpdateInputSchema ]),
  where: DocumentEventWhereUniqueInputSchema,
}).strict() ;

export const DocumentEventUpdateManyArgsSchema: z.ZodType<Prisma.DocumentEventUpdateManyArgs> = z.object({
  data: z.union([ DocumentEventUpdateManyMutationInputSchema,DocumentEventUncheckedUpdateManyInputSchema ]),
  where: DocumentEventWhereInputSchema.optional(),
}).strict() ;

export const DocumentEventDeleteManyArgsSchema: z.ZodType<Prisma.DocumentEventDeleteManyArgs> = z.object({
  where: DocumentEventWhereInputSchema.optional(),
}).strict() ;

export const AddressCreateArgsSchema: z.ZodType<Prisma.AddressCreateArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  data: z.union([ AddressCreateInputSchema,AddressUncheckedCreateInputSchema ]),
}).strict() ;

export const AddressUpsertArgsSchema: z.ZodType<Prisma.AddressUpsertArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
  create: z.union([ AddressCreateInputSchema,AddressUncheckedCreateInputSchema ]),
  update: z.union([ AddressUpdateInputSchema,AddressUncheckedUpdateInputSchema ]),
}).strict() ;

export const AddressCreateManyArgsSchema: z.ZodType<Prisma.AddressCreateManyArgs> = z.object({
  data: z.union([ AddressCreateManyInputSchema,AddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AddressCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AddressCreateManyAndReturnArgs> = z.object({
  data: z.union([ AddressCreateManyInputSchema,AddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AddressDeleteArgsSchema: z.ZodType<Prisma.AddressDeleteArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const AddressUpdateArgsSchema: z.ZodType<Prisma.AddressUpdateArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  data: z.union([ AddressUpdateInputSchema,AddressUncheckedUpdateInputSchema ]),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const AddressUpdateManyArgsSchema: z.ZodType<Prisma.AddressUpdateManyArgs> = z.object({
  data: z.union([ AddressUpdateManyMutationInputSchema,AddressUncheckedUpdateManyInputSchema ]),
  where: AddressWhereInputSchema.optional(),
}).strict() ;

export const AddressDeleteManyArgsSchema: z.ZodType<Prisma.AddressDeleteManyArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
}).strict() ;