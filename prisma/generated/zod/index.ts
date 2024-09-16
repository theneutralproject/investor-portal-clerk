import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','clerkId','role','email','firstName','lastName','phoneNumber','hubspotId','title','ssn','addressId']);

export const MeetingScalarFieldEnumSchema = z.enum(['id','url','userId','projectId','time']);

export const ProjectScalarFieldEnumSchema = z.enum(['id','name','slug','location','investmentGoal','investmentRaised','tags','status','description','buildingAvgRent','buildingAvgUnitSize','buildingCommSqFt','buildingUnits','debtInterestRate','debtMinInvestment','debtPaymentFreq','debtTermMonths','equityIRR','equityMinInvestment','equityPaymentFreq','equityTermMonths','marketHighlights','youtubeUrl','preferredReturn','targetEquityMultiple']);

export const PicturesScalarFieldEnumSchema = z.enum(['id','projectId','url','type']);

export const DocumentScalarFieldEnumSchema = z.enum(['id','name','fileName','description','link','docusignTemplateId','projectId','dealStage','financingTypes','documentType']);

export const DocumentEventScalarFieldEnumSchema = z.enum(['id','userId','documentId','date','type']);

export const DealScalarFieldEnumSchema = z.enum(['id','projectId','userId','dealStage','amount','financingType','hubspotId','transactionId','investmentEntity','ownershipType','ownershipTypeOtherValue','numberAUnits','numberCUnits','coSignerEmail','coSignerFullName','verifierEmail','verifierFullName']);

export const AddressScalarFieldEnumSchema = z.enum(['id','street','city','zipcode','state']);

