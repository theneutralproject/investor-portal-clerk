import { DocumentEventType } from "@prisma/client";
import { z } from "zod";

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
];
const MAX_FILE_SIZE = 4; // In MegaBytes

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

// Helper function to check if we're on the client side
const isClient = typeof window !== "undefined";

// Type guard to check if value is a File
const isFile = (value: unknown): value is File => {
  return isClient && value instanceof File;
};

// Modified file schema that works in both client and server contexts
const fileSchema = z.custom<File | FormDataEntryValue>((file) => {
  // If we're on the server, just validate it's present
  if (!isClient) {
    return file !== null && file !== undefined;
  }

  // Client-side validation
  if (!isFile(file)) {
    throw new Error("Required");
  }

  // Check file type
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    throw new Error(
      `File type must be one of ${ACCEPTED_FILE_TYPES.join(", ")}`
    );
  }

  // Check file size
  if (sizeInMB(file.size) > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE}MB`);
  }

  return true;
});

export const zPdfDocumentCreateSchema = z.object({
  dealId: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    })
    .nullable(),
  organizationId: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    })
    .nullable(),
  type: z.string().refine((val) => ["organization", "deal"].includes(val), {
    message: "Type must be either 'organization' or 'deal'",
  }),
  file: fileSchema,
  key: z.string(),
});

export type PdfDocumentCreateSchema = z.infer<typeof zPdfDocumentCreateSchema>;

export const zDocumentEventCreateSchema = z.object({
  documentId: z.number().int(),
  projectId: z.number().int(),
  type: z.nativeEnum(DocumentEventType),
});

export type DocumentEventCreateSchema = z.infer<
  typeof zDocumentEventCreateSchema
>;

export const zPdfBulkUploadSchema = z.object({
    files: z.array(z.instanceof(File)).nonempty().max(20).refine(
        (files) => files.every((file) => sizeInMB(file.size) <= MAX_FILE_SIZE && ACCEPTED_FILE_TYPES.includes(file.type)),
        {
            message: "PDF only, max 20 files, each file must be less than 4MB",
        }
    )
});

export type PdfBulkUploadSchema = z.infer<typeof zPdfBulkUploadSchema>;