import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','clerkId','role','email','firstName','lastName','phoneNumber','hubspotId','ssn','userOrgId','referralSource','dateOfBirth']);

export const DealScalarFieldEnumSchema = z.enum(['id','projectId','dealStage','hubspotId','transactionId','investmentEntity','organizationId','closingDate','signaturesCompletedDate','dateFundsSent','paymentMethod','paymentReferenceId']);

export const DealInvestmentStatsScalarFieldEnumSchema = z.enum(['id','dealId','amount','financingType','unitType','ownershipType','numberAUnits','numberCUnits','shareOfEquity','debtInterestRatePerc','debtPaymentFreq','debtTermMonthsMax','debtTermMonthsMin','equityTermMonths','debtPaymentFreqMonths','equityPreferredReturn']);

export const OrganizationScalarFieldEnumSchema = z.enum(['id','name','ownerId','tin','dateOfCreation','juristication','ownershipType','isPrimary']);

export const MemberScalarFieldEnumSchema = z.enum(['id','userId','organizationId','type','title']);

export const AccreditationVerificationScalarFieldEnumSchema = z.enum(['id','dealId','verifierId','method','basis']);

export const AccreditationVerifierScalarFieldEnumSchema = z.enum(['id','firstName','lastName','title','phoneNumber','email']);

export const DealDocumentScalarFieldEnumSchema = z.enum(['id','name','type','dealId','dateCreated','path','uploadedById','taxYear']);

export const OrganizationDocumentScalarFieldEnumSchema = z.enum(['id','name','organizationId','dateCreated','path','key','uploadedById']);

export const ProjectScalarFieldEnumSchema = z.enum(['id','name','location','tags','status','description','marketHighlights','youtubeUrl','slug','equityReturnsFile']);

export const ProjectPropertyStatsScalarFieldEnumSchema = z.enum(['id','avgRent','avgUnitSize','commercialSqFt','numUnits','projectId']);

export const ProjectInvestmentStatsScalarFieldEnumSchema = z.enum(['id','cUnitThresholdAmount','debtMinInvestment','debtPaymentFreq','equityIRR','equityMinInvestment','equityPaymentFreq','equityTermMonths','investmentGoal','investmentRaised','projectId','targetEquityMultiple','totalAUnitReturn','totalCUnitReturn','interestRateDollarThreshold','interestRateMax','interestRateMin','equityPreferredReturn','debtPaymentFreqMonths','debtTermMonthsMax','debtTermMonthsMin','equityPaymentFreqMonths','boolDebt','boolEquity']);

export const ProjectPaymentInfoScalarFieldEnumSchema = z.enum(['id','projectId','investmentEntity','accountNumber','routingNumber']);

export const ProjectMilestonesScalarFieldEnumSchema = z.enum(['id','projectId','equityContribution','financialClosing','groundBreakingCeremony','startVerticalConstruction','toppingOut','preLeasing','fullEnclosure','temporaryOccupancy','grandOpening','stabilized','refinance','sale']);

export const ProjectPictureScalarFieldEnumSchema = z.enum(['id','projectId','url','type']);

export const ProjectDocumentScalarFieldEnumSchema = z.enum(['id','name','fileName','description','link','projectId','dealStage','financingTypes','documentType','docusignTemplateId']);

export const DocumentEventScalarFieldEnumSchema = z.enum(['id','userId','documentId','date','type']);

export const DocusignEventScalarFieldEnumSchema = z.enum(['id','envelopeId','templateId','userId','dealId','dateSent','dateCompleted','allSignaturesCompleted','investorSignatureCompleted']);