export const ContactScalarFieldEnumSchema = z.enum(['id','firstName','lastName','email','title','ssn','type','addressId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const ContactTypeSchema = z.enum(['COSIGNER','VERIFIER']);

export type ContactTypeType = `${z.infer<typeof ContactTypeSchema>}`

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

export const DealOwnershipTypeSchema = z.enum(['INDIVIDUAL','JOINT','CORPROTATION','REVOCABLEGRANTOR','OTHER','MARITAL','COMMON','PARTNERSHIP']);

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
  title: z.string().nullable(),
  ssn: z.string().nullable(),
  addressId: z.number().int().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// MEETING SCHEMA
/////////////////////////////////////////

export const MeetingSchema = z.object({
  id: z.number().int(),
  url: z.string(),
  userId: z.number().int(),
  projectId: z.number().int(),
  time: z.coerce.date(),
})

export type Meeting = z.infer<typeof MeetingSchema>

/////////////////////////////////////////
// PROJECT SCHEMA
/////////////////////////////////////////

export const ProjectSchema = z.object({
  status: StatusSchema,
  id: z.number().int(),
  name: z.string(),
  slug: z.string().cuid(),
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
})

export type Project = z.infer<typeof ProjectSchema>

/////////////////////////////////////////
// PICTURES SCHEMA
/////////////////////////////////////////

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

export const DocumentSchema = z.object({
  financingTypes: DealFinancingTypeSchema.array(),
  documentType: DocumentTypeSchema,
  id: z.number().int(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().nullable(),
  link: z.string(),
  docusignTemplateId: z.string().nullable(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
})

export type Document = z.infer<typeof DocumentSchema>

/////////////////////////////////////////
// DOCUMENT EVENT SCHEMA
/////////////////////////////////////////

export const DocumentEventSchema = z.object({
  type: DocumentEventTypeSchema,
  id: z.number().int(),
  userId: z.number().int(),
  documentId: z.number().int(),
  date: z.coerce.date(),
})

export type DocumentEvent = z.infer<typeof DocumentEventSchema>

/////////////////////////////////////////
// DEAL SCHEMA
/////////////////////////////////////////

export const DealSchema = z.object({
  financingType: DealFinancingTypeSchema.nullable(),
  ownershipType: DealOwnershipTypeSchema.nullable(),
  id: z.number().int(),
  projectId: z.number().int(),
  userId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  hubspotId: z.string(),
  transactionId: z.string(),
  investmentEntity: z.string(),
  ownershipTypeOtherValue: z.string().nullable(),
  numberAUnits: z.number().nullable(),
  numberCUnits: z.number().nullable(),
  coSignerEmail: z.string().nullable(),
  coSignerFullName: z.string().nullable(),
  verifierEmail: z.string().nullable(),
  verifierFullName: z.string().nullable(),
})

export type Deal = z.infer<typeof DealSchema>

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
// CONTACT SCHEMA
/////////////////////////////////////////

export const ContactSchema = z.object({
  type: ContactTypeSchema,
  id: z.number().int(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  title: z.string().nullable(),
  ssn: z.number().nullable(),
  addressId: z.number().int().nullable(),
})

export type Contact = z.infer<typeof ContactSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  documentEvents: z.union([z.boolean(),z.lazy(() => DocumentEventFindManyArgsSchema)]).optional(),
  meetings: z.union([z.boolean(),z.lazy(() => MeetingFindManyArgsSchema)]).optional(),
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
  deals: z.boolean().optional(),
  documentEvents: z.boolean().optional(),
  meetings: z.boolean().optional(),
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
  title: z.boolean().optional(),
  ssn: z.boolean().optional(),
  addressId: z.boolean().optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  documentEvents: z.union([z.boolean(),z.lazy(() => DocumentEventFindManyArgsSchema)]).optional(),
  meetings: z.union([z.boolean(),z.lazy(() => MeetingFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MEETING
//------------------------------------------------------

export const MeetingIncludeSchema: z.ZodType<Prisma.MeetingInclude> = z.object({
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const MeetingArgsSchema: z.ZodType<Prisma.MeetingDefaultArgs> = z.object({
  select: z.lazy(() => MeetingSelectSchema).optional(),
  include: z.lazy(() => MeetingIncludeSchema).optional(),
}).strict();

export const MeetingSelectSchema: z.ZodType<Prisma.MeetingSelect> = z.object({
  id: z.boolean().optional(),
  url: z.boolean().optional(),
  userId: z.boolean().optional(),
  projectId: z.boolean().optional(),
  time: z.boolean().optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// PROJECT
//------------------------------------------------------

export const ProjectIncludeSchema: z.ZodType<Prisma.ProjectInclude> = z.object({
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  documents: z.union([z.boolean(),z.lazy(() => DocumentFindManyArgsSchema)]).optional(),
  meetings: z.union([z.boolean(),z.lazy(() => MeetingFindManyArgsSchema)]).optional(),
  pictures: z.union([z.boolean(),z.lazy(() => PicturesFindManyArgsSchema)]).optional(),
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
  meetings: z.boolean().optional(),
  pictures: z.boolean().optional(),
}).strict();

export const ProjectSelectSchema: z.ZodType<Prisma.ProjectSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
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
  deals: z.union([z.boolean(),z.lazy(() => DealFindManyArgsSchema)]).optional(),
  documents: z.union([z.boolean(),z.lazy(() => DocumentFindManyArgsSchema)]).optional(),
  meetings: z.union([z.boolean(),z.lazy(() => MeetingFindManyArgsSchema)]).optional(),
  pictures: z.union([z.boolean(),z.lazy(() => PicturesFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProjectCountOutputTypeArgsSchema)]).optional(),
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
  docusignTemplateId: z.boolean().optional(),
  projectId: z.boolean().optional(),
  dealStage: z.boolean().optional(),
  financingTypes: z.boolean().optional(),
  documentType: z.boolean().optional(),
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

// DEAL
//------------------------------------------------------

export const DealIncludeSchema: z.ZodType<Prisma.DealInclude> = z.object({
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const DealArgsSchema: z.ZodType<Prisma.DealDefaultArgs> = z.object({
  select: z.lazy(() => DealSelectSchema).optional(),
  include: z.lazy(() => DealIncludeSchema).optional(),
}).strict();

export const DealSelectSchema: z.ZodType<Prisma.DealSelect> = z.object({
  id: z.boolean().optional(),
  projectId: z.boolean().optional(),
  userId: z.boolean().optional(),
  dealStage: z.boolean().optional(),
  amount: z.boolean().optional(),
  financingType: z.boolean().optional(),
  hubspotId: z.boolean().optional(),
  transactionId: z.boolean().optional(),
  investmentEntity: z.boolean().optional(),
  ownershipType: z.boolean().optional(),
  ownershipTypeOtherValue: z.boolean().optional(),
  numberAUnits: z.boolean().optional(),
  numberCUnits: z.boolean().optional(),
  coSignerEmail: z.boolean().optional(),
  coSignerFullName: z.boolean().optional(),
  verifierEmail: z.boolean().optional(),
  verifierFullName: z.boolean().optional(),
  project: z.union([z.boolean(),z.lazy(() => ProjectArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ADDRESS
//------------------------------------------------------

export const AddressIncludeSchema: z.ZodType<Prisma.AddressInclude> = z.object({
  User: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  Contact: z.union([z.boolean(),z.lazy(() => ContactFindManyArgsSchema)]).optional(),
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
  User: z.boolean().optional(),
  Contact: z.boolean().optional(),
}).strict();

export const AddressSelectSchema: z.ZodType<Prisma.AddressSelect> = z.object({
  id: z.boolean().optional(),
  street: z.boolean().optional(),
  city: z.boolean().optional(),
  zipcode: z.boolean().optional(),
  state: z.boolean().optional(),
  User: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  Contact: z.union([z.boolean(),z.lazy(() => ContactFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AddressCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CONTACT
//------------------------------------------------------

export const ContactIncludeSchema: z.ZodType<Prisma.ContactInclude> = z.object({
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
}).strict()

export const ContactArgsSchema: z.ZodType<Prisma.ContactDefaultArgs> = z.object({
  select: z.lazy(() => ContactSelectSchema).optional(),
  include: z.lazy(() => ContactIncludeSchema).optional(),
}).strict();

export const ContactSelectSchema: z.ZodType<Prisma.ContactSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  email: z.boolean().optional(),
  title: z.boolean().optional(),
  ssn: z.boolean().optional(),
  type: z.boolean().optional(),
  addressId: z.boolean().optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
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
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  address: z.union([ z.lazy(() => AddressNullableRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional(),
  meetings: z.lazy(() => MeetingListRelationFilterSchema).optional()
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
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ssn: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  addressId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.lazy(() => AddressOrderByWithRelationInputSchema).optional(),
  deals: z.lazy(() => DealOrderByRelationAggregateInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventOrderByRelationAggregateInputSchema).optional(),
  meetings: z.lazy(() => MeetingOrderByRelationAggregateInputSchema).optional()
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
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  address: z.union([ z.lazy(() => AddressNullableRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealListRelationFilterSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional(),
  meetings: z.lazy(() => MeetingListRelationFilterSchema).optional()
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
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ssn: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  addressId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  addressId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const MeetingWhereInputSchema: z.ZodType<Prisma.MeetingWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MeetingWhereInputSchema),z.lazy(() => MeetingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MeetingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MeetingWhereInputSchema),z.lazy(() => MeetingWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const MeetingOrderByWithRelationInputSchema: z.ZodType<Prisma.MeetingOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const MeetingWhereUniqueInputSchema: z.ZodType<Prisma.MeetingWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => MeetingWhereInputSchema),z.lazy(() => MeetingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MeetingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MeetingWhereInputSchema),z.lazy(() => MeetingWhereInputSchema).array() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const MeetingOrderByWithAggregationInputSchema: z.ZodType<Prisma.MeetingOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MeetingCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MeetingAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MeetingMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MeetingMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MeetingSumOrderByAggregateInputSchema).optional()
}).strict();

export const MeetingScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MeetingScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MeetingScalarWhereWithAggregatesInputSchema),z.lazy(() => MeetingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MeetingScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MeetingScalarWhereWithAggregatesInputSchema),z.lazy(() => MeetingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  time: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProjectWhereInputSchema: z.ZodType<Prisma.ProjectWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProjectWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProjectWhereInputSchema),z.lazy(() => ProjectWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
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
  deals: z.lazy(() => DealListRelationFilterSchema).optional(),
  documents: z.lazy(() => DocumentListRelationFilterSchema).optional(),
  meetings: z.lazy(() => MeetingListRelationFilterSchema).optional(),
  pictures: z.lazy(() => PicturesListRelationFilterSchema).optional()
}).strict();

export const ProjectOrderByWithRelationInputSchema: z.ZodType<Prisma.ProjectOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
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
  deals: z.lazy(() => DealOrderByRelationAggregateInputSchema).optional(),
  documents: z.lazy(() => DocumentOrderByRelationAggregateInputSchema).optional(),
  meetings: z.lazy(() => MeetingOrderByRelationAggregateInputSchema).optional(),
  pictures: z.lazy(() => PicturesOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ProjectWhereUniqueInputSchema: z.ZodType<Prisma.ProjectWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string().cuid()
  }),
  z.object({
    id: z.number().int(),
    name: z.string(),
  }),
  z.object({
    id: z.number().int(),
    slug: z.string().cuid(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    name: z.string(),
    slug: z.string().cuid(),
  }),
  z.object({
    name: z.string(),
  }),
  z.object({
    slug: z.string().cuid(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
  slug: z.string().cuid().optional(),
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
  meetings: z.lazy(() => MeetingListRelationFilterSchema).optional(),
  pictures: z.lazy(() => PicturesListRelationFilterSchema).optional()
}).strict());

export const ProjectOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProjectOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
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
  slug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
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
  docusignTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  financingTypes: z.lazy(() => EnumDealFinancingTypeNullableListFilterSchema).optional(),
  documentType: z.union([ z.lazy(() => EnumDocumentTypeFilterSchema),z.lazy(() => DocumentTypeSchema) ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional()
}).strict();

export const DocumentOrderByWithRelationInputSchema: z.ZodType<Prisma.DocumentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  docusignTemplateId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  financingTypes: z.lazy(() => SortOrderSchema).optional(),
  documentType: z.lazy(() => SortOrderSchema).optional(),
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
  docusignTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  financingTypes: z.lazy(() => EnumDealFinancingTypeNullableListFilterSchema).optional(),
  documentType: z.union([ z.lazy(() => EnumDocumentTypeFilterSchema),z.lazy(() => DocumentTypeSchema) ]).optional(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  documentEvents: z.lazy(() => DocumentEventListRelationFilterSchema).optional()
}).strict());

export const DocumentOrderByWithAggregationInputSchema: z.ZodType<Prisma.DocumentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  docusignTemplateId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  financingTypes: z.lazy(() => SortOrderSchema).optional(),
  documentType: z.lazy(() => SortOrderSchema).optional(),
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
  docusignTemplateId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  projectId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  financingTypes: z.lazy(() => EnumDealFinancingTypeNullableListFilterSchema).optional(),
  documentType: z.union([ z.lazy(() => EnumDocumentTypeWithAggregatesFilterSchema),z.lazy(() => DocumentTypeSchema) ]).optional(),
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

export const DealWhereInputSchema: z.ZodType<Prisma.DealWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DealWhereInputSchema),z.lazy(() => DealWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealWhereInputSchema),z.lazy(() => DealWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  financingType: z.union([ z.lazy(() => EnumDealFinancingTypeNullableFilterSchema),z.lazy(() => DealFinancingTypeSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transactionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeNullableFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  numberAUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  numberCUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  coSignerEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  coSignerFullName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  verifierEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  verifierFullName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const DealOrderByWithRelationInputSchema: z.ZodType<Prisma.DealOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  numberAUnits: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  numberCUnits: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  coSignerEmail: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  coSignerFullName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  verifierEmail: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  verifierFullName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  project: z.lazy(() => ProjectOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
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
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  amount: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  financingType: z.union([ z.lazy(() => EnumDealFinancingTypeNullableFilterSchema),z.lazy(() => DealFinancingTypeSchema) ]).optional().nullable(),
  transactionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeNullableFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  numberAUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  numberCUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  coSignerEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  coSignerFullName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  verifierEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  verifierFullName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  project: z.union([ z.lazy(() => ProjectRelationFilterSchema),z.lazy(() => ProjectWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const DealOrderByWithAggregationInputSchema: z.ZodType<Prisma.DealOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  numberAUnits: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  numberCUnits: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  coSignerEmail: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  coSignerFullName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  verifierEmail: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  verifierFullName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  financingType: z.union([ z.lazy(() => EnumDealFinancingTypeNullableWithAggregatesFilterSchema),z.lazy(() => DealFinancingTypeSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  transactionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeNullableWithAggregatesFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  numberAUnits: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  numberCUnits: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  coSignerEmail: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  coSignerFullName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  verifierEmail: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  verifierFullName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
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
  User: z.lazy(() => UserListRelationFilterSchema).optional(),
  Contact: z.lazy(() => ContactListRelationFilterSchema).optional()
}).strict();

export const AddressOrderByWithRelationInputSchema: z.ZodType<Prisma.AddressOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  zipcode: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  User: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
  Contact: z.lazy(() => ContactOrderByRelationAggregateInputSchema).optional()
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
  User: z.lazy(() => UserListRelationFilterSchema).optional(),
  Contact: z.lazy(() => ContactListRelationFilterSchema).optional()
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

export const ContactWhereInputSchema: z.ZodType<Prisma.ContactWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContactWhereInputSchema),z.lazy(() => ContactWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactWhereInputSchema),z.lazy(() => ContactWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumContactTypeFilterSchema),z.lazy(() => ContactTypeSchema) ]).optional(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  address: z.union([ z.lazy(() => AddressNullableRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ContactOrderByWithRelationInputSchema: z.ZodType<Prisma.ContactOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ssn: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.lazy(() => AddressOrderByWithRelationInputSchema).optional()
}).strict();

export const ContactWhereUniqueInputSchema: z.ZodType<Prisma.ContactWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ContactWhereInputSchema),z.lazy(() => ContactWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactWhereInputSchema),z.lazy(() => ContactWhereInputSchema).array() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumContactTypeFilterSchema),z.lazy(() => ContactTypeSchema) ]).optional(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  address: z.union([ z.lazy(() => AddressNullableRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ContactOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContactOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ssn: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ContactCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ContactAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContactMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContactMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ContactSumOrderByAggregateInputSchema).optional()
}).strict();

export const ContactScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContactScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContactScalarWhereWithAggregatesInputSchema),z.lazy(() => ContactScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactScalarWhereWithAggregatesInputSchema),z.lazy(() => ContactScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumContactTypeWithAggregatesFilterSchema),z.lazy(() => ContactTypeSchema) ]).optional(),
  addressId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
  deals: z.lazy(() => DealCreateNestedManyWithoutUserInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  meetings: z.lazy(() => MeetingCreateNestedManyWithoutUserInputSchema).optional()
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
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  addressId: z.number().int().optional().nullable(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutUserNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUpdateManyWithoutUserNestedInputSchema).optional()
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
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
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
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  addressId: z.number().int().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MeetingCreateInputSchema: z.ZodType<Prisma.MeetingCreateInput> = z.object({
  url: z.string(),
  time: z.coerce.date(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutMeetingsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutMeetingsInputSchema)
}).strict();

export const MeetingUncheckedCreateInputSchema: z.ZodType<Prisma.MeetingUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  url: z.string(),
  userId: z.number().int(),
  projectId: z.number().int(),
  time: z.coerce.date()
}).strict();

export const MeetingUpdateInputSchema: z.ZodType<Prisma.MeetingUpdateInput> = z.object({
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutMeetingsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMeetingsNestedInputSchema).optional()
}).strict();

export const MeetingUncheckedUpdateInputSchema: z.ZodType<Prisma.MeetingUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MeetingCreateManyInputSchema: z.ZodType<Prisma.MeetingCreateManyInput> = z.object({
  id: z.number().int().optional(),
  url: z.string(),
  userId: z.number().int(),
  projectId: z.number().int(),
  time: z.coerce.date()
}).strict();

export const MeetingUpdateManyMutationInputSchema: z.ZodType<Prisma.MeetingUpdateManyMutationInput> = z.object({
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MeetingUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MeetingUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProjectCreateInputSchema: z.ZodType<Prisma.ProjectCreateInput> = z.object({
  name: z.string(),
  slug: z.string().cuid().optional(),
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
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  meetings: z.lazy(() => MeetingCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  slug: z.string().cuid().optional(),
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
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUpdateInputSchema: z.ZodType<Prisma.ProjectUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectCreateManyInputSchema: z.ZodType<Prisma.ProjectCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  slug: z.string().cuid().optional(),
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
  targetEquityMultiple: z.number().optional()
}).strict();

export const ProjectUpdateManyMutationInputSchema: z.ZodType<Prisma.ProjectUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
}).strict();

export const ProjectUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  docusignTemplateId: z.string().optional().nullable(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDocumentsInputSchema),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutDocumentInputSchema).optional()
}).strict();

export const DocumentUncheckedCreateInputSchema: z.ZodType<Prisma.DocumentUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  docusignTemplateId: z.string().optional().nullable(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutDocumentInputSchema).optional()
}).strict();

export const DocumentUpdateInputSchema: z.ZodType<Prisma.DocumentUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDocumentsNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutDocumentNestedInputSchema).optional()
}).strict();

export const DocumentUncheckedUpdateInputSchema: z.ZodType<Prisma.DocumentUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutDocumentNestedInputSchema).optional()
}).strict();

export const DocumentCreateManyInputSchema: z.ZodType<Prisma.DocumentCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  docusignTemplateId: z.string().optional().nullable(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional()
}).strict();

export const DocumentUpdateManyMutationInputSchema: z.ZodType<Prisma.DocumentUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DocumentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DocumentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
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

export const DealCreateInputSchema: z.ZodType<Prisma.DealCreateInput> = z.object({
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  coSignerEmail: z.string().optional().nullable(),
  coSignerFullName: z.string().optional().nullable(),
  verifierEmail: z.string().optional().nullable(),
  verifierFullName: z.string().optional().nullable(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutDealsInputSchema)
}).strict();

export const DealUncheckedCreateInputSchema: z.ZodType<Prisma.DealUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  userId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  coSignerEmail: z.string().optional().nullable(),
  coSignerFullName: z.string().optional().nullable(),
  verifierEmail: z.string().optional().nullable(),
  verifierFullName: z.string().optional().nullable()
}).strict();

export const DealUpdateInputSchema: z.ZodType<Prisma.DealUpdateInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDealsNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateInputSchema: z.ZodType<Prisma.DealUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealCreateManyInputSchema: z.ZodType<Prisma.DealCreateManyInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  userId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  coSignerEmail: z.string().optional().nullable(),
  coSignerFullName: z.string().optional().nullable(),
  verifierEmail: z.string().optional().nullable(),
  verifierFullName: z.string().optional().nullable()
}).strict();

export const DealUpdateManyMutationInputSchema: z.ZodType<Prisma.DealUpdateManyMutationInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AddressCreateInputSchema: z.ZodType<Prisma.AddressCreateInput> = z.object({
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  User: z.lazy(() => UserCreateNestedManyWithoutAddressInputSchema).optional(),
  Contact: z.lazy(() => ContactCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateInputSchema: z.ZodType<Prisma.AddressUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutAddressInputSchema).optional(),
  Contact: z.lazy(() => ContactUncheckedCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUpdateInputSchema: z.ZodType<Prisma.AddressUpdateInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateManyWithoutAddressNestedInputSchema).optional(),
  Contact: z.lazy(() => ContactUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutAddressNestedInputSchema).optional(),
  Contact: z.lazy(() => ContactUncheckedUpdateManyWithoutAddressNestedInputSchema).optional()
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

export const ContactCreateInputSchema: z.ZodType<Prisma.ContactCreateInput> = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.number().optional().nullable(),
  type: z.lazy(() => ContactTypeSchema),
  address: z.lazy(() => AddressCreateNestedOneWithoutContactInputSchema).optional()
}).strict();

export const ContactUncheckedCreateInputSchema: z.ZodType<Prisma.ContactUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.number().optional().nullable(),
  type: z.lazy(() => ContactTypeSchema),
  addressId: z.number().int().optional().nullable()
}).strict();

export const ContactUpdateInputSchema: z.ZodType<Prisma.ContactUpdateInput> = z.object({
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ContactTypeSchema),z.lazy(() => EnumContactTypeFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutContactNestedInputSchema).optional()
}).strict();

export const ContactUncheckedUpdateInputSchema: z.ZodType<Prisma.ContactUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ContactTypeSchema),z.lazy(() => EnumContactTypeFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContactCreateManyInputSchema: z.ZodType<Prisma.ContactCreateManyInput> = z.object({
  id: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.number().optional().nullable(),
  type: z.lazy(() => ContactTypeSchema),
  addressId: z.number().int().optional().nullable()
}).strict();

export const ContactUpdateManyMutationInputSchema: z.ZodType<Prisma.ContactUpdateManyMutationInput> = z.object({
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ContactTypeSchema),z.lazy(() => EnumContactTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContactUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContactUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ContactTypeSchema),z.lazy(() => EnumContactTypeFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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

export const AddressNullableRelationFilterSchema: z.ZodType<Prisma.AddressNullableRelationFilter> = z.object({
  is: z.lazy(() => AddressWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AddressWhereInputSchema).optional().nullable()
}).strict();

export const DealListRelationFilterSchema: z.ZodType<Prisma.DealListRelationFilter> = z.object({
  every: z.lazy(() => DealWhereInputSchema).optional(),
  some: z.lazy(() => DealWhereInputSchema).optional(),
  none: z.lazy(() => DealWhereInputSchema).optional()
}).strict();

export const DocumentEventListRelationFilterSchema: z.ZodType<Prisma.DocumentEventListRelationFilter> = z.object({
  every: z.lazy(() => DocumentEventWhereInputSchema).optional(),
  some: z.lazy(() => DocumentEventWhereInputSchema).optional(),
  none: z.lazy(() => DocumentEventWhereInputSchema).optional()
}).strict();

export const MeetingListRelationFilterSchema: z.ZodType<Prisma.MeetingListRelationFilter> = z.object({
  every: z.lazy(() => MeetingWhereInputSchema).optional(),
  some: z.lazy(() => MeetingWhereInputSchema).optional(),
  none: z.lazy(() => MeetingWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const DealOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DealOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentEventOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DocumentEventOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MeetingOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MeetingOrderByRelationAggregateInput> = z.object({
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
  title: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
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
  title: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
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
  title: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
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

export const ProjectRelationFilterSchema: z.ZodType<Prisma.ProjectRelationFilter> = z.object({
  is: z.lazy(() => ProjectWhereInputSchema).optional(),
  isNot: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const MeetingCountOrderByAggregateInputSchema: z.ZodType<Prisma.MeetingCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MeetingAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MeetingAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MeetingMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MeetingMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MeetingMinOrderByAggregateInputSchema: z.ZodType<Prisma.MeetingMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MeetingSumOrderByAggregateInputSchema: z.ZodType<Prisma.MeetingSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
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

export const DocumentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DocumentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PicturesOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PicturesOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
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
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional()
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
  slug: z.lazy(() => SortOrderSchema).optional(),
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
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProjectMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProjectMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
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
  targetEquityMultiple: z.lazy(() => SortOrderSchema).optional()
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
  docusignTemplateId: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  financingTypes: z.lazy(() => SortOrderSchema).optional(),
  documentType: z.lazy(() => SortOrderSchema).optional()
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
  docusignTemplateId: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  documentType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DocumentMinOrderByAggregateInputSchema: z.ZodType<Prisma.DocumentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  docusignTemplateId: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  documentType: z.lazy(() => SortOrderSchema).optional()
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

export const EnumDealFinancingTypeNullableFilterSchema: z.ZodType<Prisma.EnumDealFinancingTypeNullableFilter> = z.object({
  equals: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  in: z.lazy(() => DealFinancingTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealFinancingTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NestedEnumDealFinancingTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumDealOwnershipTypeNullableFilterSchema: z.ZodType<Prisma.EnumDealOwnershipTypeNullableFilter> = z.object({
  equals: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  in: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NestedEnumDealOwnershipTypeNullableFilterSchema) ]).optional().nullable(),
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

export const DealCountOrderByAggregateInputSchema: z.ZodType<Prisma.DealCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  ownershipTypeOtherValue: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  coSignerEmail: z.lazy(() => SortOrderSchema).optional(),
  coSignerFullName: z.lazy(() => SortOrderSchema).optional(),
  verifierEmail: z.lazy(() => SortOrderSchema).optional(),
  verifierFullName: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DealAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DealMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  ownershipTypeOtherValue: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  coSignerEmail: z.lazy(() => SortOrderSchema).optional(),
  coSignerFullName: z.lazy(() => SortOrderSchema).optional(),
  verifierEmail: z.lazy(() => SortOrderSchema).optional(),
  verifierFullName: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealMinOrderByAggregateInputSchema: z.ZodType<Prisma.DealMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  financingType: z.lazy(() => SortOrderSchema).optional(),
  hubspotId: z.lazy(() => SortOrderSchema).optional(),
  transactionId: z.lazy(() => SortOrderSchema).optional(),
  investmentEntity: z.lazy(() => SortOrderSchema).optional(),
  ownershipType: z.lazy(() => SortOrderSchema).optional(),
  ownershipTypeOtherValue: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional(),
  coSignerEmail: z.lazy(() => SortOrderSchema).optional(),
  coSignerFullName: z.lazy(() => SortOrderSchema).optional(),
  verifierEmail: z.lazy(() => SortOrderSchema).optional(),
  verifierFullName: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DealSumOrderByAggregateInputSchema: z.ZodType<Prisma.DealSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  projectId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  dealStage: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  numberAUnits: z.lazy(() => SortOrderSchema).optional(),
  numberCUnits: z.lazy(() => SortOrderSchema).optional()
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

export const EnumDealOwnershipTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDealOwnershipTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  in: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NestedEnumDealOwnershipTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealOwnershipTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealOwnershipTypeNullableFilterSchema).optional()
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

export const UserListRelationFilterSchema: z.ZodType<Prisma.UserListRelationFilter> = z.object({
  every: z.lazy(() => UserWhereInputSchema).optional(),
  some: z.lazy(() => UserWhereInputSchema).optional(),
  none: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ContactListRelationFilterSchema: z.ZodType<Prisma.ContactListRelationFilter> = z.object({
  every: z.lazy(() => ContactWhereInputSchema).optional(),
  some: z.lazy(() => ContactWhereInputSchema).optional(),
  none: z.lazy(() => ContactWhereInputSchema).optional()
}).strict();

export const UserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ContactOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
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

export const EnumContactTypeFilterSchema: z.ZodType<Prisma.EnumContactTypeFilter> = z.object({
  equals: z.lazy(() => ContactTypeSchema).optional(),
  in: z.lazy(() => ContactTypeSchema).array().optional(),
  notIn: z.lazy(() => ContactTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContactTypeSchema),z.lazy(() => NestedEnumContactTypeFilterSchema) ]).optional(),
}).strict();

export const ContactCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContactCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ContactAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContactMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContactMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactSumOrderByAggregateInputSchema: z.ZodType<Prisma.ContactSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  ssn: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumContactTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumContactTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ContactTypeSchema).optional(),
  in: z.lazy(() => ContactTypeSchema).array().optional(),
  notIn: z.lazy(() => ContactTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContactTypeSchema),z.lazy(() => NestedEnumContactTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumContactTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumContactTypeFilterSchema).optional()
}).strict();

export const AddressCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional()
}).strict();

export const DealCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DealCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutUserInputSchema),z.lazy(() => DealCreateWithoutUserInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutUserInputSchema),z.lazy(() => DealUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutUserInputSchema),z.lazy(() => DealCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocumentEventCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutUserInputSchema),z.lazy(() => DocumentEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MeetingCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MeetingCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => MeetingCreateWithoutUserInputSchema),z.lazy(() => MeetingCreateWithoutUserInputSchema).array(),z.lazy(() => MeetingUncheckedCreateWithoutUserInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MeetingCreateOrConnectWithoutUserInputSchema),z.lazy(() => MeetingCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MeetingCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DealUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DealUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutUserInputSchema),z.lazy(() => DealCreateWithoutUserInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutUserInputSchema),z.lazy(() => DealUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutUserInputSchema),z.lazy(() => DealCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DocumentEventUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DocumentEventCreateWithoutUserInputSchema),z.lazy(() => DocumentEventCreateWithoutUserInputSchema).array(),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema),z.lazy(() => DocumentEventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema),z.lazy(() => DocumentEventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DocumentEventCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DocumentEventWhereUniqueInputSchema),z.lazy(() => DocumentEventWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MeetingUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MeetingUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => MeetingCreateWithoutUserInputSchema),z.lazy(() => MeetingCreateWithoutUserInputSchema).array(),z.lazy(() => MeetingUncheckedCreateWithoutUserInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MeetingCreateOrConnectWithoutUserInputSchema),z.lazy(() => MeetingCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MeetingCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
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

export const AddressUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.AddressUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => AddressUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AddressUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => AddressUpdateWithoutUserInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const DealUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.DealUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutUserInputSchema),z.lazy(() => DealCreateWithoutUserInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutUserInputSchema),z.lazy(() => DealUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutUserInputSchema),z.lazy(() => DealCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DealUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DealUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => DealUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
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

export const MeetingUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MeetingUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => MeetingCreateWithoutUserInputSchema),z.lazy(() => MeetingCreateWithoutUserInputSchema).array(),z.lazy(() => MeetingUncheckedCreateWithoutUserInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MeetingCreateOrConnectWithoutUserInputSchema),z.lazy(() => MeetingCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MeetingUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MeetingUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MeetingCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MeetingUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MeetingUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MeetingUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => MeetingUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MeetingScalarWhereInputSchema),z.lazy(() => MeetingScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const DealUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => DealCreateWithoutUserInputSchema),z.lazy(() => DealCreateWithoutUserInputSchema).array(),z.lazy(() => DealUncheckedCreateWithoutUserInputSchema),z.lazy(() => DealUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DealCreateOrConnectWithoutUserInputSchema),z.lazy(() => DealCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DealUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DealUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DealCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DealWhereUniqueInputSchema),z.lazy(() => DealWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DealUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DealUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DealUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => DealUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
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

export const MeetingUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MeetingUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => MeetingCreateWithoutUserInputSchema),z.lazy(() => MeetingCreateWithoutUserInputSchema).array(),z.lazy(() => MeetingUncheckedCreateWithoutUserInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MeetingCreateOrConnectWithoutUserInputSchema),z.lazy(() => MeetingCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MeetingUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MeetingUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MeetingCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MeetingUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MeetingUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MeetingUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => MeetingUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MeetingScalarWhereInputSchema),z.lazy(() => MeetingScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProjectCreateNestedOneWithoutMeetingsInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutMeetingsInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutMeetingsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutMeetingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutMeetingsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutMeetingsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutMeetingsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMeetingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMeetingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMeetingsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const ProjectUpdateOneRequiredWithoutMeetingsNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutMeetingsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutMeetingsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutMeetingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutMeetingsInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutMeetingsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutMeetingsInputSchema),z.lazy(() => ProjectUpdateWithoutMeetingsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutMeetingsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutMeetingsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutMeetingsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMeetingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMeetingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMeetingsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutMeetingsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutMeetingsInputSchema),z.lazy(() => UserUpdateWithoutMeetingsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMeetingsInputSchema) ]).optional(),
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

export const MeetingCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.MeetingCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => MeetingCreateWithoutProjectInputSchema),z.lazy(() => MeetingCreateWithoutProjectInputSchema).array(),z.lazy(() => MeetingUncheckedCreateWithoutProjectInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MeetingCreateOrConnectWithoutProjectInputSchema),z.lazy(() => MeetingCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MeetingCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PicturesCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.PicturesCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => PicturesCreateWithoutProjectInputSchema),z.lazy(() => PicturesCreateWithoutProjectInputSchema).array(),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema),z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PicturesCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
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

export const MeetingUncheckedCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.MeetingUncheckedCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => MeetingCreateWithoutProjectInputSchema),z.lazy(() => MeetingCreateWithoutProjectInputSchema).array(),z.lazy(() => MeetingUncheckedCreateWithoutProjectInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MeetingCreateOrConnectWithoutProjectInputSchema),z.lazy(() => MeetingCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MeetingCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PicturesUncheckedCreateNestedManyWithoutProjectInputSchema: z.ZodType<Prisma.PicturesUncheckedCreateNestedManyWithoutProjectInput> = z.object({
  create: z.union([ z.lazy(() => PicturesCreateWithoutProjectInputSchema),z.lazy(() => PicturesCreateWithoutProjectInputSchema).array(),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema),z.lazy(() => PicturesUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema),z.lazy(() => PicturesCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PicturesCreateManyProjectInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PicturesWhereUniqueInputSchema),z.lazy(() => PicturesWhereUniqueInputSchema).array() ]).optional(),
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

export const MeetingUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.MeetingUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => MeetingCreateWithoutProjectInputSchema),z.lazy(() => MeetingCreateWithoutProjectInputSchema).array(),z.lazy(() => MeetingUncheckedCreateWithoutProjectInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MeetingCreateOrConnectWithoutProjectInputSchema),z.lazy(() => MeetingCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MeetingUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => MeetingUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MeetingCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MeetingUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => MeetingUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MeetingUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => MeetingUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MeetingScalarWhereInputSchema),z.lazy(() => MeetingScalarWhereInputSchema).array() ]).optional(),
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

