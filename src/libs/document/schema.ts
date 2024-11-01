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

// Custom file validation that works in both browser and Node.js
const fileSchema = z
  .custom<File | Blob>((file) => {
    // Check if it's a File or Blob
    if (!(file instanceof Blob)) {
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
  })
  .transform((val) => val as File | Blob);

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
