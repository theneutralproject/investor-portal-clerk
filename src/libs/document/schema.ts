import { DocumentEventType } from "@prisma/client";
import { z } from "zod";
import { zfd } from "zod-form-data";

const ACCEPTED_FILE_TYPES = ["application/pdf", "image/png", "image/jpg", "image/jpeg"];
const MAX_FILE_SIZE = 4; //In MegaBytes
const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
    const result = sizeInBytes / (1024 * 1024);
    return +result.toFixed(decimalsNum);
};

export const zPdfDocumentCreateSchema = zfd.formData({
    dealId: zfd.numeric().nullish(),
    organizationId: zfd.numeric().nullish(),
    type: zfd.text().refine((type) => {
        return ["organization", "deal"].includes(type);
    }),
    file: zfd.file().refine((file) => {
        return ACCEPTED_FILE_TYPES.includes(file.type);
    }).refine((file) => {
        return sizeInMB(file.size) <= MAX_FILE_SIZE;
    }, `File type must be one of ${ACCEPTED_FILE_TYPES.join(", ")} and size must be less than ${MAX_FILE_SIZE}MB`),
});

export type PdfDocumentCreateSchema = z.infer<typeof zPdfDocumentCreateSchema>;

export const zDocumentEventCreateSchema = z.object({
    documentId: z.number().int(),
    projectId: z.number().int(),
    type: z.nativeEnum(DocumentEventType),
});

export type DocumentEventCreateSchema = z.infer<typeof zDocumentEventCreateSchema>;