export const MeetingUncheckedUpdateManyWithoutProjectNestedInputSchema: z.ZodType<Prisma.MeetingUncheckedUpdateManyWithoutProjectNestedInput> = z.object({
  create: z.union([ z.lazy(() => MeetingCreateWithoutProjectInputSchema),z.lazy(() => MeetingCreateWithoutProjectInputSchema).array(),z.lazy(() => MeetingUncheckedCreateWithoutProjectInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutProjectInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MeetingCreateOrConnectWithoutProjectInputSchema),z.lazy(() => MeetingCreateOrConnectWithoutProjectInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MeetingUpsertWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => MeetingUpsertWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MeetingCreateManyProjectInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MeetingWhereUniqueInputSchema),z.lazy(() => MeetingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MeetingUpdateWithWhereUniqueWithoutProjectInputSchema),z.lazy(() => MeetingUpdateWithWhereUniqueWithoutProjectInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MeetingUpdateManyWithWhereWithoutProjectInputSchema),z.lazy(() => MeetingUpdateManyWithWhereWithoutProjectInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MeetingScalarWhereInputSchema),z.lazy(() => MeetingScalarWhereInputSchema).array() ]).optional(),
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

export const ProjectCreateNestedOneWithoutDealsInputSchema: z.ZodType<Prisma.ProjectCreateNestedOneWithoutDealsInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutDealsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDealsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDealsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumDealFinancingTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DealFinancingTypeSchema).optional().nullable()
}).strict();