export const AddressScalarFieldEnumSchema = z.enum(['id','street','city','zipcode','state','country','organizationId','userId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const DealDocumentTypeSchema = z.enum(['K1','VERIFICATION_ACCREDITATION','INVESTMENT_DOCUMENT']);

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

export const MembershipTypeSchema = z.enum(['OWNER','COINVESTOR','CPA']);

export type MembershipTypeType = `${z.infer<typeof MembershipTypeSchema>}`

export const DealFinancingTypeSchema = z.enum(['equity','promissory_note_now','promissory_to_equity','promissory_note_at_closing']);

export type DealFinancingTypeType = `${z.infer<typeof DealFinancingTypeSchema>}`

export const DealOwnershipTypeSchema = z.enum(['INDIVIDUAL','JOINT','CORPORATION','TRUST','OTHER','MARITAL','COMMON','PARTNERSHIP']);

export type DealOwnershipTypeType = `${z.infer<typeof DealOwnershipTypeSchema>}`

export const DealUnitTypeSchema = z.enum(['AUNIT','CUNIT','BUNIT']);

export type DealUnitTypeType = `${z.infer<typeof DealUnitTypeSchema>}`

export const VerificationBasisSchema = z.enum(['INCOME','ASSETS','LICENSE','OTHER']);

export type VerificationBasisType = `${z.infer<typeof VerificationBasisSchema>}`

export const VerificationMethodSchema = z.enum(['SELF','THIRD_PARTY']);

export type VerificationMethodType = `${z.infer<typeof VerificationMethodSchema>}`

export const PaymentMethodSchema = z.enum(['ACH','WIRE','CHECK']);

export type PaymentMethodType = `${z.infer<typeof PaymentMethodSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.number().int(),
  clerkId: z.string().nullable(),
  email: z.string(),
  /**
   * @encrypted
   */
  firstName: z.string(),
  /**
   * @encrypted
   */
  lastName: z.string(),
  phoneNumber: z.string().nullable(),
  hubspotId: z.string(),
  /**
   * @encrypted?mode=strict
   */
  ssn: z.string().nullable(),
  userOrgId: z.number().int().nullable(),
  referralSource: z.string().nullable(),
  dateOfBirth: z.coerce.date().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// DEAL SCHEMA
/////////////////////////////////////////

export const DealSchema = z.object({
  paymentMethod: PaymentMethodSchema.nullable(),
  id: z.number().int(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string(),
  /**
   * the project, i.e. Edison LLC
   */
  investmentEntity: z.string(),
  organizationId: z.number().int(),
  closingDate: z.coerce.date().nullable(),
  signaturesCompletedDate: z.coerce.date().nullable(),
  dateFundsSent: z.coerce.date().nullable(),
  paymentReferenceId: z.string().nullable(),
})

export type Deal = z.infer<typeof DealSchema>

/////////////////////////////////////////
// DEAL INVESTMENT STATS SCHEMA
/////////////////////////////////////////

/**
 * used to manifest the agreed upon terms of the deal
 */
export const DealInvestmentStatsSchema = z.object({
  financingType: DealFinancingTypeSchema,
  unitType: DealUnitTypeSchema,
  ownershipType: DealOwnershipTypeSchema,
  id: z.number().int(),
  dealId: z.number().int(),
  amount: z.number(),
  numberAUnits: z.number(),
  numberCUnits: z.number(),
  shareOfEquity: z.number(),
  debtInterestRatePerc: z.number(),
  debtPaymentFreq: z.string(),
  debtTermMonthsMax: z.number().int(),
  debtTermMonthsMin: z.number().int(),
  equityTermMonths: z.number().int(),
  debtPaymentFreqMonths: z.number().int(),
  equityPreferredReturn: z.number(),
})

export type DealInvestmentStats = z.infer<typeof DealInvestmentStatsSchema>

/////////////////////////////////////////
// ORGANIZATION SCHEMA
/////////////////////////////////////////

export const OrganizationSchema = z.object({
  ownershipType: DealOwnershipTypeSchema,
  id: z.number().int(),
  /**
   * @encrypted
   */
  name: z.string(),
  ownerId: z.number().int(),
  /**
   * @encrypted?mode=strict
   */
  tin: z.string().nullable(),
  dateOfCreation: z.coerce.date().nullable(),
  juristication: z.string().nullable(),
  /**
   * used to determine which organization is the primary individual one for the user
   */
  isPrimary: z.boolean(),
})

export type Organization = z.infer<typeof OrganizationSchema>

/////////////////////////////////////////
// MEMBER SCHEMA
/////////////////////////////////////////

export const MemberSchema = z.object({
  type: MembershipTypeSchema,
  id: z.number().int(),
  userId: z.number().int(),
  organizationId: z.number().int(),
  title: z.string().nullable(),
})

export type Member = z.infer<typeof MemberSchema>

/////////////////////////////////////////
// ACCREDITATION VERIFICATION SCHEMA
/////////////////////////////////////////

export const AccreditationVerificationSchema = z.object({
  method: VerificationMethodSchema,
  basis: VerificationBasisSchema,
  id: z.number().int(),
  dealId: z.number().int(),
  verifierId: z.number().int().nullable(),
})

export type AccreditationVerification = z.infer<typeof AccreditationVerificationSchema>

/////////////////////////////////////////
// ACCREDITATION VERIFIER SCHEMA
/////////////////////////////////////////

export const AccreditationVerifierSchema = z.object({
  id: z.number().int(),
  /**
   * @encrypted?mode=strict
   */
  firstName: z.string(),
  /**
   * @encrypted?mode=strict
   */
  lastName: z.string(),
  title: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  email: z.string(),
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
  dealId: z.number().int(),
  dateCreated: z.coerce.date(),
  path: z.string(),
  uploadedById: z.number().int(),
  taxYear: z.number().int().nullable(),
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
  organizationId: z.number().int(),
  dateCreated: z.coerce.date(),
  path: z.string(),
  key: z.string(),
  uploadedById: z.number().int(),
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
  tags: z.string(),
  description: z.string(),
  marketHighlights: z.string(),
  youtubeUrl: z.string(),
  slug: z.string(),
  equityReturnsFile: z.string(),
})

export type Project = z.infer<typeof ProjectSchema>

/////////////////////////////////////////
// PROJECT PROPERTY STATS SCHEMA
/////////////////////////////////////////

export const ProjectPropertyStatsSchema = z.object({
  id: z.number().int(),
  avgRent: z.number().int(),
  avgUnitSize: z.number().int(),
  commercialSqFt: z.number().int(),
  numUnits: z.number().int(),
  projectId: z.number().int(),
})

export type ProjectPropertyStats = z.infer<typeof ProjectPropertyStatsSchema>

/////////////////////////////////////////
// PROJECT INVESTMENT STATS SCHEMA
/////////////////////////////////////////

export const ProjectInvestmentStatsSchema = z.object({
  id: z.number().int(),
  cUnitThresholdAmount: z.number(),
  debtMinInvestment: z.number().int(),
  debtPaymentFreq: z.string(),
  equityIRR: z.number(),
  equityMinInvestment: z.number().int(),
  equityPaymentFreq: z.string(),
  equityTermMonths: z.number().int(),
  investmentGoal: z.number(),
  investmentRaised: z.number(),
  projectId: z.number().int(),
  targetEquityMultiple: z.number(),
  totalAUnitReturn: z.number(),
  totalCUnitReturn: z.number(),
  interestRateDollarThreshold: z.number(),
  interestRateMax: z.number(),
  interestRateMin: z.number(),
  equityPreferredReturn: z.number(),
  debtPaymentFreqMonths: z.number().int(),
  debtTermMonthsMax: z.number().int(),
  debtTermMonthsMin: z.number().int(),
  equityPaymentFreqMonths: z.number().int(),
  /**
   * if the project is offering debt
   */
  boolDebt: z.boolean(),
  /**
   * if the project is offering equity
   */
  boolEquity: z.boolean(),
})

export type ProjectInvestmentStats = z.infer<typeof ProjectInvestmentStatsSchema>

/////////////////////////////////////////
// PROJECT PAYMENT INFO SCHEMA
/////////////////////////////////////////

export const ProjectPaymentInfoSchema = z.object({
  id: z.number().int(),
  projectId: z.number().int(),
  investmentEntity: z.string(),
  /**
   * @encrypted
   */
  accountNumber: z.string(),
  /**
   * @encrypted
   */
  routingNumber: z.string(),
})

export type ProjectPaymentInfo = z.infer<typeof ProjectPaymentInfoSchema>

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
// PROJECT PICTURE SCHEMA
/////////////////////////////////////////

/**
 * Project specific pictures
 */
export const ProjectPictureSchema = z.object({
  type: PictureTypeSchema,
  id: z.number().int(),
  projectId: z.number().int(),
  url: z.string(),
})

export type ProjectPicture = z.infer<typeof ProjectPictureSchema>

/////////////////////////////////////////
// PROJECT DOCUMENT SCHEMA
/////////////////////////////////////////

/**
 * project documents that all logged in users can see
 */
export const ProjectDocumentSchema = z.object({
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

export type ProjectDocument = z.infer<typeof ProjectDocumentSchema>

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
// DOCUSIGN EVENT SCHEMA
/////////////////////////////////////////

export const DocusignEventSchema = z.object({
  id: z.number().int(),
  envelopeId: z.string(),
  templateId: z.string(),
  userId: z.number().int(),
  dealId: z.number().int(),
  dateSent: z.coerce.date().nullable(),
  dateCompleted: z.coerce.date().nullable(),
  allSignaturesCompleted: z.boolean(),
  investorSignatureCompleted: z.boolean(),
})

export type DocusignEvent = z.infer<typeof DocusignEventSchema>

/////////////////////////////////////////
// ADDRESS SCHEMA
/////////////////////////////////////////

export const AddressSchema = z.object({
  id: z.number().int(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  country: z.string(),
  organizationId: z.number().int().nullable(),
  userId: z.number().int().nullable(),
})

export type Address = z.infer<typeof AddressSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  DealDocumentUploaded: z.union([z.boolean(),z.lazy(() => DealDocumentFindManyArgsSchema)]).optional(),
  documentEvents: z.union([z.boolean(),z.lazy(() => DocumentEventFindManyArgsSchema)]).optional(),
  DocusignEvent: z.union([z.boolean(),z.lazy(() => DocusignEventFindManyArgsSchema)]).optional(),
  organizationMember: z.union([z.boolean(),z.lazy(() => MemberFindManyArgsSchema)]).optional(),
  organizationsOwned: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  OrganizationDocumentUploaded: z.union([z.boolean(),z.lazy(() => OrganizationDocumentFindManyArgsSchema)]).optional(),
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
  DealDocumentUploaded: z.boolean().optional(),
  documentEvents: z.boolean().optional(),
  DocusignEvent: z.boolean().optional(),
  organizationMember: z.boolean().optional(),
  organizationsOwned: z.boolean().optional(),
  OrganizationDocumentUploaded: z.boolean().optional(),
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
  ssn: z.boolean().optional(),
  userOrgId: z.boolean().optional(),
  referralSource: z.boolean().optional(),
  dateOfBirth: z.boolean().optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  DealDocumentUploaded: z.union([z.boolean(),z.lazy(() => DealDocumentFindManyArgsSchema)]).optional(),
  documentEvents: z.union([z.boolean(),z.lazy(() => DocumentEventFindManyArgsSchema)]).optional(),
  DocusignEvent: z.union([z.boolean(),z.lazy(() => DocusignEventFindManyArgsSchema)]).optional(),
  organizationMember: z.union([z.boolean(),z.lazy(() => MemberFindManyArgsSchema)]).optional(),
  organizationsOwned: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  OrganizationDocumentUploaded: z.union([z.boolean(),z.lazy(() => OrganizationDocumentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DEAL
//------------------------------------------------------

export const DealIncludeSchema: z.ZodType<Prisma.DealInclude> = z.object({
  accreditationVerification: z.union([z.boolean(),z.lazy(() => AccreditationVerificationArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  document: z.union([z.boolean(),z.lazy(() => DealDocumentFindManyArgsSchema)]).optional(),
  investmentStats: z.union([z.boolean(),z.lazy(() => DealInvestmentStatsArgsSchema)]).optional(),
  DocusignEvent: z.union([z.boolean(),z.lazy(() => DocusignEventFindManyArgsSchema)]).optional(),
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
  DocusignEvent: z.boolean().optional(),
}).strict();

export const DealSelectSchema: z.ZodType<Prisma.DealSelect> = z.object({
  id: z.boolean().optional(),
  projectId: z.boolean().optional(),
  dealStage: z.boolean().optional(),
  hubspotId: z.boolean().optional(),
  transactionId: z.boolean().optional(),
  investmentEntity: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  closingDate: z.boolean().optional(),
  signaturesCompletedDate: z.boolean().optional(),
  dateFundsSent: z.boolean().optional(),
  paymentMethod: z.boolean().optional(),
  paymentReferenceId: z.boolean().optional(),
  accreditationVerification: z.union([z.boolean(),z.lazy(() => AccreditationVerificationArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  document: z.union([z.boolean(),z.lazy(() => DealDocumentFindManyArgsSchema)]).optional(),
  investmentStats: z.union([z.boolean(),z.lazy(() => DealInvestmentStatsArgsSchema)]).optional(),
  DocusignEvent: z.union([z.boolean(),z.lazy(() => DocusignEventFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DealCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DEAL INVESTMENT STATS
//------------------------------------------------------

export const DealInvestmentStatsIncludeSchema: z.ZodType<Prisma.DealInvestmentStatsInclude> = z.object({
  deal: z.union([z.boolean(),z.lazy(() => DealArgsSchema)]).optional(),
}).strict()

export const DealInvestmentStatsArgsSchema: z.ZodType<Prisma.DealInvestmentStatsDefaultArgs> = z.object({
  select: z.lazy(() => DealInvestmentStatsSelectSchema).optional(),
  include: z.lazy(() => DealInvestmentStatsIncludeSchema).optional(),
}).strict();

export const DealInvestmentStatsSelectSchema: z.ZodType<Prisma.DealInvestmentStatsSelect> = z.object({
  id: z.boolean().optional(),
  dealId: z.boolean().optional(),
  amount: z.boolean().optional(),
  financingType: z.boolean().optional(),
  unitType: z.boolean().optional(),
  ownershipType: z.boolean().optional(),
  numberAUnits: z.boolean().optional(),
  numberCUnits: z.boolean().optional(),
  shareOfEquity: z.boolean().optional(),
  debtInterestRatePerc: z.boolean().optional(),
  debtPaymentFreq: z.boolean().optional(),
  debtTermMonthsMax: z.boolean().optional(),
  debtTermMonthsMin: z.boolean().optional(),
  equityTermMonths: z.boolean().optional(),
  debtPaymentFreqMonths: z.boolean().optional(),
  equityPreferredReturn: z.boolean().optional(),
  deal: z.union([z.boolean(),z.lazy(() => DealArgsSchema)]).optional(),
}).strict()

// ORGANIZATION
//------------------------------------------------------

export const OrganizationIncludeSchema: z.ZodType<Prisma.OrganizationInclude> = z.object({
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  members: z.union([z.boolean(),z.lazy(() => MemberFindManyArgsSchema)]).optional(),
  ownedBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  document: z.union([z.boolean(),z.lazy(() => OrganizationDocumentFindManyArgsSchema)]).optional(),
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
  deals: z.boolean().optional(),
  members: z.boolean().optional(),
  document: z.boolean().optional(),
}).strict();

export const OrganizationSelectSchema: z.ZodType<Prisma.OrganizationSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  tin: z.boolean().optional(),
  dateOfCreation: z.boolean().optional(),
  juristication: z.boolean().optional(),
  ownershipType: z.boolean().optional(),
  isPrimary: z.boolean().optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  members: z.union([z.boolean(),z.lazy(() => MemberFindManyArgsSchema)]).optional(),
  ownedBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  document: z.union([z.boolean(),z.lazy(() => OrganizationDocumentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrganizationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MEMBER
//------------------------------------------------------

export const MemberIncludeSchema: z.ZodType<Prisma.MemberInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const MemberArgsSchema: z.ZodType<Prisma.MemberDefaultArgs> = z.object({
  select: z.lazy(() => MemberSelectSchema).optional(),
  include: z.lazy(() => MemberIncludeSchema).optional(),
}).strict();

export const MemberSelectSchema: z.ZodType<Prisma.MemberSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  type: z.boolean().optional(),
  title: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ACCREDITATION VERIFICATION
//------------------------------------------------------

export const AccreditationVerificationIncludeSchema: z.ZodType<Prisma.AccreditationVerificationInclude> = z.object({
  deal: z.union([z.boolean(),z.lazy(() => DealArgsSchema)]).optional(),
  verifier: z.union([z.boolean(),z.lazy(() => AccreditationVerifierArgsSchema)]).optional(),
}).strict()

export const AccreditationVerificationArgsSchema: z.ZodType<Prisma.AccreditationVerificationDefaultArgs> = z.object({
  select: z.lazy(() => AccreditationVerificationSelectSchema).optional(),
  include: z.lazy(() => AccreditationVerificationIncludeSchema).optional(),
}).strict();

export const AccreditationVerificationSelectSchema: z.ZodType<Prisma.AccreditationVerificationSelect> = z.object({
  id: z.boolean().optional(),
  dealId: z.boolean().optional(),
  verifierId: z.boolean().optional(),
  method: z.boolean().optional(),
  basis: z.boolean().optional(),
  deal: z.union([z.boolean(),z.lazy(() => DealArgsSchema)]).optional(),
  verifier: z.union([z.boolean(),z.lazy(() => AccreditationVerifierArgsSchema)]).optional(),
}).strict()

// ACCREDITATION VERIFIER
//------------------------------------------------------

export const AccreditationVerifierIncludeSchema: z.ZodType<Prisma.AccreditationVerifierInclude> = z.object({
  AccreditationVerification: z.union([z.boolean(),z.lazy(() => AccreditationVerificationArgsSchema)]).optional(),
}).strict()

export const AccreditationVerifierArgsSchema: z.ZodType<Prisma.AccreditationVerifierDefaultArgs> = z.object({
  select: z.lazy(() => AccreditationVerifierSelectSchema).optional(),
  include: z.lazy(() => AccreditationVerifierIncludeSchema).optional(),
}).strict();

export const AccreditationVerifierSelectSchema: z.ZodType<Prisma.AccreditationVerifierSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  title: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  email: z.boolean().optional(),
  AccreditationVerification: z.union([z.boolean(),z.lazy(() => AccreditationVerificationArgsSchema)]).optional(),
}).strict()

// DEAL DOCUMENT
//------------------------------------------------------

export const DealDocumentIncludeSchema: z.ZodType<Prisma.DealDocumentInclude> = z.object({
  deal: z.union([z.boolean(),z.lazy(() => DealArgsSchema)]).optional(),
  uploadedBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const DealDocumentArgsSchema: z.ZodType<Prisma.DealDocumentDefaultArgs> = z.object({
  select: z.lazy(() => DealDocumentSelectSchema).optional(),
  include: z.lazy(() => DealDocumentIncludeSchema).optional(),
}).strict();

export const DealDocumentSelectSchema: z.ZodType<Prisma.DealDocumentSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  dealId: z.boolean().optional(),
  dateCreated: z.boolean().optional(),
  path: z.boolean().optional(),
  uploadedById: z.boolean().optional(),
  taxYear: z.boolean().optional(),
  deal: z.union([z.boolean(),z.lazy(() => DealArgsSchema)]).optional(),
  uploadedBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ORGANIZATION DOCUMENT
//------------------------------------------------------

export const OrganizationDocumentIncludeSchema: z.ZodType<Prisma.OrganizationDocumentInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  uploadedBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const OrganizationDocumentArgsSchema: z.ZodType<Prisma.OrganizationDocumentDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationDocumentSelectSchema).optional(),
  include: z.lazy(() => OrganizationDocumentIncludeSchema).optional(),
}).strict();

export const OrganizationDocumentSelectSchema: z.ZodType<Prisma.OrganizationDocumentSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  dateCreated: z.boolean().optional(),
  path: z.boolean().optional(),
  key: z.boolean().optional(),
  uploadedById: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  uploadedBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// PROJECT
//------------------------------------------------------

export const ProjectIncludeSchema: z.ZodType<Prisma.ProjectInclude> = z.object({
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  documents: z.union([z.boolean(),z.lazy(() => ProjectDocumentFindManyArgsSchema)]).optional(),
  investmentStats: z.union([z.boolean(),z.lazy(() => ProjectInvestmentStatsArgsSchema)]).optional(),
  milestones: z.union([z.boolean(),z.lazy(() => ProjectMilestonesArgsSchema)]).optional(),
  projectPaymentInfo: z.union([z.boolean(),z.lazy(() => ProjectPaymentInfoFindManyArgsSchema)]).optional(),
  pictures: z.union([z.boolean(),z.lazy(() => ProjectPictureFindManyArgsSchema)]).optional(),
  propertyStats: z.union([z.boolean(),z.lazy(() => ProjectPropertyStatsArgsSchema)]).optional(),
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
  projectPaymentInfo: z.boolean().optional(),
  pictures: z.boolean().optional(),
}).strict();

export const ProjectSelectSchema: z.ZodType<Prisma.ProjectSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  location: z.boolean().optional(),
  tags: z.boolean().optional(),
  status: z.boolean().optional(),
  description: z.boolean().optional(),
  marketHighlights: z.boolean().optional(),
  youtubeUrl: z.boolean().optional(),
  slug: z.boolean().optional(),
  equityReturnsFile: z.boolean().optional(),
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  documents: z.union([z.boolean(),z.lazy(() => ProjectDocumentFindManyArgsSchema)]).optional(),
  investmentStats: z.union([z.boolean(),z.lazy(() => ProjectInvestmentStatsArgsSchema)]).optional(),
  milestones: z.union([z.boolean(),z.lazy(() => ProjectMilestonesArgsSchema)]).optional(),
  projectPaymentInfo: z.union([z.boolean(),z.lazy(() => ProjectPaymentInfoFindManyArgsSchema)]).optional(),
  pictures: z.union([z.boolean(),z.lazy(() => ProjectPictureFindManyArgsSchema)]).optional(),
  propertyStats: z.union([z.boolean(),z.lazy(() => ProjectPropertyStatsArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProjectCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROJECT PROPERTY STATS
//------------------------------------------------------

export const ProjectPropertyStatsIncludeSchema: z.ZodType<Prisma.ProjectPropertyStatsInclude> = z.object({
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
}).strict()

export const ProjectPropertyStatsArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsDefaultArgs> = z.object({
  select: z.lazy(() => ProjectPropertyStatsSelectSchema).optional(),
  include: z.lazy(() => ProjectPropertyStatsIncludeSchema).optional(),
}).strict();

export const ProjectPropertyStatsSelectSchema: z.ZodType<Prisma.ProjectPropertyStatsSelect> = z.object({
  id: z.boolean().optional(),
  avgRent: z.boolean().optional(),
  avgUnitSize: z.boolean().optional(),
  commercialSqFt: z.boolean().optional(),
  numUnits: z.boolean().optional(),
  projectId: z.boolean().optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
}).strict()

// PROJECT INVESTMENT STATS
//------------------------------------------------------

export const ProjectInvestmentStatsIncludeSchema: z.ZodType<Prisma.ProjectInvestmentStatsInclude> = z.object({
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
}).strict()

export const ProjectInvestmentStatsArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsDefaultArgs> = z.object({
  select: z.lazy(() => ProjectInvestmentStatsSelectSchema).optional(),
  include: z.lazy(() => ProjectInvestmentStatsIncludeSchema).optional(),
}).strict();

export const ProjectInvestmentStatsSelectSchema: z.ZodType<Prisma.ProjectInvestmentStatsSelect> = z.object({
  id: z.boolean().optional(),
  cUnitThresholdAmount: z.boolean().optional(),
  debtMinInvestment: z.boolean().optional(),
  debtPaymentFreq: z.boolean().optional(),
  equityIRR: z.boolean().optional(),
  equityMinInvestment: z.boolean().optional(),
  equityPaymentFreq: z.boolean().optional(),
  equityTermMonths: z.boolean().optional(),
  investmentGoal: z.boolean().optional(),
  investmentRaised: z.boolean().optional(),
  projectId: z.boolean().optional(),
  targetEquityMultiple: z.boolean().optional(),
  totalAUnitReturn: z.boolean().optional(),
  totalCUnitReturn: z.boolean().optional(),
  interestRateDollarThreshold: z.boolean().optional(),
  interestRateMax: z.boolean().optional(),
  interestRateMin: z.boolean().optional(),
  equityPreferredReturn: z.boolean().optional(),
  debtPaymentFreqMonths: z.boolean().optional(),
  debtTermMonthsMax: z.boolean().optional(),
  debtTermMonthsMin: z.boolean().optional(),
  equityPaymentFreqMonths: z.boolean().optional(),
  boolDebt: z.boolean().optional(),
  boolEquity: z.boolean().optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
}).strict()

// PROJECT PAYMENT INFO
//------------------------------------------------------

export const ProjectPaymentInfoIncludeSchema: z.ZodType<Prisma.ProjectPaymentInfoInclude> = z.object({
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
}).strict()

export const ProjectPaymentInfoArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoDefaultArgs> = z.object({
  select: z.lazy(() => ProjectPaymentInfoSelectSchema).optional(),
  include: z.lazy(() => ProjectPaymentInfoIncludeSchema).optional(),
}).strict();

export const ProjectPaymentInfoSelectSchema: z.ZodType<Prisma.ProjectPaymentInfoSelect> = z.object({
  id: z.boolean().optional(),
  projectId: z.boolean().optional(),
  investmentEntity: z.boolean().optional(),
  accountNumber: z.boolean().optional(),
  routingNumber: z.boolean().optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
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

// PROJECT PICTURE
//------------------------------------------------------

export const ProjectPictureIncludeSchema: z.ZodType<Prisma.ProjectPictureInclude> = z.object({
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
}).strict()

export const ProjectPictureArgsSchema: z.ZodType<Prisma.ProjectPictureDefaultArgs> = z.object({
  select: z.lazy(() => ProjectPictureSelectSchema).optional(),
  include: z.lazy(() => ProjectPictureIncludeSchema).optional(),
}).strict();

export const ProjectPictureSelectSchema: z.ZodType<Prisma.ProjectPictureSelect> = z.object({
  id: z.boolean().optional(),
  projectId: z.boolean().optional(),
  url: z.boolean().optional(),
  type: z.boolean().optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
}).strict()

// PROJECT DOCUMENT
//------------------------------------------------------

export const ProjectDocumentIncludeSchema: z.ZodType<Prisma.ProjectDocumentInclude> = z.object({
  documentEvents: z.union([z.boolean(),z.lazy(() => DocumentEventFindManyArgsSchema)]).optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProjectDocumentCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ProjectDocumentArgsSchema: z.ZodType<Prisma.ProjectDocumentDefaultArgs> = z.object({
  select: z.lazy(() => ProjectDocumentSelectSchema).optional(),
  include: z.lazy(() => ProjectDocumentIncludeSchema).optional(),
}).strict();

export const ProjectDocumentCountOutputTypeArgsSchema: z.ZodType<Prisma.ProjectDocumentCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProjectDocumentCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProjectDocumentCountOutputTypeSelectSchema: z.ZodType<Prisma.ProjectDocumentCountOutputTypeSelect> = z.object({
  documentEvents: z.boolean().optional(),
}).strict();

export const ProjectDocumentSelectSchema: z.ZodType<Prisma.ProjectDocumentSelect> = z.object({
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
  documentEvents: z.union([z.boolean(),z.lazy(() => DocumentEventFindManyArgsSchema)]).optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProjectDocumentCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DOCUMENT EVENT
//------------------------------------------------------

export const DocumentEventIncludeSchema: z.ZodType<Prisma.DocumentEventInclude> = z.object({
  document: z.union([z.boolean(),z.lazy(() => ProjectDocumentArgsSchema)]).optional(),
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
  document: z.union([z.boolean(),z.lazy(() => ProjectDocumentArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// DOCUSIGN EVENT
//------------------------------------------------------

export const DocusignEventIncludeSchema: z.ZodType<Prisma.DocusignEventInclude> = z.object({
  deal: z.union([z.boolean(),z.lazy(() => DealArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const DocusignEventArgsSchema: z.ZodType<Prisma.DocusignEventDefaultArgs> = z.object({
  select: z.lazy(() => DocusignEventSelectSchema).optional(),
  include: z.lazy(() => DocusignEventIncludeSchema).optional(),
}).strict();

export const DocusignEventSelectSchema: z.ZodType<Prisma.DocusignEventSelect> = z.object({
  id: z.boolean().optional(),
  envelopeId: z.boolean().optional(),
  templateId: z.boolean().optional(),
  userId: z.boolean().optional(),
  dealId: z.boolean().optional(),
  dateSent: z.boolean().optional(),
  dateCompleted: z.boolean().optional(),
  allSignaturesCompleted: z.boolean().optional(),
  investorSignatureCompleted: z.boolean().optional(),
  deal: z.union([z.boolean(),z.lazy(() => DealArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ADDRESS
//------------------------------------------------------

export const AddressIncludeSchema: z.ZodType<Prisma.AddressInclude> = z.object({
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const AddressArgsSchema: z.ZodType<Prisma.AddressDefaultArgs> = z.object({
  select: z.lazy(() => AddressSelectSchema).optional(),
  include: z.lazy(() => AddressIncludeSchema).optional(),
}).strict();

export const AddressSelectSchema: z.ZodType<Prisma.AddressSelect> = z.object({
  id: z.boolean().optional(),
  street: z.boolean().optional(),
  city: z.boolean().optional(),
  zipcode: z.boolean().optional(),
  state: z.boolean().optional(),
  country: z.boolean().optional(),
  organizationId: z.boolean().optional(),
  userId: z.boolean().optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ssn: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userOrgId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  referralSource: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dateOfBirth: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  address: z.union([ z.lazy(() => AddressNullableScalarRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
  DealDocumentUploaded: z.lazy(() => DealDocumentListRelationFilterSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventListRelationFilterSchema).optional(),
  organizationMember: z.lazy(() => MemberListRelationFilterSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationListRelationFilterSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userOrgId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  referralSource: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateOfBirth: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.lazy(() => AddressOrderByWithRelationInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentOrderByRelationAggregateInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventOrderByRelationAggregateInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventOrderByRelationAggregateInputSchema).optional(),
  organizationMember: z.lazy(() => MemberOrderByRelationAggregateInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationOrderByRelationAggregateInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    clerkId: z.string(),
    email: z.string(),
    ssn: z.string(),
    userOrgId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
    clerkId: z.string(),
    email: z.string(),
    ssn: z.string(),
  }),
  z.object({
    id: z.number().int(),
    clerkId: z.string(),
    email: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    clerkId: z.string(),
    email: z.string(),
  }),
  z.object({
    id: z.number().int(),
    clerkId: z.string(),
    ssn: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    clerkId: z.string(),
    ssn: z.string(),
  }),
  z.object({
    id: z.number().int(),
    clerkId: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    clerkId: z.string(),
  }),
  z.object({
    id: z.number().int(),
    email: z.string(),
    ssn: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    email: z.string(),
    ssn: z.string(),
  }),
  z.object({
    id: z.number().int(),
    email: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    email: z.string(),
  }),
  z.object({
    id: z.number().int(),
    ssn: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    ssn: z.string(),
  }),
  z.object({
    id: z.number().int(),
    userOrgId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    clerkId: z.string(),
    email: z.string(),
    ssn: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    clerkId: z.string(),
    email: z.string(),
    ssn: z.string(),
  }),
  z.object({
    clerkId: z.string(),
    email: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    clerkId: z.string(),
    email: z.string(),
  }),
  z.object({
    clerkId: z.string(),
    ssn: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    clerkId: z.string(),
    ssn: z.string(),
  }),
  z.object({
    clerkId: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    clerkId: z.string(),
  }),
  z.object({
    email: z.string(),
    ssn: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    email: z.string(),
    ssn: z.string(),
  }),
  z.object({
    email: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    email: z.string(),
  }),
  z.object({
    ssn: z.string(),
    userOrgId: z.number().int(),
  }),
  z.object({
    ssn: z.string(),
  }),
  z.object({
    userOrgId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  clerkId: z.string().optional(),
  email: z.string().optional(),
  ssn: z.string().optional(),
  userOrgId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  referralSource: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dateOfBirth: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  address: z.union([ z.lazy(() => AddressNullableScalarRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
  DealDocumentUploaded: z.lazy(() => DealDocumentListRelationFilterSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventListRelationFilterSchema).optional(),
  organizationMember: z.lazy(() => MemberListRelationFilterSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationListRelationFilterSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userOrgId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  referralSource: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateOfBirth: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  clerkId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ssn: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userOrgId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  referralSource: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  dateOfBirth: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const DealWhereInputSchema: z.ZodType<Prisma.DealWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DealWhereInputSchema),z.lazy(() => DealWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealWhereInputSchema),z.lazy(() => DealWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  hubspotId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transactionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  closingDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  dateFundsSent: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => EnumPaymentMethodNullableFilterSchema),z.lazy(() => PaymentMethodSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accreditationVerification: z.union([ z.lazy(() => AccreditationVerificationNullableScalarRelationFilterSchema),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional().nullable(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  document: z.lazy(() => DealDocumentListRelationFilterSchema).optional(),
  investmentStats: z.union([ z.lazy(() => DealInvestmentStatsNullableScalarRelationFilterSchema),z.lazy(() => DealInvestmentStatsWhereInputSchema) ]).optional().nullable(),
  DocusignEvent: z.lazy(() => DocusignEventListRelationFilterSchema).optional()
}).strict();

export const DealOrderByWithRelationInputSchema: z.ZodType<Prisma.DealOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  closingDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  signaturesCompletedDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateFundsSent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  paymentReferenceId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accreditationVerification: z.lazy(() => AccreditationVerificationOrderByWithRelationInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional(),
  document: z.lazy(() => DealDocumentOrderByRelationAggregateInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsOrderByWithRelationInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventOrderByRelationAggregateInputSchema).optional()
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
  transactionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  closingDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  dateFundsSent: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => EnumPaymentMethodNullableFilterSchema),z.lazy(() => PaymentMethodSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accreditationVerification: z.union([ z.lazy(() => AccreditationVerificationNullableScalarRelationFilterSchema),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional().nullable(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  document: z.lazy(() => DealDocumentListRelationFilterSchema).optional(),
  investmentStats: z.union([ z.lazy(() => DealInvestmentStatsNullableScalarRelationFilterSchema),z.lazy(() => DealInvestmentStatsWhereInputSchema) ]).optional().nullable(),
  DocusignEvent: z.lazy(() => DocusignEventListRelationFilterSchema).optional()
}).strict());

export const DealOrderByWithAggregationInputSchema: z.ZodType<Prisma.DealOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  closingDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  signaturesCompletedDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateFundsSent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  paymentMethod: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  paymentReferenceId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  hubspotId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  transactionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  closingDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  dateFundsSent: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => EnumPaymentMethodNullableWithAggregatesFilterSchema),z.lazy(() => PaymentMethodSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const DealInvestmentStatsWhereInputSchema: z.ZodType<Prisma.DealInvestmentStatsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DealInvestmentStatsWhereInputSchema),z.lazy(() => DealInvestmentStatsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealInvestmentStatsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealInvestmentStatsWhereInputSchema),z.lazy(() => DealInvestmentStatsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  financingType: z.union([ z.lazy(() => EnumDealFinancingTypeFilterSchema),z.lazy(() => DealFinancingTypeSchema) ]).optional(),
  unitType: z.union([ z.lazy(() => EnumDealUnitTypeFilterSchema),z.lazy(() => DealUnitTypeSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional(),
  numberAUnits: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  numberCUnits: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  shareOfEquity: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  debtInterestRatePerc: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  debtPaymentFreq: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  debtTermMonthsMax: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  debtTermMonthsMin: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  equityTermMonths: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  debtPaymentFreqMonths: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  equityPreferredReturn: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  deal: z.union([ z.lazy(() => DealScalarRelationFilterSchema),z.lazy(() => DealWhereInputSchema) ]).optional(),
}).strict();

export const DealInvestmentStatsOrderByWithRelationInputSchema: z.ZodType<Prisma.DealInvestmentStatsOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.lazy(() => SortOrderSchema).optional(),
  unitType: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  shareOfEquity: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRatePerc: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional(),
  deal: z.lazy(() => DealOrderByWithRelationInputSchema).optional()
}).strict();

export const DealInvestmentStatsWhereUniqueInputSchema: z.ZodType<Prisma.DealInvestmentStatsWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    dealId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    dealId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  dealId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => DealInvestmentStatsWhereInputSchema),z.lazy(() => DealInvestmentStatsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealInvestmentStatsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealInvestmentStatsWhereInputSchema),z.lazy(() => DealInvestmentStatsWhereInputSchema).array() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  financingType: z.union([ z.lazy(() => EnumDealFinancingTypeFilterSchema),z.lazy(() => DealFinancingTypeSchema) ]).optional(),
  unitType: z.union([ z.lazy(() => EnumDealUnitTypeFilterSchema),z.lazy(() => DealUnitTypeSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional(),
  numberAUnits: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  numberCUnits: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  shareOfEquity: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  debtInterestRatePerc: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  debtPaymentFreq: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  debtTermMonthsMax: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  debtTermMonthsMin: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  equityTermMonths: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  debtPaymentFreqMonths: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  equityPreferredReturn: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  deal: z.union([ z.lazy(() => DealScalarRelationFilterSchema),z.lazy(() => DealWhereInputSchema) ]).optional(),
}).strict());

export const DealInvestmentStatsOrderByWithAggregationInputSchema: z.ZodType<Prisma.DealInvestmentStatsOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.lazy(() => SortOrderSchema).optional(),
  unitType: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  shareOfEquity: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRatePerc: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DealInvestmentStatsCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DealInvestmentStatsAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DealInvestmentStatsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DealInvestmentStatsMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DealInvestmentStatsSumOrderByAggregateInputSchema).optional()
}).strict();

export const DealInvestmentStatsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DealInvestmentStatsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DealInvestmentStatsScalarWhereWithAggregatesInputSchema),z.lazy(() => DealInvestmentStatsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealInvestmentStatsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealInvestmentStatsScalarWhereWithAggregatesInputSchema),z.lazy(() => DealInvestmentStatsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dealId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  financingType: z.union([ z.lazy(() => EnumDealFinancingTypeWithAggregatesFilterSchema),z.lazy(() => DealFinancingTypeSchema) ]).optional(),
  unitType: z.union([ z.lazy(() => EnumDealUnitTypeWithAggregatesFilterSchema),z.lazy(() => DealUnitTypeSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeWithAggregatesFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional(),
  numberAUnits: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  numberCUnits: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  shareOfEquity: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  debtInterestRatePerc: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  debtPaymentFreq: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  debtTermMonthsMax: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  debtTermMonthsMin: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  equityTermMonths: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  debtPaymentFreqMonths: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  equityPreferredReturn: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const OrganizationWhereInputSchema: z.ZodType<Prisma.OrganizationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  tin: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dateOfCreation: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  juristication: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional(),
  isPrimary: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  address: z.union([ z.lazy(() => AddressNullableScalarRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional(),
  members: z.lazy(() => MemberListRelationFilterSchema).optional(),
  ownedBy: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  document: z.lazy(() => OrganizationDocumentListRelationFilterSchema).optional()
}).strict();

export const OrganizationOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  tin: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateOfCreation: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  juristication: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  isPrimary: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => AddressOrderByWithRelationInputSchema).optional(),
  deals: z.lazy(() => DealOrderByRelationAggregateInputSchema).optional(),
  members: z.lazy(() => MemberOrderByRelationAggregateInputSchema).optional(),
  ownedBy: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentOrderByRelationAggregateInputSchema).optional()
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
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  tin: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dateOfCreation: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  juristication: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional(),
  isPrimary: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  address: z.union([ z.lazy(() => AddressNullableScalarRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional(),
  members: z.lazy(() => MemberListRelationFilterSchema).optional(),
  ownedBy: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  document: z.lazy(() => OrganizationDocumentListRelationFilterSchema).optional()
}).strict());

export const OrganizationOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  tin: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateOfCreation: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  juristication: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  isPrimary: z.lazy(() => SortOrderSchema).optional(),
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
  ownerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  tin: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  dateOfCreation: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  juristication: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeWithAggregatesFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional(),
  isPrimary: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const MemberWhereInputSchema: z.ZodType<Prisma.MemberWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MemberWhereInputSchema),z.lazy(() => MemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MemberWhereInputSchema),z.lazy(() => MemberWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumMembershipTypeFilterSchema),z.lazy(() => MembershipTypeSchema) ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const MemberOrderByWithRelationInputSchema: z.ZodType<Prisma.MemberOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const MemberWhereUniqueInputSchema: z.ZodType<Prisma.MemberWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => MemberWhereInputSchema),z.lazy(() => MemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MemberWhereInputSchema),z.lazy(() => MemberWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  type: z.union([ z.lazy(() => EnumMembershipTypeFilterSchema),z.lazy(() => MembershipTypeSchema) ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const MemberOrderByWithAggregationInputSchema: z.ZodType<Prisma.MemberOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => MemberCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MemberAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MemberMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MemberMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MemberSumOrderByAggregateInputSchema).optional()
}).strict();

export const MemberScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MemberScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MemberScalarWhereWithAggregatesInputSchema),z.lazy(() => MemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MemberScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MemberScalarWhereWithAggregatesInputSchema),z.lazy(() => MemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumMembershipTypeWithAggregatesFilterSchema),z.lazy(() => MembershipTypeSchema) ]).optional(),
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const AccreditationVerificationWhereInputSchema: z.ZodType<Prisma.AccreditationVerificationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccreditationVerificationWhereInputSchema),z.lazy(() => AccreditationVerificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccreditationVerificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccreditationVerificationWhereInputSchema),z.lazy(() => AccreditationVerificationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  verifierId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  method: z.union([ z.lazy(() => EnumVerificationMethodFilterSchema),z.lazy(() => VerificationMethodSchema) ]).optional(),
  basis: z.union([ z.lazy(() => EnumVerificationBasisFilterSchema),z.lazy(() => VerificationBasisSchema) ]).optional(),
  deal: z.union([ z.lazy(() => DealScalarRelationFilterSchema),z.lazy(() => DealWhereInputSchema) ]).optional(),
  verifier: z.union([ z.lazy(() => AccreditationVerifierNullableScalarRelationFilterSchema),z.lazy(() => AccreditationVerifierWhereInputSchema) ]).optional().nullable(),
}).strict();

export const AccreditationVerificationOrderByWithRelationInputSchema: z.ZodType<Prisma.AccreditationVerificationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  verifierId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  basis: z.lazy(() => SortOrderSchema).optional(),
  deal: z.lazy(() => DealOrderByWithRelationInputSchema).optional(),
  verifier: z.lazy(() => AccreditationVerifierOrderByWithRelationInputSchema).optional()
}).strict();

export const AccreditationVerificationWhereUniqueInputSchema: z.ZodType<Prisma.AccreditationVerificationWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    dealId: z.number().int(),
    verifierId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
    dealId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    verifierId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    dealId: z.number().int(),
    verifierId: z.number().int(),
  }),
  z.object({
    dealId: z.number().int(),
  }),
  z.object({
    verifierId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  dealId: z.number().int().optional(),
  verifierId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => AccreditationVerificationWhereInputSchema),z.lazy(() => AccreditationVerificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccreditationVerificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccreditationVerificationWhereInputSchema),z.lazy(() => AccreditationVerificationWhereInputSchema).array() ]).optional(),
  method: z.union([ z.lazy(() => EnumVerificationMethodFilterSchema),z.lazy(() => VerificationMethodSchema) ]).optional(),
  basis: z.union([ z.lazy(() => EnumVerificationBasisFilterSchema),z.lazy(() => VerificationBasisSchema) ]).optional(),
  deal: z.union([ z.lazy(() => DealScalarRelationFilterSchema),z.lazy(() => DealWhereInputSchema) ]).optional(),
  verifier: z.union([ z.lazy(() => AccreditationVerifierNullableScalarRelationFilterSchema),z.lazy(() => AccreditationVerifierWhereInputSchema) ]).optional().nullable(),
}).strict());

export const AccreditationVerificationOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccreditationVerificationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  verifierId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  basis: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AccreditationVerificationCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AccreditationVerificationAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccreditationVerificationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccreditationVerificationMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AccreditationVerificationSumOrderByAggregateInputSchema).optional()
}).strict();

export const AccreditationVerificationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccreditationVerificationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccreditationVerificationScalarWhereWithAggregatesInputSchema),z.lazy(() => AccreditationVerificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccreditationVerificationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccreditationVerificationScalarWhereWithAggregatesInputSchema),z.lazy(() => AccreditationVerificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dealId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  verifierId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  method: z.union([ z.lazy(() => EnumVerificationMethodWithAggregatesFilterSchema),z.lazy(() => VerificationMethodSchema) ]).optional(),
  basis: z.union([ z.lazy(() => EnumVerificationBasisWithAggregatesFilterSchema),z.lazy(() => VerificationBasisSchema) ]).optional(),
}).strict();

export const AccreditationVerifierWhereInputSchema: z.ZodType<Prisma.AccreditationVerifierWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccreditationVerifierWhereInputSchema),z.lazy(() => AccreditationVerifierWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccreditationVerifierWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccreditationVerifierWhereInputSchema),z.lazy(() => AccreditationVerifierWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  AccreditationVerification: z.union([ z.lazy(() => AccreditationVerificationNullableScalarRelationFilterSchema),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional().nullable(),
}).strict();

export const AccreditationVerifierOrderByWithRelationInputSchema: z.ZodType<Prisma.AccreditationVerifierOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  AccreditationVerification: z.lazy(() => AccreditationVerificationOrderByWithRelationInputSchema).optional()
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
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  AccreditationVerification: z.union([ z.lazy(() => AccreditationVerificationNullableScalarRelationFilterSchema),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional().nullable(),
}).strict());

export const AccreditationVerifierOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccreditationVerifierOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
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
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const DealDocumentWhereInputSchema: z.ZodType<Prisma.DealDocumentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DealDocumentWhereInputSchema),z.lazy(() => DealDocumentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealDocumentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealDocumentWhereInputSchema),z.lazy(() => DealDocumentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDealDocumentTypeFilterSchema),z.lazy(() => DealDocumentTypeSchema) ]).optional(),
  dealId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dateCreated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uploadedById: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  taxYear: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  deal: z.union([ z.lazy(() => DealScalarRelationFilterSchema),z.lazy(() => DealWhereInputSchema) ]).optional(),
  uploadedBy: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const DealDocumentOrderByWithRelationInputSchema: z.ZodType<Prisma.DealDocumentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional(),
  taxYear: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  deal: z.lazy(() => DealOrderByWithRelationInputSchema).optional(),
  uploadedBy: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
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
  type: z.union([ z.lazy(() => EnumDealDocumentTypeFilterSchema),z.lazy(() => DealDocumentTypeSchema) ]).optional(),
  dealId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dateCreated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uploadedById: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  taxYear: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  deal: z.union([ z.lazy(() => DealScalarRelationFilterSchema),z.lazy(() => DealWhereInputSchema) ]).optional(),
  uploadedBy: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const DealDocumentOrderByWithAggregationInputSchema: z.ZodType<Prisma.DealDocumentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional(),
  taxYear: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  type: z.union([ z.lazy(() => EnumDealDocumentTypeWithAggregatesFilterSchema),z.lazy(() => DealDocumentTypeSchema) ]).optional(),
  dealId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dateCreated: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  path: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  uploadedById: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  taxYear: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const OrganizationDocumentWhereInputSchema: z.ZodType<Prisma.OrganizationDocumentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationDocumentWhereInputSchema),z.lazy(() => OrganizationDocumentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationDocumentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationDocumentWhereInputSchema),z.lazy(() => OrganizationDocumentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dateCreated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uploadedById: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  uploadedBy: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationDocumentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  uploadedBy: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
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
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dateCreated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uploadedById: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  uploadedBy: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const OrganizationDocumentOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationDocumentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional(),
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
  organizationId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dateCreated: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  path: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  uploadedById: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const ProjectWhereInputSchema: z.ZodType<Prisma.ProjectWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tags: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  marketHighlights: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  youtubeUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  equityReturnsFile: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional(),
  documents: z.lazy(() => ProjectDocumentListRelationFilterSchema).optional(),
  investmentStats: z.union([ z.lazy(() => ProjectInvestmentStatsNullableScalarRelationFilterSchema),z.lazy(() => ProjectInvestmentStatsWhereInputSchema) ]).optional().nullable(),
  milestones: z.union([ z.lazy(() => ProjectMilestonesNullableScalarRelationFilterSchema),z.lazy(() => ProjectMilestonesWhereInputSchema) ]).optional().nullable(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoListRelationFilterSchema).optional(),
  pictures: z.lazy(() => ProjectPictureListRelationFilterSchema).optional(),
  propertyStats: z.union([ z.lazy(() => ProjectPropertyStatsNullableScalarRelationFilterSchema),z.lazy(() => ProjectPropertyStatsWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ProjectOrderByWithRelationInputSchema: z.ZodType<Prisma.ProjectOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  marketHighlights: z.lazy(() => SortOrderSchema).optional(),
  youtubeUrl: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  equityReturnsFile: z.lazy(() => SortOrderSchema).optional(),
  deals: z.lazy(() => DealOrderByRelationAggregateInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentOrderByRelationAggregateInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsOrderByWithRelationInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesOrderByWithRelationInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoOrderByRelationAggregateInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureOrderByRelationAggregateInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsOrderByWithRelationInputSchema).optional()
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
  tags: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  marketHighlights: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  youtubeUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  equityReturnsFile: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional(),
  documents: z.lazy(() => ProjectDocumentListRelationFilterSchema).optional(),
  investmentStats: z.union([ z.lazy(() => ProjectInvestmentStatsNullableScalarRelationFilterSchema),z.lazy(() => ProjectInvestmentStatsWhereInputSchema) ]).optional().nullable(),
  milestones: z.union([ z.lazy(() => ProjectMilestonesNullableScalarRelationFilterSchema),z.lazy(() => ProjectMilestonesWhereInputSchema) ]).optional().nullable(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoListRelationFilterSchema).optional(),
  pictures: z.lazy(() => ProjectPictureListRelationFilterSchema).optional(),
  propertyStats: z.union([ z.lazy(() => ProjectPropertyStatsNullableScalarRelationFilterSchema),z.lazy(() => ProjectPropertyStatsWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ProjectOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProjectOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  marketHighlights: z.lazy(() => SortOrderSchema).optional(),
  youtubeUrl: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  equityReturnsFile: z.lazy(() => SortOrderSchema).optional(),
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
  tags: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusWithAggregatesFilterSchema),z.lazy(() => StatusSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  marketHighlights: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  youtubeUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  equityReturnsFile: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ProjectPropertyStatsWhereInputSchema: z.ZodType<Prisma.ProjectPropertyStatsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectPropertyStatsWhereInputSchema),z.lazy(() => ProjectPropertyStatsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectPropertyStatsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectPropertyStatsWhereInputSchema),z.lazy(() => ProjectPropertyStatsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  avgRent: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  avgUnitSize: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  commercialSqFt: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  numUnits: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict();

export const ProjectPropertyStatsOrderByWithRelationInputSchema: z.ZodType<Prisma.ProjectPropertyStatsOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  avgRent: z.lazy(() => SortOrderSchema).optional(),
  avgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  commercialSqFt: z.lazy(() => SortOrderSchema).optional(),
  numUnits: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional()
}).strict();

export const ProjectPropertyStatsWhereUniqueInputSchema: z.ZodType<Prisma.ProjectPropertyStatsWhereUniqueInput> = z.union([
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
  AND: z.union([ z.lazy(() => ProjectPropertyStatsWhereInputSchema),z.lazy(() => ProjectPropertyStatsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectPropertyStatsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectPropertyStatsWhereInputSchema),z.lazy(() => ProjectPropertyStatsWhereInputSchema).array() ]).optional(),
  avgRent: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  avgUnitSize: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  commercialSqFt: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  numUnits: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict());

export const ProjectPropertyStatsOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProjectPropertyStatsOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  avgRent: z.lazy(() => SortOrderSchema).optional(),
  avgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  commercialSqFt: z.lazy(() => SortOrderSchema).optional(),
  numUnits: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProjectPropertyStatsCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProjectPropertyStatsAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProjectPropertyStatsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProjectPropertyStatsMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProjectPropertyStatsSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProjectPropertyStatsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProjectPropertyStatsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectPropertyStatsScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectPropertyStatsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectPropertyStatsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectPropertyStatsScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectPropertyStatsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  avgRent: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  avgUnitSize: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  commercialSqFt: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  numUnits: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const ProjectInvestmentStatsWhereInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectInvestmentStatsWhereInputSchema),z.lazy(() => ProjectInvestmentStatsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectInvestmentStatsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectInvestmentStatsWhereInputSchema),z.lazy(() => ProjectInvestmentStatsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  cUnitThresholdAmount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  debtMinInvestment: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  debtPaymentFreq: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  equityIRR: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  equityMinInvestment: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  equityPaymentFreq: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  equityTermMonths: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  investmentGoal: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  investmentRaised: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  targetEquityMultiple: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  totalAUnitReturn: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  totalCUnitReturn: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  interestRateDollarThreshold: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  interestRateMax: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  interestRateMin: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  equityPreferredReturn: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  debtPaymentFreqMonths: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  debtTermMonthsMax: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  debtTermMonthsMin: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  equityPaymentFreqMonths: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  boolDebt: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  boolEquity: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict();

export const ProjectInvestmentStatsOrderByWithRelationInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cUnitThresholdAmount: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  totalAUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  totalCUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  interestRateDollarThreshold: z.lazy(() => SortOrderSchema).optional(),
  interestRateMax: z.lazy(() => SortOrderSchema).optional(),
  interestRateMin: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  boolDebt: z.lazy(() => SortOrderSchema).optional(),
  boolEquity: z.lazy(() => SortOrderSchema).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional()
}).strict();

export const ProjectInvestmentStatsWhereUniqueInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsWhereUniqueInput> = z.union([
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
  AND: z.union([ z.lazy(() => ProjectInvestmentStatsWhereInputSchema),z.lazy(() => ProjectInvestmentStatsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectInvestmentStatsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectInvestmentStatsWhereInputSchema),z.lazy(() => ProjectInvestmentStatsWhereInputSchema).array() ]).optional(),
  cUnitThresholdAmount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  debtMinInvestment: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  debtPaymentFreq: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  equityIRR: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  equityMinInvestment: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  equityPaymentFreq: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  equityTermMonths: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  investmentGoal: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  investmentRaised: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  targetEquityMultiple: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  totalAUnitReturn: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  totalCUnitReturn: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  interestRateDollarThreshold: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  interestRateMax: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  interestRateMin: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  equityPreferredReturn: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  debtPaymentFreqMonths: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  debtTermMonthsMax: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  debtTermMonthsMin: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  equityPaymentFreqMonths: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  boolDebt: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  boolEquity: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict());

export const ProjectInvestmentStatsOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cUnitThresholdAmount: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  totalAUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  totalCUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  interestRateDollarThreshold: z.lazy(() => SortOrderSchema).optional(),
  interestRateMax: z.lazy(() => SortOrderSchema).optional(),
  interestRateMin: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  boolDebt: z.lazy(() => SortOrderSchema).optional(),
  boolEquity: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProjectInvestmentStatsCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProjectInvestmentStatsAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProjectInvestmentStatsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProjectInvestmentStatsMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProjectInvestmentStatsSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProjectInvestmentStatsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectInvestmentStatsScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectInvestmentStatsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectInvestmentStatsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectInvestmentStatsScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectInvestmentStatsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  cUnitThresholdAmount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  debtMinInvestment: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  debtPaymentFreq: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  equityIRR: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  equityMinInvestment: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  equityPaymentFreq: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  equityTermMonths: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  investmentGoal: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  investmentRaised: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  targetEquityMultiple: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  totalAUnitReturn: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  totalCUnitReturn: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  interestRateDollarThreshold: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  interestRateMax: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  interestRateMin: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  equityPreferredReturn: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  debtPaymentFreqMonths: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  debtTermMonthsMax: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  debtTermMonthsMin: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  equityPaymentFreqMonths: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  boolDebt: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  boolEquity: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const ProjectPaymentInfoWhereInputSchema: z.ZodType<Prisma.ProjectPaymentInfoWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectPaymentInfoWhereInputSchema),z.lazy(() => ProjectPaymentInfoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectPaymentInfoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectPaymentInfoWhereInputSchema),z.lazy(() => ProjectPaymentInfoWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accountNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  routingNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict();

export const ProjectPaymentInfoOrderByWithRelationInputSchema: z.ZodType<Prisma.ProjectPaymentInfoOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  accountNumber: z.lazy(() => SortOrderSchema).optional(),
  routingNumber: z.lazy(() => SortOrderSchema).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional()
}).strict();

export const ProjectPaymentInfoWhereUniqueInputSchema: z.ZodType<Prisma.ProjectPaymentInfoWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ProjectPaymentInfoWhereInputSchema),z.lazy(() => ProjectPaymentInfoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectPaymentInfoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectPaymentInfoWhereInputSchema),z.lazy(() => ProjectPaymentInfoWhereInputSchema).array() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accountNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  routingNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict());

export const ProjectPaymentInfoOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProjectPaymentInfoOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  accountNumber: z.lazy(() => SortOrderSchema).optional(),
  routingNumber: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProjectPaymentInfoCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProjectPaymentInfoAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProjectPaymentInfoMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProjectPaymentInfoMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProjectPaymentInfoSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProjectPaymentInfoScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProjectPaymentInfoScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectPaymentInfoScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectPaymentInfoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectPaymentInfoScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectPaymentInfoScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectPaymentInfoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  accountNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  routingNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
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
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
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
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
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

export const ProjectPictureWhereInputSchema: z.ZodType<Prisma.ProjectPictureWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectPictureWhereInputSchema),z.lazy(() => ProjectPictureWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectPictureWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectPictureWhereInputSchema),z.lazy(() => ProjectPictureWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumPictureTypeFilterSchema),z.lazy(() => PictureTypeSchema) ]).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict();

export const ProjectPictureOrderByWithRelationInputSchema: z.ZodType<Prisma.ProjectPictureOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional()
}).strict();

export const ProjectPictureWhereUniqueInputSchema: z.ZodType<Prisma.ProjectPictureWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ProjectPictureWhereInputSchema),z.lazy(() => ProjectPictureWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectPictureWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectPictureWhereInputSchema),z.lazy(() => ProjectPictureWhereInputSchema).array() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumPictureTypeFilterSchema),z.lazy(() => PictureTypeSchema) ]).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict());

export const ProjectPictureOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProjectPictureOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProjectPictureCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProjectPictureAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProjectPictureMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProjectPictureMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProjectPictureSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProjectPictureScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProjectPictureScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectPictureScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectPictureScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectPictureScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectPictureScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectPictureScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumPictureTypeWithAggregatesFilterSchema),z.lazy(() => PictureTypeSchema) ]).optional(),
}).strict();

export const ProjectDocumentWhereInputSchema: z.ZodType<Prisma.ProjectDocumentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectDocumentWhereInputSchema),z.lazy(() => ProjectDocumentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectDocumentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectDocumentWhereInputSchema),z.lazy(() => ProjectDocumentWhereInputSchema).array() ]).optional(),
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
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict();

export const ProjectDocumentOrderByWithRelationInputSchema: z.ZodType<Prisma.ProjectDocumentOrderByWithRelationInput> = z.object({
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
  documentEvents: z.lazy(() => DocumentEventOrderByRelationAggregateInputSchema).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional()
}).strict();

export const ProjectDocumentWhereUniqueInputSchema: z.ZodType<Prisma.ProjectDocumentWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ProjectDocumentWhereInputSchema),z.lazy(() => ProjectDocumentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectDocumentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectDocumentWhereInputSchema),z.lazy(() => ProjectDocumentWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  fileName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  link: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  financingTypes: z.lazy(() => EnumDealFinancingTypeNullableListFilterSchema).optional(),
  documentType: z.union([ z.lazy(() => EnumDocumentTypeFilterSchema),z.lazy(() => DocumentTypeSchema) ]).optional(),
  docusignTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional(),
  project: z.union([ z.lazy(() => ProjectScalarRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
}).strict());

export const ProjectDocumentOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProjectDocumentOrderByWithAggregationInput> = z.object({
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
  _count: z.lazy(() => ProjectDocumentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProjectDocumentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProjectDocumentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProjectDocumentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProjectDocumentSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProjectDocumentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProjectDocumentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectDocumentScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectDocumentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectDocumentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectDocumentScalarWhereWithAggregatesInputSchema),z.lazy(() => ProjectDocumentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
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
  document: z.union([ z.lazy(() => ProjectDocumentScalarRelationFilterSchema),z.lazy(() => ProjectDocumentWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const DocumentEventOrderByWithRelationInputSchema: z.ZodType<Prisma.DocumentEventOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  documentId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  document: z.lazy(() => ProjectDocumentOrderByWithRelationInputSchema).optional(),
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
  document: z.union([ z.lazy(() => ProjectDocumentScalarRelationFilterSchema),z.lazy(() => ProjectDocumentWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
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

export const DocusignEventWhereInputSchema: z.ZodType<Prisma.DocusignEventWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DocusignEventWhereInputSchema),z.lazy(() => DocusignEventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocusignEventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocusignEventWhereInputSchema),z.lazy(() => DocusignEventWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  envelopeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  templateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dateSent: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  dateCompleted: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  investorSignatureCompleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deal: z.union([ z.lazy(() => DealScalarRelationFilterSchema),z.lazy(() => DealWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const DocusignEventOrderByWithRelationInputSchema: z.ZodType<Prisma.DocusignEventOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  envelopeId: z.lazy(() => SortOrderSchema).optional(),
  templateId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  dateSent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateCompleted: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  allSignaturesCompleted: z.lazy(() => SortOrderSchema).optional(),
  investorSignatureCompleted: z.lazy(() => SortOrderSchema).optional(),
  deal: z.lazy(() => DealOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const DocusignEventWhereUniqueInputSchema: z.ZodType<Prisma.DocusignEventWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    envelopeId: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    envelopeId: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  envelopeId: z.string().optional(),
  AND: z.union([ z.lazy(() => DocusignEventWhereInputSchema),z.lazy(() => DocusignEventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocusignEventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocusignEventWhereInputSchema),z.lazy(() => DocusignEventWhereInputSchema).array() ]).optional(),
  templateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dealId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dateSent: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  dateCompleted: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  investorSignatureCompleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  deal: z.union([ z.lazy(() => DealScalarRelationFilterSchema),z.lazy(() => DealWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const DocusignEventOrderByWithAggregationInputSchema: z.ZodType<Prisma.DocusignEventOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  envelopeId: z.lazy(() => SortOrderSchema).optional(),
  templateId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  dateSent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateCompleted: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  allSignaturesCompleted: z.lazy(() => SortOrderSchema).optional(),
  investorSignatureCompleted: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DocusignEventCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DocusignEventAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DocusignEventMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DocusignEventMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DocusignEventSumOrderByAggregateInputSchema).optional()
}).strict();

export const DocusignEventScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DocusignEventScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DocusignEventScalarWhereWithAggregatesInputSchema),z.lazy(() => DocusignEventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocusignEventScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocusignEventScalarWhereWithAggregatesInputSchema),z.lazy(() => DocusignEventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  envelopeId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  templateId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dealId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dateSent: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  dateCompleted: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  investorSignatureCompleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
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
  country: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  organization: z.union([ z.lazy(() => OrganizationNullableScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict();

export const AddressOrderByWithRelationInputSchema: z.ZodType<Prisma.AddressOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  zipcode: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const AddressWhereUniqueInputSchema: z.ZodType<Prisma.AddressWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    organizationId: z.number().int(),
    userId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
    organizationId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    userId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    organizationId: z.number().int(),
    userId: z.number().int(),
  }),
  z.object({
    organizationId: z.number().int(),
  }),
  z.object({
    userId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  organizationId: z.number().int().optional(),
  userId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  zipcode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationNullableScalarRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict());

export const AddressOrderByWithAggregationInputSchema: z.ZodType<Prisma.AddressOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  zipcode: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  country: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealCreateInputSchema: z.ZodType<Prisma.DealCreateInput> = z.object({
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationCreateNestedOneWithoutDealInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDealsInputSchema),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema),
  document: z.lazy(() => DealDocumentCreateNestedManyWithoutDealInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsCreateNestedOneWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealUncheckedCreateInputSchema: z.ZodType<Prisma.DealUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  organizationId: z.number().int(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedCreateNestedOneWithoutDealInputSchema).optional(),
  document: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedCreateNestedOneWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealUpdateInputSchema: z.ZodType<Prisma.DealUpdateInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUpdateOneWithoutDealNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUpdateManyWithoutDealNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUpdateOneWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateInputSchema: z.ZodType<Prisma.DealUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedUpdateOneWithoutDealNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutDealNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedUpdateOneWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealCreateManyInputSchema: z.ZodType<Prisma.DealCreateManyInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  organizationId: z.number().int(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable()
}).strict();

export const DealUpdateManyMutationInputSchema: z.ZodType<Prisma.DealUpdateManyMutationInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealInvestmentStatsCreateInputSchema: z.ZodType<Prisma.DealInvestmentStatsCreateInput> = z.object({
  amount: z.number().optional(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional(),
  unitType: z.lazy(() => DealUnitTypeSchema).optional(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  numberAUnits: z.number().optional(),
  numberCUnits: z.number().optional(),
  shareOfEquity: z.number().optional(),
  debtInterestRatePerc: z.number().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonthsMax: z.number().int().optional(),
  debtTermMonthsMin: z.number().int().optional(),
  equityTermMonths: z.number().int().optional(),
  debtPaymentFreqMonths: z.number().int().optional(),
  equityPreferredReturn: z.number().optional(),
  deal: z.lazy(() => DealCreateNestedOneWithoutInvestmentStatsInputSchema)
}).strict();

export const DealInvestmentStatsUncheckedCreateInputSchema: z.ZodType<Prisma.DealInvestmentStatsUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  dealId: z.number().int(),
  amount: z.number().optional(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional(),
  unitType: z.lazy(() => DealUnitTypeSchema).optional(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  numberAUnits: z.number().optional(),
  numberCUnits: z.number().optional(),
  shareOfEquity: z.number().optional(),
  debtInterestRatePerc: z.number().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonthsMax: z.number().int().optional(),
  debtTermMonthsMin: z.number().int().optional(),
  equityTermMonths: z.number().int().optional(),
  debtPaymentFreqMonths: z.number().int().optional(),
  equityPreferredReturn: z.number().optional()
}).strict();

export const DealInvestmentStatsUpdateInputSchema: z.ZodType<Prisma.DealInvestmentStatsUpdateInput> = z.object({
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => EnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional(),
  unitType: z.union([ z.lazy(() => DealUnitTypeSchema),z.lazy(() => EnumDealUnitTypeFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  numberCUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  shareOfEquity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRatePerc: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  deal: z.lazy(() => DealUpdateOneRequiredWithoutInvestmentStatsNestedInputSchema).optional()
}).strict();

export const DealInvestmentStatsUncheckedUpdateInputSchema: z.ZodType<Prisma.DealInvestmentStatsUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => EnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional(),
  unitType: z.union([ z.lazy(() => DealUnitTypeSchema),z.lazy(() => EnumDealUnitTypeFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  numberCUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  shareOfEquity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRatePerc: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealInvestmentStatsCreateManyInputSchema: z.ZodType<Prisma.DealInvestmentStatsCreateManyInput> = z.object({
  id: z.number().int().optional(),
  dealId: z.number().int(),
  amount: z.number().optional(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional(),
  unitType: z.lazy(() => DealUnitTypeSchema).optional(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  numberAUnits: z.number().optional(),
  numberCUnits: z.number().optional(),
  shareOfEquity: z.number().optional(),
  debtInterestRatePerc: z.number().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonthsMax: z.number().int().optional(),
  debtTermMonthsMin: z.number().int().optional(),
  equityTermMonths: z.number().int().optional(),
  debtPaymentFreqMonths: z.number().int().optional(),
  equityPreferredReturn: z.number().optional()
}).strict();

export const DealInvestmentStatsUpdateManyMutationInputSchema: z.ZodType<Prisma.DealInvestmentStatsUpdateManyMutationInput> = z.object({
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => EnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional(),
  unitType: z.union([ z.lazy(() => DealUnitTypeSchema),z.lazy(() => EnumDealUnitTypeFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  numberCUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  shareOfEquity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRatePerc: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealInvestmentStatsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DealInvestmentStatsUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => EnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional(),
  unitType: z.union([ z.lazy(() => DealUnitTypeSchema),z.lazy(() => EnumDealUnitTypeFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  numberCUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  shareOfEquity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRatePerc: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateInputSchema: z.ZodType<Prisma.OrganizationCreateInput> = z.object({
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealCreateNestedManyWithoutOrganizationInputSchema).optional(),
  members: z.lazy(() => MemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ownedBy: z.lazy(() => UserCreateNestedOneWithoutOrganizationsOwnedInputSchema),
  document: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  members: z.lazy(() => MemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUpdateInputSchema: z.ZodType<Prisma.OrganizationUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  members: z.lazy(() => MemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ownedBy: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsOwnedNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  members: z.lazy(() => MemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationCreateManyInputSchema: z.ZodType<Prisma.OrganizationCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional()
}).strict();

export const OrganizationUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MemberCreateInputSchema: z.ZodType<Prisma.MemberCreateInput> = z.object({
  type: z.lazy(() => MembershipTypeSchema),
  title: z.string().optional().nullable(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizationMemberInputSchema)
}).strict();

export const MemberUncheckedCreateInputSchema: z.ZodType<Prisma.MemberUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  organizationId: z.number().int(),
  type: z.lazy(() => MembershipTypeSchema),
  title: z.string().optional().nullable()
}).strict();

export const MemberUpdateInputSchema: z.ZodType<Prisma.MemberUpdateInput> = z.object({
  type: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => EnumMembershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationMemberNestedInputSchema).optional()
}).strict();

export const MemberUncheckedUpdateInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => EnumMembershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MemberCreateManyInputSchema: z.ZodType<Prisma.MemberCreateManyInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  organizationId: z.number().int(),
  type: z.lazy(() => MembershipTypeSchema),
  title: z.string().optional().nullable()
}).strict();

export const MemberUpdateManyMutationInputSchema: z.ZodType<Prisma.MemberUpdateManyMutationInput> = z.object({
  type: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => EnumMembershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MemberUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => EnumMembershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccreditationVerificationCreateInputSchema: z.ZodType<Prisma.AccreditationVerificationCreateInput> = z.object({
  method: z.lazy(() => VerificationMethodSchema),
  basis: z.lazy(() => VerificationBasisSchema),
  deal: z.lazy(() => DealCreateNestedOneWithoutAccreditationVerificationInputSchema),
  verifier: z.lazy(() => AccreditationVerifierCreateNestedOneWithoutAccreditationVerificationInputSchema).optional()
}).strict();

export const AccreditationVerificationUncheckedCreateInputSchema: z.ZodType<Prisma.AccreditationVerificationUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  dealId: z.number().int(),
  verifierId: z.number().int().optional().nullable(),
  method: z.lazy(() => VerificationMethodSchema),
  basis: z.lazy(() => VerificationBasisSchema)
}).strict();

export const AccreditationVerificationUpdateInputSchema: z.ZodType<Prisma.AccreditationVerificationUpdateInput> = z.object({
  method: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => EnumVerificationMethodFieldUpdateOperationsInputSchema) ]).optional(),
  basis: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => EnumVerificationBasisFieldUpdateOperationsInputSchema) ]).optional(),
  deal: z.lazy(() => DealUpdateOneRequiredWithoutAccreditationVerificationNestedInputSchema).optional(),
  verifier: z.lazy(() => AccreditationVerifierUpdateOneWithoutAccreditationVerificationNestedInputSchema).optional()
}).strict();

export const AccreditationVerificationUncheckedUpdateInputSchema: z.ZodType<Prisma.AccreditationVerificationUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  verifierId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  method: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => EnumVerificationMethodFieldUpdateOperationsInputSchema) ]).optional(),
  basis: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => EnumVerificationBasisFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccreditationVerificationCreateManyInputSchema: z.ZodType<Prisma.AccreditationVerificationCreateManyInput> = z.object({
  id: z.number().int().optional(),
  dealId: z.number().int(),
  verifierId: z.number().int().optional().nullable(),
  method: z.lazy(() => VerificationMethodSchema),
  basis: z.lazy(() => VerificationBasisSchema)
}).strict();

export const AccreditationVerificationUpdateManyMutationInputSchema: z.ZodType<Prisma.AccreditationVerificationUpdateManyMutationInput> = z.object({
  method: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => EnumVerificationMethodFieldUpdateOperationsInputSchema) ]).optional(),
  basis: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => EnumVerificationBasisFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccreditationVerificationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccreditationVerificationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  verifierId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  method: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => EnumVerificationMethodFieldUpdateOperationsInputSchema) ]).optional(),
  basis: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => EnumVerificationBasisFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccreditationVerifierCreateInputSchema: z.ZodType<Prisma.AccreditationVerifierCreateInput> = z.object({
  firstName: z.string(),
  lastName: z.string(),
  title: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string(),
  AccreditationVerification: z.lazy(() => AccreditationVerificationCreateNestedOneWithoutVerifierInputSchema).optional()
}).strict();

export const AccreditationVerifierUncheckedCreateInputSchema: z.ZodType<Prisma.AccreditationVerifierUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  title: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string(),
  AccreditationVerification: z.lazy(() => AccreditationVerificationUncheckedCreateNestedOneWithoutVerifierInputSchema).optional()
}).strict();

export const AccreditationVerifierUpdateInputSchema: z.ZodType<Prisma.AccreditationVerifierUpdateInput> = z.object({
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  AccreditationVerification: z.lazy(() => AccreditationVerificationUpdateOneWithoutVerifierNestedInputSchema).optional()
}).strict();

export const AccreditationVerifierUncheckedUpdateInputSchema: z.ZodType<Prisma.AccreditationVerifierUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  AccreditationVerification: z.lazy(() => AccreditationVerificationUncheckedUpdateOneWithoutVerifierNestedInputSchema).optional()
}).strict();

export const AccreditationVerifierCreateManyInputSchema: z.ZodType<Prisma.AccreditationVerifierCreateManyInput> = z.object({
  id: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  title: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string()
}).strict();

export const AccreditationVerifierUpdateManyMutationInputSchema: z.ZodType<Prisma.AccreditationVerifierUpdateManyMutationInput> = z.object({
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccreditationVerifierUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccreditationVerifierUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealDocumentCreateInputSchema: z.ZodType<Prisma.DealDocumentCreateInput> = z.object({
  name: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  taxYear: z.number().int().optional().nullable(),
  deal: z.lazy(() => DealCreateNestedOneWithoutDocumentInputSchema),
  uploadedBy: z.lazy(() => UserCreateNestedOneWithoutDealDocumentUploadedInputSchema)
}).strict();

export const DealDocumentUncheckedCreateInputSchema: z.ZodType<Prisma.DealDocumentUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  dealId: z.number().int(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  uploadedById: z.number().int(),
  taxYear: z.number().int().optional().nullable()
}).strict();

export const DealDocumentUpdateInputSchema: z.ZodType<Prisma.DealDocumentUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  taxYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deal: z.lazy(() => DealUpdateOneRequiredWithoutDocumentNestedInputSchema).optional(),
  uploadedBy: z.lazy(() => UserUpdateOneRequiredWithoutDealDocumentUploadedNestedInputSchema).optional()
}).strict();

export const DealDocumentUncheckedUpdateInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadedById: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealDocumentCreateManyInputSchema: z.ZodType<Prisma.DealDocumentCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  dealId: z.number().int(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  uploadedById: z.number().int(),
  taxYear: z.number().int().optional().nullable()
}).strict();

export const DealDocumentUpdateManyMutationInputSchema: z.ZodType<Prisma.DealDocumentUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  taxYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealDocumentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadedById: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrganizationDocumentCreateInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateInput> = z.object({
  name: z.string(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  key: z.string().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDocumentInputSchema),
  uploadedBy: z.lazy(() => UserCreateNestedOneWithoutOrganizationDocumentUploadedInputSchema)
}).strict();

export const OrganizationDocumentUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  organizationId: z.number().int(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  key: z.string().optional(),
  uploadedById: z.number().int()
}).strict();

export const OrganizationDocumentUpdateInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDocumentNestedInputSchema).optional(),
  uploadedBy: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationDocumentUploadedNestedInputSchema).optional()
}).strict();

export const OrganizationDocumentUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadedById: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentCreateManyInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  organizationId: z.number().int(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  key: z.string().optional(),
  uploadedById: z.number().int()
}).strict();

export const OrganizationDocumentUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadedById: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectCreateInputSchema: z.ZodType<Prisma.ProjectCreateInput> = z.object({
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUpdateInputSchema: z.ZodType<Prisma.ProjectUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectCreateManyInputSchema: z.ZodType<Prisma.ProjectCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string()
}).strict();

export const ProjectUpdateManyMutationInputSchema: z.ZodType<Prisma.ProjectUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPropertyStatsCreateInputSchema: z.ZodType<Prisma.ProjectPropertyStatsCreateInput> = z.object({
  avgRent: z.number().int().optional(),
  avgUnitSize: z.number().int().optional(),
  commercialSqFt: z.number().int().optional(),
  numUnits: z.number().int().optional(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutPropertyStatsInputSchema)
}).strict();

export const ProjectPropertyStatsUncheckedCreateInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  avgRent: z.number().int().optional(),
  avgUnitSize: z.number().int().optional(),
  commercialSqFt: z.number().int().optional(),
  numUnits: z.number().int().optional(),
  projectId: z.number().int()
}).strict();

export const ProjectPropertyStatsUpdateInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUpdateInput> = z.object({
  avgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  commercialSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  numUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutPropertyStatsNestedInputSchema).optional()
}).strict();

export const ProjectPropertyStatsUncheckedUpdateInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  commercialSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  numUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPropertyStatsCreateManyInputSchema: z.ZodType<Prisma.ProjectPropertyStatsCreateManyInput> = z.object({
  id: z.number().int().optional(),
  avgRent: z.number().int().optional(),
  avgUnitSize: z.number().int().optional(),
  commercialSqFt: z.number().int().optional(),
  numUnits: z.number().int().optional(),
  projectId: z.number().int()
}).strict();

export const ProjectPropertyStatsUpdateManyMutationInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUpdateManyMutationInput> = z.object({
  avgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  commercialSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  numUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPropertyStatsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  commercialSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  numUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectInvestmentStatsCreateInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsCreateInput> = z.object({
  cUnitThresholdAmount: z.number().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  targetEquityMultiple: z.number().optional(),
  totalAUnitReturn: z.number().optional(),
  totalCUnitReturn: z.number().optional(),
  interestRateDollarThreshold: z.number().optional(),
  interestRateMax: z.number().optional(),
  interestRateMin: z.number().optional(),
  equityPreferredReturn: z.number().optional(),
  debtPaymentFreqMonths: z.number().int().optional(),
  debtTermMonthsMax: z.number().int().optional(),
  debtTermMonthsMin: z.number().int().optional(),
  equityPaymentFreqMonths: z.number().int().optional(),
  boolDebt: z.boolean().optional(),
  boolEquity: z.boolean().optional(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutInvestmentStatsInputSchema)
}).strict();

export const ProjectInvestmentStatsUncheckedCreateInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  cUnitThresholdAmount: z.number().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  projectId: z.number().int(),
  targetEquityMultiple: z.number().optional(),
  totalAUnitReturn: z.number().optional(),
  totalCUnitReturn: z.number().optional(),
  interestRateDollarThreshold: z.number().optional(),
  interestRateMax: z.number().optional(),
  interestRateMin: z.number().optional(),
  equityPreferredReturn: z.number().optional(),
  debtPaymentFreqMonths: z.number().int().optional(),
  debtTermMonthsMax: z.number().int().optional(),
  debtTermMonthsMin: z.number().int().optional(),
  equityPaymentFreqMonths: z.number().int().optional(),
  boolDebt: z.boolean().optional(),
  boolEquity: z.boolean().optional()
}).strict();

export const ProjectInvestmentStatsUpdateInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUpdateInput> = z.object({
  cUnitThresholdAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalAUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalCUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateDollarThreshold: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMax: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMin: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  boolDebt: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  boolEquity: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutInvestmentStatsNestedInputSchema).optional()
}).strict();

export const ProjectInvestmentStatsUncheckedUpdateInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cUnitThresholdAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalAUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalCUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateDollarThreshold: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMax: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMin: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  boolDebt: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  boolEquity: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectInvestmentStatsCreateManyInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsCreateManyInput> = z.object({
  id: z.number().int().optional(),
  cUnitThresholdAmount: z.number().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  projectId: z.number().int(),
  targetEquityMultiple: z.number().optional(),
  totalAUnitReturn: z.number().optional(),
  totalCUnitReturn: z.number().optional(),
  interestRateDollarThreshold: z.number().optional(),
  interestRateMax: z.number().optional(),
  interestRateMin: z.number().optional(),
  equityPreferredReturn: z.number().optional(),
  debtPaymentFreqMonths: z.number().int().optional(),
  debtTermMonthsMax: z.number().int().optional(),
  debtTermMonthsMin: z.number().int().optional(),
  equityPaymentFreqMonths: z.number().int().optional(),
  boolDebt: z.boolean().optional(),
  boolEquity: z.boolean().optional()
}).strict();

export const ProjectInvestmentStatsUpdateManyMutationInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUpdateManyMutationInput> = z.object({
  cUnitThresholdAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalAUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalCUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateDollarThreshold: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMax: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMin: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  boolDebt: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  boolEquity: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectInvestmentStatsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cUnitThresholdAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalAUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalCUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateDollarThreshold: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMax: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMin: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  boolDebt: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  boolEquity: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPaymentInfoCreateInputSchema: z.ZodType<Prisma.ProjectPaymentInfoCreateInput> = z.object({
  investmentEntity: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutProjectPaymentInfoInputSchema)
}).strict();

export const ProjectPaymentInfoUncheckedCreateInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  investmentEntity: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string()
}).strict();

export const ProjectPaymentInfoUpdateInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUpdateInput> = z.object({
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  routingNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutProjectPaymentInfoNestedInputSchema).optional()
}).strict();

export const ProjectPaymentInfoUncheckedUpdateInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  routingNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPaymentInfoCreateManyInputSchema: z.ZodType<Prisma.ProjectPaymentInfoCreateManyInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  investmentEntity: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string()
}).strict();

export const ProjectPaymentInfoUpdateManyMutationInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUpdateManyMutationInput> = z.object({
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  routingNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPaymentInfoUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  routingNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  project: z.lazy(() => ProjectCreateNestedOneWithoutMilestonesInputSchema)
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
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutMilestonesNestedInputSchema).optional()
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

export const ProjectPictureCreateInputSchema: z.ZodType<Prisma.ProjectPictureCreateInput> = z.object({
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema),
  project: z.lazy(() => ProjectCreateNestedOneWithoutPicturesInputSchema)
}).strict();

export const ProjectPictureUncheckedCreateInputSchema: z.ZodType<Prisma.ProjectPictureUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema)
}).strict();

export const ProjectPictureUpdateInputSchema: z.ZodType<Prisma.ProjectPictureUpdateInput> = z.object({
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutPicturesNestedInputSchema).optional()
}).strict();

export const ProjectPictureUncheckedUpdateInputSchema: z.ZodType<Prisma.ProjectPictureUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPictureCreateManyInputSchema: z.ZodType<Prisma.ProjectPictureCreateManyInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema)
}).strict();

export const ProjectPictureUpdateManyMutationInputSchema: z.ZodType<Prisma.ProjectPictureUpdateManyMutationInput> = z.object({
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPictureUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProjectPictureUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectDocumentCreateInputSchema: z.ZodType<Prisma.ProjectDocumentCreateInput> = z.object({
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutDocumentInputSchema).optional(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDocumentsInputSchema)
}).strict();

export const ProjectDocumentUncheckedCreateInputSchema: z.ZodType<Prisma.ProjectDocumentUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutDocumentInputSchema).optional()
}).strict();

export const ProjectDocumentUpdateInputSchema: z.ZodType<Prisma.ProjectDocumentUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutDocumentNestedInputSchema).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDocumentsNestedInputSchema).optional()
}).strict();

export const ProjectDocumentUncheckedUpdateInputSchema: z.ZodType<Prisma.ProjectDocumentUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutDocumentNestedInputSchema).optional()
}).strict();

export const ProjectDocumentCreateManyInputSchema: z.ZodType<Prisma.ProjectDocumentCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable()
}).strict();

export const ProjectDocumentUpdateManyMutationInputSchema: z.ZodType<Prisma.ProjectDocumentUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProjectDocumentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProjectDocumentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DocumentEventCreateInputSchema: z.ZodType<Prisma.DocumentEventCreateInput> = z.object({
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema),
  document: z.lazy(() => ProjectDocumentCreateNestedOneWithoutDocumentEventsInputSchema),
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
  document: z.lazy(() => ProjectDocumentUpdateOneRequiredWithoutDocumentEventsNestedInputSchema).optional(),
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

export const DocusignEventCreateInputSchema: z.ZodType<Prisma.DocusignEventCreateInput> = z.object({
  envelopeId: z.string(),
  templateId: z.string(),
  dateSent: z.coerce.date().optional().nullable(),
  dateCompleted: z.coerce.date().optional().nullable(),
  allSignaturesCompleted: z.boolean().optional(),
  investorSignatureCompleted: z.boolean().optional(),
  deal: z.lazy(() => DealCreateNestedOneWithoutDocusignEventInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutDocusignEventInputSchema)
}).strict();

export const DocusignEventUncheckedCreateInputSchema: z.ZodType<Prisma.DocusignEventUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  envelopeId: z.string(),
  templateId: z.string(),
  userId: z.number().int(),
  dealId: z.number().int(),
  dateSent: z.coerce.date().optional().nullable(),
  dateCompleted: z.coerce.date().optional().nullable(),
  allSignaturesCompleted: z.boolean().optional(),
  investorSignatureCompleted: z.boolean().optional()
}).strict();

export const DocusignEventUpdateInputSchema: z.ZodType<Prisma.DocusignEventUpdateInput> = z.object({
  envelopeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dateSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateCompleted: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  investorSignatureCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deal: z.lazy(() => DealUpdateOneRequiredWithoutDocusignEventNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDocusignEventNestedInputSchema).optional()
}).strict();

export const DocusignEventUncheckedUpdateInputSchema: z.ZodType<Prisma.DocusignEventUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  envelopeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateCompleted: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  investorSignatureCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocusignEventCreateManyInputSchema: z.ZodType<Prisma.DocusignEventCreateManyInput> = z.object({
  id: z.number().int().optional(),
  envelopeId: z.string(),
  templateId: z.string(),
  userId: z.number().int(),
  dealId: z.number().int(),
  dateSent: z.coerce.date().optional().nullable(),
  dateCompleted: z.coerce.date().optional().nullable(),
  allSignaturesCompleted: z.boolean().optional(),
  investorSignatureCompleted: z.boolean().optional()
}).strict();

export const DocusignEventUpdateManyMutationInputSchema: z.ZodType<Prisma.DocusignEventUpdateManyMutationInput> = z.object({
  envelopeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dateSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateCompleted: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  investorSignatureCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocusignEventUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DocusignEventUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  envelopeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateCompleted: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  investorSignatureCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AddressCreateInputSchema: z.ZodType<Prisma.AddressCreateInput> = z.object({
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  country: z.string().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutAddressInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateInputSchema: z.ZodType<Prisma.AddressUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  country: z.string().optional(),
  organizationId: z.number().int().optional().nullable(),
  userId: z.number().int().optional().nullable()
}).strict();

export const AddressUpdateInputSchema: z.ZodType<Prisma.AddressUpdateInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneWithoutAddressNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AddressCreateManyInputSchema: z.ZodType<Prisma.AddressCreateManyInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  country: z.string().optional(),
  organizationId: z.number().int().optional().nullable(),
  userId: z.number().int().optional().nullable()
}).strict();

export const AddressUpdateManyMutationInputSchema: z.ZodType<Prisma.AddressUpdateManyMutationInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AddressUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
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

export const AddressNullableScalarRelationFilterSchema: z.ZodType<Prisma.AddressNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => AddressWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AddressWhereInputSchema).optional().nullable()
}).strict();

export const DealDocumentListRelationFilterSchema: z.ZodType<Prisma.DealDocumentListRelationFilter> = z.object({
  every: z.lazy(() => DealDocumentWhereInputSchema).optional(),
  some: z.lazy(() => DealDocumentWhereInputSchema).optional(),
  none: z.lazy(() => DealDocumentWhereInputSchema).optional()
}).strict();

export const DocumentEventListRelationFilterSchema: z.ZodType<Prisma.DocumentEventListRelationFilter> = z.object({
  every: z.lazy(() => DocumentEventWhereInputSchema).optional(),
  some: z.lazy(() => DocumentEventWhereInputSchema).optional(),
  none: z.lazy(() => DocumentEventWhereInputSchema).optional()
}).strict();

export const DocusignEventListRelationFilterSchema: z.ZodType<Prisma.DocusignEventListRelationFilter> = z.object({
  every: z.lazy(() => DocusignEventWhereInputSchema).optional(),
  some: z.lazy(() => DocusignEventWhereInputSchema).optional(),
  none: z.lazy(() => DocusignEventWhereInputSchema).optional()
}).strict();

export const MemberListRelationFilterSchema: z.ZodType<Prisma.MemberListRelationFilter> = z.object({
  every: z.lazy(() => MemberWhereInputSchema).optional(),
  some: z.lazy(() => MemberWhereInputSchema).optional(),
  none: z.lazy(() => MemberWhereInputSchema).optional()
}).strict();

export const OrganizationListRelationFilterSchema: z.ZodType<Prisma.OrganizationListRelationFilter> = z.object({
  every: z.lazy(() => OrganizationWhereInputSchema).optional(),
  some: z.lazy(() => OrganizationWhereInputSchema).optional(),
  none: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationDocumentListRelationFilterSchema: z.ZodType<Prisma.OrganizationDocumentListRelationFilter> = z.object({
  every: z.lazy(() => OrganizationDocumentWhereInputSchema).optional(),
  some: z.lazy(() => OrganizationDocumentWhereInputSchema).optional(),
  none: z.lazy(() => OrganizationDocumentWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const DealDocumentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DealDocumentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentEventOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DocumentEventOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocusignEventOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DocusignEventOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MemberOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MemberOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationDocumentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentOrderByRelationAggregateInput> = z.object({
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
  ssn: z.lazy(() => SortOrderSchema).optional(),
  userOrgId: z.lazy(() => SortOrderSchema).optional(),
  referralSource: z.lazy(() => SortOrderSchema).optional(),
  dateOfBirth: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userOrgId: z.lazy(() => SortOrderSchema).optional()
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
  ssn: z.lazy(() => SortOrderSchema).optional(),
  userOrgId: z.lazy(() => SortOrderSchema).optional(),
  referralSource: z.lazy(() => SortOrderSchema).optional(),
  dateOfBirth: z.lazy(() => SortOrderSchema).optional()
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
  ssn: z.lazy(() => SortOrderSchema).optional(),
  userOrgId: z.lazy(() => SortOrderSchema).optional(),
  referralSource: z.lazy(() => SortOrderSchema).optional(),
  dateOfBirth: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userOrgId: z.lazy(() => SortOrderSchema).optional()
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

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
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

export const EnumPaymentMethodNullableFilterSchema: z.ZodType<Prisma.EnumPaymentMethodNullableFilter> = z.object({
  equals: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  in: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const AccreditationVerificationNullableScalarRelationFilterSchema: z.ZodType<Prisma.AccreditationVerificationNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => AccreditationVerificationWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AccreditationVerificationWhereInputSchema).optional().nullable()
}).strict();

export const OrganizationScalarRelationFilterSchema: z.ZodType<Prisma.OrganizationScalarRelationFilter> = z.object({
  is: z.lazy(() => OrganizationWhereInputSchema).optional(),
  isNot: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const ProjectScalarRelationFilterSchema: z.ZodType<Prisma.ProjectScalarRelationFilter> = z.object({
  is: z.lazy(() => ProjectWhereInputSchema).optional(),
  isNot: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const DealInvestmentStatsNullableScalarRelationFilterSchema: z.ZodType<Prisma.DealInvestmentStatsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => DealInvestmentStatsWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => DealInvestmentStatsWhereInputSchema).optional().nullable()
}).strict();

export const DealCountOrderByAggregateInputSchema: z.ZodType<Prisma.DealCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  closingDate: z.lazy(() => SortOrderSchema).optional(),
  signaturesCompletedDate: z.lazy(() => SortOrderSchema).optional(),
  dateFundsSent: z.lazy(() => SortOrderSchema).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  paymentReferenceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DealAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DealMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  closingDate: z.lazy(() => SortOrderSchema).optional(),
  signaturesCompletedDate: z.lazy(() => SortOrderSchema).optional(),
  dateFundsSent: z.lazy(() => SortOrderSchema).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  paymentReferenceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealMinOrderByAggregateInputSchema: z.ZodType<Prisma.DealMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  closingDate: z.lazy(() => SortOrderSchema).optional(),
  signaturesCompletedDate: z.lazy(() => SortOrderSchema).optional(),
  dateFundsSent: z.lazy(() => SortOrderSchema).optional(),
  paymentMethod: z.lazy(() => SortOrderSchema).optional(),
  paymentReferenceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealSumOrderByAggregateInputSchema: z.ZodType<Prisma.DealSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPaymentMethodNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPaymentMethodNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  in: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NestedEnumPaymentMethodNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema).optional()
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

export const EnumDealFinancingTypeFilterSchema: z.ZodType<Prisma.EnumDealFinancingTypeFilter> = z.object({
  equals: z.lazy(() => DealFinancingTypeSchema).optional(),
  in: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  notIn: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NestedEnumDealFinancingTypeFilterSchema) ]).optional(),
}).strict();

export const EnumDealUnitTypeFilterSchema: z.ZodType<Prisma.EnumDealUnitTypeFilter> = z.object({
  equals: z.lazy(() => DealUnitTypeSchema).optional(),
  in: z.lazy(() => DealUnitTypeSchema).array().optional(),
  notIn: z.lazy(() => DealUnitTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealUnitTypeSchema),z.lazy(() => NestedEnumDealUnitTypeFilterSchema) ]).optional(),
}).strict();

export const EnumDealOwnershipTypeFilterSchema: z.ZodType<Prisma.EnumDealOwnershipTypeFilter> = z.object({
  equals: z.lazy(() => DealOwnershipTypeSchema).optional(),
  in: z.lazy(() => DealOwnershipTypeSchema).array().optional(),
  notIn: z.lazy(() => DealOwnershipTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NestedEnumDealOwnershipTypeFilterSchema) ]).optional(),
}).strict();

export const DealScalarRelationFilterSchema: z.ZodType<Prisma.DealScalarRelationFilter> = z.object({
  is: z.lazy(() => DealWhereInputSchema).optional(),
  isNot: z.lazy(() => DealWhereInputSchema).optional()
}).strict();

export const DealInvestmentStatsCountOrderByAggregateInputSchema: z.ZodType<Prisma.DealInvestmentStatsCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.lazy(() => SortOrderSchema).optional(),
  unitType: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  shareOfEquity: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRatePerc: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealInvestmentStatsAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DealInvestmentStatsAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  shareOfEquity: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRatePerc: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealInvestmentStatsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DealInvestmentStatsMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.lazy(() => SortOrderSchema).optional(),
  unitType: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  shareOfEquity: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRatePerc: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealInvestmentStatsMinOrderByAggregateInputSchema: z.ZodType<Prisma.DealInvestmentStatsMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.lazy(() => SortOrderSchema).optional(),
  unitType: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  shareOfEquity: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRatePerc: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealInvestmentStatsSumOrderByAggregateInputSchema: z.ZodType<Prisma.DealInvestmentStatsSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  shareOfEquity: z.lazy(() => SortOrderSchema).optional(),
  debtInterestRatePerc: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional()
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

export const EnumDealFinancingTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDealFinancingTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealFinancingTypeSchema).optional(),
  in: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  notIn: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NestedEnumDealFinancingTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealFinancingTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealFinancingTypeFilterSchema).optional()
}).strict();

export const EnumDealUnitTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDealUnitTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealUnitTypeSchema).optional(),
  in: z.lazy(() => DealUnitTypeSchema).array().optional(),
  notIn: z.lazy(() => DealUnitTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealUnitTypeSchema),z.lazy(() => NestedEnumDealUnitTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealUnitTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealUnitTypeFilterSchema).optional()
}).strict();

export const EnumDealOwnershipTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDealOwnershipTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealOwnershipTypeSchema).optional(),
  in: z.lazy(() => DealOwnershipTypeSchema).array().optional(),
  notIn: z.lazy(() => DealOwnershipTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NestedEnumDealOwnershipTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealOwnershipTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealOwnershipTypeFilterSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const DealListRelationFilterSchema: z.ZodType<Prisma.DealListRelationFilter> = z.object({
  every: z.lazy(() => DealWhereInputSchema).optional(),
  some: z.lazy(() => DealWhereInputSchema).optional(),
  none: z.lazy(() => DealWhereInputSchema).optional()
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const DealOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DealOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  tin: z.lazy(() => SortOrderSchema).optional(),
  dateOfCreation: z.lazy(() => SortOrderSchema).optional(),
  juristication: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  isPrimary: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  tin: z.lazy(() => SortOrderSchema).optional(),
  dateOfCreation: z.lazy(() => SortOrderSchema).optional(),
  juristication: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  isPrimary: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  tin: z.lazy(() => SortOrderSchema).optional(),
  dateOfCreation: z.lazy(() => SortOrderSchema).optional(),
  juristication: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  isPrimary: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const EnumMembershipTypeFilterSchema: z.ZodType<Prisma.EnumMembershipTypeFilter> = z.object({
  equals: z.lazy(() => MembershipTypeSchema).optional(),
  in: z.lazy(() => MembershipTypeSchema).array().optional(),
  notIn: z.lazy(() => MembershipTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => NestedEnumMembershipTypeFilterSchema) ]).optional(),
}).strict();

export const MemberCountOrderByAggregateInputSchema: z.ZodType<Prisma.MemberCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MemberAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MemberAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MemberMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MemberMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MemberMinOrderByAggregateInputSchema: z.ZodType<Prisma.MemberMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MemberSumOrderByAggregateInputSchema: z.ZodType<Prisma.MemberSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumMembershipTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumMembershipTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MembershipTypeSchema).optional(),
  in: z.lazy(() => MembershipTypeSchema).array().optional(),
  notIn: z.lazy(() => MembershipTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => NestedEnumMembershipTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMembershipTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMembershipTypeFilterSchema).optional()
}).strict();

export const EnumVerificationMethodFilterSchema: z.ZodType<Prisma.EnumVerificationMethodFilter> = z.object({
  equals: z.lazy(() => VerificationMethodSchema).optional(),
  in: z.lazy(() => VerificationMethodSchema).array().optional(),
  notIn: z.lazy(() => VerificationMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => NestedEnumVerificationMethodFilterSchema) ]).optional(),
}).strict();

export const EnumVerificationBasisFilterSchema: z.ZodType<Prisma.EnumVerificationBasisFilter> = z.object({
  equals: z.lazy(() => VerificationBasisSchema).optional(),
  in: z.lazy(() => VerificationBasisSchema).array().optional(),
  notIn: z.lazy(() => VerificationBasisSchema).array().optional(),
  not: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => NestedEnumVerificationBasisFilterSchema) ]).optional(),
}).strict();

export const AccreditationVerifierNullableScalarRelationFilterSchema: z.ZodType<Prisma.AccreditationVerifierNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => AccreditationVerifierWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AccreditationVerifierWhereInputSchema).optional().nullable()
}).strict();

export const AccreditationVerificationCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerificationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  verifierId: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  basis: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccreditationVerificationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerificationAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  verifierId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccreditationVerificationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerificationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  verifierId: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  basis: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccreditationVerificationMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerificationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  verifierId: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  basis: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccreditationVerificationSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerificationSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  verifierId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumVerificationMethodWithAggregatesFilterSchema: z.ZodType<Prisma.EnumVerificationMethodWithAggregatesFilter> = z.object({
  equals: z.lazy(() => VerificationMethodSchema).optional(),
  in: z.lazy(() => VerificationMethodSchema).array().optional(),
  notIn: z.lazy(() => VerificationMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => NestedEnumVerificationMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumVerificationMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumVerificationMethodFilterSchema).optional()
}).strict();

export const EnumVerificationBasisWithAggregatesFilterSchema: z.ZodType<Prisma.EnumVerificationBasisWithAggregatesFilter> = z.object({
  equals: z.lazy(() => VerificationBasisSchema).optional(),
  in: z.lazy(() => VerificationBasisSchema).array().optional(),
  notIn: z.lazy(() => VerificationBasisSchema).array().optional(),
  not: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => NestedEnumVerificationBasisWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumVerificationBasisFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumVerificationBasisFilterSchema).optional()
}).strict();

export const AccreditationVerifierCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerifierCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccreditationVerifierAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerifierAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccreditationVerifierMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerifierMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccreditationVerifierMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccreditationVerifierMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional()
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

export const DealDocumentCountOrderByAggregateInputSchema: z.ZodType<Prisma.DealDocumentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional(),
  taxYear: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealDocumentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DealDocumentAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional(),
  taxYear: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealDocumentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DealDocumentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional(),
  taxYear: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealDocumentMinOrderByAggregateInputSchema: z.ZodType<Prisma.DealDocumentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional(),
  taxYear: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealDocumentSumOrderByAggregateInputSchema: z.ZodType<Prisma.DealDocumentSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional(),
  taxYear: z.lazy(() => SortOrderSchema).optional()
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

export const OrganizationDocumentCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationDocumentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationDocumentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationDocumentMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationDocumentSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationDocumentSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  uploadedById: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumStatusFilterSchema: z.ZodType<Prisma.EnumStatusFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
}).strict();

export const ProjectDocumentListRelationFilterSchema: z.ZodType<Prisma.ProjectDocumentListRelationFilter> = z.object({
  every: z.lazy(() => ProjectDocumentWhereInputSchema).optional(),
  some: z.lazy(() => ProjectDocumentWhereInputSchema).optional(),
  none: z.lazy(() => ProjectDocumentWhereInputSchema).optional()
}).strict();

export const ProjectInvestmentStatsNullableScalarRelationFilterSchema: z.ZodType<Prisma.ProjectInvestmentStatsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => ProjectInvestmentStatsWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProjectInvestmentStatsWhereInputSchema).optional().nullable()
}).strict();

export const ProjectMilestonesNullableScalarRelationFilterSchema: z.ZodType<Prisma.ProjectMilestonesNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => ProjectMilestonesWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProjectMilestonesWhereInputSchema).optional().nullable()
}).strict();

export const ProjectPaymentInfoListRelationFilterSchema: z.ZodType<Prisma.ProjectPaymentInfoListRelationFilter> = z.object({
  every: z.lazy(() => ProjectPaymentInfoWhereInputSchema).optional(),
  some: z.lazy(() => ProjectPaymentInfoWhereInputSchema).optional(),
  none: z.lazy(() => ProjectPaymentInfoWhereInputSchema).optional()
}).strict();

export const ProjectPictureListRelationFilterSchema: z.ZodType<Prisma.ProjectPictureListRelationFilter> = z.object({
  every: z.lazy(() => ProjectPictureWhereInputSchema).optional(),
  some: z.lazy(() => ProjectPictureWhereInputSchema).optional(),
  none: z.lazy(() => ProjectPictureWhereInputSchema).optional()
}).strict();

export const ProjectPropertyStatsNullableScalarRelationFilterSchema: z.ZodType<Prisma.ProjectPropertyStatsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => ProjectPropertyStatsWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProjectPropertyStatsWhereInputSchema).optional().nullable()
}).strict();

export const ProjectDocumentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProjectDocumentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPaymentInfoOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProjectPaymentInfoOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPictureOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProjectPictureOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  marketHighlights: z.lazy(() => SortOrderSchema).optional(),
  youtubeUrl: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  equityReturnsFile: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  marketHighlights: z.lazy(() => SortOrderSchema).optional(),
  youtubeUrl: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  equityReturnsFile: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  marketHighlights: z.lazy(() => SortOrderSchema).optional(),
  youtubeUrl: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  equityReturnsFile: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
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

export const ProjectPropertyStatsCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPropertyStatsCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  avgRent: z.lazy(() => SortOrderSchema).optional(),
  avgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  commercialSqFt: z.lazy(() => SortOrderSchema).optional(),
  numUnits: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPropertyStatsAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPropertyStatsAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  avgRent: z.lazy(() => SortOrderSchema).optional(),
  avgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  commercialSqFt: z.lazy(() => SortOrderSchema).optional(),
  numUnits: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPropertyStatsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPropertyStatsMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  avgRent: z.lazy(() => SortOrderSchema).optional(),
  avgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  commercialSqFt: z.lazy(() => SortOrderSchema).optional(),
  numUnits: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPropertyStatsMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPropertyStatsMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  avgRent: z.lazy(() => SortOrderSchema).optional(),
  avgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  commercialSqFt: z.lazy(() => SortOrderSchema).optional(),
  numUnits: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPropertyStatsSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPropertyStatsSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  avgRent: z.lazy(() => SortOrderSchema).optional(),
  avgUnitSize: z.lazy(() => SortOrderSchema).optional(),
  commercialSqFt: z.lazy(() => SortOrderSchema).optional(),
  numUnits: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectInvestmentStatsCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cUnitThresholdAmount: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  totalAUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  totalCUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  interestRateDollarThreshold: z.lazy(() => SortOrderSchema).optional(),
  interestRateMax: z.lazy(() => SortOrderSchema).optional(),
  interestRateMin: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  boolDebt: z.lazy(() => SortOrderSchema).optional(),
  boolEquity: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectInvestmentStatsAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cUnitThresholdAmount: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  totalAUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  totalCUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  interestRateDollarThreshold: z.lazy(() => SortOrderSchema).optional(),
  interestRateMax: z.lazy(() => SortOrderSchema).optional(),
  interestRateMin: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectInvestmentStatsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cUnitThresholdAmount: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  totalAUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  totalCUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  interestRateDollarThreshold: z.lazy(() => SortOrderSchema).optional(),
  interestRateMax: z.lazy(() => SortOrderSchema).optional(),
  interestRateMin: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  boolDebt: z.lazy(() => SortOrderSchema).optional(),
  boolEquity: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectInvestmentStatsMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cUnitThresholdAmount: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreq: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  totalAUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  totalCUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  interestRateDollarThreshold: z.lazy(() => SortOrderSchema).optional(),
  interestRateMax: z.lazy(() => SortOrderSchema).optional(),
  interestRateMin: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  boolDebt: z.lazy(() => SortOrderSchema).optional(),
  boolEquity: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectInvestmentStatsSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  cUnitThresholdAmount: z.lazy(() => SortOrderSchema).optional(),
  debtMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityIRR: z.lazy(() => SortOrderSchema).optional(),
  equityMinInvestment: z.lazy(() => SortOrderSchema).optional(),
  equityTermMonths: z.lazy(() => SortOrderSchema).optional(),
  investmentGoal: z.lazy(() => SortOrderSchema).optional(),
  investmentRaised: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional(),
  totalAUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  totalCUnitReturn: z.lazy(() => SortOrderSchema).optional(),
  interestRateDollarThreshold: z.lazy(() => SortOrderSchema).optional(),
  interestRateMax: z.lazy(() => SortOrderSchema).optional(),
  interestRateMin: z.lazy(() => SortOrderSchema).optional(),
  equityPreferredReturn: z.lazy(() => SortOrderSchema).optional(),
  debtPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMax: z.lazy(() => SortOrderSchema).optional(),
  debtTermMonthsMin: z.lazy(() => SortOrderSchema).optional(),
  equityPaymentFreqMonths: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPaymentInfoCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPaymentInfoCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  accountNumber: z.lazy(() => SortOrderSchema).optional(),
  routingNumber: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPaymentInfoAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPaymentInfoAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPaymentInfoMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPaymentInfoMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  accountNumber: z.lazy(() => SortOrderSchema).optional(),
  routingNumber: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPaymentInfoMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPaymentInfoMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  accountNumber: z.lazy(() => SortOrderSchema).optional(),
  routingNumber: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPaymentInfoSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPaymentInfoSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
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

export const EnumPictureTypeFilterSchema: z.ZodType<Prisma.EnumPictureTypeFilter> = z.object({
  equals: z.lazy(() => PictureTypeSchema).optional(),
  in: z.lazy(() => PictureTypeSchema).array().optional(),
  notIn: z.lazy(() => PictureTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => NestedEnumPictureTypeFilterSchema) ]).optional(),
}).strict();

export const ProjectPictureCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPictureCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPictureAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPictureAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPictureMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPictureMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPictureMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPictureMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectPictureSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectPictureSumOrderByAggregateInput> = z.object({
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

export const ProjectDocumentCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectDocumentCountOrderByAggregateInput> = z.object({
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

export const ProjectDocumentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectDocumentAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectDocumentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectDocumentMaxOrderByAggregateInput> = z.object({
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

export const ProjectDocumentMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectDocumentMinOrderByAggregateInput> = z.object({
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

export const ProjectDocumentSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectDocumentSumOrderByAggregateInput> = z.object({
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

export const ProjectDocumentScalarRelationFilterSchema: z.ZodType<Prisma.ProjectDocumentScalarRelationFilter> = z.object({
  is: z.lazy(() => ProjectDocumentWhereInputSchema).optional(),
  isNot: z.lazy(() => ProjectDocumentWhereInputSchema).optional()
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

export const DocusignEventCountOrderByAggregateInputSchema: z.ZodType<Prisma.DocusignEventCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  envelopeId: z.lazy(() => SortOrderSchema).optional(),
  templateId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  dateSent: z.lazy(() => SortOrderSchema).optional(),
  dateCompleted: z.lazy(() => SortOrderSchema).optional(),
  allSignaturesCompleted: z.lazy(() => SortOrderSchema).optional(),
  investorSignatureCompleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocusignEventAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DocusignEventAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocusignEventMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DocusignEventMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  envelopeId: z.lazy(() => SortOrderSchema).optional(),
  templateId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  dateSent: z.lazy(() => SortOrderSchema).optional(),
  dateCompleted: z.lazy(() => SortOrderSchema).optional(),
  allSignaturesCompleted: z.lazy(() => SortOrderSchema).optional(),
  investorSignatureCompleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocusignEventMinOrderByAggregateInputSchema: z.ZodType<Prisma.DocusignEventMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  envelopeId: z.lazy(() => SortOrderSchema).optional(),
  templateId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional(),
  dateSent: z.lazy(() => SortOrderSchema).optional(),
  dateCompleted: z.lazy(() => SortOrderSchema).optional(),
  allSignaturesCompleted: z.lazy(() => SortOrderSchema).optional(),
  investorSignatureCompleted: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocusignEventSumOrderByAggregateInputSchema: z.ZodType<Prisma.DocusignEventSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationNullableScalarRelationFilterSchema: z.ZodType<Prisma.OrganizationNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => OrganizationWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => OrganizationWhereInputSchema).optional().nullable()
}).strict();

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const AddressCountOrderByAggregateInputSchema: z.ZodType<Prisma.AddressCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  zipcode: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AddressAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  zipcode: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressMinOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  zipcode: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressSumOrderByAggregateInputSchema: z.ZodType<Prisma.AddressSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  organizationId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional()
}).strict();

export const DealDocumentCreateNestedManyWithoutUploadedByInputSchema: z.ZodType<Prisma.DealDocumentCreateNestedManyWithoutUploadedByInput> = z.object({
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentCreateWithoutUploadedByInputSchema).array(),z.lazy(() => DealDocumentUncheckedCreateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutUploadedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealDocumentCreateOrConnectWithoutUploadedByInputSchema),z.lazy(() => DealDocumentCreateOrConnectWithoutUploadedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealDocumentCreateManyUploadedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocumentEventCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutUserInputSchema),z.lazy(() => DocumentEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocusignEventCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DocusignEventCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutUserInputSchema),z.lazy(() => DocusignEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocusignEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocusignEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocusignEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocusignEventCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MemberCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MemberCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => MemberCreateWithoutUserInputSchema),z.lazy(() => MemberCreateWithoutUserInputSchema).array(),z.lazy(() => MemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => MemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => MemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MemberCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationCreateNestedManyWithoutOwnedByInputSchema: z.ZodType<Prisma.OrganizationCreateNestedManyWithoutOwnedByInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnedByInputSchema),z.lazy(() => OrganizationCreateWithoutOwnedByInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutOwnedByInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutOwnedByInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutOwnedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyOwnedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationDocumentCreateNestedManyWithoutUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateNestedManyWithoutUploadedByInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentCreateWithoutUploadedByInputSchema).array(),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutUploadedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationDocumentCreateOrConnectWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentCreateOrConnectWithoutUploadedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationDocumentCreateManyUploadedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AddressUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional()
}).strict();

export const DealDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema: z.ZodType<Prisma.DealDocumentUncheckedCreateNestedManyWithoutUploadedByInput> = z.object({
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentCreateWithoutUploadedByInputSchema).array(),z.lazy(() => DealDocumentUncheckedCreateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutUploadedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealDocumentCreateOrConnectWithoutUploadedByInputSchema),z.lazy(() => DealDocumentCreateOrConnectWithoutUploadedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealDocumentCreateManyUploadedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutUserInputSchema),z.lazy(() => DocumentEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocusignEventUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DocusignEventUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutUserInputSchema),z.lazy(() => DocusignEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocusignEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocusignEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocusignEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocusignEventCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MemberUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MemberUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => MemberCreateWithoutUserInputSchema),z.lazy(() => MemberCreateWithoutUserInputSchema).array(),z.lazy(() => MemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => MemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => MemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MemberCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUncheckedCreateNestedManyWithoutOwnedByInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateNestedManyWithoutOwnedByInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnedByInputSchema),z.lazy(() => OrganizationCreateWithoutOwnedByInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutOwnedByInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutOwnedByInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutOwnedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyOwnedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedCreateNestedManyWithoutUploadedByInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentCreateWithoutUploadedByInputSchema).array(),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutUploadedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationDocumentCreateOrConnectWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentCreateOrConnectWithoutUploadedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationDocumentCreateManyUploadedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
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

export const DealDocumentUpdateManyWithoutUploadedByNestedInputSchema: z.ZodType<Prisma.DealDocumentUpdateManyWithoutUploadedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentCreateWithoutUploadedByInputSchema).array(),z.lazy(() => DealDocumentUncheckedCreateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutUploadedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealDocumentCreateOrConnectWithoutUploadedByInputSchema),z.lazy(() => DealDocumentCreateOrConnectWithoutUploadedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealDocumentUpsertWithWhereUniqueWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUpsertWithWhereUniqueWithoutUploadedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealDocumentCreateManyUploadedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealDocumentUpdateWithWhereUniqueWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUpdateWithWhereUniqueWithoutUploadedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealDocumentUpdateManyWithWhereWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUpdateManyWithWhereWithoutUploadedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealDocumentScalarWhereInputSchema),z.lazy(() => DealDocumentScalarWhereInputSchema).array() ]).optional(),
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

export const DocusignEventUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.DocusignEventUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutUserInputSchema),z.lazy(() => DocusignEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocusignEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocusignEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocusignEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DocusignEventUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DocusignEventUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocusignEventCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DocusignEventUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DocusignEventUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DocusignEventUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => DocusignEventUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DocusignEventScalarWhereInputSchema),z.lazy(() => DocusignEventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MemberUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MemberUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => MemberCreateWithoutUserInputSchema),z.lazy(() => MemberCreateWithoutUserInputSchema).array(),z.lazy(() => MemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => MemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => MemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MemberUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MemberUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MemberCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MemberUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MemberUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MemberUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => MemberUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MemberScalarWhereInputSchema),z.lazy(() => MemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUpdateManyWithoutOwnedByNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithoutOwnedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnedByInputSchema),z.lazy(() => OrganizationCreateWithoutOwnedByInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutOwnedByInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutOwnedByInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutOwnedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutOwnedByInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutOwnedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyOwnedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutOwnedByInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutOwnedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutOwnedByInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutOwnedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationDocumentUpdateManyWithoutUploadedByNestedInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateManyWithoutUploadedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentCreateWithoutUploadedByInputSchema).array(),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutUploadedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationDocumentCreateOrConnectWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentCreateOrConnectWithoutUploadedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationDocumentUpsertWithWhereUniqueWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUpsertWithWhereUniqueWithoutUploadedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationDocumentCreateManyUploadedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationDocumentUpdateWithWhereUniqueWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUpdateWithWhereUniqueWithoutUploadedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationDocumentUpdateManyWithWhereWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUpdateManyWithWhereWithoutUploadedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationDocumentScalarWhereInputSchema),z.lazy(() => OrganizationDocumentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const AddressUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => AddressUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AddressUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => AddressUpdateWithoutUserInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const DealDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateManyWithoutUploadedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentCreateWithoutUploadedByInputSchema).array(),z.lazy(() => DealDocumentUncheckedCreateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutUploadedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealDocumentCreateOrConnectWithoutUploadedByInputSchema),z.lazy(() => DealDocumentCreateOrConnectWithoutUploadedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealDocumentUpsertWithWhereUniqueWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUpsertWithWhereUniqueWithoutUploadedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealDocumentCreateManyUploadedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealDocumentUpdateWithWhereUniqueWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUpdateWithWhereUniqueWithoutUploadedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealDocumentUpdateManyWithWhereWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUpdateManyWithWhereWithoutUploadedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealDocumentScalarWhereInputSchema),z.lazy(() => DealDocumentScalarWhereInputSchema).array() ]).optional(),
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

export const DocusignEventUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.DocusignEventUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutUserInputSchema),z.lazy(() => DocusignEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocusignEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocusignEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocusignEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DocusignEventUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DocusignEventUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocusignEventCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DocusignEventUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DocusignEventUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DocusignEventUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => DocusignEventUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DocusignEventScalarWhereInputSchema),z.lazy(() => DocusignEventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MemberUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => MemberCreateWithoutUserInputSchema),z.lazy(() => MemberCreateWithoutUserInputSchema).array(),z.lazy(() => MemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => MemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => MemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MemberUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MemberUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MemberCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MemberUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MemberUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MemberUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => MemberUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MemberScalarWhereInputSchema),z.lazy(() => MemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUncheckedUpdateManyWithoutOwnedByNestedInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutOwnedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnedByInputSchema),z.lazy(() => OrganizationCreateWithoutOwnedByInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutOwnedByInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutOwnedByInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutOwnedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutOwnedByInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutOwnedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyOwnedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutOwnedByInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutOwnedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutOwnedByInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutOwnedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateManyWithoutUploadedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentCreateWithoutUploadedByInputSchema).array(),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutUploadedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationDocumentCreateOrConnectWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentCreateOrConnectWithoutUploadedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationDocumentUpsertWithWhereUniqueWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUpsertWithWhereUniqueWithoutUploadedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationDocumentCreateManyUploadedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationDocumentUpdateWithWhereUniqueWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUpdateWithWhereUniqueWithoutUploadedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationDocumentUpdateManyWithWhereWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUpdateManyWithWhereWithoutUploadedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationDocumentScalarWhereInputSchema),z.lazy(() => OrganizationDocumentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccreditationVerificationCreateNestedOneWithoutDealInputSchema: z.ZodType<Prisma.AccreditationVerificationCreateNestedOneWithoutDealInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutDealInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerificationCreateOrConnectWithoutDealInputSchema).optional(),
  connect: z.lazy(() => AccreditationVerificationWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationCreateNestedOneWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutDealsInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDealsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const ProjectCreateNestedOneWithoutDealsInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutDealsInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const DealDocumentCreateNestedManyWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentCreateNestedManyWithoutDealInput> = z.object({
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutDealInputSchema),z.lazy(() => DealDocumentCreateWithoutDealInputSchema).array(),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema),z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealDocumentCreateManyDealInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DealInvestmentStatsCreateNestedOneWithoutDealInputSchema: z.ZodType<Prisma.DealInvestmentStatsCreateNestedOneWithoutDealInput> = z.object({
  create: z.union([ z.lazy(() => DealInvestmentStatsCreateWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUncheckedCreateWithoutDealInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealInvestmentStatsCreateOrConnectWithoutDealInputSchema).optional(),
  connect: z.lazy(() => DealInvestmentStatsWhereUniqueInputSchema).optional()
}).strict();

export const DocusignEventCreateNestedManyWithoutDealInputSchema: z.ZodType<Prisma.DocusignEventCreateNestedManyWithoutDealInput> = z.object({
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutDealInputSchema),z.lazy(() => DocusignEventCreateWithoutDealInputSchema).array(),z.lazy(() => DocusignEventUncheckedCreateWithoutDealInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutDealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocusignEventCreateOrConnectWithoutDealInputSchema),z.lazy(() => DocusignEventCreateOrConnectWithoutDealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocusignEventCreateManyDealInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccreditationVerificationUncheckedCreateNestedOneWithoutDealInputSchema: z.ZodType<Prisma.AccreditationVerificationUncheckedCreateNestedOneWithoutDealInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutDealInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerificationCreateOrConnectWithoutDealInputSchema).optional(),
  connect: z.lazy(() => AccreditationVerificationWhereUniqueInputSchema).optional()
}).strict();

export const DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUncheckedCreateNestedManyWithoutDealInput> = z.object({
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutDealInputSchema),z.lazy(() => DealDocumentCreateWithoutDealInputSchema).array(),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema),z.lazy(() => DealDocumentCreateOrConnectWithoutDealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealDocumentCreateManyDealInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealDocumentWhereUniqueInputSchema),z.lazy(() => DealDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DealInvestmentStatsUncheckedCreateNestedOneWithoutDealInputSchema: z.ZodType<Prisma.DealInvestmentStatsUncheckedCreateNestedOneWithoutDealInput> = z.object({
  create: z.union([ z.lazy(() => DealInvestmentStatsCreateWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUncheckedCreateWithoutDealInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealInvestmentStatsCreateOrConnectWithoutDealInputSchema).optional(),
  connect: z.lazy(() => DealInvestmentStatsWhereUniqueInputSchema).optional()
}).strict();

export const DocusignEventUncheckedCreateNestedManyWithoutDealInputSchema: z.ZodType<Prisma.DocusignEventUncheckedCreateNestedManyWithoutDealInput> = z.object({
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutDealInputSchema),z.lazy(() => DocusignEventCreateWithoutDealInputSchema).array(),z.lazy(() => DocusignEventUncheckedCreateWithoutDealInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutDealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocusignEventCreateOrConnectWithoutDealInputSchema),z.lazy(() => DocusignEventCreateOrConnectWithoutDealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocusignEventCreateManyDealInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableEnumPaymentMethodFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumPaymentMethodFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PaymentMethodSchema).optional().nullable()
}).strict();

export const AccreditationVerificationUpdateOneWithoutDealNestedInputSchema: z.ZodType<Prisma.AccreditationVerificationUpdateOneWithoutDealNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutDealInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerificationCreateOrConnectWithoutDealInputSchema).optional(),
  upsert: z.lazy(() => AccreditationVerificationUpsertWithoutDealInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AccreditationVerificationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AccreditationVerificationUpdateToOneWithWhereWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUpdateWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUncheckedUpdateWithoutDealInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutDealsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDealsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutDealsInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutDealsInputSchema),z.lazy(() => OrganizationUpdateWithoutDealsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutDealsInputSchema) ]).optional(),
}).strict();

export const ProjectUpdateOneRequiredWithoutDealsNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutDealsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutDealsInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutDealsInputSchema),z.lazy(() => ProjectUpdateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutDealsInputSchema) ]).optional(),
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

export const DealInvestmentStatsUpdateOneWithoutDealNestedInputSchema: z.ZodType<Prisma.DealInvestmentStatsUpdateOneWithoutDealNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealInvestmentStatsCreateWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUncheckedCreateWithoutDealInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealInvestmentStatsCreateOrConnectWithoutDealInputSchema).optional(),
  upsert: z.lazy(() => DealInvestmentStatsUpsertWithoutDealInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => DealInvestmentStatsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => DealInvestmentStatsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => DealInvestmentStatsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DealInvestmentStatsUpdateToOneWithWhereWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUpdateWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUncheckedUpdateWithoutDealInputSchema) ]).optional(),
}).strict();

export const DocusignEventUpdateManyWithoutDealNestedInputSchema: z.ZodType<Prisma.DocusignEventUpdateManyWithoutDealNestedInput> = z.object({
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutDealInputSchema),z.lazy(() => DocusignEventCreateWithoutDealInputSchema).array(),z.lazy(() => DocusignEventUncheckedCreateWithoutDealInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutDealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocusignEventCreateOrConnectWithoutDealInputSchema),z.lazy(() => DocusignEventCreateOrConnectWithoutDealInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DocusignEventUpsertWithWhereUniqueWithoutDealInputSchema),z.lazy(() => DocusignEventUpsertWithWhereUniqueWithoutDealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocusignEventCreateManyDealInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DocusignEventUpdateWithWhereUniqueWithoutDealInputSchema),z.lazy(() => DocusignEventUpdateWithWhereUniqueWithoutDealInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DocusignEventUpdateManyWithWhereWithoutDealInputSchema),z.lazy(() => DocusignEventUpdateManyWithWhereWithoutDealInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DocusignEventScalarWhereInputSchema),z.lazy(() => DocusignEventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccreditationVerificationUncheckedUpdateOneWithoutDealNestedInputSchema: z.ZodType<Prisma.AccreditationVerificationUncheckedUpdateOneWithoutDealNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutDealInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerificationCreateOrConnectWithoutDealInputSchema).optional(),
  upsert: z.lazy(() => AccreditationVerificationUpsertWithoutDealInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AccreditationVerificationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AccreditationVerificationUpdateToOneWithWhereWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUpdateWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUncheckedUpdateWithoutDealInputSchema) ]).optional(),
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

export const DealInvestmentStatsUncheckedUpdateOneWithoutDealNestedInputSchema: z.ZodType<Prisma.DealInvestmentStatsUncheckedUpdateOneWithoutDealNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealInvestmentStatsCreateWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUncheckedCreateWithoutDealInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealInvestmentStatsCreateOrConnectWithoutDealInputSchema).optional(),
  upsert: z.lazy(() => DealInvestmentStatsUpsertWithoutDealInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => DealInvestmentStatsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => DealInvestmentStatsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => DealInvestmentStatsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DealInvestmentStatsUpdateToOneWithWhereWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUpdateWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUncheckedUpdateWithoutDealInputSchema) ]).optional(),
}).strict();

export const DocusignEventUncheckedUpdateManyWithoutDealNestedInputSchema: z.ZodType<Prisma.DocusignEventUncheckedUpdateManyWithoutDealNestedInput> = z.object({
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutDealInputSchema),z.lazy(() => DocusignEventCreateWithoutDealInputSchema).array(),z.lazy(() => DocusignEventUncheckedCreateWithoutDealInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutDealInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocusignEventCreateOrConnectWithoutDealInputSchema),z.lazy(() => DocusignEventCreateOrConnectWithoutDealInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DocusignEventUpsertWithWhereUniqueWithoutDealInputSchema),z.lazy(() => DocusignEventUpsertWithWhereUniqueWithoutDealInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocusignEventCreateManyDealInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DocusignEventWhereUniqueInputSchema),z.lazy(() => DocusignEventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DocusignEventUpdateWithWhereUniqueWithoutDealInputSchema),z.lazy(() => DocusignEventUpdateWithWhereUniqueWithoutDealInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DocusignEventUpdateManyWithWhereWithoutDealInputSchema),z.lazy(() => DocusignEventUpdateManyWithWhereWithoutDealInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DocusignEventScalarWhereInputSchema),z.lazy(() => DocusignEventScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DealCreateNestedOneWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.DealCreateNestedOneWithoutInvestmentStatsInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutInvestmentStatsInputSchema),z.lazy(() => DealUncheckedCreateWithoutInvestmentStatsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealCreateOrConnectWithoutInvestmentStatsInputSchema).optional(),
  connect: z.lazy(() => DealWhereUniqueInputSchema).optional()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumDealFinancingTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDealFinancingTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DealFinancingTypeSchema).optional()
}).strict();

export const EnumDealUnitTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDealUnitTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DealUnitTypeSchema).optional()
}).strict();

export const EnumDealOwnershipTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDealOwnershipTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DealOwnershipTypeSchema).optional()
}).strict();

export const DealUpdateOneRequiredWithoutInvestmentStatsNestedInputSchema: z.ZodType<Prisma.DealUpdateOneRequiredWithoutInvestmentStatsNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutInvestmentStatsInputSchema),z.lazy(() => DealUncheckedCreateWithoutInvestmentStatsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealCreateOrConnectWithoutInvestmentStatsInputSchema).optional(),
  upsert: z.lazy(() => DealUpsertWithoutInvestmentStatsInputSchema).optional(),
  connect: z.lazy(() => DealWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DealUpdateToOneWithWhereWithoutInvestmentStatsInputSchema),z.lazy(() => DealUpdateWithoutInvestmentStatsInputSchema),z.lazy(() => DealUncheckedUpdateWithoutInvestmentStatsInputSchema) ]).optional(),
}).strict();

export const AddressCreateNestedOneWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressCreateNestedOneWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrganizationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutOrganizationInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional()
}).strict();

export const DealCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.DealCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutOrganizationInputSchema),z.lazy(() => DealCreateWithoutOrganizationInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MemberCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.MemberCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => MemberCreateWithoutOrganizationInputSchema),z.lazy(() => MemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => MemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => MemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => MemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutOrganizationsOwnedInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOrganizationsOwnedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationsOwnedInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationsOwnedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationsOwnedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationDocumentCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationDocumentCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AddressUncheckedCreateNestedOneWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressUncheckedCreateNestedOneWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrganizationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutOrganizationInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional()
}).strict();

export const DealUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutOrganizationInputSchema),z.lazy(() => DealCreateWithoutOrganizationInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => DealCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MemberUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.MemberUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => MemberCreateWithoutOrganizationInputSchema),z.lazy(() => MemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => MemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => MemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => MemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationDocumentCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),z.lazy(() => OrganizationDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
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

export const MemberUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.MemberUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => MemberCreateWithoutOrganizationInputSchema),z.lazy(() => MemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => MemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => MemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => MemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MemberUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => MemberUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MemberUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => MemberUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MemberUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => MemberUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MemberScalarWhereInputSchema),z.lazy(() => MemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutOrganizationsOwnedNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOrganizationsOwnedNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationsOwnedInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationsOwnedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationsOwnedInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOrganizationsOwnedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOrganizationsOwnedInputSchema),z.lazy(() => UserUpdateWithoutOrganizationsOwnedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationsOwnedInputSchema) ]).optional(),
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

export const AddressUncheckedUpdateOneWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateOneWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrganizationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutOrganizationInputSchema).optional(),
  upsert: z.lazy(() => AddressUpsertWithoutOrganizationInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AddressUpdateToOneWithWhereWithoutOrganizationInputSchema),z.lazy(() => AddressUpdateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutOrganizationInputSchema) ]).optional(),
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

export const MemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => MemberCreateWithoutOrganizationInputSchema),z.lazy(() => MemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => MemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => MemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => MemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MemberUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => MemberUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MemberWhereUniqueInputSchema),z.lazy(() => MemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MemberUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => MemberUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MemberUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => MemberUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MemberScalarWhereInputSchema),z.lazy(() => MemberScalarWhereInputSchema).array() ]).optional(),
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

export const OrganizationCreateNestedOneWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutMembersInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutOrganizationMemberInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOrganizationMemberInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMemberInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationMemberInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumMembershipTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumMembershipTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => MembershipTypeSchema).optional()
}).strict();

export const OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutMembersNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutMembersInputSchema),z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutOrganizationMemberNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOrganizationMemberNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMemberInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMemberInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationMemberInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOrganizationMemberInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOrganizationMemberInputSchema),z.lazy(() => UserUpdateWithoutOrganizationMemberInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationMemberInputSchema) ]).optional(),
}).strict();

export const DealCreateNestedOneWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.DealCreateNestedOneWithoutAccreditationVerificationInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutAccreditationVerificationInputSchema),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerificationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealCreateOrConnectWithoutAccreditationVerificationInputSchema).optional(),
  connect: z.lazy(() => DealWhereUniqueInputSchema).optional()
}).strict();

export const AccreditationVerifierCreateNestedOneWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.AccreditationVerifierCreateNestedOneWithoutAccreditationVerificationInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerifierCreateWithoutAccreditationVerificationInputSchema),z.lazy(() => AccreditationVerifierUncheckedCreateWithoutAccreditationVerificationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerifierCreateOrConnectWithoutAccreditationVerificationInputSchema).optional(),
  connect: z.lazy(() => AccreditationVerifierWhereUniqueInputSchema).optional()
}).strict();

export const EnumVerificationMethodFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumVerificationMethodFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => VerificationMethodSchema).optional()
}).strict();

export const EnumVerificationBasisFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumVerificationBasisFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => VerificationBasisSchema).optional()
}).strict();

export const DealUpdateOneRequiredWithoutAccreditationVerificationNestedInputSchema: z.ZodType<Prisma.DealUpdateOneRequiredWithoutAccreditationVerificationNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutAccreditationVerificationInputSchema),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerificationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealCreateOrConnectWithoutAccreditationVerificationInputSchema).optional(),
  upsert: z.lazy(() => DealUpsertWithoutAccreditationVerificationInputSchema).optional(),
  connect: z.lazy(() => DealWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DealUpdateToOneWithWhereWithoutAccreditationVerificationInputSchema),z.lazy(() => DealUpdateWithoutAccreditationVerificationInputSchema),z.lazy(() => DealUncheckedUpdateWithoutAccreditationVerificationInputSchema) ]).optional(),
}).strict();

export const AccreditationVerifierUpdateOneWithoutAccreditationVerificationNestedInputSchema: z.ZodType<Prisma.AccreditationVerifierUpdateOneWithoutAccreditationVerificationNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerifierCreateWithoutAccreditationVerificationInputSchema),z.lazy(() => AccreditationVerifierUncheckedCreateWithoutAccreditationVerificationInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerifierCreateOrConnectWithoutAccreditationVerificationInputSchema).optional(),
  upsert: z.lazy(() => AccreditationVerifierUpsertWithoutAccreditationVerificationInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AccreditationVerifierWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AccreditationVerifierWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AccreditationVerifierWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AccreditationVerifierUpdateToOneWithWhereWithoutAccreditationVerificationInputSchema),z.lazy(() => AccreditationVerifierUpdateWithoutAccreditationVerificationInputSchema),z.lazy(() => AccreditationVerifierUncheckedUpdateWithoutAccreditationVerificationInputSchema) ]).optional(),
}).strict();

export const AccreditationVerificationCreateNestedOneWithoutVerifierInputSchema: z.ZodType<Prisma.AccreditationVerificationCreateNestedOneWithoutVerifierInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutVerifierInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerificationCreateOrConnectWithoutVerifierInputSchema).optional(),
  connect: z.lazy(() => AccreditationVerificationWhereUniqueInputSchema).optional()
}).strict();

export const AccreditationVerificationUncheckedCreateNestedOneWithoutVerifierInputSchema: z.ZodType<Prisma.AccreditationVerificationUncheckedCreateNestedOneWithoutVerifierInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutVerifierInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerificationCreateOrConnectWithoutVerifierInputSchema).optional(),
  connect: z.lazy(() => AccreditationVerificationWhereUniqueInputSchema).optional()
}).strict();

export const AccreditationVerificationUpdateOneWithoutVerifierNestedInputSchema: z.ZodType<Prisma.AccreditationVerificationUpdateOneWithoutVerifierNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutVerifierInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerificationCreateOrConnectWithoutVerifierInputSchema).optional(),
  upsert: z.lazy(() => AccreditationVerificationUpsertWithoutVerifierInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AccreditationVerificationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AccreditationVerificationUpdateToOneWithWhereWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUpdateWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUncheckedUpdateWithoutVerifierInputSchema) ]).optional(),
}).strict();

export const AccreditationVerificationUncheckedUpdateOneWithoutVerifierNestedInputSchema: z.ZodType<Prisma.AccreditationVerificationUncheckedUpdateOneWithoutVerifierNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutVerifierInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccreditationVerificationCreateOrConnectWithoutVerifierInputSchema).optional(),
  upsert: z.lazy(() => AccreditationVerificationUpsertWithoutVerifierInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AccreditationVerificationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AccreditationVerificationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AccreditationVerificationUpdateToOneWithWhereWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUpdateWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUncheckedUpdateWithoutVerifierInputSchema) ]).optional(),
}).strict();

export const DealCreateNestedOneWithoutDocumentInputSchema: z.ZodType<Prisma.DealCreateNestedOneWithoutDocumentInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutDocumentInputSchema),z.lazy(() => DealUncheckedCreateWithoutDocumentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealCreateOrConnectWithoutDocumentInputSchema).optional(),
  connect: z.lazy(() => DealWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutDealDocumentUploadedInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDealDocumentUploadedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDealDocumentUploadedInputSchema),z.lazy(() => UserUncheckedCreateWithoutDealDocumentUploadedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDealDocumentUploadedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumDealDocumentTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDealDocumentTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DealDocumentTypeSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const DealUpdateOneRequiredWithoutDocumentNestedInputSchema: z.ZodType<Prisma.DealUpdateOneRequiredWithoutDocumentNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutDocumentInputSchema),z.lazy(() => DealUncheckedCreateWithoutDocumentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealCreateOrConnectWithoutDocumentInputSchema).optional(),
  upsert: z.lazy(() => DealUpsertWithoutDocumentInputSchema).optional(),
  connect: z.lazy(() => DealWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DealUpdateToOneWithWhereWithoutDocumentInputSchema),z.lazy(() => DealUpdateWithoutDocumentInputSchema),z.lazy(() => DealUncheckedUpdateWithoutDocumentInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutDealDocumentUploadedNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDealDocumentUploadedNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDealDocumentUploadedInputSchema),z.lazy(() => UserUncheckedCreateWithoutDealDocumentUploadedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDealDocumentUploadedInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutDealDocumentUploadedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutDealDocumentUploadedInputSchema),z.lazy(() => UserUpdateWithoutDealDocumentUploadedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDealDocumentUploadedInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateNestedOneWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutDocumentInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDocumentInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDocumentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutDocumentInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutOrganizationDocumentUploadedInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOrganizationDocumentUploadedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationDocumentUploadedInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationDocumentUploadedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationDocumentUploadedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationUpdateOneRequiredWithoutDocumentNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutDocumentNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDocumentInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDocumentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutDocumentInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutDocumentInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutDocumentInputSchema),z.lazy(() => OrganizationUpdateWithoutDocumentInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutDocumentInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutOrganizationDocumentUploadedNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOrganizationDocumentUploadedNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationDocumentUploadedInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationDocumentUploadedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationDocumentUploadedInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOrganizationDocumentUploadedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOrganizationDocumentUploadedInputSchema),z.lazy(() => UserUpdateWithoutOrganizationDocumentUploadedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationDocumentUploadedInputSchema) ]).optional(),
}).strict();

export const DealCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.DealCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutProjectInputSchema),z.lazy(() => DealCreateWithoutProjectInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema),z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectDocumentCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.ProjectDocumentCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectDocumentCreateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectDocumentUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectDocumentCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectDocumentCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectDocumentCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProjectDocumentWhereUniqueInputSchema),z.lazy(() => ProjectDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectInvestmentStatsCreateNestedOneWithoutProjectInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsCreateNestedOneWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectInvestmentStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectInvestmentStatsCreateOrConnectWithoutProjectInputSchema).optional(),
  connect: z.lazy(() => ProjectInvestmentStatsWhereUniqueInputSchema).optional()
}).strict();

export const ProjectMilestonesCreateNestedOneWithoutProjectInputSchema: z.ZodType<Prisma.ProjectMilestonesCreateNestedOneWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectMilestonesCreateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectMilestonesCreateOrConnectWithoutProjectInputSchema).optional(),
  connect: z.lazy(() => ProjectMilestonesWhereUniqueInputSchema).optional()
}).strict();

export const ProjectPaymentInfoCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPaymentInfoCreateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectPaymentInfoUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectPaymentInfoCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectPaymentInfoCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectPictureCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPictureCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPictureCreateWithoutProjectInputSchema),z.lazy(() => ProjectPictureCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectPictureUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectPictureUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectPictureCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectPictureCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectPictureCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProjectPictureWhereUniqueInputSchema),z.lazy(() => ProjectPictureWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectPropertyStatsCreateNestedOneWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPropertyStatsCreateNestedOneWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPropertyStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectPropertyStatsCreateOrConnectWithoutProjectInputSchema).optional(),
  connect: z.lazy(() => ProjectPropertyStatsWhereUniqueInputSchema).optional()
}).strict();

export const DealUncheckedCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.DealUncheckedCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutProjectInputSchema),z.lazy(() => DealCreateWithoutProjectInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema),z.lazy(() => DealCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectDocumentUncheckedCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.ProjectDocumentUncheckedCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectDocumentCreateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectDocumentUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectDocumentCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectDocumentCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectDocumentCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProjectDocumentWhereUniqueInputSchema),z.lazy(() => ProjectDocumentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectInvestmentStatsUncheckedCreateNestedOneWithoutProjectInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUncheckedCreateNestedOneWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectInvestmentStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectInvestmentStatsCreateOrConnectWithoutProjectInputSchema).optional(),
  connect: z.lazy(() => ProjectInvestmentStatsWhereUniqueInputSchema).optional()
}).strict();

export const ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema: z.ZodType<Prisma.ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectMilestonesCreateWithoutProjectInputSchema),z.lazy(() => ProjectMilestonesUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectMilestonesCreateOrConnectWithoutProjectInputSchema).optional(),
  connect: z.lazy(() => ProjectMilestonesWhereUniqueInputSchema).optional()
}).strict();

export const ProjectPaymentInfoUncheckedCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUncheckedCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPaymentInfoCreateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectPaymentInfoUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectPaymentInfoCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectPaymentInfoCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectPictureUncheckedCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPictureUncheckedCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPictureCreateWithoutProjectInputSchema),z.lazy(() => ProjectPictureCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectPictureUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectPictureUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectPictureCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectPictureCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectPictureCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProjectPictureWhereUniqueInputSchema),z.lazy(() => ProjectPictureWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectPropertyStatsUncheckedCreateNestedOneWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUncheckedCreateNestedOneWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPropertyStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectPropertyStatsCreateOrConnectWithoutProjectInputSchema).optional(),
  connect: z.lazy(() => ProjectPropertyStatsWhereUniqueInputSchema).optional()
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

export const ProjectDocumentUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectDocumentUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectDocumentCreateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectDocumentUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectDocumentCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectDocumentCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProjectDocumentUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectDocumentCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProjectDocumentWhereUniqueInputSchema),z.lazy(() => ProjectDocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProjectDocumentWhereUniqueInputSchema),z.lazy(() => ProjectDocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProjectDocumentWhereUniqueInputSchema),z.lazy(() => ProjectDocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProjectDocumentWhereUniqueInputSchema),z.lazy(() => ProjectDocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProjectDocumentUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProjectDocumentUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProjectDocumentScalarWhereInputSchema),z.lazy(() => ProjectDocumentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectInvestmentStatsUpdateOneWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUpdateOneWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectInvestmentStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectInvestmentStatsCreateOrConnectWithoutProjectInputSchema).optional(),
  upsert: z.lazy(() => ProjectInvestmentStatsUpsertWithoutProjectInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProjectInvestmentStatsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProjectInvestmentStatsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProjectInvestmentStatsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectInvestmentStatsUpdateToOneWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUpdateWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUncheckedUpdateWithoutProjectInputSchema) ]).optional(),
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

export const ProjectPaymentInfoUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPaymentInfoCreateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectPaymentInfoUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectPaymentInfoCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProjectPaymentInfoUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectPaymentInfoCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProjectPaymentInfoUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProjectPaymentInfoUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProjectPaymentInfoScalarWhereInputSchema),z.lazy(() => ProjectPaymentInfoScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectPictureUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectPictureUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPictureCreateWithoutProjectInputSchema),z.lazy(() => ProjectPictureCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectPictureUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectPictureUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectPictureCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectPictureCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProjectPictureUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectPictureUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectPictureCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProjectPictureWhereUniqueInputSchema),z.lazy(() => ProjectPictureWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProjectPictureWhereUniqueInputSchema),z.lazy(() => ProjectPictureWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProjectPictureWhereUniqueInputSchema),z.lazy(() => ProjectPictureWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProjectPictureWhereUniqueInputSchema),z.lazy(() => ProjectPictureWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProjectPictureUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectPictureUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProjectPictureUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectPictureUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProjectPictureScalarWhereInputSchema),z.lazy(() => ProjectPictureScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectPropertyStatsUpdateOneWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUpdateOneWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPropertyStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectPropertyStatsCreateOrConnectWithoutProjectInputSchema).optional(),
  upsert: z.lazy(() => ProjectPropertyStatsUpsertWithoutProjectInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProjectPropertyStatsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProjectPropertyStatsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProjectPropertyStatsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectPropertyStatsUpdateToOneWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUpdateWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUncheckedUpdateWithoutProjectInputSchema) ]).optional(),
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

export const ProjectDocumentUncheckedUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectDocumentUncheckedUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectDocumentCreateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectDocumentUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectDocumentCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectDocumentCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProjectDocumentUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectDocumentCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProjectDocumentWhereUniqueInputSchema),z.lazy(() => ProjectDocumentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProjectDocumentWhereUniqueInputSchema),z.lazy(() => ProjectDocumentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProjectDocumentWhereUniqueInputSchema),z.lazy(() => ProjectDocumentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProjectDocumentWhereUniqueInputSchema),z.lazy(() => ProjectDocumentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProjectDocumentUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProjectDocumentUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProjectDocumentScalarWhereInputSchema),z.lazy(() => ProjectDocumentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectInvestmentStatsUncheckedUpdateOneWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUncheckedUpdateOneWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectInvestmentStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectInvestmentStatsCreateOrConnectWithoutProjectInputSchema).optional(),
  upsert: z.lazy(() => ProjectInvestmentStatsUpsertWithoutProjectInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProjectInvestmentStatsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProjectInvestmentStatsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProjectInvestmentStatsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectInvestmentStatsUpdateToOneWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUpdateWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUncheckedUpdateWithoutProjectInputSchema) ]).optional(),
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

export const ProjectPaymentInfoUncheckedUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUncheckedUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPaymentInfoCreateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectPaymentInfoUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectPaymentInfoCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProjectPaymentInfoUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectPaymentInfoCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProjectPaymentInfoUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProjectPaymentInfoUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProjectPaymentInfoScalarWhereInputSchema),z.lazy(() => ProjectPaymentInfoScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectPictureUncheckedUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectPictureUncheckedUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPictureCreateWithoutProjectInputSchema),z.lazy(() => ProjectPictureCreateWithoutProjectInputSchema).array(),z.lazy(() => ProjectPictureUncheckedCreateWithoutProjectInputSchema),z.lazy(() => ProjectPictureUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProjectPictureCreateOrConnectWithoutProjectInputSchema),z.lazy(() => ProjectPictureCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProjectPictureUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectPictureUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProjectPictureCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProjectPictureWhereUniqueInputSchema),z.lazy(() => ProjectPictureWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProjectPictureWhereUniqueInputSchema),z.lazy(() => ProjectPictureWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProjectPictureWhereUniqueInputSchema),z.lazy(() => ProjectPictureWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProjectPictureWhereUniqueInputSchema),z.lazy(() => ProjectPictureWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProjectPictureUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => ProjectPictureUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProjectPictureUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectPictureUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProjectPictureScalarWhereInputSchema),z.lazy(() => ProjectPictureScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectPropertyStatsUncheckedUpdateOneWithoutProjectNestedInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUncheckedUpdateOneWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectPropertyStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUncheckedCreateWithoutProjectInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectPropertyStatsCreateOrConnectWithoutProjectInputSchema).optional(),
  upsert: z.lazy(() => ProjectPropertyStatsUpsertWithoutProjectInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProjectPropertyStatsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProjectPropertyStatsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProjectPropertyStatsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectPropertyStatsUpdateToOneWithWhereWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUpdateWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUncheckedUpdateWithoutProjectInputSchema) ]).optional(),
}).strict();

export const ProjectCreateNestedOneWithoutPropertyStatsInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutPropertyStatsInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutPropertyStatsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutPropertyStatsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutPropertyStatsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const ProjectUpdateOneRequiredWithoutPropertyStatsNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutPropertyStatsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutPropertyStatsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutPropertyStatsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutPropertyStatsInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutPropertyStatsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutPropertyStatsInputSchema),z.lazy(() => ProjectUpdateWithoutPropertyStatsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutPropertyStatsInputSchema) ]).optional(),
}).strict();

export const ProjectCreateNestedOneWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutInvestmentStatsInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutInvestmentStatsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutInvestmentStatsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutInvestmentStatsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const ProjectUpdateOneRequiredWithoutInvestmentStatsNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutInvestmentStatsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutInvestmentStatsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutInvestmentStatsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutInvestmentStatsInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutInvestmentStatsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutInvestmentStatsInputSchema),z.lazy(() => ProjectUpdateWithoutInvestmentStatsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutInvestmentStatsInputSchema) ]).optional(),
}).strict();

export const ProjectCreateNestedOneWithoutProjectPaymentInfoInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutProjectPaymentInfoInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutProjectPaymentInfoInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutProjectPaymentInfoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutProjectPaymentInfoInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const ProjectUpdateOneRequiredWithoutProjectPaymentInfoNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutProjectPaymentInfoNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutProjectPaymentInfoInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutProjectPaymentInfoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutProjectPaymentInfoInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutProjectPaymentInfoInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutProjectPaymentInfoInputSchema),z.lazy(() => ProjectUpdateWithoutProjectPaymentInfoInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutProjectPaymentInfoInputSchema) ]).optional(),
}).strict();

export const ProjectCreateNestedOneWithoutMilestonesInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutMilestonesInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutMilestonesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutMilestonesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutMilestonesInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const ProjectUpdateOneRequiredWithoutMilestonesNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutMilestonesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutMilestonesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutMilestonesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutMilestonesInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutMilestonesInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutMilestonesInputSchema),z.lazy(() => ProjectUpdateWithoutMilestonesInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutMilestonesInputSchema) ]).optional(),
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

export const ProjectDocumentCreatefinancingTypesInputSchema: z.ZodType<Prisma.ProjectDocumentCreatefinancingTypesInput> = z.object({
  set: z.lazy(() => DealFinancingTypeSchema).array()
}).strict();

export const DocumentEventCreateNestedManyWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventCreateNestedManyWithoutDocumentInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyDocumentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectCreateNestedOneWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutDocumentsInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutDocumentsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDocumentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutDocumentsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const DocumentEventUncheckedCreateNestedManyWithoutDocumentInputSchema: z.ZodType<Prisma.DocumentEventUncheckedCreateNestedManyWithoutDocumentInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateWithoutDocumentInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutDocumentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutDocumentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyDocumentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProjectDocumentUpdatefinancingTypesInputSchema: z.ZodType<Prisma.ProjectDocumentUpdatefinancingTypesInput> = z.object({
  set: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  push: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
}).strict();

export const EnumDocumentTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDocumentTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DocumentTypeSchema).optional()
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

export const ProjectUpdateOneRequiredWithoutDocumentsNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutDocumentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutDocumentsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDocumentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutDocumentsInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutDocumentsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutDocumentsInputSchema),z.lazy(() => ProjectUpdateWithoutDocumentsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutDocumentsInputSchema) ]).optional(),
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

export const ProjectDocumentCreateNestedOneWithoutDocumentEventsInputSchema: z.ZodType<Prisma.ProjectDocumentCreateNestedOneWithoutDocumentEventsInput> = z.object({
  create: z.union([ z.lazy(() => ProjectDocumentCreateWithoutDocumentEventsInputSchema),z.lazy(() => ProjectDocumentUncheckedCreateWithoutDocumentEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectDocumentCreateOrConnectWithoutDocumentEventsInputSchema).optional(),
  connect: z.lazy(() => ProjectDocumentWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDocumentEventsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDocumentEventsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDocumentEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDocumentEventsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumDocumentEventTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDocumentEventTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DocumentEventTypeSchema).optional()
}).strict();

export const ProjectDocumentUpdateOneRequiredWithoutDocumentEventsNestedInputSchema: z.ZodType<Prisma.ProjectDocumentUpdateOneRequiredWithoutDocumentEventsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectDocumentCreateWithoutDocumentEventsInputSchema),z.lazy(() => ProjectDocumentUncheckedCreateWithoutDocumentEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectDocumentCreateOrConnectWithoutDocumentEventsInputSchema).optional(),
  upsert: z.lazy(() => ProjectDocumentUpsertWithoutDocumentEventsInputSchema).optional(),
  connect: z.lazy(() => ProjectDocumentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectDocumentUpdateToOneWithWhereWithoutDocumentEventsInputSchema),z.lazy(() => ProjectDocumentUpdateWithoutDocumentEventsInputSchema),z.lazy(() => ProjectDocumentUncheckedUpdateWithoutDocumentEventsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutDocumentEventsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDocumentEventsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDocumentEventsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDocumentEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDocumentEventsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutDocumentEventsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutDocumentEventsInputSchema),z.lazy(() => UserUpdateWithoutDocumentEventsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDocumentEventsInputSchema) ]).optional(),
}).strict();

export const DealCreateNestedOneWithoutDocusignEventInputSchema: z.ZodType<Prisma.DealCreateNestedOneWithoutDocusignEventInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutDocusignEventInputSchema),z.lazy(() => DealUncheckedCreateWithoutDocusignEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealCreateOrConnectWithoutDocusignEventInputSchema).optional(),
  connect: z.lazy(() => DealWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutDocusignEventInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDocusignEventInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDocusignEventInputSchema),z.lazy(() => UserUncheckedCreateWithoutDocusignEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDocusignEventInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const DealUpdateOneRequiredWithoutDocusignEventNestedInputSchema: z.ZodType<Prisma.DealUpdateOneRequiredWithoutDocusignEventNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutDocusignEventInputSchema),z.lazy(() => DealUncheckedCreateWithoutDocusignEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DealCreateOrConnectWithoutDocusignEventInputSchema).optional(),
  upsert: z.lazy(() => DealUpsertWithoutDocusignEventInputSchema).optional(),
  connect: z.lazy(() => DealWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DealUpdateToOneWithWhereWithoutDocusignEventInputSchema),z.lazy(() => DealUpdateWithoutDocusignEventInputSchema),z.lazy(() => DealUncheckedUpdateWithoutDocusignEventInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutDocusignEventNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDocusignEventNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDocusignEventInputSchema),z.lazy(() => UserUncheckedCreateWithoutDocusignEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDocusignEventInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutDocusignEventInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutDocusignEventInputSchema),z.lazy(() => UserUpdateWithoutDocusignEventInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDocusignEventInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateNestedOneWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutAddressInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationUpdateOneWithoutAddressNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutAddressInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutAddressInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutAddressInputSchema),z.lazy(() => OrganizationUpdateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutAddressInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneWithoutAddressNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAddressInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAddressInputSchema),z.lazy(() => UserUpdateWithoutAddressInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAddressInputSchema) ]).optional(),
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

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
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

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
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

export const NestedEnumPaymentMethodNullableFilterSchema: z.ZodType<Prisma.NestedEnumPaymentMethodNullableFilter> = z.object({
  equals: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  in: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumPaymentMethodNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPaymentMethodNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  in: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NestedEnumPaymentMethodNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentMethodNullableFilterSchema).optional()
}).strict();

export const NestedEnumDealFinancingTypeFilterSchema: z.ZodType<Prisma.NestedEnumDealFinancingTypeFilter> = z.object({
  equals: z.lazy(() => DealFinancingTypeSchema).optional(),
  in: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  notIn: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NestedEnumDealFinancingTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDealUnitTypeFilterSchema: z.ZodType<Prisma.NestedEnumDealUnitTypeFilter> = z.object({
  equals: z.lazy(() => DealUnitTypeSchema).optional(),
  in: z.lazy(() => DealUnitTypeSchema).array().optional(),
  notIn: z.lazy(() => DealUnitTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealUnitTypeSchema),z.lazy(() => NestedEnumDealUnitTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDealOwnershipTypeFilterSchema: z.ZodType<Prisma.NestedEnumDealOwnershipTypeFilter> = z.object({
  equals: z.lazy(() => DealOwnershipTypeSchema).optional(),
  in: z.lazy(() => DealOwnershipTypeSchema).array().optional(),
  notIn: z.lazy(() => DealOwnershipTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NestedEnumDealOwnershipTypeFilterSchema) ]).optional(),
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

export const NestedEnumDealFinancingTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDealFinancingTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealFinancingTypeSchema).optional(),
  in: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  notIn: z.lazy(() => DealFinancingTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NestedEnumDealFinancingTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealFinancingTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealFinancingTypeFilterSchema).optional()
}).strict();

export const NestedEnumDealUnitTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDealUnitTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealUnitTypeSchema).optional(),
  in: z.lazy(() => DealUnitTypeSchema).array().optional(),
  notIn: z.lazy(() => DealUnitTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealUnitTypeSchema),z.lazy(() => NestedEnumDealUnitTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealUnitTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealUnitTypeFilterSchema).optional()
}).strict();

export const NestedEnumDealOwnershipTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDealOwnershipTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealOwnershipTypeSchema).optional(),
  in: z.lazy(() => DealOwnershipTypeSchema).array().optional(),
  notIn: z.lazy(() => DealOwnershipTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NestedEnumDealOwnershipTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealOwnershipTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealOwnershipTypeFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedEnumMembershipTypeFilterSchema: z.ZodType<Prisma.NestedEnumMembershipTypeFilter> = z.object({
  equals: z.lazy(() => MembershipTypeSchema).optional(),
  in: z.lazy(() => MembershipTypeSchema).array().optional(),
  notIn: z.lazy(() => MembershipTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => NestedEnumMembershipTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumMembershipTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumMembershipTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => MembershipTypeSchema).optional(),
  in: z.lazy(() => MembershipTypeSchema).array().optional(),
  notIn: z.lazy(() => MembershipTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => NestedEnumMembershipTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMembershipTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMembershipTypeFilterSchema).optional()
}).strict();

export const NestedEnumVerificationMethodFilterSchema: z.ZodType<Prisma.NestedEnumVerificationMethodFilter> = z.object({
  equals: z.lazy(() => VerificationMethodSchema).optional(),
  in: z.lazy(() => VerificationMethodSchema).array().optional(),
  notIn: z.lazy(() => VerificationMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => NestedEnumVerificationMethodFilterSchema) ]).optional(),
}).strict();

export const NestedEnumVerificationBasisFilterSchema: z.ZodType<Prisma.NestedEnumVerificationBasisFilter> = z.object({
  equals: z.lazy(() => VerificationBasisSchema).optional(),
  in: z.lazy(() => VerificationBasisSchema).array().optional(),
  notIn: z.lazy(() => VerificationBasisSchema).array().optional(),
  not: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => NestedEnumVerificationBasisFilterSchema) ]).optional(),
}).strict();

export const NestedEnumVerificationMethodWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumVerificationMethodWithAggregatesFilter> = z.object({
  equals: z.lazy(() => VerificationMethodSchema).optional(),
  in: z.lazy(() => VerificationMethodSchema).array().optional(),
  notIn: z.lazy(() => VerificationMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => NestedEnumVerificationMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumVerificationMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumVerificationMethodFilterSchema).optional()
}).strict();

export const NestedEnumVerificationBasisWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumVerificationBasisWithAggregatesFilter> = z.object({
  equals: z.lazy(() => VerificationBasisSchema).optional(),
  in: z.lazy(() => VerificationBasisSchema).array().optional(),
  notIn: z.lazy(() => VerificationBasisSchema).array().optional(),
  not: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => NestedEnumVerificationBasisWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumVerificationBasisFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumVerificationBasisFilterSchema).optional()
}).strict();

export const NestedEnumDealDocumentTypeFilterSchema: z.ZodType<Prisma.NestedEnumDealDocumentTypeFilter> = z.object({
  equals: z.lazy(() => DealDocumentTypeSchema).optional(),
  in: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  notIn: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => NestedEnumDealDocumentTypeFilterSchema) ]).optional(),
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

export const NestedEnumDealDocumentTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDealDocumentTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealDocumentTypeSchema).optional(),
  in: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  notIn: z.lazy(() => DealDocumentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => NestedEnumDealDocumentTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealDocumentTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealDocumentTypeFilterSchema).optional()
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

export const NestedEnumStatusFilterSchema: z.ZodType<Prisma.NestedEnumStatusFilter> = z.object({
  equals: z.lazy(() => StatusSchema).optional(),
  in: z.lazy(() => StatusSchema).array().optional(),
  notIn: z.lazy(() => StatusSchema).array().optional(),
  not: z.union([ z.lazy(() => StatusSchema),z.lazy(() => NestedEnumStatusFilterSchema) ]).optional(),
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

export const AddressCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateWithoutUserInput> = z.object({
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  country: z.string().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  country: z.string().optional(),
  organizationId: z.number().int().optional().nullable()
}).strict();

export const AddressCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const DealDocumentCreateWithoutUploadedByInputSchema: z.ZodType<Prisma.DealDocumentCreateWithoutUploadedByInput> = z.object({
  name: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  taxYear: z.number().int().optional().nullable(),
  deal: z.lazy(() => DealCreateNestedOneWithoutDocumentInputSchema)
}).strict();

export const DealDocumentUncheckedCreateWithoutUploadedByInputSchema: z.ZodType<Prisma.DealDocumentUncheckedCreateWithoutUploadedByInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  dealId: z.number().int(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  taxYear: z.number().int().optional().nullable()
}).strict();

export const DealDocumentCreateOrConnectWithoutUploadedByInputSchema: z.ZodType<Prisma.DealDocumentCreateOrConnectWithoutUploadedByInput> = z.object({
  where: z.lazy(() => DealDocumentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutUploadedByInputSchema) ]),
}).strict();

export const DealDocumentCreateManyUploadedByInputEnvelopeSchema: z.ZodType<Prisma.DealDocumentCreateManyUploadedByInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DealDocumentCreateManyUploadedByInputSchema),z.lazy(() => DealDocumentCreateManyUploadedByInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DocumentEventCreateWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventCreateWithoutUserInput> = z.object({
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema),
  document: z.lazy(() => ProjectDocumentCreateNestedOneWithoutDocumentEventsInputSchema)
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

export const DocusignEventCreateWithoutUserInputSchema: z.ZodType<Prisma.DocusignEventCreateWithoutUserInput> = z.object({
  envelopeId: z.string(),
  templateId: z.string(),
  dateSent: z.coerce.date().optional().nullable(),
  dateCompleted: z.coerce.date().optional().nullable(),
  allSignaturesCompleted: z.boolean().optional(),
  investorSignatureCompleted: z.boolean().optional(),
  deal: z.lazy(() => DealCreateNestedOneWithoutDocusignEventInputSchema)
}).strict();

export const DocusignEventUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.DocusignEventUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  envelopeId: z.string(),
  templateId: z.string(),
  dealId: z.number().int(),
  dateSent: z.coerce.date().optional().nullable(),
  dateCompleted: z.coerce.date().optional().nullable(),
  allSignaturesCompleted: z.boolean().optional(),
  investorSignatureCompleted: z.boolean().optional()
}).strict();

export const DocusignEventCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.DocusignEventCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => DocusignEventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutUserInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const DocusignEventCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.DocusignEventCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DocusignEventCreateManyUserInputSchema),z.lazy(() => DocusignEventCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const MemberCreateWithoutUserInputSchema: z.ZodType<Prisma.MemberCreateWithoutUserInput> = z.object({
  type: z.lazy(() => MembershipTypeSchema),
  title: z.string().optional().nullable(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const MemberUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.MemberUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  organizationId: z.number().int(),
  type: z.lazy(() => MembershipTypeSchema),
  title: z.string().optional().nullable()
}).strict();

export const MemberCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.MemberCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => MemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MemberCreateWithoutUserInputSchema),z.lazy(() => MemberUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const MemberCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.MemberCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MemberCreateManyUserInputSchema),z.lazy(() => MemberCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationCreateWithoutOwnedByInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutOwnedByInput> = z.object({
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealCreateNestedManyWithoutOrganizationInputSchema).optional(),
  members: z.lazy(() => MemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutOwnedByInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutOwnedByInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  members: z.lazy(() => MemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutOwnedByInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutOwnedByInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnedByInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnedByInputSchema) ]),
}).strict();

export const OrganizationCreateManyOwnedByInputEnvelopeSchema: z.ZodType<Prisma.OrganizationCreateManyOwnedByInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationCreateManyOwnedByInputSchema),z.lazy(() => OrganizationCreateManyOwnedByInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationDocumentCreateWithoutUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateWithoutUploadedByInput> = z.object({
  name: z.string(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  key: z.string().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDocumentInputSchema)
}).strict();

export const OrganizationDocumentUncheckedCreateWithoutUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedCreateWithoutUploadedByInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  organizationId: z.number().int(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  key: z.string().optional()
}).strict();

export const OrganizationDocumentCreateOrConnectWithoutUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateOrConnectWithoutUploadedByInput> = z.object({
  where: z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutUploadedByInputSchema) ]),
}).strict();

export const OrganizationDocumentCreateManyUploadedByInputEnvelopeSchema: z.ZodType<Prisma.OrganizationDocumentCreateManyUploadedByInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationDocumentCreateManyUploadedByInputSchema),z.lazy(() => OrganizationDocumentCreateManyUploadedByInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
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
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealDocumentUpsertWithWhereUniqueWithoutUploadedByInputSchema: z.ZodType<Prisma.DealDocumentUpsertWithWhereUniqueWithoutUploadedByInput> = z.object({
  where: z.lazy(() => DealDocumentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DealDocumentUpdateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUncheckedUpdateWithoutUploadedByInputSchema) ]),
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutUploadedByInputSchema) ]),
}).strict();

export const DealDocumentUpdateWithWhereUniqueWithoutUploadedByInputSchema: z.ZodType<Prisma.DealDocumentUpdateWithWhereUniqueWithoutUploadedByInput> = z.object({
  where: z.lazy(() => DealDocumentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DealDocumentUpdateWithoutUploadedByInputSchema),z.lazy(() => DealDocumentUncheckedUpdateWithoutUploadedByInputSchema) ]),
}).strict();

export const DealDocumentUpdateManyWithWhereWithoutUploadedByInputSchema: z.ZodType<Prisma.DealDocumentUpdateManyWithWhereWithoutUploadedByInput> = z.object({
  where: z.lazy(() => DealDocumentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DealDocumentUpdateManyMutationInputSchema),z.lazy(() => DealDocumentUncheckedUpdateManyWithoutUploadedByInputSchema) ]),
}).strict();

export const DealDocumentScalarWhereInputSchema: z.ZodType<Prisma.DealDocumentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DealDocumentScalarWhereInputSchema),z.lazy(() => DealDocumentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealDocumentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealDocumentScalarWhereInputSchema),z.lazy(() => DealDocumentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDealDocumentTypeFilterSchema),z.lazy(() => DealDocumentTypeSchema) ]).optional(),
  dealId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dateCreated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uploadedById: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  taxYear: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
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

export const DocusignEventUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.DocusignEventUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => DocusignEventWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DocusignEventUpdateWithoutUserInputSchema),z.lazy(() => DocusignEventUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutUserInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const DocusignEventUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.DocusignEventUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => DocusignEventWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DocusignEventUpdateWithoutUserInputSchema),z.lazy(() => DocusignEventUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const DocusignEventUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.DocusignEventUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => DocusignEventScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DocusignEventUpdateManyMutationInputSchema),z.lazy(() => DocusignEventUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const DocusignEventScalarWhereInputSchema: z.ZodType<Prisma.DocusignEventScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DocusignEventScalarWhereInputSchema),z.lazy(() => DocusignEventScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DocusignEventScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DocusignEventScalarWhereInputSchema),z.lazy(() => DocusignEventScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  envelopeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  templateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dateSent: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  dateCompleted: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  investorSignatureCompleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const MemberUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MemberUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => MemberWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MemberUpdateWithoutUserInputSchema),z.lazy(() => MemberUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => MemberCreateWithoutUserInputSchema),z.lazy(() => MemberUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const MemberUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MemberUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => MemberWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MemberUpdateWithoutUserInputSchema),z.lazy(() => MemberUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const MemberUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.MemberUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => MemberScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MemberUpdateManyMutationInputSchema),z.lazy(() => MemberUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const MemberScalarWhereInputSchema: z.ZodType<Prisma.MemberScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MemberScalarWhereInputSchema),z.lazy(() => MemberScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MemberScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MemberScalarWhereInputSchema),z.lazy(() => MemberScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumMembershipTypeFilterSchema),z.lazy(() => MembershipTypeSchema) ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const OrganizationUpsertWithWhereUniqueWithoutOwnedByInputSchema: z.ZodType<Prisma.OrganizationUpsertWithWhereUniqueWithoutOwnedByInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutOwnedByInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOwnedByInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnedByInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnedByInputSchema) ]),
}).strict();

export const OrganizationUpdateWithWhereUniqueWithoutOwnedByInputSchema: z.ZodType<Prisma.OrganizationUpdateWithWhereUniqueWithoutOwnedByInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutOwnedByInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOwnedByInputSchema) ]),
}).strict();

export const OrganizationUpdateManyWithWhereWithoutOwnedByInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithWhereWithoutOwnedByInput> = z.object({
  where: z.lazy(() => OrganizationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateManyMutationInputSchema),z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnedByInputSchema) ]),
}).strict();

export const OrganizationScalarWhereInputSchema: z.ZodType<Prisma.OrganizationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  tin: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dateOfCreation: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  juristication: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional(),
  isPrimary: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const OrganizationDocumentUpsertWithWhereUniqueWithoutUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentUpsertWithWhereUniqueWithoutUploadedByInput> = z.object({
  where: z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationDocumentUpdateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUncheckedUpdateWithoutUploadedByInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutUploadedByInputSchema) ]),
}).strict();

export const OrganizationDocumentUpdateWithWhereUniqueWithoutUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateWithWhereUniqueWithoutUploadedByInput> = z.object({
  where: z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationDocumentUpdateWithoutUploadedByInputSchema),z.lazy(() => OrganizationDocumentUncheckedUpdateWithoutUploadedByInputSchema) ]),
}).strict();

export const OrganizationDocumentUpdateManyWithWhereWithoutUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateManyWithWhereWithoutUploadedByInput> = z.object({
  where: z.lazy(() => OrganizationDocumentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationDocumentUpdateManyMutationInputSchema),z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutUploadedByInputSchema) ]),
}).strict();

export const OrganizationDocumentScalarWhereInputSchema: z.ZodType<Prisma.OrganizationDocumentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationDocumentScalarWhereInputSchema),z.lazy(() => OrganizationDocumentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationDocumentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationDocumentScalarWhereInputSchema),z.lazy(() => OrganizationDocumentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dateCreated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  path: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uploadedById: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const AccreditationVerificationCreateWithoutDealInputSchema: z.ZodType<Prisma.AccreditationVerificationCreateWithoutDealInput> = z.object({
  method: z.lazy(() => VerificationMethodSchema),
  basis: z.lazy(() => VerificationBasisSchema),
  verifier: z.lazy(() => AccreditationVerifierCreateNestedOneWithoutAccreditationVerificationInputSchema).optional()
}).strict();

export const AccreditationVerificationUncheckedCreateWithoutDealInputSchema: z.ZodType<Prisma.AccreditationVerificationUncheckedCreateWithoutDealInput> = z.object({
  id: z.number().int().optional(),
  verifierId: z.number().int().optional().nullable(),
  method: z.lazy(() => VerificationMethodSchema),
  basis: z.lazy(() => VerificationBasisSchema)
}).strict();

export const AccreditationVerificationCreateOrConnectWithoutDealInputSchema: z.ZodType<Prisma.AccreditationVerificationCreateOrConnectWithoutDealInput> = z.object({
  where: z.lazy(() => AccreditationVerificationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutDealInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutDealsInput> = z.object({
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutOrganizationInputSchema).optional(),
  members: z.lazy(() => MemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ownedBy: z.lazy(() => UserCreateNestedOneWithoutOrganizationsOwnedInputSchema),
  document: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutDealsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutOrganizationInputSchema).optional(),
  members: z.lazy(() => MemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutDealsInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDealsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDealsInputSchema) ]),
}).strict();

export const ProjectCreateWithoutDealsInputSchema: z.ZodType<Prisma.ProjectCreateWithoutDealsInput> = z.object({
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  documents: z.lazy(() => ProjectDocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutDealsInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutDealsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  documents: z.lazy(() => ProjectDocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutDealsInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutDealsInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDealsInputSchema) ]),
}).strict();

export const DealDocumentCreateWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentCreateWithoutDealInput> = z.object({
  name: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  taxYear: z.number().int().optional().nullable(),
  uploadedBy: z.lazy(() => UserCreateNestedOneWithoutDealDocumentUploadedInputSchema)
}).strict();

export const DealDocumentUncheckedCreateWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUncheckedCreateWithoutDealInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  uploadedById: z.number().int(),
  taxYear: z.number().int().optional().nullable()
}).strict();

export const DealDocumentCreateOrConnectWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentCreateOrConnectWithoutDealInput> = z.object({
  where: z.lazy(() => DealDocumentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealDocumentCreateWithoutDealInputSchema),z.lazy(() => DealDocumentUncheckedCreateWithoutDealInputSchema) ]),
}).strict();

export const DealDocumentCreateManyDealInputEnvelopeSchema: z.ZodType<Prisma.DealDocumentCreateManyDealInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DealDocumentCreateManyDealInputSchema),z.lazy(() => DealDocumentCreateManyDealInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DealInvestmentStatsCreateWithoutDealInputSchema: z.ZodType<Prisma.DealInvestmentStatsCreateWithoutDealInput> = z.object({
  amount: z.number().optional(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional(),
  unitType: z.lazy(() => DealUnitTypeSchema).optional(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  numberAUnits: z.number().optional(),
  numberCUnits: z.number().optional(),
  shareOfEquity: z.number().optional(),
  debtInterestRatePerc: z.number().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonthsMax: z.number().int().optional(),
  debtTermMonthsMin: z.number().int().optional(),
  equityTermMonths: z.number().int().optional(),
  debtPaymentFreqMonths: z.number().int().optional(),
  equityPreferredReturn: z.number().optional()
}).strict();

export const DealInvestmentStatsUncheckedCreateWithoutDealInputSchema: z.ZodType<Prisma.DealInvestmentStatsUncheckedCreateWithoutDealInput> = z.object({
  id: z.number().int().optional(),
  amount: z.number().optional(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional(),
  unitType: z.lazy(() => DealUnitTypeSchema).optional(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  numberAUnits: z.number().optional(),
  numberCUnits: z.number().optional(),
  shareOfEquity: z.number().optional(),
  debtInterestRatePerc: z.number().optional(),
  debtPaymentFreq: z.string().optional(),
  debtTermMonthsMax: z.number().int().optional(),
  debtTermMonthsMin: z.number().int().optional(),
  equityTermMonths: z.number().int().optional(),
  debtPaymentFreqMonths: z.number().int().optional(),
  equityPreferredReturn: z.number().optional()
}).strict();

export const DealInvestmentStatsCreateOrConnectWithoutDealInputSchema: z.ZodType<Prisma.DealInvestmentStatsCreateOrConnectWithoutDealInput> = z.object({
  where: z.lazy(() => DealInvestmentStatsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealInvestmentStatsCreateWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUncheckedCreateWithoutDealInputSchema) ]),
}).strict();

export const DocusignEventCreateWithoutDealInputSchema: z.ZodType<Prisma.DocusignEventCreateWithoutDealInput> = z.object({
  envelopeId: z.string(),
  templateId: z.string(),
  dateSent: z.coerce.date().optional().nullable(),
  dateCompleted: z.coerce.date().optional().nullable(),
  allSignaturesCompleted: z.boolean().optional(),
  investorSignatureCompleted: z.boolean().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutDocusignEventInputSchema)
}).strict();

export const DocusignEventUncheckedCreateWithoutDealInputSchema: z.ZodType<Prisma.DocusignEventUncheckedCreateWithoutDealInput> = z.object({
  id: z.number().int().optional(),
  envelopeId: z.string(),
  templateId: z.string(),
  userId: z.number().int(),
  dateSent: z.coerce.date().optional().nullable(),
  dateCompleted: z.coerce.date().optional().nullable(),
  allSignaturesCompleted: z.boolean().optional(),
  investorSignatureCompleted: z.boolean().optional()
}).strict();

export const DocusignEventCreateOrConnectWithoutDealInputSchema: z.ZodType<Prisma.DocusignEventCreateOrConnectWithoutDealInput> = z.object({
  where: z.lazy(() => DocusignEventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutDealInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutDealInputSchema) ]),
}).strict();

export const DocusignEventCreateManyDealInputEnvelopeSchema: z.ZodType<Prisma.DocusignEventCreateManyDealInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DocusignEventCreateManyDealInputSchema),z.lazy(() => DocusignEventCreateManyDealInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AccreditationVerificationUpsertWithoutDealInputSchema: z.ZodType<Prisma.AccreditationVerificationUpsertWithoutDealInput> = z.object({
  update: z.union([ z.lazy(() => AccreditationVerificationUpdateWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUncheckedUpdateWithoutDealInputSchema) ]),
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutDealInputSchema) ]),
  where: z.lazy(() => AccreditationVerificationWhereInputSchema).optional()
}).strict();

export const AccreditationVerificationUpdateToOneWithWhereWithoutDealInputSchema: z.ZodType<Prisma.AccreditationVerificationUpdateToOneWithWhereWithoutDealInput> = z.object({
  where: z.lazy(() => AccreditationVerificationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AccreditationVerificationUpdateWithoutDealInputSchema),z.lazy(() => AccreditationVerificationUncheckedUpdateWithoutDealInputSchema) ]),
}).strict();

export const AccreditationVerificationUpdateWithoutDealInputSchema: z.ZodType<Prisma.AccreditationVerificationUpdateWithoutDealInput> = z.object({
  method: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => EnumVerificationMethodFieldUpdateOperationsInputSchema) ]).optional(),
  basis: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => EnumVerificationBasisFieldUpdateOperationsInputSchema) ]).optional(),
  verifier: z.lazy(() => AccreditationVerifierUpdateOneWithoutAccreditationVerificationNestedInputSchema).optional()
}).strict();

export const AccreditationVerificationUncheckedUpdateWithoutDealInputSchema: z.ZodType<Prisma.AccreditationVerificationUncheckedUpdateWithoutDealInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  verifierId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  method: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => EnumVerificationMethodFieldUpdateOperationsInputSchema) ]).optional(),
  basis: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => EnumVerificationBasisFieldUpdateOperationsInputSchema) ]).optional(),
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
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutOrganizationNestedInputSchema).optional(),
  members: z.lazy(() => MemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ownedBy: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsOwnedNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutDealsInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutDealsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutOrganizationNestedInputSchema).optional(),
  members: z.lazy(() => MemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
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
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  documents: z.lazy(() => ProjectDocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutDealsInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutDealsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional()
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

export const DealInvestmentStatsUpsertWithoutDealInputSchema: z.ZodType<Prisma.DealInvestmentStatsUpsertWithoutDealInput> = z.object({
  update: z.union([ z.lazy(() => DealInvestmentStatsUpdateWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUncheckedUpdateWithoutDealInputSchema) ]),
  create: z.union([ z.lazy(() => DealInvestmentStatsCreateWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUncheckedCreateWithoutDealInputSchema) ]),
  where: z.lazy(() => DealInvestmentStatsWhereInputSchema).optional()
}).strict();

export const DealInvestmentStatsUpdateToOneWithWhereWithoutDealInputSchema: z.ZodType<Prisma.DealInvestmentStatsUpdateToOneWithWhereWithoutDealInput> = z.object({
  where: z.lazy(() => DealInvestmentStatsWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DealInvestmentStatsUpdateWithoutDealInputSchema),z.lazy(() => DealInvestmentStatsUncheckedUpdateWithoutDealInputSchema) ]),
}).strict();

export const DealInvestmentStatsUpdateWithoutDealInputSchema: z.ZodType<Prisma.DealInvestmentStatsUpdateWithoutDealInput> = z.object({
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => EnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional(),
  unitType: z.union([ z.lazy(() => DealUnitTypeSchema),z.lazy(() => EnumDealUnitTypeFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  numberCUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  shareOfEquity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRatePerc: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealInvestmentStatsUncheckedUpdateWithoutDealInputSchema: z.ZodType<Prisma.DealInvestmentStatsUncheckedUpdateWithoutDealInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => EnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional(),
  unitType: z.union([ z.lazy(() => DealUnitTypeSchema),z.lazy(() => EnumDealUnitTypeFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  numberAUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  numberCUnits: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  shareOfEquity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtInterestRatePerc: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocusignEventUpsertWithWhereUniqueWithoutDealInputSchema: z.ZodType<Prisma.DocusignEventUpsertWithWhereUniqueWithoutDealInput> = z.object({
  where: z.lazy(() => DocusignEventWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DocusignEventUpdateWithoutDealInputSchema),z.lazy(() => DocusignEventUncheckedUpdateWithoutDealInputSchema) ]),
  create: z.union([ z.lazy(() => DocusignEventCreateWithoutDealInputSchema),z.lazy(() => DocusignEventUncheckedCreateWithoutDealInputSchema) ]),
}).strict();

export const DocusignEventUpdateWithWhereUniqueWithoutDealInputSchema: z.ZodType<Prisma.DocusignEventUpdateWithWhereUniqueWithoutDealInput> = z.object({
  where: z.lazy(() => DocusignEventWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DocusignEventUpdateWithoutDealInputSchema),z.lazy(() => DocusignEventUncheckedUpdateWithoutDealInputSchema) ]),
}).strict();

export const DocusignEventUpdateManyWithWhereWithoutDealInputSchema: z.ZodType<Prisma.DocusignEventUpdateManyWithWhereWithoutDealInput> = z.object({
  where: z.lazy(() => DocusignEventScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DocusignEventUpdateManyMutationInputSchema),z.lazy(() => DocusignEventUncheckedUpdateManyWithoutDealInputSchema) ]),
}).strict();

export const DealCreateWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.DealCreateWithoutInvestmentStatsInput> = z.object({
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationCreateNestedOneWithoutDealInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDealsInputSchema),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema),
  document: z.lazy(() => DealDocumentCreateNestedManyWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealUncheckedCreateWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutInvestmentStatsInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  organizationId: z.number().int(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedCreateNestedOneWithoutDealInputSchema).optional(),
  document: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealCreateOrConnectWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.DealCreateOrConnectWithoutInvestmentStatsInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealCreateWithoutInvestmentStatsInputSchema),z.lazy(() => DealUncheckedCreateWithoutInvestmentStatsInputSchema) ]),
}).strict();

export const DealUpsertWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.DealUpsertWithoutInvestmentStatsInput> = z.object({
  update: z.union([ z.lazy(() => DealUpdateWithoutInvestmentStatsInputSchema),z.lazy(() => DealUncheckedUpdateWithoutInvestmentStatsInputSchema) ]),
  create: z.union([ z.lazy(() => DealCreateWithoutInvestmentStatsInputSchema),z.lazy(() => DealUncheckedCreateWithoutInvestmentStatsInputSchema) ]),
  where: z.lazy(() => DealWhereInputSchema).optional()
}).strict();

export const DealUpdateToOneWithWhereWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.DealUpdateToOneWithWhereWithoutInvestmentStatsInput> = z.object({
  where: z.lazy(() => DealWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DealUpdateWithoutInvestmentStatsInputSchema),z.lazy(() => DealUncheckedUpdateWithoutInvestmentStatsInputSchema) ]),
}).strict();

export const DealUpdateWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.DealUpdateWithoutInvestmentStatsInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUpdateOneWithoutDealNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUpdateManyWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutInvestmentStatsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedUpdateOneWithoutDealNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const AddressCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressCreateWithoutOrganizationInput> = z.object({
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  country: z.string().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  country: z.string().optional(),
  userId: z.number().int().optional().nullable()
}).strict();

export const AddressCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutOrganizationInputSchema),z.lazy(() => AddressUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const DealCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.DealCreateWithoutOrganizationInput> = z.object({
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationCreateNestedOneWithoutDealInputSchema).optional(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema),
  document: z.lazy(() => DealDocumentCreateNestedManyWithoutDealInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsCreateNestedOneWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedCreateNestedOneWithoutDealInputSchema).optional(),
  document: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedCreateNestedOneWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.DealCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealCreateWithoutOrganizationInputSchema),z.lazy(() => DealUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const DealCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.DealCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DealCreateManyOrganizationInputSchema),z.lazy(() => DealCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const MemberCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.MemberCreateWithoutOrganizationInput> = z.object({
  type: z.lazy(() => MembershipTypeSchema),
  title: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizationMemberInputSchema)
}).strict();

export const MemberUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.MemberUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  type: z.lazy(() => MembershipTypeSchema),
  title: z.string().optional().nullable()
}).strict();

export const MemberCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.MemberCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => MemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MemberCreateWithoutOrganizationInputSchema),z.lazy(() => MemberUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const MemberCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.MemberCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MemberCreateManyOrganizationInputSchema),z.lazy(() => MemberCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutOrganizationsOwnedInputSchema: z.ZodType<Prisma.UserCreateWithoutOrganizationsOwnedInput> = z.object({
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberCreateNestedManyWithoutUserInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrganizationsOwnedInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizationsOwnedInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOrganizationsOwnedInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrganizationsOwnedInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationsOwnedInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationsOwnedInputSchema) ]),
}).strict();

export const OrganizationDocumentCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateWithoutOrganizationInput> = z.object({
  name: z.string(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  key: z.string().optional(),
  uploadedBy: z.lazy(() => UserCreateNestedOneWithoutOrganizationDocumentUploadedInputSchema)
}).strict();

export const OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedCreateWithoutOrganizationInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  key: z.string().optional(),
  uploadedById: z.number().int()
}).strict();

export const OrganizationDocumentCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationDocumentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationDocumentCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationDocumentUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationDocumentCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.OrganizationDocumentCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationDocumentCreateManyOrganizationInputSchema),z.lazy(() => OrganizationDocumentCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
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
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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
  hubspotId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transactionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  organizationId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  closingDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  dateFundsSent: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => EnumPaymentMethodNullableFilterSchema),z.lazy(() => PaymentMethodSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const MemberUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.MemberUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => MemberWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MemberUpdateWithoutOrganizationInputSchema),z.lazy(() => MemberUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => MemberCreateWithoutOrganizationInputSchema),z.lazy(() => MemberUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const MemberUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.MemberUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => MemberWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MemberUpdateWithoutOrganizationInputSchema),z.lazy(() => MemberUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const MemberUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.MemberUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => MemberScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MemberUpdateManyMutationInputSchema),z.lazy(() => MemberUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const UserUpsertWithoutOrganizationsOwnedInputSchema: z.ZodType<Prisma.UserUpsertWithoutOrganizationsOwnedInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOrganizationsOwnedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationsOwnedInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationsOwnedInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationsOwnedInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOrganizationsOwnedInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOrganizationsOwnedInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrganizationsOwnedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationsOwnedInputSchema) ]),
}).strict();

export const UserUpdateWithoutOrganizationsOwnedInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrganizationsOwnedInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUpdateManyWithoutUserNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrganizationsOwnedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizationsOwnedInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional()
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

export const OrganizationCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutMembersInput> = z.object({
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ownedBy: z.lazy(() => UserCreateNestedOneWithoutOrganizationsOwnedInputSchema),
  document: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutMembersInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]),
}).strict();

export const UserCreateWithoutOrganizationMemberInputSchema: z.ZodType<Prisma.UserCreateWithoutOrganizationMemberInput> = z.object({
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrganizationMemberInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizationMemberInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOrganizationMemberInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrganizationMemberInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMemberInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMemberInputSchema) ]),
}).strict();

export const OrganizationUpsertWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutMembersInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutMembersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ownedBy: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsOwnedNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutMembersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutOrganizationMemberInputSchema: z.ZodType<Prisma.UserUpsertWithoutOrganizationMemberInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOrganizationMemberInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationMemberInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMemberInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMemberInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOrganizationMemberInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOrganizationMemberInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrganizationMemberInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationMemberInputSchema) ]),
}).strict();

export const UserUpdateWithoutOrganizationMemberInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrganizationMemberInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrganizationMemberInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizationMemberInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const DealCreateWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.DealCreateWithoutAccreditationVerificationInput> = z.object({
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDealsInputSchema),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema),
  document: z.lazy(() => DealDocumentCreateNestedManyWithoutDealInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsCreateNestedOneWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealUncheckedCreateWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutAccreditationVerificationInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  organizationId: z.number().int(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  document: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedCreateNestedOneWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealCreateOrConnectWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.DealCreateOrConnectWithoutAccreditationVerificationInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealCreateWithoutAccreditationVerificationInputSchema),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerificationInputSchema) ]),
}).strict();

export const AccreditationVerifierCreateWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.AccreditationVerifierCreateWithoutAccreditationVerificationInput> = z.object({
  firstName: z.string(),
  lastName: z.string(),
  title: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string()
}).strict();

export const AccreditationVerifierUncheckedCreateWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.AccreditationVerifierUncheckedCreateWithoutAccreditationVerificationInput> = z.object({
  id: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  title: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string()
}).strict();

export const AccreditationVerifierCreateOrConnectWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.AccreditationVerifierCreateOrConnectWithoutAccreditationVerificationInput> = z.object({
  where: z.lazy(() => AccreditationVerifierWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccreditationVerifierCreateWithoutAccreditationVerificationInputSchema),z.lazy(() => AccreditationVerifierUncheckedCreateWithoutAccreditationVerificationInputSchema) ]),
}).strict();

export const DealUpsertWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.DealUpsertWithoutAccreditationVerificationInput> = z.object({
  update: z.union([ z.lazy(() => DealUpdateWithoutAccreditationVerificationInputSchema),z.lazy(() => DealUncheckedUpdateWithoutAccreditationVerificationInputSchema) ]),
  create: z.union([ z.lazy(() => DealCreateWithoutAccreditationVerificationInputSchema),z.lazy(() => DealUncheckedCreateWithoutAccreditationVerificationInputSchema) ]),
  where: z.lazy(() => DealWhereInputSchema).optional()
}).strict();

export const DealUpdateToOneWithWhereWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.DealUpdateToOneWithWhereWithoutAccreditationVerificationInput> = z.object({
  where: z.lazy(() => DealWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DealUpdateWithoutAccreditationVerificationInputSchema),z.lazy(() => DealUncheckedUpdateWithoutAccreditationVerificationInputSchema) ]),
}).strict();

export const DealUpdateWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.DealUpdateWithoutAccreditationVerificationInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUpdateManyWithoutDealNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUpdateOneWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutAccreditationVerificationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  document: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutDealNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedUpdateOneWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const AccreditationVerifierUpsertWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.AccreditationVerifierUpsertWithoutAccreditationVerificationInput> = z.object({
  update: z.union([ z.lazy(() => AccreditationVerifierUpdateWithoutAccreditationVerificationInputSchema),z.lazy(() => AccreditationVerifierUncheckedUpdateWithoutAccreditationVerificationInputSchema) ]),
  create: z.union([ z.lazy(() => AccreditationVerifierCreateWithoutAccreditationVerificationInputSchema),z.lazy(() => AccreditationVerifierUncheckedCreateWithoutAccreditationVerificationInputSchema) ]),
  where: z.lazy(() => AccreditationVerifierWhereInputSchema).optional()
}).strict();

export const AccreditationVerifierUpdateToOneWithWhereWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.AccreditationVerifierUpdateToOneWithWhereWithoutAccreditationVerificationInput> = z.object({
  where: z.lazy(() => AccreditationVerifierWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AccreditationVerifierUpdateWithoutAccreditationVerificationInputSchema),z.lazy(() => AccreditationVerifierUncheckedUpdateWithoutAccreditationVerificationInputSchema) ]),
}).strict();

export const AccreditationVerifierUpdateWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.AccreditationVerifierUpdateWithoutAccreditationVerificationInput> = z.object({
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccreditationVerifierUncheckedUpdateWithoutAccreditationVerificationInputSchema: z.ZodType<Prisma.AccreditationVerifierUncheckedUpdateWithoutAccreditationVerificationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccreditationVerificationCreateWithoutVerifierInputSchema: z.ZodType<Prisma.AccreditationVerificationCreateWithoutVerifierInput> = z.object({
  method: z.lazy(() => VerificationMethodSchema),
  basis: z.lazy(() => VerificationBasisSchema),
  deal: z.lazy(() => DealCreateNestedOneWithoutAccreditationVerificationInputSchema)
}).strict();

export const AccreditationVerificationUncheckedCreateWithoutVerifierInputSchema: z.ZodType<Prisma.AccreditationVerificationUncheckedCreateWithoutVerifierInput> = z.object({
  id: z.number().int().optional(),
  dealId: z.number().int(),
  method: z.lazy(() => VerificationMethodSchema),
  basis: z.lazy(() => VerificationBasisSchema)
}).strict();

export const AccreditationVerificationCreateOrConnectWithoutVerifierInputSchema: z.ZodType<Prisma.AccreditationVerificationCreateOrConnectWithoutVerifierInput> = z.object({
  where: z.lazy(() => AccreditationVerificationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutVerifierInputSchema) ]),
}).strict();

export const AccreditationVerificationUpsertWithoutVerifierInputSchema: z.ZodType<Prisma.AccreditationVerificationUpsertWithoutVerifierInput> = z.object({
  update: z.union([ z.lazy(() => AccreditationVerificationUpdateWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUncheckedUpdateWithoutVerifierInputSchema) ]),
  create: z.union([ z.lazy(() => AccreditationVerificationCreateWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUncheckedCreateWithoutVerifierInputSchema) ]),
  where: z.lazy(() => AccreditationVerificationWhereInputSchema).optional()
}).strict();

export const AccreditationVerificationUpdateToOneWithWhereWithoutVerifierInputSchema: z.ZodType<Prisma.AccreditationVerificationUpdateToOneWithWhereWithoutVerifierInput> = z.object({
  where: z.lazy(() => AccreditationVerificationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AccreditationVerificationUpdateWithoutVerifierInputSchema),z.lazy(() => AccreditationVerificationUncheckedUpdateWithoutVerifierInputSchema) ]),
}).strict();

export const AccreditationVerificationUpdateWithoutVerifierInputSchema: z.ZodType<Prisma.AccreditationVerificationUpdateWithoutVerifierInput> = z.object({
  method: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => EnumVerificationMethodFieldUpdateOperationsInputSchema) ]).optional(),
  basis: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => EnumVerificationBasisFieldUpdateOperationsInputSchema) ]).optional(),
  deal: z.lazy(() => DealUpdateOneRequiredWithoutAccreditationVerificationNestedInputSchema).optional()
}).strict();

export const AccreditationVerificationUncheckedUpdateWithoutVerifierInputSchema: z.ZodType<Prisma.AccreditationVerificationUncheckedUpdateWithoutVerifierInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.lazy(() => VerificationMethodSchema),z.lazy(() => EnumVerificationMethodFieldUpdateOperationsInputSchema) ]).optional(),
  basis: z.union([ z.lazy(() => VerificationBasisSchema),z.lazy(() => EnumVerificationBasisFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealCreateWithoutDocumentInputSchema: z.ZodType<Prisma.DealCreateWithoutDocumentInput> = z.object({
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationCreateNestedOneWithoutDealInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDealsInputSchema),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema),
  investmentStats: z.lazy(() => DealInvestmentStatsCreateNestedOneWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealUncheckedCreateWithoutDocumentInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutDocumentInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  organizationId: z.number().int(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedCreateNestedOneWithoutDealInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedCreateNestedOneWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealCreateOrConnectWithoutDocumentInputSchema: z.ZodType<Prisma.DealCreateOrConnectWithoutDocumentInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealCreateWithoutDocumentInputSchema),z.lazy(() => DealUncheckedCreateWithoutDocumentInputSchema) ]),
}).strict();

export const UserCreateWithoutDealDocumentUploadedInputSchema: z.ZodType<Prisma.UserCreateWithoutDealDocumentUploadedInput> = z.object({
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutDealDocumentUploadedInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDealDocumentUploadedInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutDealDocumentUploadedInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDealDocumentUploadedInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutDealDocumentUploadedInputSchema),z.lazy(() => UserUncheckedCreateWithoutDealDocumentUploadedInputSchema) ]),
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
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUpdateOneWithoutDealNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUpdateOneWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutDocumentInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutDocumentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedUpdateOneWithoutDealNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedUpdateOneWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutDealDocumentUploadedInputSchema: z.ZodType<Prisma.UserUpsertWithoutDealDocumentUploadedInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutDealDocumentUploadedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDealDocumentUploadedInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutDealDocumentUploadedInputSchema),z.lazy(() => UserUncheckedCreateWithoutDealDocumentUploadedInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutDealDocumentUploadedInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDealDocumentUploadedInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutDealDocumentUploadedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDealDocumentUploadedInputSchema) ]),
}).strict();

export const UserUpdateWithoutDealDocumentUploadedInputSchema: z.ZodType<Prisma.UserUpdateWithoutDealDocumentUploadedInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutDealDocumentUploadedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDealDocumentUploadedInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const OrganizationCreateWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutDocumentInput> = z.object({
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealCreateNestedManyWithoutOrganizationInputSchema).optional(),
  members: z.lazy(() => MemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ownedBy: z.lazy(() => UserCreateNestedOneWithoutOrganizationsOwnedInputSchema)
}).strict();

export const OrganizationUncheckedCreateWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutDocumentInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutOrganizationInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  members: z.lazy(() => MemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutDocumentInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutDocumentInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutDocumentInputSchema) ]),
}).strict();

export const UserCreateWithoutOrganizationDocumentUploadedInputSchema: z.ZodType<Prisma.UserCreateWithoutOrganizationDocumentUploadedInput> = z.object({
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationCreateNestedManyWithoutOwnedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrganizationDocumentUploadedInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizationDocumentUploadedInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOrganizationDocumentUploadedInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrganizationDocumentUploadedInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationDocumentUploadedInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationDocumentUploadedInputSchema) ]),
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
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  members: z.lazy(() => MemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ownedBy: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsOwnedNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutDocumentInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutDocumentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  members: z.lazy(() => MemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutOrganizationDocumentUploadedInputSchema: z.ZodType<Prisma.UserUpsertWithoutOrganizationDocumentUploadedInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOrganizationDocumentUploadedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationDocumentUploadedInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationDocumentUploadedInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationDocumentUploadedInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOrganizationDocumentUploadedInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOrganizationDocumentUploadedInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrganizationDocumentUploadedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationDocumentUploadedInputSchema) ]),
}).strict();

export const UserUpdateWithoutOrganizationDocumentUploadedInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrganizationDocumentUploadedInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUpdateManyWithoutOwnedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrganizationDocumentUploadedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizationDocumentUploadedInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnedByNestedInputSchema).optional()
}).strict();

export const DealCreateWithoutProjectInputSchema: z.ZodType<Prisma.DealCreateWithoutProjectInput> = z.object({
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationCreateNestedOneWithoutDealInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDealsInputSchema),
  document: z.lazy(() => DealDocumentCreateNestedManyWithoutDealInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsCreateNestedOneWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  organizationId: z.number().int(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedCreateNestedOneWithoutDealInputSchema).optional(),
  document: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedCreateNestedOneWithoutDealInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutDealInputSchema).optional()
}).strict();

export const DealCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.DealCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealCreateWithoutProjectInputSchema),z.lazy(() => DealUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const DealCreateManyProjectInputEnvelopeSchema: z.ZodType<Prisma.DealCreateManyProjectInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DealCreateManyProjectInputSchema),z.lazy(() => DealCreateManyProjectInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProjectDocumentCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectDocumentCreateWithoutProjectInput> = z.object({
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutDocumentInputSchema).optional()
}).strict();

export const ProjectDocumentUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectDocumentUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutDocumentInputSchema).optional()
}).strict();

export const ProjectDocumentCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.ProjectDocumentCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectDocumentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectDocumentCreateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectDocumentCreateManyProjectInputEnvelopeSchema: z.ZodType<Prisma.ProjectDocumentCreateManyProjectInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProjectDocumentCreateManyProjectInputSchema),z.lazy(() => ProjectDocumentCreateManyProjectInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProjectInvestmentStatsCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsCreateWithoutProjectInput> = z.object({
  cUnitThresholdAmount: z.number().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  targetEquityMultiple: z.number().optional(),
  totalAUnitReturn: z.number().optional(),
  totalCUnitReturn: z.number().optional(),
  interestRateDollarThreshold: z.number().optional(),
  interestRateMax: z.number().optional(),
  interestRateMin: z.number().optional(),
  equityPreferredReturn: z.number().optional(),
  debtPaymentFreqMonths: z.number().int().optional(),
  debtTermMonthsMax: z.number().int().optional(),
  debtTermMonthsMin: z.number().int().optional(),
  equityPaymentFreqMonths: z.number().int().optional(),
  boolDebt: z.boolean().optional(),
  boolEquity: z.boolean().optional()
}).strict();

export const ProjectInvestmentStatsUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  cUnitThresholdAmount: z.number().optional(),
  debtMinInvestment: z.number().int().optional(),
  debtPaymentFreq: z.string().optional(),
  equityIRR: z.number().optional(),
  equityMinInvestment: z.number().int().optional(),
  equityPaymentFreq: z.string().optional(),
  equityTermMonths: z.number().int().optional(),
  investmentGoal: z.number().optional(),
  investmentRaised: z.number().optional(),
  targetEquityMultiple: z.number().optional(),
  totalAUnitReturn: z.number().optional(),
  totalCUnitReturn: z.number().optional(),
  interestRateDollarThreshold: z.number().optional(),
  interestRateMax: z.number().optional(),
  interestRateMin: z.number().optional(),
  equityPreferredReturn: z.number().optional(),
  debtPaymentFreqMonths: z.number().int().optional(),
  debtTermMonthsMax: z.number().int().optional(),
  debtTermMonthsMin: z.number().int().optional(),
  equityPaymentFreqMonths: z.number().int().optional(),
  boolDebt: z.boolean().optional(),
  boolEquity: z.boolean().optional()
}).strict();

export const ProjectInvestmentStatsCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectInvestmentStatsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectInvestmentStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUncheckedCreateWithoutProjectInputSchema) ]),
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

export const ProjectPaymentInfoCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoCreateWithoutProjectInput> = z.object({
  investmentEntity: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string()
}).strict();

export const ProjectPaymentInfoUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  investmentEntity: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string()
}).strict();

export const ProjectPaymentInfoCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectPaymentInfoCreateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectPaymentInfoCreateManyProjectInputEnvelopeSchema: z.ZodType<Prisma.ProjectPaymentInfoCreateManyProjectInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProjectPaymentInfoCreateManyProjectInputSchema),z.lazy(() => ProjectPaymentInfoCreateManyProjectInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProjectPictureCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPictureCreateWithoutProjectInput> = z.object({
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema)
}).strict();

export const ProjectPictureUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPictureUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema)
}).strict();

export const ProjectPictureCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPictureCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectPictureWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectPictureCreateWithoutProjectInputSchema),z.lazy(() => ProjectPictureUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectPictureCreateManyProjectInputEnvelopeSchema: z.ZodType<Prisma.ProjectPictureCreateManyProjectInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProjectPictureCreateManyProjectInputSchema),z.lazy(() => ProjectPictureCreateManyProjectInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProjectPropertyStatsCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPropertyStatsCreateWithoutProjectInput> = z.object({
  avgRent: z.number().int().optional(),
  avgUnitSize: z.number().int().optional(),
  commercialSqFt: z.number().int().optional(),
  numUnits: z.number().int().optional()
}).strict();

export const ProjectPropertyStatsUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  avgRent: z.number().int().optional(),
  avgUnitSize: z.number().int().optional(),
  commercialSqFt: z.number().int().optional(),
  numUnits: z.number().int().optional()
}).strict();

export const ProjectPropertyStatsCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPropertyStatsCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectPropertyStatsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectPropertyStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUncheckedCreateWithoutProjectInputSchema) ]),
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

export const ProjectDocumentUpsertWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.ProjectDocumentUpsertWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectDocumentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProjectDocumentUpdateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUncheckedUpdateWithoutProjectInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectDocumentCreateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectDocumentUpdateWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.ProjectDocumentUpdateWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectDocumentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProjectDocumentUpdateWithoutProjectInputSchema),z.lazy(() => ProjectDocumentUncheckedUpdateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectDocumentUpdateManyWithWhereWithoutProjectInputSchema: z.ZodType<Prisma.ProjectDocumentUpdateManyWithWhereWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectDocumentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProjectDocumentUpdateManyMutationInputSchema),z.lazy(() => ProjectDocumentUncheckedUpdateManyWithoutProjectInputSchema) ]),
}).strict();

export const ProjectDocumentScalarWhereInputSchema: z.ZodType<Prisma.ProjectDocumentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectDocumentScalarWhereInputSchema),z.lazy(() => ProjectDocumentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectDocumentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectDocumentScalarWhereInputSchema),z.lazy(() => ProjectDocumentScalarWhereInputSchema).array() ]).optional(),
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

export const ProjectInvestmentStatsUpsertWithoutProjectInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUpsertWithoutProjectInput> = z.object({
  update: z.union([ z.lazy(() => ProjectInvestmentStatsUpdateWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUncheckedUpdateWithoutProjectInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectInvestmentStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUncheckedCreateWithoutProjectInputSchema) ]),
  where: z.lazy(() => ProjectInvestmentStatsWhereInputSchema).optional()
}).strict();

export const ProjectInvestmentStatsUpdateToOneWithWhereWithoutProjectInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUpdateToOneWithWhereWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectInvestmentStatsWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectInvestmentStatsUpdateWithoutProjectInputSchema),z.lazy(() => ProjectInvestmentStatsUncheckedUpdateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectInvestmentStatsUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUpdateWithoutProjectInput> = z.object({
  cUnitThresholdAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalAUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalCUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateDollarThreshold: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMax: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMin: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  boolDebt: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  boolEquity: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectInvestmentStatsUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectInvestmentStatsUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cUnitThresholdAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityIRR: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityMinInvestment: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreq: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityTermMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  investmentGoal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  investmentRaised: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  targetEquityMultiple: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalAUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalCUnitReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateDollarThreshold: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMax: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  interestRateMin: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  equityPreferredReturn: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  debtPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMax: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  debtTermMonthsMin: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  equityPaymentFreqMonths: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  boolDebt: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  boolEquity: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
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

export const ProjectPaymentInfoUpsertWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUpsertWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProjectPaymentInfoUpdateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUncheckedUpdateWithoutProjectInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectPaymentInfoCreateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectPaymentInfoUpdateWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUpdateWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectPaymentInfoWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProjectPaymentInfoUpdateWithoutProjectInputSchema),z.lazy(() => ProjectPaymentInfoUncheckedUpdateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectPaymentInfoUpdateManyWithWhereWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUpdateManyWithWhereWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectPaymentInfoScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProjectPaymentInfoUpdateManyMutationInputSchema),z.lazy(() => ProjectPaymentInfoUncheckedUpdateManyWithoutProjectInputSchema) ]),
}).strict();

export const ProjectPaymentInfoScalarWhereInputSchema: z.ZodType<Prisma.ProjectPaymentInfoScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectPaymentInfoScalarWhereInputSchema),z.lazy(() => ProjectPaymentInfoScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectPaymentInfoScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectPaymentInfoScalarWhereInputSchema),z.lazy(() => ProjectPaymentInfoScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accountNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  routingNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ProjectPictureUpsertWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPictureUpsertWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectPictureWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProjectPictureUpdateWithoutProjectInputSchema),z.lazy(() => ProjectPictureUncheckedUpdateWithoutProjectInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectPictureCreateWithoutProjectInputSchema),z.lazy(() => ProjectPictureUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectPictureUpdateWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPictureUpdateWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectPictureWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProjectPictureUpdateWithoutProjectInputSchema),z.lazy(() => ProjectPictureUncheckedUpdateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectPictureUpdateManyWithWhereWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPictureUpdateManyWithWhereWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectPictureScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProjectPictureUpdateManyMutationInputSchema),z.lazy(() => ProjectPictureUncheckedUpdateManyWithoutProjectInputSchema) ]),
}).strict();

export const ProjectPictureScalarWhereInputSchema: z.ZodType<Prisma.ProjectPictureScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectPictureScalarWhereInputSchema),z.lazy(() => ProjectPictureScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectPictureScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectPictureScalarWhereInputSchema),z.lazy(() => ProjectPictureScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumPictureTypeFilterSchema),z.lazy(() => PictureTypeSchema) ]).optional(),
}).strict();

export const ProjectPropertyStatsUpsertWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUpsertWithoutProjectInput> = z.object({
  update: z.union([ z.lazy(() => ProjectPropertyStatsUpdateWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUncheckedUpdateWithoutProjectInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectPropertyStatsCreateWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUncheckedCreateWithoutProjectInputSchema) ]),
  where: z.lazy(() => ProjectPropertyStatsWhereInputSchema).optional()
}).strict();

export const ProjectPropertyStatsUpdateToOneWithWhereWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUpdateToOneWithWhereWithoutProjectInput> = z.object({
  where: z.lazy(() => ProjectPropertyStatsWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectPropertyStatsUpdateWithoutProjectInputSchema),z.lazy(() => ProjectPropertyStatsUncheckedUpdateWithoutProjectInputSchema) ]),
}).strict();

export const ProjectPropertyStatsUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUpdateWithoutProjectInput> = z.object({
  avgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  commercialSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  numUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPropertyStatsUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPropertyStatsUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgRent: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgUnitSize: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  commercialSqFt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  numUnits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectCreateWithoutPropertyStatsInputSchema: z.ZodType<Prisma.ProjectCreateWithoutPropertyStatsInput> = z.object({
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutPropertyStatsInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutPropertyStatsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutPropertyStatsInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutPropertyStatsInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutPropertyStatsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutPropertyStatsInputSchema) ]),
}).strict();

export const ProjectUpsertWithoutPropertyStatsInputSchema: z.ZodType<Prisma.ProjectUpsertWithoutPropertyStatsInput> = z.object({
  update: z.union([ z.lazy(() => ProjectUpdateWithoutPropertyStatsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutPropertyStatsInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectCreateWithoutPropertyStatsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutPropertyStatsInputSchema) ]),
  where: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const ProjectUpdateToOneWithWhereWithoutPropertyStatsInputSchema: z.ZodType<Prisma.ProjectUpdateToOneWithWhereWithoutPropertyStatsInput> = z.object({
  where: z.lazy(() => ProjectWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectUpdateWithoutPropertyStatsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutPropertyStatsInputSchema) ]),
}).strict();

export const ProjectUpdateWithoutPropertyStatsInputSchema: z.ZodType<Prisma.ProjectUpdateWithoutPropertyStatsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutPropertyStatsInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutPropertyStatsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectCreateWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.ProjectCreateWithoutInvestmentStatsInput> = z.object({
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutInvestmentStatsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutInvestmentStatsInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutInvestmentStatsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutInvestmentStatsInputSchema) ]),
}).strict();

export const ProjectUpsertWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.ProjectUpsertWithoutInvestmentStatsInput> = z.object({
  update: z.union([ z.lazy(() => ProjectUpdateWithoutInvestmentStatsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutInvestmentStatsInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectCreateWithoutInvestmentStatsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutInvestmentStatsInputSchema) ]),
  where: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const ProjectUpdateToOneWithWhereWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.ProjectUpdateToOneWithWhereWithoutInvestmentStatsInput> = z.object({
  where: z.lazy(() => ProjectWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectUpdateWithoutInvestmentStatsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutInvestmentStatsInputSchema) ]),
}).strict();

export const ProjectUpdateWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.ProjectUpdateWithoutInvestmentStatsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutInvestmentStatsInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutInvestmentStatsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectCreateWithoutProjectPaymentInfoInputSchema: z.ZodType<Prisma.ProjectCreateWithoutProjectPaymentInfoInput> = z.object({
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesCreateNestedOneWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutProjectPaymentInfoInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutProjectPaymentInfoInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutProjectPaymentInfoInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutProjectPaymentInfoInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutProjectPaymentInfoInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutProjectPaymentInfoInputSchema) ]),
}).strict();

export const ProjectUpsertWithoutProjectPaymentInfoInputSchema: z.ZodType<Prisma.ProjectUpsertWithoutProjectPaymentInfoInput> = z.object({
  update: z.union([ z.lazy(() => ProjectUpdateWithoutProjectPaymentInfoInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutProjectPaymentInfoInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectCreateWithoutProjectPaymentInfoInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutProjectPaymentInfoInputSchema) ]),
  where: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const ProjectUpdateToOneWithWhereWithoutProjectPaymentInfoInputSchema: z.ZodType<Prisma.ProjectUpdateToOneWithWhereWithoutProjectPaymentInfoInput> = z.object({
  where: z.lazy(() => ProjectWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectUpdateWithoutProjectPaymentInfoInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutProjectPaymentInfoInputSchema) ]),
}).strict();

export const ProjectUpdateWithoutProjectPaymentInfoInputSchema: z.ZodType<Prisma.ProjectUpdateWithoutProjectPaymentInfoInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutProjectPaymentInfoInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutProjectPaymentInfoInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectCreateWithoutMilestonesInputSchema: z.ZodType<Prisma.ProjectCreateWithoutMilestonesInput> = z.object({
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutMilestonesInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutMilestonesInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutMilestonesInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutMilestonesInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutMilestonesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutMilestonesInputSchema) ]),
}).strict();

export const ProjectUpsertWithoutMilestonesInputSchema: z.ZodType<Prisma.ProjectUpsertWithoutMilestonesInput> = z.object({
  update: z.union([ z.lazy(() => ProjectUpdateWithoutMilestonesInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutMilestonesInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectCreateWithoutMilestonesInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutMilestonesInputSchema) ]),
  where: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const ProjectUpdateToOneWithWhereWithoutMilestonesInputSchema: z.ZodType<Prisma.ProjectUpdateToOneWithWhereWithoutMilestonesInput> = z.object({
  where: z.lazy(() => ProjectWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectUpdateWithoutMilestonesInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutMilestonesInputSchema) ]),
}).strict();

export const ProjectUpdateWithoutMilestonesInputSchema: z.ZodType<Prisma.ProjectUpdateWithoutMilestonesInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutMilestonesInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutMilestonesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectCreateWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectCreateWithoutPicturesInput> = z.object({
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutPicturesInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional()
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
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutPicturesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => ProjectDocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional()
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

export const ProjectCreateWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectCreateWithoutDocumentsInput> = z.object({
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutDocumentsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  location: z.string(),
  tags: z.string().optional(),
  status: z.lazy(() => StatusSchema).optional(),
  description: z.string(),
  marketHighlights: z.string().optional(),
  youtubeUrl: z.string().optional(),
  slug: z.string(),
  equityReturnsFile: z.string(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedCreateNestedOneWithoutProjectInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedCreateNestedOneWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutDocumentsInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutDocumentsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDocumentsInputSchema) ]),
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
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutDocumentsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusSchema),z.lazy(() => EnumStatusFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  marketHighlights: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  youtubeUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  equityReturnsFile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  investmentStats: z.lazy(() => ProjectInvestmentStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  milestones: z.lazy(() => ProjectMilestonesUncheckedUpdateOneWithoutProjectNestedInputSchema).optional(),
  projectPaymentInfo: z.lazy(() => ProjectPaymentInfoUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => ProjectPictureUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  propertyStats: z.lazy(() => ProjectPropertyStatsUncheckedUpdateOneWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectDocumentCreateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.ProjectDocumentCreateWithoutDocumentEventsInput> = z.object({
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDocumentsInputSchema)
}).strict();

export const ProjectDocumentUncheckedCreateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.ProjectDocumentUncheckedCreateWithoutDocumentEventsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable()
}).strict();

export const ProjectDocumentCreateOrConnectWithoutDocumentEventsInputSchema: z.ZodType<Prisma.ProjectDocumentCreateOrConnectWithoutDocumentEventsInput> = z.object({
  where: z.lazy(() => ProjectDocumentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectDocumentCreateWithoutDocumentEventsInputSchema),z.lazy(() => ProjectDocumentUncheckedCreateWithoutDocumentEventsInputSchema) ]),
}).strict();

export const UserCreateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserCreateWithoutDocumentEventsInput> = z.object({
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentCreateNestedManyWithoutUploadedByInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDocumentEventsInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDocumentEventsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutDocumentEventsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDocumentEventsInputSchema) ]),
}).strict();

export const ProjectDocumentUpsertWithoutDocumentEventsInputSchema: z.ZodType<Prisma.ProjectDocumentUpsertWithoutDocumentEventsInput> = z.object({
  update: z.union([ z.lazy(() => ProjectDocumentUpdateWithoutDocumentEventsInputSchema),z.lazy(() => ProjectDocumentUncheckedUpdateWithoutDocumentEventsInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectDocumentCreateWithoutDocumentEventsInputSchema),z.lazy(() => ProjectDocumentUncheckedCreateWithoutDocumentEventsInputSchema) ]),
  where: z.lazy(() => ProjectDocumentWhereInputSchema).optional()
}).strict();

export const ProjectDocumentUpdateToOneWithWhereWithoutDocumentEventsInputSchema: z.ZodType<Prisma.ProjectDocumentUpdateToOneWithWhereWithoutDocumentEventsInput> = z.object({
  where: z.lazy(() => ProjectDocumentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectDocumentUpdateWithoutDocumentEventsInputSchema),z.lazy(() => ProjectDocumentUncheckedUpdateWithoutDocumentEventsInputSchema) ]),
}).strict();

export const ProjectDocumentUpdateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.ProjectDocumentUpdateWithoutDocumentEventsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDocumentsNestedInputSchema).optional()
}).strict();

export const ProjectDocumentUncheckedUpdateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.ProjectDocumentUncheckedUpdateWithoutDocumentEventsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
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
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDocumentEventsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const DealCreateWithoutDocusignEventInputSchema: z.ZodType<Prisma.DealCreateWithoutDocusignEventInput> = z.object({
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationCreateNestedOneWithoutDealInputSchema).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutDealsInputSchema),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema),
  document: z.lazy(() => DealDocumentCreateNestedManyWithoutDealInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsCreateNestedOneWithoutDealInputSchema).optional()
}).strict();

export const DealUncheckedCreateWithoutDocusignEventInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutDocusignEventInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  organizationId: z.number().int(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedCreateNestedOneWithoutDealInputSchema).optional(),
  document: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutDealInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedCreateNestedOneWithoutDealInputSchema).optional()
}).strict();

export const DealCreateOrConnectWithoutDocusignEventInputSchema: z.ZodType<Prisma.DealCreateOrConnectWithoutDocusignEventInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealCreateWithoutDocusignEventInputSchema),z.lazy(() => DealUncheckedCreateWithoutDocusignEventInputSchema) ]),
}).strict();

export const UserCreateWithoutDocusignEventInputSchema: z.ZodType<Prisma.UserCreateWithoutDocusignEventInput> = z.object({
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutDocusignEventInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDocusignEventInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutDocusignEventInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDocusignEventInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutDocusignEventInputSchema),z.lazy(() => UserUncheckedCreateWithoutDocusignEventInputSchema) ]),
}).strict();

export const DealUpsertWithoutDocusignEventInputSchema: z.ZodType<Prisma.DealUpsertWithoutDocusignEventInput> = z.object({
  update: z.union([ z.lazy(() => DealUpdateWithoutDocusignEventInputSchema),z.lazy(() => DealUncheckedUpdateWithoutDocusignEventInputSchema) ]),
  create: z.union([ z.lazy(() => DealCreateWithoutDocusignEventInputSchema),z.lazy(() => DealUncheckedCreateWithoutDocusignEventInputSchema) ]),
  where: z.lazy(() => DealWhereInputSchema).optional()
}).strict();

export const DealUpdateToOneWithWhereWithoutDocusignEventInputSchema: z.ZodType<Prisma.DealUpdateToOneWithWhereWithoutDocusignEventInput> = z.object({
  where: z.lazy(() => DealWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DealUpdateWithoutDocusignEventInputSchema),z.lazy(() => DealUncheckedUpdateWithoutDocusignEventInputSchema) ]),
}).strict();

export const DealUpdateWithoutDocusignEventInputSchema: z.ZodType<Prisma.DealUpdateWithoutDocusignEventInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUpdateOneWithoutDealNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUpdateManyWithoutDealNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUpdateOneWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutDocusignEventInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutDocusignEventInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedUpdateOneWithoutDealNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutDealNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedUpdateOneWithoutDealNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutDocusignEventInputSchema: z.ZodType<Prisma.UserUpsertWithoutDocusignEventInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutDocusignEventInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDocusignEventInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutDocusignEventInputSchema),z.lazy(() => UserUncheckedCreateWithoutDocusignEventInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutDocusignEventInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDocusignEventInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutDocusignEventInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDocusignEventInputSchema) ]),
}).strict();

export const UserUpdateWithoutDocusignEventInputSchema: z.ZodType<Prisma.UserUpdateWithoutDocusignEventInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutDocusignEventInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDocusignEventInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const OrganizationCreateWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutAddressInput> = z.object({
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  deals: z.lazy(() => DealCreateNestedManyWithoutOrganizationInputSchema).optional(),
  members: z.lazy(() => MemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ownedBy: z.lazy(() => UserCreateNestedOneWithoutOrganizationsOwnedInputSchema),
  document: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutAddressInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  ownerId: z.number().int(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  members: z.lazy(() => MemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutAddressInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const UserCreateWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateWithoutAddressInput> = z.object({
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  DealDocumentUploaded: z.lazy(() => DealDocumentCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAddressInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAddressInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  ssn: z.string().optional().nullable(),
  userOrgId: z.number().int().optional().nullable(),
  referralSource: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnedByInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedCreateNestedManyWithoutUploadedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAddressInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const OrganizationUpsertWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutAddressInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutAddressInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutAddressInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutAddressInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutAddressInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutAddressInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutAddressInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  members: z.lazy(() => MemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ownedBy: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsOwnedNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutAddressInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutAddressInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  members: z.lazy(() => MemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutAddressInputSchema: z.ZodType<Prisma.UserUpsertWithoutAddressInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAddressInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAddressInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAddressInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAddressInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAddressInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAddressInputSchema) ]),
}).strict();

export const UserUpdateWithoutAddressInputSchema: z.ZodType<Prisma.UserUpdateWithoutAddressInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAddressInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAddressInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userOrgId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralSource: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfBirth: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  DealDocumentUploaded: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationMember: z.lazy(() => MemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  organizationsOwned: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnedByNestedInputSchema).optional(),
  OrganizationDocumentUploaded: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutUploadedByNestedInputSchema).optional()
}).strict();

export const DealDocumentCreateManyUploadedByInputSchema: z.ZodType<Prisma.DealDocumentCreateManyUploadedByInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  dealId: z.number().int(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  taxYear: z.number().int().optional().nullable()
}).strict();

export const DocumentEventCreateManyUserInputSchema: z.ZodType<Prisma.DocumentEventCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  documentId: z.number().int(),
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema)
}).strict();

export const DocusignEventCreateManyUserInputSchema: z.ZodType<Prisma.DocusignEventCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  envelopeId: z.string(),
  templateId: z.string(),
  dealId: z.number().int(),
  dateSent: z.coerce.date().optional().nullable(),
  dateCompleted: z.coerce.date().optional().nullable(),
  allSignaturesCompleted: z.boolean().optional(),
  investorSignatureCompleted: z.boolean().optional()
}).strict();

export const MemberCreateManyUserInputSchema: z.ZodType<Prisma.MemberCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  organizationId: z.number().int(),
  type: z.lazy(() => MembershipTypeSchema),
  title: z.string().optional().nullable()
}).strict();

export const OrganizationCreateManyOwnedByInputSchema: z.ZodType<Prisma.OrganizationCreateManyOwnedByInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  tin: z.string().optional().nullable(),
  dateOfCreation: z.coerce.date().optional().nullable(),
  juristication: z.string().optional().nullable(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional(),
  isPrimary: z.boolean().optional()
}).strict();

export const OrganizationDocumentCreateManyUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateManyUploadedByInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  organizationId: z.number().int(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  key: z.string().optional()
}).strict();

export const DealDocumentUpdateWithoutUploadedByInputSchema: z.ZodType<Prisma.DealDocumentUpdateWithoutUploadedByInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  taxYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deal: z.lazy(() => DealUpdateOneRequiredWithoutDocumentNestedInputSchema).optional()
}).strict();

export const DealDocumentUncheckedUpdateWithoutUploadedByInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateWithoutUploadedByInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  taxYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealDocumentUncheckedUpdateManyWithoutUploadedByInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateManyWithoutUploadedByInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  taxYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DocumentEventUpdateWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventUpdateWithoutUserInput> = z.object({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DocumentEventTypeSchema),z.lazy(() => EnumDocumentEventTypeFieldUpdateOperationsInputSchema) ]).optional(),
  document: z.lazy(() => ProjectDocumentUpdateOneRequiredWithoutDocumentEventsNestedInputSchema).optional()
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

export const DocusignEventUpdateWithoutUserInputSchema: z.ZodType<Prisma.DocusignEventUpdateWithoutUserInput> = z.object({
  envelopeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dateSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateCompleted: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  investorSignatureCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  deal: z.lazy(() => DealUpdateOneRequiredWithoutDocusignEventNestedInputSchema).optional()
}).strict();

export const DocusignEventUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.DocusignEventUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  envelopeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateCompleted: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  investorSignatureCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocusignEventUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.DocusignEventUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  envelopeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateCompleted: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  investorSignatureCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MemberUpdateWithoutUserInputSchema: z.ZodType<Prisma.MemberUpdateWithoutUserInput> = z.object({
  type: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => EnumMembershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const MemberUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => EnumMembershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MemberUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => EnumMembershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrganizationUpdateWithoutOwnedByInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutOwnedByInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  members: z.lazy(() => MemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutOwnedByInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutOwnedByInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutOrganizationNestedInputSchema).optional(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  members: z.lazy(() => MemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  document: z.lazy(() => OrganizationDocumentUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateManyWithoutOwnedByInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutOwnedByInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tin: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateOfCreation: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  juristication: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => EnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  isPrimary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentUpdateWithoutUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateWithoutUploadedByInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDocumentNestedInputSchema).optional()
}).strict();

export const OrganizationDocumentUncheckedUpdateWithoutUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateWithoutUploadedByInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentUncheckedUpdateManyWithoutUploadedByInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateManyWithoutUploadedByInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealDocumentCreateManyDealInputSchema: z.ZodType<Prisma.DealDocumentCreateManyDealInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  type: z.lazy(() => DealDocumentTypeSchema),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  uploadedById: z.number().int(),
  taxYear: z.number().int().optional().nullable()
}).strict();

export const DocusignEventCreateManyDealInputSchema: z.ZodType<Prisma.DocusignEventCreateManyDealInput> = z.object({
  id: z.number().int().optional(),
  envelopeId: z.string(),
  templateId: z.string(),
  userId: z.number().int(),
  dateSent: z.coerce.date().optional().nullable(),
  dateCompleted: z.coerce.date().optional().nullable(),
  allSignaturesCompleted: z.boolean().optional(),
  investorSignatureCompleted: z.boolean().optional()
}).strict();

export const DealDocumentUpdateWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUpdateWithoutDealInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  taxYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  uploadedBy: z.lazy(() => UserUpdateOneRequiredWithoutDealDocumentUploadedNestedInputSchema).optional()
}).strict();

export const DealDocumentUncheckedUpdateWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateWithoutDealInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadedById: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealDocumentUncheckedUpdateManyWithoutDealInputSchema: z.ZodType<Prisma.DealDocumentUncheckedUpdateManyWithoutDealInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DealDocumentTypeSchema),z.lazy(() => EnumDealDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadedById: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DocusignEventUpdateWithoutDealInputSchema: z.ZodType<Prisma.DocusignEventUpdateWithoutDealInput> = z.object({
  envelopeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dateSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateCompleted: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  investorSignatureCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDocusignEventNestedInputSchema).optional()
}).strict();

export const DocusignEventUncheckedUpdateWithoutDealInputSchema: z.ZodType<Prisma.DocusignEventUncheckedUpdateWithoutDealInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  envelopeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateCompleted: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  investorSignatureCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocusignEventUncheckedUpdateManyWithoutDealInputSchema: z.ZodType<Prisma.DocusignEventUncheckedUpdateManyWithoutDealInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  envelopeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  templateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dateSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateCompleted: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  allSignaturesCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  investorSignatureCompleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealCreateManyOrganizationInputSchema: z.ZodType<Prisma.DealCreateManyOrganizationInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable()
}).strict();

export const MemberCreateManyOrganizationInputSchema: z.ZodType<Prisma.MemberCreateManyOrganizationInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  type: z.lazy(() => MembershipTypeSchema),
  title: z.string().optional().nullable()
}).strict();

export const OrganizationDocumentCreateManyOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentCreateManyOrganizationInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  dateCreated: z.coerce.date().optional(),
  path: z.string(),
  key: z.string().optional(),
  uploadedById: z.number().int()
}).strict();

export const DealUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUpdateWithoutOrganizationInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUpdateOneWithoutDealNestedInputSchema).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUpdateManyWithoutDealNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUpdateOneWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedUpdateOneWithoutDealNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutDealNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedUpdateOneWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MemberUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.MemberUpdateWithoutOrganizationInput> = z.object({
  type: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => EnumMembershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationMemberNestedInputSchema).optional()
}).strict();

export const MemberUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => EnumMembershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MemberUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.MemberUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => MembershipTypeSchema),z.lazy(() => EnumMembershipTypeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OrganizationDocumentUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUpdateWithoutOrganizationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadedBy: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationDocumentUploadedNestedInputSchema).optional()
}).strict();

export const OrganizationDocumentUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadedById: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationDocumentUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationDocumentUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadedById: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealCreateManyProjectInputSchema: z.ZodType<Prisma.DealCreateManyProjectInput> = z.object({
  id: z.number().int().optional(),
  dealStage: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  organizationId: z.number().int(),
  closingDate: z.coerce.date().optional().nullable(),
  signaturesCompletedDate: z.coerce.date().optional().nullable(),
  dateFundsSent: z.coerce.date().optional().nullable(),
  paymentMethod: z.lazy(() => PaymentMethodSchema).optional().nullable(),
  paymentReferenceId: z.string().optional().nullable()
}).strict();

export const ProjectDocumentCreateManyProjectInputSchema: z.ZodType<Prisma.ProjectDocumentCreateManyProjectInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  docusignTemplateId: z.string().optional().nullable()
}).strict();

export const ProjectPaymentInfoCreateManyProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoCreateManyProjectInput> = z.object({
  id: z.number().int().optional(),
  investmentEntity: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string()
}).strict();

export const ProjectPictureCreateManyProjectInputSchema: z.ZodType<Prisma.ProjectPictureCreateManyProjectInput> = z.object({
  id: z.number().int().optional(),
  url: z.string(),
  type: z.lazy(() => PictureTypeSchema)
}).strict();

export const DealUpdateWithoutProjectInputSchema: z.ZodType<Prisma.DealUpdateWithoutProjectInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUpdateOneWithoutDealNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUpdateManyWithoutDealNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUpdateOneWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accreditationVerification: z.lazy(() => AccreditationVerificationUncheckedUpdateOneWithoutDealNestedInputSchema).optional(),
  document: z.lazy(() => DealDocumentUncheckedUpdateManyWithoutDealNestedInputSchema).optional(),
  investmentStats: z.lazy(() => DealInvestmentStatsUncheckedUpdateOneWithoutDealNestedInputSchema).optional(),
  DocusignEvent: z.lazy(() => DocusignEventUncheckedUpdateManyWithoutDealNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateManyWithoutProjectInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  organizationId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  closingDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  signaturesCompletedDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateFundsSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentMethod: z.union([ z.lazy(() => PaymentMethodSchema),z.lazy(() => NullableEnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentReferenceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProjectDocumentUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectDocumentUpdateWithoutProjectInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutDocumentNestedInputSchema).optional()
}).strict();

export const ProjectDocumentUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectDocumentUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutDocumentNestedInputSchema).optional()
}).strict();

export const ProjectDocumentUncheckedUpdateManyWithoutProjectInputSchema: z.ZodType<Prisma.ProjectDocumentUncheckedUpdateManyWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => ProjectDocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ProjectPaymentInfoUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUpdateWithoutProjectInput> = z.object({
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  routingNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPaymentInfoUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  routingNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPaymentInfoUncheckedUpdateManyWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPaymentInfoUncheckedUpdateManyWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  routingNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPictureUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPictureUpdateWithoutProjectInput> = z.object({
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPictureUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPictureUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PictureTypeSchema),z.lazy(() => EnumPictureTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectPictureUncheckedUpdateManyWithoutProjectInputSchema: z.ZodType<Prisma.ProjectPictureUncheckedUpdateManyWithoutProjectInput> = z.object({
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

export const DealInvestmentStatsFindFirstArgsSchema: z.ZodType<Prisma.DealInvestmentStatsFindFirstArgs> = z.object({
  select: DealInvestmentStatsSelectSchema.optional(),
  include: DealInvestmentStatsIncludeSchema.optional(),
  where: DealInvestmentStatsWhereInputSchema.optional(),
  orderBy: z.union([ DealInvestmentStatsOrderByWithRelationInputSchema.array(),DealInvestmentStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: DealInvestmentStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DealInvestmentStatsScalarFieldEnumSchema,DealInvestmentStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DealInvestmentStatsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DealInvestmentStatsFindFirstOrThrowArgs> = z.object({
  select: DealInvestmentStatsSelectSchema.optional(),
  include: DealInvestmentStatsIncludeSchema.optional(),
  where: DealInvestmentStatsWhereInputSchema.optional(),
  orderBy: z.union([ DealInvestmentStatsOrderByWithRelationInputSchema.array(),DealInvestmentStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: DealInvestmentStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DealInvestmentStatsScalarFieldEnumSchema,DealInvestmentStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DealInvestmentStatsFindManyArgsSchema: z.ZodType<Prisma.DealInvestmentStatsFindManyArgs> = z.object({
  select: DealInvestmentStatsSelectSchema.optional(),
  include: DealInvestmentStatsIncludeSchema.optional(),
  where: DealInvestmentStatsWhereInputSchema.optional(),
  orderBy: z.union([ DealInvestmentStatsOrderByWithRelationInputSchema.array(),DealInvestmentStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: DealInvestmentStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DealInvestmentStatsScalarFieldEnumSchema,DealInvestmentStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DealInvestmentStatsAggregateArgsSchema: z.ZodType<Prisma.DealInvestmentStatsAggregateArgs> = z.object({
  where: DealInvestmentStatsWhereInputSchema.optional(),
  orderBy: z.union([ DealInvestmentStatsOrderByWithRelationInputSchema.array(),DealInvestmentStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: DealInvestmentStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DealInvestmentStatsGroupByArgsSchema: z.ZodType<Prisma.DealInvestmentStatsGroupByArgs> = z.object({
  where: DealInvestmentStatsWhereInputSchema.optional(),
  orderBy: z.union([ DealInvestmentStatsOrderByWithAggregationInputSchema.array(),DealInvestmentStatsOrderByWithAggregationInputSchema ]).optional(),
  by: DealInvestmentStatsScalarFieldEnumSchema.array(),
  having: DealInvestmentStatsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DealInvestmentStatsFindUniqueArgsSchema: z.ZodType<Prisma.DealInvestmentStatsFindUniqueArgs> = z.object({
  select: DealInvestmentStatsSelectSchema.optional(),
  include: DealInvestmentStatsIncludeSchema.optional(),
  where: DealInvestmentStatsWhereUniqueInputSchema,
}).strict() ;

export const DealInvestmentStatsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DealInvestmentStatsFindUniqueOrThrowArgs> = z.object({
  select: DealInvestmentStatsSelectSchema.optional(),
  include: DealInvestmentStatsIncludeSchema.optional(),
  where: DealInvestmentStatsWhereUniqueInputSchema,
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

export const MemberFindFirstArgsSchema: z.ZodType<Prisma.MemberFindFirstArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereInputSchema.optional(),
  orderBy: z.union([ MemberOrderByWithRelationInputSchema.array(),MemberOrderByWithRelationInputSchema ]).optional(),
  cursor: MemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MemberScalarFieldEnumSchema,MemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MemberFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MemberFindFirstOrThrowArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereInputSchema.optional(),
  orderBy: z.union([ MemberOrderByWithRelationInputSchema.array(),MemberOrderByWithRelationInputSchema ]).optional(),
  cursor: MemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MemberScalarFieldEnumSchema,MemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MemberFindManyArgsSchema: z.ZodType<Prisma.MemberFindManyArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereInputSchema.optional(),
  orderBy: z.union([ MemberOrderByWithRelationInputSchema.array(),MemberOrderByWithRelationInputSchema ]).optional(),
  cursor: MemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MemberScalarFieldEnumSchema,MemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MemberAggregateArgsSchema: z.ZodType<Prisma.MemberAggregateArgs> = z.object({
  where: MemberWhereInputSchema.optional(),
  orderBy: z.union([ MemberOrderByWithRelationInputSchema.array(),MemberOrderByWithRelationInputSchema ]).optional(),
  cursor: MemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MemberGroupByArgsSchema: z.ZodType<Prisma.MemberGroupByArgs> = z.object({
  where: MemberWhereInputSchema.optional(),
  orderBy: z.union([ MemberOrderByWithAggregationInputSchema.array(),MemberOrderByWithAggregationInputSchema ]).optional(),
  by: MemberScalarFieldEnumSchema.array(),
  having: MemberScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MemberFindUniqueArgsSchema: z.ZodType<Prisma.MemberFindUniqueArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereUniqueInputSchema,
}).strict() ;

export const MemberFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MemberFindUniqueOrThrowArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereUniqueInputSchema,
}).strict() ;

export const AccreditationVerificationFindFirstArgsSchema: z.ZodType<Prisma.AccreditationVerificationFindFirstArgs> = z.object({
  select: AccreditationVerificationSelectSchema.optional(),
  include: AccreditationVerificationIncludeSchema.optional(),
  where: AccreditationVerificationWhereInputSchema.optional(),
  orderBy: z.union([ AccreditationVerificationOrderByWithRelationInputSchema.array(),AccreditationVerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: AccreditationVerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccreditationVerificationScalarFieldEnumSchema,AccreditationVerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccreditationVerificationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccreditationVerificationFindFirstOrThrowArgs> = z.object({
  select: AccreditationVerificationSelectSchema.optional(),
  include: AccreditationVerificationIncludeSchema.optional(),
  where: AccreditationVerificationWhereInputSchema.optional(),
  orderBy: z.union([ AccreditationVerificationOrderByWithRelationInputSchema.array(),AccreditationVerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: AccreditationVerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccreditationVerificationScalarFieldEnumSchema,AccreditationVerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccreditationVerificationFindManyArgsSchema: z.ZodType<Prisma.AccreditationVerificationFindManyArgs> = z.object({
  select: AccreditationVerificationSelectSchema.optional(),
  include: AccreditationVerificationIncludeSchema.optional(),
  where: AccreditationVerificationWhereInputSchema.optional(),
  orderBy: z.union([ AccreditationVerificationOrderByWithRelationInputSchema.array(),AccreditationVerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: AccreditationVerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccreditationVerificationScalarFieldEnumSchema,AccreditationVerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccreditationVerificationAggregateArgsSchema: z.ZodType<Prisma.AccreditationVerificationAggregateArgs> = z.object({
  where: AccreditationVerificationWhereInputSchema.optional(),
  orderBy: z.union([ AccreditationVerificationOrderByWithRelationInputSchema.array(),AccreditationVerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: AccreditationVerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccreditationVerificationGroupByArgsSchema: z.ZodType<Prisma.AccreditationVerificationGroupByArgs> = z.object({
  where: AccreditationVerificationWhereInputSchema.optional(),
  orderBy: z.union([ AccreditationVerificationOrderByWithAggregationInputSchema.array(),AccreditationVerificationOrderByWithAggregationInputSchema ]).optional(),
  by: AccreditationVerificationScalarFieldEnumSchema.array(),
  having: AccreditationVerificationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccreditationVerificationFindUniqueArgsSchema: z.ZodType<Prisma.AccreditationVerificationFindUniqueArgs> = z.object({
  select: AccreditationVerificationSelectSchema.optional(),
  include: AccreditationVerificationIncludeSchema.optional(),
  where: AccreditationVerificationWhereUniqueInputSchema,
}).strict() ;

export const AccreditationVerificationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccreditationVerificationFindUniqueOrThrowArgs> = z.object({
  select: AccreditationVerificationSelectSchema.optional(),
  include: AccreditationVerificationIncludeSchema.optional(),
  where: AccreditationVerificationWhereUniqueInputSchema,
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

export const ProjectPropertyStatsFindFirstArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsFindFirstArgs> = z.object({
  select: ProjectPropertyStatsSelectSchema.optional(),
  include: ProjectPropertyStatsIncludeSchema.optional(),
  where: ProjectPropertyStatsWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPropertyStatsOrderByWithRelationInputSchema.array(),ProjectPropertyStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPropertyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectPropertyStatsScalarFieldEnumSchema,ProjectPropertyStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectPropertyStatsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsFindFirstOrThrowArgs> = z.object({
  select: ProjectPropertyStatsSelectSchema.optional(),
  include: ProjectPropertyStatsIncludeSchema.optional(),
  where: ProjectPropertyStatsWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPropertyStatsOrderByWithRelationInputSchema.array(),ProjectPropertyStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPropertyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectPropertyStatsScalarFieldEnumSchema,ProjectPropertyStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectPropertyStatsFindManyArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsFindManyArgs> = z.object({
  select: ProjectPropertyStatsSelectSchema.optional(),
  include: ProjectPropertyStatsIncludeSchema.optional(),
  where: ProjectPropertyStatsWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPropertyStatsOrderByWithRelationInputSchema.array(),ProjectPropertyStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPropertyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectPropertyStatsScalarFieldEnumSchema,ProjectPropertyStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectPropertyStatsAggregateArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsAggregateArgs> = z.object({
  where: ProjectPropertyStatsWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPropertyStatsOrderByWithRelationInputSchema.array(),ProjectPropertyStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPropertyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectPropertyStatsGroupByArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsGroupByArgs> = z.object({
  where: ProjectPropertyStatsWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPropertyStatsOrderByWithAggregationInputSchema.array(),ProjectPropertyStatsOrderByWithAggregationInputSchema ]).optional(),
  by: ProjectPropertyStatsScalarFieldEnumSchema.array(),
  having: ProjectPropertyStatsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectPropertyStatsFindUniqueArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsFindUniqueArgs> = z.object({
  select: ProjectPropertyStatsSelectSchema.optional(),
  include: ProjectPropertyStatsIncludeSchema.optional(),
  where: ProjectPropertyStatsWhereUniqueInputSchema,
}).strict() ;

export const ProjectPropertyStatsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsFindUniqueOrThrowArgs> = z.object({
  select: ProjectPropertyStatsSelectSchema.optional(),
  include: ProjectPropertyStatsIncludeSchema.optional(),
  where: ProjectPropertyStatsWhereUniqueInputSchema,
}).strict() ;

export const ProjectInvestmentStatsFindFirstArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsFindFirstArgs> = z.object({
  select: ProjectInvestmentStatsSelectSchema.optional(),
  include: ProjectInvestmentStatsIncludeSchema.optional(),
  where: ProjectInvestmentStatsWhereInputSchema.optional(),
  orderBy: z.union([ ProjectInvestmentStatsOrderByWithRelationInputSchema.array(),ProjectInvestmentStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectInvestmentStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectInvestmentStatsScalarFieldEnumSchema,ProjectInvestmentStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectInvestmentStatsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsFindFirstOrThrowArgs> = z.object({
  select: ProjectInvestmentStatsSelectSchema.optional(),
  include: ProjectInvestmentStatsIncludeSchema.optional(),
  where: ProjectInvestmentStatsWhereInputSchema.optional(),
  orderBy: z.union([ ProjectInvestmentStatsOrderByWithRelationInputSchema.array(),ProjectInvestmentStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectInvestmentStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectInvestmentStatsScalarFieldEnumSchema,ProjectInvestmentStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectInvestmentStatsFindManyArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsFindManyArgs> = z.object({
  select: ProjectInvestmentStatsSelectSchema.optional(),
  include: ProjectInvestmentStatsIncludeSchema.optional(),
  where: ProjectInvestmentStatsWhereInputSchema.optional(),
  orderBy: z.union([ ProjectInvestmentStatsOrderByWithRelationInputSchema.array(),ProjectInvestmentStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectInvestmentStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectInvestmentStatsScalarFieldEnumSchema,ProjectInvestmentStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectInvestmentStatsAggregateArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsAggregateArgs> = z.object({
  where: ProjectInvestmentStatsWhereInputSchema.optional(),
  orderBy: z.union([ ProjectInvestmentStatsOrderByWithRelationInputSchema.array(),ProjectInvestmentStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectInvestmentStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectInvestmentStatsGroupByArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsGroupByArgs> = z.object({
  where: ProjectInvestmentStatsWhereInputSchema.optional(),
  orderBy: z.union([ ProjectInvestmentStatsOrderByWithAggregationInputSchema.array(),ProjectInvestmentStatsOrderByWithAggregationInputSchema ]).optional(),
  by: ProjectInvestmentStatsScalarFieldEnumSchema.array(),
  having: ProjectInvestmentStatsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectInvestmentStatsFindUniqueArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsFindUniqueArgs> = z.object({
  select: ProjectInvestmentStatsSelectSchema.optional(),
  include: ProjectInvestmentStatsIncludeSchema.optional(),
  where: ProjectInvestmentStatsWhereUniqueInputSchema,
}).strict() ;

export const ProjectInvestmentStatsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsFindUniqueOrThrowArgs> = z.object({
  select: ProjectInvestmentStatsSelectSchema.optional(),
  include: ProjectInvestmentStatsIncludeSchema.optional(),
  where: ProjectInvestmentStatsWhereUniqueInputSchema,
}).strict() ;

export const ProjectPaymentInfoFindFirstArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoFindFirstArgs> = z.object({
  select: ProjectPaymentInfoSelectSchema.optional(),
  include: ProjectPaymentInfoIncludeSchema.optional(),
  where: ProjectPaymentInfoWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPaymentInfoOrderByWithRelationInputSchema.array(),ProjectPaymentInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPaymentInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectPaymentInfoScalarFieldEnumSchema,ProjectPaymentInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectPaymentInfoFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoFindFirstOrThrowArgs> = z.object({
  select: ProjectPaymentInfoSelectSchema.optional(),
  include: ProjectPaymentInfoIncludeSchema.optional(),
  where: ProjectPaymentInfoWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPaymentInfoOrderByWithRelationInputSchema.array(),ProjectPaymentInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPaymentInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectPaymentInfoScalarFieldEnumSchema,ProjectPaymentInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectPaymentInfoFindManyArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoFindManyArgs> = z.object({
  select: ProjectPaymentInfoSelectSchema.optional(),
  include: ProjectPaymentInfoIncludeSchema.optional(),
  where: ProjectPaymentInfoWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPaymentInfoOrderByWithRelationInputSchema.array(),ProjectPaymentInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPaymentInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectPaymentInfoScalarFieldEnumSchema,ProjectPaymentInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectPaymentInfoAggregateArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoAggregateArgs> = z.object({
  where: ProjectPaymentInfoWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPaymentInfoOrderByWithRelationInputSchema.array(),ProjectPaymentInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPaymentInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectPaymentInfoGroupByArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoGroupByArgs> = z.object({
  where: ProjectPaymentInfoWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPaymentInfoOrderByWithAggregationInputSchema.array(),ProjectPaymentInfoOrderByWithAggregationInputSchema ]).optional(),
  by: ProjectPaymentInfoScalarFieldEnumSchema.array(),
  having: ProjectPaymentInfoScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectPaymentInfoFindUniqueArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoFindUniqueArgs> = z.object({
  select: ProjectPaymentInfoSelectSchema.optional(),
  include: ProjectPaymentInfoIncludeSchema.optional(),
  where: ProjectPaymentInfoWhereUniqueInputSchema,
}).strict() ;

export const ProjectPaymentInfoFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoFindUniqueOrThrowArgs> = z.object({
  select: ProjectPaymentInfoSelectSchema.optional(),
  include: ProjectPaymentInfoIncludeSchema.optional(),
  where: ProjectPaymentInfoWhereUniqueInputSchema,
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

export const ProjectPictureFindFirstArgsSchema: z.ZodType<Prisma.ProjectPictureFindFirstArgs> = z.object({
  select: ProjectPictureSelectSchema.optional(),
  include: ProjectPictureIncludeSchema.optional(),
  where: ProjectPictureWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPictureOrderByWithRelationInputSchema.array(),ProjectPictureOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPictureWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectPictureScalarFieldEnumSchema,ProjectPictureScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectPictureFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProjectPictureFindFirstOrThrowArgs> = z.object({
  select: ProjectPictureSelectSchema.optional(),
  include: ProjectPictureIncludeSchema.optional(),
  where: ProjectPictureWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPictureOrderByWithRelationInputSchema.array(),ProjectPictureOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPictureWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectPictureScalarFieldEnumSchema,ProjectPictureScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectPictureFindManyArgsSchema: z.ZodType<Prisma.ProjectPictureFindManyArgs> = z.object({
  select: ProjectPictureSelectSchema.optional(),
  include: ProjectPictureIncludeSchema.optional(),
  where: ProjectPictureWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPictureOrderByWithRelationInputSchema.array(),ProjectPictureOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPictureWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectPictureScalarFieldEnumSchema,ProjectPictureScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectPictureAggregateArgsSchema: z.ZodType<Prisma.ProjectPictureAggregateArgs> = z.object({
  where: ProjectPictureWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPictureOrderByWithRelationInputSchema.array(),ProjectPictureOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectPictureWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectPictureGroupByArgsSchema: z.ZodType<Prisma.ProjectPictureGroupByArgs> = z.object({
  where: ProjectPictureWhereInputSchema.optional(),
  orderBy: z.union([ ProjectPictureOrderByWithAggregationInputSchema.array(),ProjectPictureOrderByWithAggregationInputSchema ]).optional(),
  by: ProjectPictureScalarFieldEnumSchema.array(),
  having: ProjectPictureScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectPictureFindUniqueArgsSchema: z.ZodType<Prisma.ProjectPictureFindUniqueArgs> = z.object({
  select: ProjectPictureSelectSchema.optional(),
  include: ProjectPictureIncludeSchema.optional(),
  where: ProjectPictureWhereUniqueInputSchema,
}).strict() ;

export const ProjectPictureFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProjectPictureFindUniqueOrThrowArgs> = z.object({
  select: ProjectPictureSelectSchema.optional(),
  include: ProjectPictureIncludeSchema.optional(),
  where: ProjectPictureWhereUniqueInputSchema,
}).strict() ;

export const ProjectDocumentFindFirstArgsSchema: z.ZodType<Prisma.ProjectDocumentFindFirstArgs> = z.object({
  select: ProjectDocumentSelectSchema.optional(),
  include: ProjectDocumentIncludeSchema.optional(),
  where: ProjectDocumentWhereInputSchema.optional(),
  orderBy: z.union([ ProjectDocumentOrderByWithRelationInputSchema.array(),ProjectDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectDocumentScalarFieldEnumSchema,ProjectDocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectDocumentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProjectDocumentFindFirstOrThrowArgs> = z.object({
  select: ProjectDocumentSelectSchema.optional(),
  include: ProjectDocumentIncludeSchema.optional(),
  where: ProjectDocumentWhereInputSchema.optional(),
  orderBy: z.union([ ProjectDocumentOrderByWithRelationInputSchema.array(),ProjectDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectDocumentScalarFieldEnumSchema,ProjectDocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectDocumentFindManyArgsSchema: z.ZodType<Prisma.ProjectDocumentFindManyArgs> = z.object({
  select: ProjectDocumentSelectSchema.optional(),
  include: ProjectDocumentIncludeSchema.optional(),
  where: ProjectDocumentWhereInputSchema.optional(),
  orderBy: z.union([ ProjectDocumentOrderByWithRelationInputSchema.array(),ProjectDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProjectDocumentScalarFieldEnumSchema,ProjectDocumentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProjectDocumentAggregateArgsSchema: z.ZodType<Prisma.ProjectDocumentAggregateArgs> = z.object({
  where: ProjectDocumentWhereInputSchema.optional(),
  orderBy: z.union([ ProjectDocumentOrderByWithRelationInputSchema.array(),ProjectDocumentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProjectDocumentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectDocumentGroupByArgsSchema: z.ZodType<Prisma.ProjectDocumentGroupByArgs> = z.object({
  where: ProjectDocumentWhereInputSchema.optional(),
  orderBy: z.union([ ProjectDocumentOrderByWithAggregationInputSchema.array(),ProjectDocumentOrderByWithAggregationInputSchema ]).optional(),
  by: ProjectDocumentScalarFieldEnumSchema.array(),
  having: ProjectDocumentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProjectDocumentFindUniqueArgsSchema: z.ZodType<Prisma.ProjectDocumentFindUniqueArgs> = z.object({
  select: ProjectDocumentSelectSchema.optional(),
  include: ProjectDocumentIncludeSchema.optional(),
  where: ProjectDocumentWhereUniqueInputSchema,
}).strict() ;

export const ProjectDocumentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProjectDocumentFindUniqueOrThrowArgs> = z.object({
  select: ProjectDocumentSelectSchema.optional(),
  include: ProjectDocumentIncludeSchema.optional(),
  where: ProjectDocumentWhereUniqueInputSchema,
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

export const DocusignEventFindFirstArgsSchema: z.ZodType<Prisma.DocusignEventFindFirstArgs> = z.object({
  select: DocusignEventSelectSchema.optional(),
  include: DocusignEventIncludeSchema.optional(),
  where: DocusignEventWhereInputSchema.optional(),
  orderBy: z.union([ DocusignEventOrderByWithRelationInputSchema.array(),DocusignEventOrderByWithRelationInputSchema ]).optional(),
  cursor: DocusignEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DocusignEventScalarFieldEnumSchema,DocusignEventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DocusignEventFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DocusignEventFindFirstOrThrowArgs> = z.object({
  select: DocusignEventSelectSchema.optional(),
  include: DocusignEventIncludeSchema.optional(),
  where: DocusignEventWhereInputSchema.optional(),
  orderBy: z.union([ DocusignEventOrderByWithRelationInputSchema.array(),DocusignEventOrderByWithRelationInputSchema ]).optional(),
  cursor: DocusignEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DocusignEventScalarFieldEnumSchema,DocusignEventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DocusignEventFindManyArgsSchema: z.ZodType<Prisma.DocusignEventFindManyArgs> = z.object({
  select: DocusignEventSelectSchema.optional(),
  include: DocusignEventIncludeSchema.optional(),
  where: DocusignEventWhereInputSchema.optional(),
  orderBy: z.union([ DocusignEventOrderByWithRelationInputSchema.array(),DocusignEventOrderByWithRelationInputSchema ]).optional(),
  cursor: DocusignEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DocusignEventScalarFieldEnumSchema,DocusignEventScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DocusignEventAggregateArgsSchema: z.ZodType<Prisma.DocusignEventAggregateArgs> = z.object({
  where: DocusignEventWhereInputSchema.optional(),
  orderBy: z.union([ DocusignEventOrderByWithRelationInputSchema.array(),DocusignEventOrderByWithRelationInputSchema ]).optional(),
  cursor: DocusignEventWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DocusignEventGroupByArgsSchema: z.ZodType<Prisma.DocusignEventGroupByArgs> = z.object({
  where: DocusignEventWhereInputSchema.optional(),
  orderBy: z.union([ DocusignEventOrderByWithAggregationInputSchema.array(),DocusignEventOrderByWithAggregationInputSchema ]).optional(),
  by: DocusignEventScalarFieldEnumSchema.array(),
  having: DocusignEventScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DocusignEventFindUniqueArgsSchema: z.ZodType<Prisma.DocusignEventFindUniqueArgs> = z.object({
  select: DocusignEventSelectSchema.optional(),
  include: DocusignEventIncludeSchema.optional(),
  where: DocusignEventWhereUniqueInputSchema,
}).strict() ;

export const DocusignEventFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DocusignEventFindUniqueOrThrowArgs> = z.object({
  select: DocusignEventSelectSchema.optional(),
  include: DocusignEventIncludeSchema.optional(),
  where: DocusignEventWhereUniqueInputSchema,
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

export const DealInvestmentStatsCreateArgsSchema: z.ZodType<Prisma.DealInvestmentStatsCreateArgs> = z.object({
  select: DealInvestmentStatsSelectSchema.optional(),
  include: DealInvestmentStatsIncludeSchema.optional(),
  data: z.union([ DealInvestmentStatsCreateInputSchema,DealInvestmentStatsUncheckedCreateInputSchema ]),
}).strict() ;

export const DealInvestmentStatsUpsertArgsSchema: z.ZodType<Prisma.DealInvestmentStatsUpsertArgs> = z.object({
  select: DealInvestmentStatsSelectSchema.optional(),
  include: DealInvestmentStatsIncludeSchema.optional(),
  where: DealInvestmentStatsWhereUniqueInputSchema,
  create: z.union([ DealInvestmentStatsCreateInputSchema,DealInvestmentStatsUncheckedCreateInputSchema ]),
  update: z.union([ DealInvestmentStatsUpdateInputSchema,DealInvestmentStatsUncheckedUpdateInputSchema ]),
}).strict() ;

export const DealInvestmentStatsCreateManyArgsSchema: z.ZodType<Prisma.DealInvestmentStatsCreateManyArgs> = z.object({
  data: z.union([ DealInvestmentStatsCreateManyInputSchema,DealInvestmentStatsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DealInvestmentStatsCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DealInvestmentStatsCreateManyAndReturnArgs> = z.object({
  data: z.union([ DealInvestmentStatsCreateManyInputSchema,DealInvestmentStatsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DealInvestmentStatsDeleteArgsSchema: z.ZodType<Prisma.DealInvestmentStatsDeleteArgs> = z.object({
  select: DealInvestmentStatsSelectSchema.optional(),
  include: DealInvestmentStatsIncludeSchema.optional(),
  where: DealInvestmentStatsWhereUniqueInputSchema,
}).strict() ;

export const DealInvestmentStatsUpdateArgsSchema: z.ZodType<Prisma.DealInvestmentStatsUpdateArgs> = z.object({
  select: DealInvestmentStatsSelectSchema.optional(),
  include: DealInvestmentStatsIncludeSchema.optional(),
  data: z.union([ DealInvestmentStatsUpdateInputSchema,DealInvestmentStatsUncheckedUpdateInputSchema ]),
  where: DealInvestmentStatsWhereUniqueInputSchema,
}).strict() ;

export const DealInvestmentStatsUpdateManyArgsSchema: z.ZodType<Prisma.DealInvestmentStatsUpdateManyArgs> = z.object({
  data: z.union([ DealInvestmentStatsUpdateManyMutationInputSchema,DealInvestmentStatsUncheckedUpdateManyInputSchema ]),
  where: DealInvestmentStatsWhereInputSchema.optional(),
}).strict() ;

export const DealInvestmentStatsDeleteManyArgsSchema: z.ZodType<Prisma.DealInvestmentStatsDeleteManyArgs> = z.object({
  where: DealInvestmentStatsWhereInputSchema.optional(),
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

export const MemberCreateArgsSchema: z.ZodType<Prisma.MemberCreateArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  data: z.union([ MemberCreateInputSchema,MemberUncheckedCreateInputSchema ]),
}).strict() ;

export const MemberUpsertArgsSchema: z.ZodType<Prisma.MemberUpsertArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereUniqueInputSchema,
  create: z.union([ MemberCreateInputSchema,MemberUncheckedCreateInputSchema ]),
  update: z.union([ MemberUpdateInputSchema,MemberUncheckedUpdateInputSchema ]),
}).strict() ;

export const MemberCreateManyArgsSchema: z.ZodType<Prisma.MemberCreateManyArgs> = z.object({
  data: z.union([ MemberCreateManyInputSchema,MemberCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MemberCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MemberCreateManyAndReturnArgs> = z.object({
  data: z.union([ MemberCreateManyInputSchema,MemberCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MemberDeleteArgsSchema: z.ZodType<Prisma.MemberDeleteArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  where: MemberWhereUniqueInputSchema,
}).strict() ;

export const MemberUpdateArgsSchema: z.ZodType<Prisma.MemberUpdateArgs> = z.object({
  select: MemberSelectSchema.optional(),
  include: MemberIncludeSchema.optional(),
  data: z.union([ MemberUpdateInputSchema,MemberUncheckedUpdateInputSchema ]),
  where: MemberWhereUniqueInputSchema,
}).strict() ;

export const MemberUpdateManyArgsSchema: z.ZodType<Prisma.MemberUpdateManyArgs> = z.object({
  data: z.union([ MemberUpdateManyMutationInputSchema,MemberUncheckedUpdateManyInputSchema ]),
  where: MemberWhereInputSchema.optional(),
}).strict() ;

export const MemberDeleteManyArgsSchema: z.ZodType<Prisma.MemberDeleteManyArgs> = z.object({
  where: MemberWhereInputSchema.optional(),
}).strict() ;

export const AccreditationVerificationCreateArgsSchema: z.ZodType<Prisma.AccreditationVerificationCreateArgs> = z.object({
  select: AccreditationVerificationSelectSchema.optional(),
  include: AccreditationVerificationIncludeSchema.optional(),
  data: z.union([ AccreditationVerificationCreateInputSchema,AccreditationVerificationUncheckedCreateInputSchema ]),
}).strict() ;

export const AccreditationVerificationUpsertArgsSchema: z.ZodType<Prisma.AccreditationVerificationUpsertArgs> = z.object({
  select: AccreditationVerificationSelectSchema.optional(),
  include: AccreditationVerificationIncludeSchema.optional(),
  where: AccreditationVerificationWhereUniqueInputSchema,
  create: z.union([ AccreditationVerificationCreateInputSchema,AccreditationVerificationUncheckedCreateInputSchema ]),
  update: z.union([ AccreditationVerificationUpdateInputSchema,AccreditationVerificationUncheckedUpdateInputSchema ]),
}).strict() ;

export const AccreditationVerificationCreateManyArgsSchema: z.ZodType<Prisma.AccreditationVerificationCreateManyArgs> = z.object({
  data: z.union([ AccreditationVerificationCreateManyInputSchema,AccreditationVerificationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccreditationVerificationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccreditationVerificationCreateManyAndReturnArgs> = z.object({
  data: z.union([ AccreditationVerificationCreateManyInputSchema,AccreditationVerificationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccreditationVerificationDeleteArgsSchema: z.ZodType<Prisma.AccreditationVerificationDeleteArgs> = z.object({
  select: AccreditationVerificationSelectSchema.optional(),
  include: AccreditationVerificationIncludeSchema.optional(),
  where: AccreditationVerificationWhereUniqueInputSchema,
}).strict() ;

export const AccreditationVerificationUpdateArgsSchema: z.ZodType<Prisma.AccreditationVerificationUpdateArgs> = z.object({
  select: AccreditationVerificationSelectSchema.optional(),
  include: AccreditationVerificationIncludeSchema.optional(),
  data: z.union([ AccreditationVerificationUpdateInputSchema,AccreditationVerificationUncheckedUpdateInputSchema ]),
  where: AccreditationVerificationWhereUniqueInputSchema,
}).strict() ;

export const AccreditationVerificationUpdateManyArgsSchema: z.ZodType<Prisma.AccreditationVerificationUpdateManyArgs> = z.object({
  data: z.union([ AccreditationVerificationUpdateManyMutationInputSchema,AccreditationVerificationUncheckedUpdateManyInputSchema ]),
  where: AccreditationVerificationWhereInputSchema.optional(),
}).strict() ;

export const AccreditationVerificationDeleteManyArgsSchema: z.ZodType<Prisma.AccreditationVerificationDeleteManyArgs> = z.object({
  where: AccreditationVerificationWhereInputSchema.optional(),
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

export const ProjectPropertyStatsCreateArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsCreateArgs> = z.object({
  select: ProjectPropertyStatsSelectSchema.optional(),
  include: ProjectPropertyStatsIncludeSchema.optional(),
  data: z.union([ ProjectPropertyStatsCreateInputSchema,ProjectPropertyStatsUncheckedCreateInputSchema ]),
}).strict() ;

export const ProjectPropertyStatsUpsertArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsUpsertArgs> = z.object({
  select: ProjectPropertyStatsSelectSchema.optional(),
  include: ProjectPropertyStatsIncludeSchema.optional(),
  where: ProjectPropertyStatsWhereUniqueInputSchema,
  create: z.union([ ProjectPropertyStatsCreateInputSchema,ProjectPropertyStatsUncheckedCreateInputSchema ]),
  update: z.union([ ProjectPropertyStatsUpdateInputSchema,ProjectPropertyStatsUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProjectPropertyStatsCreateManyArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsCreateManyArgs> = z.object({
  data: z.union([ ProjectPropertyStatsCreateManyInputSchema,ProjectPropertyStatsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectPropertyStatsCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProjectPropertyStatsCreateManyInputSchema,ProjectPropertyStatsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectPropertyStatsDeleteArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsDeleteArgs> = z.object({
  select: ProjectPropertyStatsSelectSchema.optional(),
  include: ProjectPropertyStatsIncludeSchema.optional(),
  where: ProjectPropertyStatsWhereUniqueInputSchema,
}).strict() ;

export const ProjectPropertyStatsUpdateArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsUpdateArgs> = z.object({
  select: ProjectPropertyStatsSelectSchema.optional(),
  include: ProjectPropertyStatsIncludeSchema.optional(),
  data: z.union([ ProjectPropertyStatsUpdateInputSchema,ProjectPropertyStatsUncheckedUpdateInputSchema ]),
  where: ProjectPropertyStatsWhereUniqueInputSchema,
}).strict() ;

export const ProjectPropertyStatsUpdateManyArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsUpdateManyArgs> = z.object({
  data: z.union([ ProjectPropertyStatsUpdateManyMutationInputSchema,ProjectPropertyStatsUncheckedUpdateManyInputSchema ]),
  where: ProjectPropertyStatsWhereInputSchema.optional(),
}).strict() ;

export const ProjectPropertyStatsDeleteManyArgsSchema: z.ZodType<Prisma.ProjectPropertyStatsDeleteManyArgs> = z.object({
  where: ProjectPropertyStatsWhereInputSchema.optional(),
}).strict() ;

export const ProjectInvestmentStatsCreateArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsCreateArgs> = z.object({
  select: ProjectInvestmentStatsSelectSchema.optional(),
  include: ProjectInvestmentStatsIncludeSchema.optional(),
  data: z.union([ ProjectInvestmentStatsCreateInputSchema,ProjectInvestmentStatsUncheckedCreateInputSchema ]),
}).strict() ;

export const ProjectInvestmentStatsUpsertArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsUpsertArgs> = z.object({
  select: ProjectInvestmentStatsSelectSchema.optional(),
  include: ProjectInvestmentStatsIncludeSchema.optional(),
  where: ProjectInvestmentStatsWhereUniqueInputSchema,
  create: z.union([ ProjectInvestmentStatsCreateInputSchema,ProjectInvestmentStatsUncheckedCreateInputSchema ]),
  update: z.union([ ProjectInvestmentStatsUpdateInputSchema,ProjectInvestmentStatsUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProjectInvestmentStatsCreateManyArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsCreateManyArgs> = z.object({
  data: z.union([ ProjectInvestmentStatsCreateManyInputSchema,ProjectInvestmentStatsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectInvestmentStatsCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProjectInvestmentStatsCreateManyInputSchema,ProjectInvestmentStatsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectInvestmentStatsDeleteArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsDeleteArgs> = z.object({
  select: ProjectInvestmentStatsSelectSchema.optional(),
  include: ProjectInvestmentStatsIncludeSchema.optional(),
  where: ProjectInvestmentStatsWhereUniqueInputSchema,
}).strict() ;

export const ProjectInvestmentStatsUpdateArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsUpdateArgs> = z.object({
  select: ProjectInvestmentStatsSelectSchema.optional(),
  include: ProjectInvestmentStatsIncludeSchema.optional(),
  data: z.union([ ProjectInvestmentStatsUpdateInputSchema,ProjectInvestmentStatsUncheckedUpdateInputSchema ]),
  where: ProjectInvestmentStatsWhereUniqueInputSchema,
}).strict() ;

export const ProjectInvestmentStatsUpdateManyArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsUpdateManyArgs> = z.object({
  data: z.union([ ProjectInvestmentStatsUpdateManyMutationInputSchema,ProjectInvestmentStatsUncheckedUpdateManyInputSchema ]),
  where: ProjectInvestmentStatsWhereInputSchema.optional(),
}).strict() ;

export const ProjectInvestmentStatsDeleteManyArgsSchema: z.ZodType<Prisma.ProjectInvestmentStatsDeleteManyArgs> = z.object({
  where: ProjectInvestmentStatsWhereInputSchema.optional(),
}).strict() ;

export const ProjectPaymentInfoCreateArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoCreateArgs> = z.object({
  select: ProjectPaymentInfoSelectSchema.optional(),
  include: ProjectPaymentInfoIncludeSchema.optional(),
  data: z.union([ ProjectPaymentInfoCreateInputSchema,ProjectPaymentInfoUncheckedCreateInputSchema ]),
}).strict() ;

export const ProjectPaymentInfoUpsertArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoUpsertArgs> = z.object({
  select: ProjectPaymentInfoSelectSchema.optional(),
  include: ProjectPaymentInfoIncludeSchema.optional(),
  where: ProjectPaymentInfoWhereUniqueInputSchema,
  create: z.union([ ProjectPaymentInfoCreateInputSchema,ProjectPaymentInfoUncheckedCreateInputSchema ]),
  update: z.union([ ProjectPaymentInfoUpdateInputSchema,ProjectPaymentInfoUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProjectPaymentInfoCreateManyArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoCreateManyArgs> = z.object({
  data: z.union([ ProjectPaymentInfoCreateManyInputSchema,ProjectPaymentInfoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectPaymentInfoCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProjectPaymentInfoCreateManyInputSchema,ProjectPaymentInfoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectPaymentInfoDeleteArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoDeleteArgs> = z.object({
  select: ProjectPaymentInfoSelectSchema.optional(),
  include: ProjectPaymentInfoIncludeSchema.optional(),
  where: ProjectPaymentInfoWhereUniqueInputSchema,
}).strict() ;

export const ProjectPaymentInfoUpdateArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoUpdateArgs> = z.object({
  select: ProjectPaymentInfoSelectSchema.optional(),
  include: ProjectPaymentInfoIncludeSchema.optional(),
  data: z.union([ ProjectPaymentInfoUpdateInputSchema,ProjectPaymentInfoUncheckedUpdateInputSchema ]),
  where: ProjectPaymentInfoWhereUniqueInputSchema,
}).strict() ;

export const ProjectPaymentInfoUpdateManyArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoUpdateManyArgs> = z.object({
  data: z.union([ ProjectPaymentInfoUpdateManyMutationInputSchema,ProjectPaymentInfoUncheckedUpdateManyInputSchema ]),
  where: ProjectPaymentInfoWhereInputSchema.optional(),
}).strict() ;

export const ProjectPaymentInfoDeleteManyArgsSchema: z.ZodType<Prisma.ProjectPaymentInfoDeleteManyArgs> = z.object({
  where: ProjectPaymentInfoWhereInputSchema.optional(),
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

export const ProjectPictureCreateArgsSchema: z.ZodType<Prisma.ProjectPictureCreateArgs> = z.object({
  select: ProjectPictureSelectSchema.optional(),
  include: ProjectPictureIncludeSchema.optional(),
  data: z.union([ ProjectPictureCreateInputSchema,ProjectPictureUncheckedCreateInputSchema ]),
}).strict() ;

export const ProjectPictureUpsertArgsSchema: z.ZodType<Prisma.ProjectPictureUpsertArgs> = z.object({
  select: ProjectPictureSelectSchema.optional(),
  include: ProjectPictureIncludeSchema.optional(),
  where: ProjectPictureWhereUniqueInputSchema,
  create: z.union([ ProjectPictureCreateInputSchema,ProjectPictureUncheckedCreateInputSchema ]),
  update: z.union([ ProjectPictureUpdateInputSchema,ProjectPictureUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProjectPictureCreateManyArgsSchema: z.ZodType<Prisma.ProjectPictureCreateManyArgs> = z.object({
  data: z.union([ ProjectPictureCreateManyInputSchema,ProjectPictureCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectPictureCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProjectPictureCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProjectPictureCreateManyInputSchema,ProjectPictureCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectPictureDeleteArgsSchema: z.ZodType<Prisma.ProjectPictureDeleteArgs> = z.object({
  select: ProjectPictureSelectSchema.optional(),
  include: ProjectPictureIncludeSchema.optional(),
  where: ProjectPictureWhereUniqueInputSchema,
}).strict() ;

export const ProjectPictureUpdateArgsSchema: z.ZodType<Prisma.ProjectPictureUpdateArgs> = z.object({
  select: ProjectPictureSelectSchema.optional(),
  include: ProjectPictureIncludeSchema.optional(),
  data: z.union([ ProjectPictureUpdateInputSchema,ProjectPictureUncheckedUpdateInputSchema ]),
  where: ProjectPictureWhereUniqueInputSchema,
}).strict() ;

export const ProjectPictureUpdateManyArgsSchema: z.ZodType<Prisma.ProjectPictureUpdateManyArgs> = z.object({
  data: z.union([ ProjectPictureUpdateManyMutationInputSchema,ProjectPictureUncheckedUpdateManyInputSchema ]),
  where: ProjectPictureWhereInputSchema.optional(),
}).strict() ;

export const ProjectPictureDeleteManyArgsSchema: z.ZodType<Prisma.ProjectPictureDeleteManyArgs> = z.object({
  where: ProjectPictureWhereInputSchema.optional(),
}).strict() ;

export const ProjectDocumentCreateArgsSchema: z.ZodType<Prisma.ProjectDocumentCreateArgs> = z.object({
  select: ProjectDocumentSelectSchema.optional(),
  include: ProjectDocumentIncludeSchema.optional(),
  data: z.union([ ProjectDocumentCreateInputSchema,ProjectDocumentUncheckedCreateInputSchema ]),
}).strict() ;

export const ProjectDocumentUpsertArgsSchema: z.ZodType<Prisma.ProjectDocumentUpsertArgs> = z.object({
  select: ProjectDocumentSelectSchema.optional(),
  include: ProjectDocumentIncludeSchema.optional(),
  where: ProjectDocumentWhereUniqueInputSchema,
  create: z.union([ ProjectDocumentCreateInputSchema,ProjectDocumentUncheckedCreateInputSchema ]),
  update: z.union([ ProjectDocumentUpdateInputSchema,ProjectDocumentUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProjectDocumentCreateManyArgsSchema: z.ZodType<Prisma.ProjectDocumentCreateManyArgs> = z.object({
  data: z.union([ ProjectDocumentCreateManyInputSchema,ProjectDocumentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectDocumentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProjectDocumentCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProjectDocumentCreateManyInputSchema,ProjectDocumentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProjectDocumentDeleteArgsSchema: z.ZodType<Prisma.ProjectDocumentDeleteArgs> = z.object({
  select: ProjectDocumentSelectSchema.optional(),
  include: ProjectDocumentIncludeSchema.optional(),
  where: ProjectDocumentWhereUniqueInputSchema,
}).strict() ;

export const ProjectDocumentUpdateArgsSchema: z.ZodType<Prisma.ProjectDocumentUpdateArgs> = z.object({
  select: ProjectDocumentSelectSchema.optional(),
  include: ProjectDocumentIncludeSchema.optional(),
  data: z.union([ ProjectDocumentUpdateInputSchema,ProjectDocumentUncheckedUpdateInputSchema ]),
  where: ProjectDocumentWhereUniqueInputSchema,
}).strict() ;

export const ProjectDocumentUpdateManyArgsSchema: z.ZodType<Prisma.ProjectDocumentUpdateManyArgs> = z.object({
  data: z.union([ ProjectDocumentUpdateManyMutationInputSchema,ProjectDocumentUncheckedUpdateManyInputSchema ]),
  where: ProjectDocumentWhereInputSchema.optional(),
}).strict() ;

export const ProjectDocumentDeleteManyArgsSchema: z.ZodType<Prisma.ProjectDocumentDeleteManyArgs> = z.object({
  where: ProjectDocumentWhereInputSchema.optional(),
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

export const DocusignEventCreateArgsSchema: z.ZodType<Prisma.DocusignEventCreateArgs> = z.object({
  select: DocusignEventSelectSchema.optional(),
  include: DocusignEventIncludeSchema.optional(),
  data: z.union([ DocusignEventCreateInputSchema,DocusignEventUncheckedCreateInputSchema ]),
}).strict() ;

export const DocusignEventUpsertArgsSchema: z.ZodType<Prisma.DocusignEventUpsertArgs> = z.object({
  select: DocusignEventSelectSchema.optional(),
  include: DocusignEventIncludeSchema.optional(),
  where: DocusignEventWhereUniqueInputSchema,
  create: z.union([ DocusignEventCreateInputSchema,DocusignEventUncheckedCreateInputSchema ]),
  update: z.union([ DocusignEventUpdateInputSchema,DocusignEventUncheckedUpdateInputSchema ]),
}).strict() ;

export const DocusignEventCreateManyArgsSchema: z.ZodType<Prisma.DocusignEventCreateManyArgs> = z.object({
  data: z.union([ DocusignEventCreateManyInputSchema,DocusignEventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DocusignEventCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DocusignEventCreateManyAndReturnArgs> = z.object({
  data: z.union([ DocusignEventCreateManyInputSchema,DocusignEventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DocusignEventDeleteArgsSchema: z.ZodType<Prisma.DocusignEventDeleteArgs> = z.object({
  select: DocusignEventSelectSchema.optional(),
  include: DocusignEventIncludeSchema.optional(),
  where: DocusignEventWhereUniqueInputSchema,
}).strict() ;

export const DocusignEventUpdateArgsSchema: z.ZodType<Prisma.DocusignEventUpdateArgs> = z.object({
  select: DocusignEventSelectSchema.optional(),
  include: DocusignEventIncludeSchema.optional(),
  data: z.union([ DocusignEventUpdateInputSchema,DocusignEventUncheckedUpdateInputSchema ]),
  where: DocusignEventWhereUniqueInputSchema,
}).strict() ;

export const DocusignEventUpdateManyArgsSchema: z.ZodType<Prisma.DocusignEventUpdateManyArgs> = z.object({
  data: z.union([ DocusignEventUpdateManyMutationInputSchema,DocusignEventUncheckedUpdateManyInputSchema ]),
  where: DocusignEventWhereInputSchema.optional(),
}).strict() ;

export const DocusignEventDeleteManyArgsSchema: z.ZodType<Prisma.DocusignEventDeleteManyArgs> = z.object({
  where: DocusignEventWhereInputSchema.optional(),
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