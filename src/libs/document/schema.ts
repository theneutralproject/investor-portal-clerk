import {
  DealDocumentType,
  DealFinancingType,
  DocumentEventType,
  DocumentType,
} from '@prisma/client';
import { z } from 'zod';

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpg',
  'image/jpeg',
] as const;

const MAX_FILE_SIZE = 25; // In MegaBytes

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

// Refined type guards and validation
const isClient = typeof window !== 'undefined';
const hasFileProperties = (
  value: unknown
): value is { size: number; type: string } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'size' in value &&
    'type' in value &&
    typeof (value as any).size === 'number' &&
    typeof (value as any).type === 'string'
  );
};

// Generic file validation schema that works in both client and server contexts
export const createFileSchema = () =>
  z.custom<File | FormDataEntryValue>(file => {
    if (!file) {
      throw new Error('File is required');
    }

    // Skip detailed validation on server side
    if (!isClient) {
      return hasFileProperties(file);
    }

    // Client-side validation
    if (!(file instanceof File)) {
      throw new Error('Invalid file type');
    }

    if (
      !ACCEPTED_FILE_TYPES.includes(
        file.type as (typeof ACCEPTED_FILE_TYPES)[number]
      )
    ) {
      throw new Error(
        `File type must be one of ${ACCEPTED_FILE_TYPES.join(', ')}`
      );
    }

    if (sizeInMB(file.size) > MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${MAX_FILE_SIZE}MB`);
    }

    return true;
  });

// Schema for creating a single document
export const zPdfDocumentCreateSchema = z.object({
  dealId: z
    .union([z.string(), z.number()])
    .transform(val => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    })
    .nullable(),
  organizationId: z
    .union([z.string(), z.number()])
    .transform(val => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    })
    .nullable(),
  type: z.string().refine(val => ['organization', 'deal'].includes(val), {
    message: "Type must be either 'organization' or 'deal'",
  }),
  file: createFileSchema(),
  key: z.string(),
  dealDocumentType: z.nativeEnum(DealDocumentType).optional(),
});

// Schema for creating a single without file document
export const zPdfDocumentNoFileCreateSchema = z.object({
  dealId: z
    .union([z.string(), z.number()])
    .transform(val => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    })
    .nullable(),
  organizationId: z
    .union([z.string(), z.number()])
    .transform(val => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    })
    .nullable(),
  type: z.string().refine(val => ['organization', 'deal'].includes(val), {
    message: "Type must be either 'organization' or 'deal'",
  }),
  key: z.string(),
  fileName: z.string(),
  filePath: z.string().optional(),
  path: z.string().optional(),
  dealDocumentType: z.nativeEnum(DealDocumentType).optional(),
});

export type PdfDocumentCreateSchema = z.infer<typeof zPdfDocumentCreateSchema>;

// Schema for document events
export const zDocumentEventCreateSchema = z.object({
  documentId: z.number().int(),
  projectId: z.number().int(),
  type: z.nativeEnum(DocumentEventType),
});

export type DocumentEventCreateSchema = z.infer<
  typeof zDocumentEventCreateSchema
>;

export const zPdfAdminBulkUploadSchema = z
  .array(createFileSchema())
  .nonempty()
  .max(20)
  .refine(
    files => {
      return files.every(file => {
        if (!hasFileProperties(file)) return false;
        return (
          (sizeInMB(file.size) <= MAX_FILE_SIZE &&
            file.type === 'application/pdf') ||
          file.type.startsWith('image/')
        );
      });
    },
    {
      message:
        'Only PDF and image files are allowed and each file must be less than 4MB',
    }
  );

export type PdfAdminBulkUploadSchema = z.infer<
  typeof zPdfAdminBulkUploadSchema
>;

// Export constants and utilities for reuse
export const FILE_VALIDATION = {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
  sizeInMB,
};

export type DocumentEntityType = 'deal' | 'organization' | 'project';
export const zDocumentEntityType = z.enum(['deal', 'organization', 'project']);
export type DocumentEntityTypeSchema = z.infer<typeof zDocumentEntityType>;

export const zDocumentSignedUrlCreateSchema = z.object({
  entityId: z.union([z.string(), z.number()]).transform(val => {
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error('entityId must be a valid number');
    }
    return num;
  }),

  fileName: z.string().min(1, { message: 'fileName is required' }),

  entityType: zDocumentEntityType,
});

export type DocumentSignedURLCreateSchema = z.infer<
  typeof zDocumentSignedUrlCreateSchema
>;

const zDealDocumentCreateSchema = z.object({
  type: z.literal('deal'),
  id: z.number().int().positive(),
  name: z.string().min(1),
  path: z.string().min(1),
  key: z.string().min(1),
  userId: z.number().int().positive(),
  dealDocumentType: z.nativeEnum(DealDocumentType),
  taxYear: z.number().int().optional(),
});

export type DealDocumentCreateSchema = z.infer<
  typeof zDealDocumentCreateSchema
>;

const zOrganizationDocumentCreateSchema = z.object({
  type: z.literal('organization'),
  id: z.number().int().positive(),
  name: z.string().min(1),
  path: z.string().min(1),
  key: z.string().min(1),
  userId: z.number().int().positive(),
});

export type OrganizationDocumentCreateSchema = z.infer<
  typeof zOrganizationDocumentCreateSchema
>;

export const DealOrOrganizationDocumentCreateSchema = z.discriminatedUnion(
  'type',
  [zDealDocumentCreateSchema, zOrganizationDocumentCreateSchema]
);

export const zProjectDocumentCreateSchema = z.object({
  type: z.literal('project'),
  name: z.string().min(1),
  fileName: z.string().min(1),
  description: z.string().optional(),
  link: z.string().url(),
  projectId: z.number().int().positive(),
  dealStage: z.number().int(),
  financingTypes: z.array(z.nativeEnum(DealFinancingType)).optional(),
  documentType: z.nativeEnum(DocumentType),
  docusignTemplateId: z.string().optional(),
  isPublic: z.boolean(),
  requiresNDA: z.boolean(),
});

export type ProjectDocumentCreateSchema = z.infer<
  typeof zProjectDocumentCreateSchema
>;

export const zDocumentCreateGenericSchema = z.discriminatedUnion('type', [
  zProjectDocumentCreateSchema,
  zDealDocumentCreateSchema,
  zOrganizationDocumentCreateSchema,
]);

export type DocumentCreateGenericSchema =
  | ProjectDocumentCreateSchema
  | DealDocumentCreateSchema
  | OrganizationDocumentCreateSchema;