export const NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumDealOwnershipTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DealOwnershipTypeSchema).optional().nullable()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ProjectUpdateOneRequiredWithoutDealsNestedInputSchema: z.ZodType<Prisma.ProjectUpdateOneRequiredWithoutDealsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProjectCreateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProjectCreateOrConnectWithoutDealsInputSchema).optional(),
  upsert: z.lazy(() => ProjectUpsertWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => ProjectWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProjectUpdateToOneWithWhereWithoutDealsInputSchema),z.lazy(() => ProjectUpdateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutDealsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutDealsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDealsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDealsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDealsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDealsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutDealsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutDealsInputSchema),z.lazy(() => UserUpdateWithoutDealsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDealsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserCreateWithoutAddressInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema),z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContactCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.ContactCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => ContactCreateWithoutAddressInputSchema),z.lazy(() => ContactCreateWithoutAddressInputSchema).array(),z.lazy(() => ContactUncheckedCreateWithoutAddressInputSchema),z.lazy(() => ContactUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactCreateOrConnectWithoutAddressInputSchema),z.lazy(() => ContactCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserCreateWithoutAddressInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema),z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContactUncheckedCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.ContactUncheckedCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => ContactCreateWithoutAddressInputSchema),z.lazy(() => ContactCreateWithoutAddressInputSchema).array(),z.lazy(() => ContactUncheckedCreateWithoutAddressInputSchema),z.lazy(() => ContactUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactCreateOrConnectWithoutAddressInputSchema),z.lazy(() => ContactCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
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

export const ContactUpdateManyWithoutAddressNestedInputSchema: z.ZodType<Prisma.ContactUpdateManyWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContactCreateWithoutAddressInputSchema),z.lazy(() => ContactCreateWithoutAddressInputSchema).array(),z.lazy(() => ContactUncheckedCreateWithoutAddressInputSchema),z.lazy(() => ContactUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactCreateOrConnectWithoutAddressInputSchema),z.lazy(() => ContactCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContactUpsertWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => ContactUpsertWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactCreateManyAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContactUpdateWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => ContactUpdateWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContactUpdateManyWithWhereWithoutAddressInputSchema),z.lazy(() => ContactUpdateManyWithWhereWithoutAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContactScalarWhereInputSchema),z.lazy(() => ContactScalarWhereInputSchema).array() ]).optional(),
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

export const ContactUncheckedUpdateManyWithoutAddressNestedInputSchema: z.ZodType<Prisma.ContactUncheckedUpdateManyWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContactCreateWithoutAddressInputSchema),z.lazy(() => ContactCreateWithoutAddressInputSchema).array(),z.lazy(() => ContactUncheckedCreateWithoutAddressInputSchema),z.lazy(() => ContactUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactCreateOrConnectWithoutAddressInputSchema),z.lazy(() => ContactCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContactUpsertWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => ContactUpsertWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactCreateManyAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContactWhereUniqueInputSchema),z.lazy(() => ContactWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContactUpdateWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => ContactUpdateWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContactUpdateManyWithWhereWithoutAddressInputSchema),z.lazy(() => ContactUpdateManyWithWhereWithoutAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContactScalarWhereInputSchema),z.lazy(() => ContactScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AddressCreateNestedOneWithoutContactInputSchema: z.ZodType<Prisma.AddressCreateNestedOneWithoutContactInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutContactInputSchema),z.lazy(() => AddressUncheckedCreateWithoutContactInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutContactInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional()
}).strict();

export const EnumContactTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumContactTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ContactTypeSchema).optional()
}).strict();

export const AddressUpdateOneWithoutContactNestedInputSchema: z.ZodType<Prisma.AddressUpdateOneWithoutContactNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutContactInputSchema),z.lazy(() => AddressUncheckedCreateWithoutContactInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutContactInputSchema).optional(),
  upsert: z.lazy(() => AddressUpsertWithoutContactInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AddressUpdateToOneWithWhereWithoutContactInputSchema),z.lazy(() => AddressUpdateWithoutContactInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutContactInputSchema) ]).optional(),
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

export const NestedEnumDealOwnershipTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDealOwnershipTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  in: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => DealOwnershipTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NestedEnumDealOwnershipTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDealOwnershipTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDealOwnershipTypeNullableFilterSchema).optional()
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

export const NestedEnumContactTypeFilterSchema: z.ZodType<Prisma.NestedEnumContactTypeFilter> = z.object({
  equals: z.lazy(() => ContactTypeSchema).optional(),
  in: z.lazy(() => ContactTypeSchema).array().optional(),
  notIn: z.lazy(() => ContactTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContactTypeSchema),z.lazy(() => NestedEnumContactTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumContactTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumContactTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ContactTypeSchema).optional(),
  in: z.lazy(() => ContactTypeSchema).array().optional(),
  notIn: z.lazy(() => ContactTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContactTypeSchema),z.lazy(() => NestedEnumContactTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumContactTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumContactTypeFilterSchema).optional()
}).strict();

export const AddressCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateWithoutUserInput> = z.object({
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  Contact: z.lazy(() => ContactCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  Contact: z.lazy(() => ContactUncheckedCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema),z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const DealCreateWithoutUserInputSchema: z.ZodType<Prisma.DealCreateWithoutUserInput> = z.object({
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  coSignerEmail: z.string().optional().nullable(),
  coSignerFullName: z.string().optional().nullable(),
  verifierEmail: z.string().optional().nullable(),
  verifierFullName: z.string().optional().nullable(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDealsInputSchema)
}).strict();

export const DealUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  coSignerEmail: z.string().optional().nullable(),
  coSignerFullName: z.string().optional().nullable(),
  verifierEmail: z.string().optional().nullable(),
  verifierFullName: z.string().optional().nullable()
}).strict();

export const DealCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.DealCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DealCreateWithoutUserInputSchema),z.lazy(() => DealUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const DealCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.DealCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DealCreateManyUserInputSchema),z.lazy(() => DealCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
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

export const MeetingCreateWithoutUserInputSchema: z.ZodType<Prisma.MeetingCreateWithoutUserInput> = z.object({
  url: z.string(),
  time: z.coerce.date(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutMeetingsInputSchema)
}).strict();

export const MeetingUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.MeetingUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  url: z.string(),
  projectId: z.number().int(),
  time: z.coerce.date()
}).strict();

export const MeetingCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.MeetingCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => MeetingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MeetingCreateWithoutUserInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const MeetingCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.MeetingCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MeetingCreateManyUserInputSchema),z.lazy(() => MeetingCreateManyUserInputSchema).array() ]),
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
  Contact: z.lazy(() => ContactUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Contact: z.lazy(() => ContactUncheckedUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const DealUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.DealUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DealUpdateWithoutUserInputSchema),z.lazy(() => DealUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => DealCreateWithoutUserInputSchema),z.lazy(() => DealUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const DealUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.DealUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => DealWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DealUpdateWithoutUserInputSchema),z.lazy(() => DealUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const DealUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.DealUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => DealScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DealUpdateManyMutationInputSchema),z.lazy(() => DealUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const DealScalarWhereInputSchema: z.ZodType<Prisma.DealScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DealScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DealScalarWhereInputSchema),z.lazy(() => DealScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  financingType: z.union([ z.lazy(() => EnumDealFinancingTypeNullableFilterSchema),z.lazy(() => DealFinancingTypeSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  transactionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investmentEntity: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownershipType: z.union([ z.lazy(() => EnumDealOwnershipTypeNullableFilterSchema),z.lazy(() => DealOwnershipTypeSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  numberAUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  numberCUnits: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  coSignerEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  coSignerFullName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  verifierEmail: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  verifierFullName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
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

export const MeetingUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MeetingUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => MeetingWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MeetingUpdateWithoutUserInputSchema),z.lazy(() => MeetingUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => MeetingCreateWithoutUserInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const MeetingUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MeetingUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => MeetingWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MeetingUpdateWithoutUserInputSchema),z.lazy(() => MeetingUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const MeetingUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.MeetingUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => MeetingScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MeetingUpdateManyMutationInputSchema),z.lazy(() => MeetingUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const MeetingScalarWhereInputSchema: z.ZodType<Prisma.MeetingScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MeetingScalarWhereInputSchema),z.lazy(() => MeetingScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MeetingScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MeetingScalarWhereInputSchema),z.lazy(() => MeetingScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProjectCreateWithoutMeetingsInputSchema: z.ZodType<Prisma.ProjectCreateWithoutMeetingsInput> = z.object({
  name: z.string(),
  slug: z.string().cuid().optional(),
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
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutMeetingsInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutMeetingsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  slug: z.string().cuid().optional(),
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
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutMeetingsInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutMeetingsInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutMeetingsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutMeetingsInputSchema) ]),
}).strict();

export const UserCreateWithoutMeetingsInputSchema: z.ZodType<Prisma.UserCreateWithoutMeetingsInput> = z.object({
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
  deals: z.lazy(() => DealCreateNestedManyWithoutUserInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutMeetingsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutMeetingsInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  addressId: z.number().int().optional().nullable(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutMeetingsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutMeetingsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutMeetingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMeetingsInputSchema) ]),
}).strict();

export const ProjectUpsertWithoutMeetingsInputSchema: z.ZodType<Prisma.ProjectUpsertWithoutMeetingsInput> = z.object({
  update: z.union([ z.lazy(() => ProjectUpdateWithoutMeetingsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutMeetingsInputSchema) ]),
  create: z.union([ z.lazy(() => ProjectCreateWithoutMeetingsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutMeetingsInputSchema) ]),
  where: z.lazy(() => ProjectWhereInputSchema).optional()
}).strict();

export const ProjectUpdateToOneWithWhereWithoutMeetingsInputSchema: z.ZodType<Prisma.ProjectUpdateToOneWithWhereWithoutMeetingsInput> = z.object({
  where: z.lazy(() => ProjectWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProjectUpdateWithoutMeetingsInputSchema),z.lazy(() => ProjectUncheckedUpdateWithoutMeetingsInputSchema) ]),
}).strict();

export const ProjectUpdateWithoutMeetingsInputSchema: z.ZodType<Prisma.ProjectUpdateWithoutMeetingsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutMeetingsInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutMeetingsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutMeetingsInputSchema: z.ZodType<Prisma.UserUpsertWithoutMeetingsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutMeetingsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMeetingsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutMeetingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMeetingsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutMeetingsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutMeetingsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutMeetingsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMeetingsInputSchema) ]),
}).strict();

export const UserUpdateWithoutMeetingsInputSchema: z.ZodType<Prisma.UserUpdateWithoutMeetingsInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutUserNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutMeetingsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutMeetingsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const DealCreateWithoutProjectInputSchema: z.ZodType<Prisma.DealCreateWithoutProjectInput> = z.object({
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  coSignerEmail: z.string().optional().nullable(),
  coSignerFullName: z.string().optional().nullable(),
  verifierEmail: z.string().optional().nullable(),
  verifierFullName: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutDealsInputSchema)
}).strict();

export const DealUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.DealUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  coSignerEmail: z.string().optional().nullable(),
  coSignerFullName: z.string().optional().nullable(),
  verifierEmail: z.string().optional().nullable(),
  verifierFullName: z.string().optional().nullable()
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
  docusignTemplateId: z.string().optional().nullable(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutDocumentInputSchema).optional()
}).strict();

export const DocumentUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  docusignTemplateId: z.string().optional().nullable(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
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

export const MeetingCreateWithoutProjectInputSchema: z.ZodType<Prisma.MeetingCreateWithoutProjectInput> = z.object({
  url: z.string(),
  time: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutMeetingsInputSchema)
}).strict();

export const MeetingUncheckedCreateWithoutProjectInputSchema: z.ZodType<Prisma.MeetingUncheckedCreateWithoutProjectInput> = z.object({
  id: z.number().int().optional(),
  url: z.string(),
  userId: z.number().int(),
  time: z.coerce.date()
}).strict();

export const MeetingCreateOrConnectWithoutProjectInputSchema: z.ZodType<Prisma.MeetingCreateOrConnectWithoutProjectInput> = z.object({
  where: z.lazy(() => MeetingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MeetingCreateWithoutProjectInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const MeetingCreateManyProjectInputEnvelopeSchema: z.ZodType<Prisma.MeetingCreateManyProjectInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MeetingCreateManyProjectInputSchema),z.lazy(() => MeetingCreateManyProjectInputSchema).array() ]),
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
  docusignTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  projectId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dealStage: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  financingTypes: z.lazy(() => EnumDealFinancingTypeNullableListFilterSchema).optional(),
  documentType: z.union([ z.lazy(() => EnumDocumentTypeFilterSchema),z.lazy(() => DocumentTypeSchema) ]).optional(),
}).strict();

export const MeetingUpsertWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.MeetingUpsertWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => MeetingWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MeetingUpdateWithoutProjectInputSchema),z.lazy(() => MeetingUncheckedUpdateWithoutProjectInputSchema) ]),
  create: z.union([ z.lazy(() => MeetingCreateWithoutProjectInputSchema),z.lazy(() => MeetingUncheckedCreateWithoutProjectInputSchema) ]),
}).strict();

export const MeetingUpdateWithWhereUniqueWithoutProjectInputSchema: z.ZodType<Prisma.MeetingUpdateWithWhereUniqueWithoutProjectInput> = z.object({
  where: z.lazy(() => MeetingWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MeetingUpdateWithoutProjectInputSchema),z.lazy(() => MeetingUncheckedUpdateWithoutProjectInputSchema) ]),
}).strict();

export const MeetingUpdateManyWithWhereWithoutProjectInputSchema: z.ZodType<Prisma.MeetingUpdateManyWithWhereWithoutProjectInput> = z.object({
  where: z.lazy(() => MeetingScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MeetingUpdateManyMutationInputSchema),z.lazy(() => MeetingUncheckedUpdateManyWithoutProjectInputSchema) ]),
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

export const ProjectCreateWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectCreateWithoutPicturesInput> = z.object({
  name: z.string(),
  slug: z.string().cuid().optional(),
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
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  meetings: z.lazy(() => MeetingCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutPicturesInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  slug: z.string().cuid().optional(),
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
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedCreateNestedManyWithoutProjectInputSchema).optional()
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
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutPicturesInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutPicturesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  documents: z.lazy(() => DocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectCreateWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectCreateWithoutDocumentsInput> = z.object({
  name: z.string(),
  slug: z.string().cuid().optional(),
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
  deals: z.lazy(() => DealCreateNestedManyWithoutProjectInputSchema).optional(),
  meetings: z.lazy(() => MeetingCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutDocumentsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  slug: z.string().cuid().optional(),
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
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedCreateNestedManyWithoutProjectInputSchema).optional()
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
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  deals: z.lazy(() => DealUpdateManyWithoutProjectNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutDocumentsInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutDocumentsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedUpdateManyWithoutProjectNestedInputSchema).optional()
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
  docusignTemplateId: z.string().optional().nullable(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional(),
  project: z.lazy(() => ProjectCreateNestedOneWithoutDocumentsInputSchema)
}).strict();

export const DocumentUncheckedCreateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.DocumentUncheckedCreateWithoutDocumentEventsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  docusignTemplateId: z.string().optional().nullable(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional()
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
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
  deals: z.lazy(() => DealCreateNestedManyWithoutUserInputSchema).optional(),
  meetings: z.lazy(() => MeetingCreateNestedManyWithoutUserInputSchema).optional()
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
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  addressId: z.number().int().optional().nullable(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedCreateNestedManyWithoutUserInputSchema).optional()
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
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDocumentsNestedInputSchema).optional()
}).strict();

export const DocumentUncheckedUpdateWithoutDocumentEventsInputSchema: z.ZodType<Prisma.DocumentUncheckedUpdateWithoutDocumentEventsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
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
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
  deals: z.lazy(() => DealUpdateManyWithoutUserNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUpdateManyWithoutUserNestedInputSchema).optional()
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
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ProjectCreateWithoutDealsInputSchema: z.ZodType<Prisma.ProjectCreateWithoutDealsInput> = z.object({
  name: z.string(),
  slug: z.string().cuid().optional(),
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
  documents: z.lazy(() => DocumentCreateNestedManyWithoutProjectInputSchema).optional(),
  meetings: z.lazy(() => MeetingCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectUncheckedCreateWithoutDealsInputSchema: z.ZodType<Prisma.ProjectUncheckedCreateWithoutDealsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  slug: z.string().cuid().optional(),
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
  documents: z.lazy(() => DocumentUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedCreateNestedManyWithoutProjectInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedCreateNestedManyWithoutProjectInputSchema).optional()
}).strict();

export const ProjectCreateOrConnectWithoutDealsInputSchema: z.ZodType<Prisma.ProjectCreateOrConnectWithoutDealsInput> = z.object({
  where: z.lazy(() => ProjectWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProjectCreateWithoutDealsInputSchema),z.lazy(() => ProjectUncheckedCreateWithoutDealsInputSchema) ]),
}).strict();

export const UserCreateWithoutDealsInputSchema: z.ZodType<Prisma.UserCreateWithoutDealsInput> = z.object({
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  meetings: z.lazy(() => MeetingCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutDealsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDealsInput> = z.object({
  id: z.number().int().optional(),
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  addressId: z.number().int().optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutDealsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDealsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutDealsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDealsInputSchema) ]),
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
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  documents: z.lazy(() => DocumentUpdateManyWithoutProjectNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const ProjectUncheckedUpdateWithoutDealsInputSchema: z.ZodType<Prisma.ProjectUncheckedUpdateWithoutDealsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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
  documents: z.lazy(() => DocumentUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedUpdateManyWithoutProjectNestedInputSchema).optional(),
  pictures: z.lazy(() => PicturesUncheckedUpdateManyWithoutProjectNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutDealsInputSchema: z.ZodType<Prisma.UserUpsertWithoutDealsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutDealsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDealsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutDealsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDealsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutDealsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDealsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutDealsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDealsInputSchema) ]),
}).strict();

export const UserUpdateWithoutDealsInputSchema: z.ZodType<Prisma.UserUpdateWithoutDealsInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutDealsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDealsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateWithoutAddressInput> = z.object({
  clerkId: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional().nullable(),
  hubspotId: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  deals: z.lazy(() => DealCreateNestedManyWithoutUserInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventCreateNestedManyWithoutUserInputSchema).optional(),
  meetings: z.lazy(() => MeetingCreateNestedManyWithoutUserInputSchema).optional()
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
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable(),
  deals: z.lazy(() => DealUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAddressInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema),z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const UserCreateManyAddressInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyAddressInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserCreateManyAddressInputSchema),z.lazy(() => UserCreateManyAddressInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ContactCreateWithoutAddressInputSchema: z.ZodType<Prisma.ContactCreateWithoutAddressInput> = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.number().optional().nullable(),
  type: z.lazy(() => ContactTypeSchema)
}).strict();

export const ContactUncheckedCreateWithoutAddressInputSchema: z.ZodType<Prisma.ContactUncheckedCreateWithoutAddressInput> = z.object({
  id: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.number().optional().nullable(),
  type: z.lazy(() => ContactTypeSchema)
}).strict();

export const ContactCreateOrConnectWithoutAddressInputSchema: z.ZodType<Prisma.ContactCreateOrConnectWithoutAddressInput> = z.object({
  where: z.lazy(() => ContactWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContactCreateWithoutAddressInputSchema),z.lazy(() => ContactUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const ContactCreateManyAddressInputEnvelopeSchema: z.ZodType<Prisma.ContactCreateManyAddressInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContactCreateManyAddressInputSchema),z.lazy(() => ContactCreateManyAddressInputSchema).array() ]),
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
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const ContactUpsertWithWhereUniqueWithoutAddressInputSchema: z.ZodType<Prisma.ContactUpsertWithWhereUniqueWithoutAddressInput> = z.object({
  where: z.lazy(() => ContactWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContactUpdateWithoutAddressInputSchema),z.lazy(() => ContactUncheckedUpdateWithoutAddressInputSchema) ]),
  create: z.union([ z.lazy(() => ContactCreateWithoutAddressInputSchema),z.lazy(() => ContactUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const ContactUpdateWithWhereUniqueWithoutAddressInputSchema: z.ZodType<Prisma.ContactUpdateWithWhereUniqueWithoutAddressInput> = z.object({
  where: z.lazy(() => ContactWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContactUpdateWithoutAddressInputSchema),z.lazy(() => ContactUncheckedUpdateWithoutAddressInputSchema) ]),
}).strict();

export const ContactUpdateManyWithWhereWithoutAddressInputSchema: z.ZodType<Prisma.ContactUpdateManyWithWhereWithoutAddressInput> = z.object({
  where: z.lazy(() => ContactScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContactUpdateManyMutationInputSchema),z.lazy(() => ContactUncheckedUpdateManyWithoutAddressInputSchema) ]),
}).strict();

export const ContactScalarWhereInputSchema: z.ZodType<Prisma.ContactScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContactScalarWhereInputSchema),z.lazy(() => ContactScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactScalarWhereInputSchema),z.lazy(() => ContactScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  ssn: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumContactTypeFilterSchema),z.lazy(() => ContactTypeSchema) ]).optional(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const AddressCreateWithoutContactInputSchema: z.ZodType<Prisma.AddressCreateWithoutContactInput> = z.object({
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  User: z.lazy(() => UserCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateWithoutContactInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutContactInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  city: z.string(),
  zipcode: z.string(),
  state: z.string(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressCreateOrConnectWithoutContactInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutContactInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutContactInputSchema),z.lazy(() => AddressUncheckedCreateWithoutContactInputSchema) ]),
}).strict();

export const AddressUpsertWithoutContactInputSchema: z.ZodType<Prisma.AddressUpsertWithoutContactInput> = z.object({
  update: z.union([ z.lazy(() => AddressUpdateWithoutContactInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutContactInputSchema) ]),
  create: z.union([ z.lazy(() => AddressCreateWithoutContactInputSchema),z.lazy(() => AddressUncheckedCreateWithoutContactInputSchema) ]),
  where: z.lazy(() => AddressWhereInputSchema).optional()
}).strict();

export const AddressUpdateToOneWithWhereWithoutContactInputSchema: z.ZodType<Prisma.AddressUpdateToOneWithWhereWithoutContactInput> = z.object({
  where: z.lazy(() => AddressWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AddressUpdateWithoutContactInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutContactInputSchema) ]),
}).strict();

export const AddressUpdateWithoutContactInputSchema: z.ZodType<Prisma.AddressUpdateWithoutContactInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateWithoutContactInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutContactInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zipcode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const DealCreateManyUserInputSchema: z.ZodType<Prisma.DealCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  projectId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  coSignerEmail: z.string().optional().nullable(),
  coSignerFullName: z.string().optional().nullable(),
  verifierEmail: z.string().optional().nullable(),
  verifierFullName: z.string().optional().nullable()
}).strict();

export const DocumentEventCreateManyUserInputSchema: z.ZodType<Prisma.DocumentEventCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  documentId: z.number().int(),
  date: z.coerce.date(),
  type: z.lazy(() => DocumentEventTypeSchema)
}).strict();

export const MeetingCreateManyUserInputSchema: z.ZodType<Prisma.MeetingCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  url: z.string(),
  projectId: z.number().int(),
  time: z.coerce.date()
}).strict();

export const DealUpdateWithoutUserInputSchema: z.ZodType<Prisma.DealUpdateWithoutUserInput> = z.object({
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutDealsNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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

export const MeetingUpdateWithoutUserInputSchema: z.ZodType<Prisma.MeetingUpdateWithoutUserInput> = z.object({
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  project: z.lazy(() => ProjectUpdateOneRequiredWithoutMeetingsNestedInputSchema).optional()
}).strict();

export const MeetingUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.MeetingUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MeetingUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.MeetingUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  projectId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DealCreateManyProjectInputSchema: z.ZodType<Prisma.DealCreateManyProjectInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  dealStage: z.number().int(),
  amount: z.number().int(),
  financingType: z.lazy(() => DealFinancingTypeSchema).optional().nullable(),
  hubspotId: z.string(),
  transactionId: z.string().optional(),
  investmentEntity: z.string(),
  ownershipType: z.lazy(() => DealOwnershipTypeSchema).optional().nullable(),
  ownershipTypeOtherValue: z.string().optional().nullable(),
  numberAUnits: z.number().optional().nullable(),
  numberCUnits: z.number().optional().nullable(),
  coSignerEmail: z.string().optional().nullable(),
  coSignerFullName: z.string().optional().nullable(),
  verifierEmail: z.string().optional().nullable(),
  verifierFullName: z.string().optional().nullable()
}).strict();

export const DocumentCreateManyProjectInputSchema: z.ZodType<Prisma.DocumentCreateManyProjectInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  fileName: z.string(),
  description: z.string().optional().nullable(),
  link: z.string(),
  docusignTemplateId: z.string().optional().nullable(),
  dealStage: z.number().int(),
  financingTypes: z.union([ z.lazy(() => DocumentCreatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.lazy(() => DocumentTypeSchema).optional()
}).strict();

export const MeetingCreateManyProjectInputSchema: z.ZodType<Prisma.MeetingCreateManyProjectInput> = z.object({
  id: z.number().int().optional(),
  url: z.string(),
  userId: z.number().int(),
  time: z.coerce.date()
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
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutDealsNestedInputSchema).optional()
}).strict();

export const DealUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.DealUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DealUncheckedUpdateManyWithoutProjectInputSchema: z.ZodType<Prisma.DealUncheckedUpdateManyWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingType: z.union([ z.lazy(() => DealFinancingTypeSchema),z.lazy(() => NullableEnumDealFinancingTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  transactionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investmentEntity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownershipType: z.union([ z.lazy(() => DealOwnershipTypeSchema),z.lazy(() => NullableEnumDealOwnershipTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownershipTypeOtherValue: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberAUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  numberCUnits: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coSignerFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  verifierFullName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DocumentUpdateWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUpdateWithoutProjectInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutDocumentNestedInputSchema).optional()
}).strict();

export const DocumentUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutDocumentNestedInputSchema).optional()
}).strict();

export const DocumentUncheckedUpdateManyWithoutProjectInputSchema: z.ZodType<Prisma.DocumentUncheckedUpdateManyWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  link: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  docusignTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dealStage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  financingTypes: z.union([ z.lazy(() => DocumentUpdatefinancingTypesInputSchema),z.lazy(() => DealFinancingTypeSchema).array() ]).optional(),
  documentType: z.union([ z.lazy(() => DocumentTypeSchema),z.lazy(() => EnumDocumentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MeetingUpdateWithoutProjectInputSchema: z.ZodType<Prisma.MeetingUpdateWithoutProjectInput> = z.object({
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMeetingsNestedInputSchema).optional()
}).strict();

export const MeetingUncheckedUpdateWithoutProjectInputSchema: z.ZodType<Prisma.MeetingUncheckedUpdateWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MeetingUncheckedUpdateManyWithoutProjectInputSchema: z.ZodType<Prisma.MeetingUncheckedUpdateManyWithoutProjectInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
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
  title: z.string().optional().nullable(),
  ssn: z.string().optional().nullable()
}).strict();

export const ContactCreateManyAddressInputSchema: z.ZodType<Prisma.ContactCreateManyAddressInput> = z.object({
  id: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  title: z.string().optional().nullable(),
  ssn: z.number().optional().nullable(),
  type: z.lazy(() => ContactTypeSchema)
}).strict();

export const UserUpdateWithoutAddressInputSchema: z.ZodType<Prisma.UserUpdateWithoutAddressInput> = z.object({
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hubspotId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUpdateManyWithoutUserNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUpdateManyWithoutUserNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUpdateManyWithoutUserNestedInputSchema).optional()
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
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  deals: z.lazy(() => DealUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  documentEvents: z.lazy(() => DocumentEventUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  meetings: z.lazy(() => MeetingUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
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
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContactUpdateWithoutAddressInputSchema: z.ZodType<Prisma.ContactUpdateWithoutAddressInput> = z.object({
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ContactTypeSchema),z.lazy(() => EnumContactTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContactUncheckedUpdateWithoutAddressInputSchema: z.ZodType<Prisma.ContactUncheckedUpdateWithoutAddressInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ContactTypeSchema),z.lazy(() => EnumContactTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContactUncheckedUpdateManyWithoutAddressInputSchema: z.ZodType<Prisma.ContactUncheckedUpdateManyWithoutAddressInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ssn: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ContactTypeSchema),z.lazy(() => EnumContactTypeFieldUpdateOperationsInputSchema) ]).optional(),
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

export const MeetingFindFirstArgsSchema: z.ZodType<Prisma.MeetingFindFirstArgs> = z.object({
  select: MeetingSelectSchema.optional(),
  include: MeetingIncludeSchema.optional(),
  where: MeetingWhereInputSchema.optional(),
  orderBy: z.union([ MeetingOrderByWithRelationInputSchema.array(),MeetingOrderByWithRelationInputSchema ]).optional(),
  cursor: MeetingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MeetingScalarFieldEnumSchema,MeetingScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MeetingFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MeetingFindFirstOrThrowArgs> = z.object({
  select: MeetingSelectSchema.optional(),
  include: MeetingIncludeSchema.optional(),
  where: MeetingWhereInputSchema.optional(),
  orderBy: z.union([ MeetingOrderByWithRelationInputSchema.array(),MeetingOrderByWithRelationInputSchema ]).optional(),
  cursor: MeetingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MeetingScalarFieldEnumSchema,MeetingScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MeetingFindManyArgsSchema: z.ZodType<Prisma.MeetingFindManyArgs> = z.object({
  select: MeetingSelectSchema.optional(),
  include: MeetingIncludeSchema.optional(),
  where: MeetingWhereInputSchema.optional(),
  orderBy: z.union([ MeetingOrderByWithRelationInputSchema.array(),MeetingOrderByWithRelationInputSchema ]).optional(),
  cursor: MeetingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MeetingScalarFieldEnumSchema,MeetingScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MeetingAggregateArgsSchema: z.ZodType<Prisma.MeetingAggregateArgs> = z.object({
  where: MeetingWhereInputSchema.optional(),
  orderBy: z.union([ MeetingOrderByWithRelationInputSchema.array(),MeetingOrderByWithRelationInputSchema ]).optional(),
  cursor: MeetingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MeetingGroupByArgsSchema: z.ZodType<Prisma.MeetingGroupByArgs> = z.object({
  where: MeetingWhereInputSchema.optional(),
  orderBy: z.union([ MeetingOrderByWithAggregationInputSchema.array(),MeetingOrderByWithAggregationInputSchema ]).optional(),
  by: MeetingScalarFieldEnumSchema.array(),
  having: MeetingScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MeetingFindUniqueArgsSchema: z.ZodType<Prisma.MeetingFindUniqueArgs> = z.object({
  select: MeetingSelectSchema.optional(),
  include: MeetingIncludeSchema.optional(),
  where: MeetingWhereUniqueInputSchema,
}).strict() ;

export const MeetingFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MeetingFindUniqueOrThrowArgs> = z.object({
  select: MeetingSelectSchema.optional(),
  include: MeetingIncludeSchema.optional(),
  where: MeetingWhereUniqueInputSchema,
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

export const ContactFindFirstArgsSchema: z.ZodType<Prisma.ContactFindFirstArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereInputSchema.optional(),
  orderBy: z.union([ ContactOrderByWithRelationInputSchema.array(),ContactOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactScalarFieldEnumSchema,ContactScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContactFindFirstOrThrowArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereInputSchema.optional(),
  orderBy: z.union([ ContactOrderByWithRelationInputSchema.array(),ContactOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactScalarFieldEnumSchema,ContactScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactFindManyArgsSchema: z.ZodType<Prisma.ContactFindManyArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereInputSchema.optional(),
  orderBy: z.union([ ContactOrderByWithRelationInputSchema.array(),ContactOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactScalarFieldEnumSchema,ContactScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactAggregateArgsSchema: z.ZodType<Prisma.ContactAggregateArgs> = z.object({
  where: ContactWhereInputSchema.optional(),
  orderBy: z.union([ ContactOrderByWithRelationInputSchema.array(),ContactOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContactGroupByArgsSchema: z.ZodType<Prisma.ContactGroupByArgs> = z.object({
  where: ContactWhereInputSchema.optional(),
  orderBy: z.union([ ContactOrderByWithAggregationInputSchema.array(),ContactOrderByWithAggregationInputSchema ]).optional(),
  by: ContactScalarFieldEnumSchema.array(),
  having: ContactScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContactFindUniqueArgsSchema: z.ZodType<Prisma.ContactFindUniqueArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereUniqueInputSchema,
}).strict() ;

export const ContactFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContactFindUniqueOrThrowArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereUniqueInputSchema,
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

export const MeetingCreateArgsSchema: z.ZodType<Prisma.MeetingCreateArgs> = z.object({
  select: MeetingSelectSchema.optional(),
  include: MeetingIncludeSchema.optional(),
  data: z.union([ MeetingCreateInputSchema,MeetingUncheckedCreateInputSchema ]),
}).strict() ;

export const MeetingUpsertArgsSchema: z.ZodType<Prisma.MeetingUpsertArgs> = z.object({
  select: MeetingSelectSchema.optional(),
  include: MeetingIncludeSchema.optional(),
  where: MeetingWhereUniqueInputSchema,
  create: z.union([ MeetingCreateInputSchema,MeetingUncheckedCreateInputSchema ]),
  update: z.union([ MeetingUpdateInputSchema,MeetingUncheckedUpdateInputSchema ]),
}).strict() ;

export const MeetingCreateManyArgsSchema: z.ZodType<Prisma.MeetingCreateManyArgs> = z.object({
  data: z.union([ MeetingCreateManyInputSchema,MeetingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MeetingCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MeetingCreateManyAndReturnArgs> = z.object({
  data: z.union([ MeetingCreateManyInputSchema,MeetingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MeetingDeleteArgsSchema: z.ZodType<Prisma.MeetingDeleteArgs> = z.object({
  select: MeetingSelectSchema.optional(),
  include: MeetingIncludeSchema.optional(),
  where: MeetingWhereUniqueInputSchema,
}).strict() ;

export const MeetingUpdateArgsSchema: z.ZodType<Prisma.MeetingUpdateArgs> = z.object({
  select: MeetingSelectSchema.optional(),
  include: MeetingIncludeSchema.optional(),
  data: z.union([ MeetingUpdateInputSchema,MeetingUncheckedUpdateInputSchema ]),
  where: MeetingWhereUniqueInputSchema,
}).strict() ;

export const MeetingUpdateManyArgsSchema: z.ZodType<Prisma.MeetingUpdateManyArgs> = z.object({
  data: z.union([ MeetingUpdateManyMutationInputSchema,MeetingUncheckedUpdateManyInputSchema ]),
  where: MeetingWhereInputSchema.optional(),
}).strict() ;

export const MeetingDeleteManyArgsSchema: z.ZodType<Prisma.MeetingDeleteManyArgs> = z.object({
  where: MeetingWhereInputSchema.optional(),
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

export const ContactCreateArgsSchema: z.ZodType<Prisma.ContactCreateArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  data: z.union([ ContactCreateInputSchema,ContactUncheckedCreateInputSchema ]),
}).strict() ;

export const ContactUpsertArgsSchema: z.ZodType<Prisma.ContactUpsertArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereUniqueInputSchema,
  create: z.union([ ContactCreateInputSchema,ContactUncheckedCreateInputSchema ]),
  update: z.union([ ContactUpdateInputSchema,ContactUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContactCreateManyArgsSchema: z.ZodType<Prisma.ContactCreateManyArgs> = z.object({
  data: z.union([ ContactCreateManyInputSchema,ContactCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContactCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ContactCreateManyAndReturnArgs> = z.object({
  data: z.union([ ContactCreateManyInputSchema,ContactCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContactDeleteArgsSchema: z.ZodType<Prisma.ContactDeleteArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  where: ContactWhereUniqueInputSchema,
}).strict() ;

export const ContactUpdateArgsSchema: z.ZodType<Prisma.ContactUpdateArgs> = z.object({
  select: ContactSelectSchema.optional(),
  include: ContactIncludeSchema.optional(),
  data: z.union([ ContactUpdateInputSchema,ContactUncheckedUpdateInputSchema ]),
  where: ContactWhereUniqueInputSchema,
}).strict() ;

export const ContactUpdateManyArgsSchema: z.ZodType<Prisma.ContactUpdateManyArgs> = z.object({
  data: z.union([ ContactUpdateManyMutationInputSchema,ContactUncheckedUpdateManyInputSchema ]),
  where: ContactWhereInputSchema.optional(),
}).strict() ;

export const ContactDeleteManyArgsSchema: z.ZodType<Prisma.ContactDeleteManyArgs> = z.object({
  where: ContactWhereInputSchema.optional(),
}).strict() ;