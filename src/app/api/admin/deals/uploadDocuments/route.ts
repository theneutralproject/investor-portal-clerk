import { createDocumentEntry, getAdminFromRequest } from "@/libs/admin/utils";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { NextRequest } from "next/server";
import { isError } from "lodash";
import { zPdfBulkUploadSchema } from "@/libs/document/schema";
import { storageClient } from "@/libs/supabase";
import { DealDocumentType } from "@prisma/client";


/**
 * Admin can upload up to 10 PDFs at a time
 * @param request formData with PdfDocumentCreateSchema
 * @returns 
 */
export async function POST(request: NextRequest) {
    // check if they are an admin user by checking the auth token
    const adminUser = await getAdminFromRequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return jsonResponse(getErrorMessage(adminUser), 401);
    }

    try {
        const formData = await request.formData();
        const { files, dealId } = zPdfBulkUploadSchema.parse(formData);
        if (!dealId) {
            return jsonResponse('dealId is required', 400);
        }

        for (const file of files) {
            // @ts-expect-error will fix later
            const { name, type } = file;
            const { data, error } = await storageClient.from('deal-documents').upload(
                `deal-${dealId}/${name}`, file,
                { contentType: type }
            )

            if (error) {
                console.error(`unable to upload file ${file}:`, getErrorMessage(error));
                return jsonResponse(getErrorMessage(error), 500);
            }

            try {
                await createDocumentEntry(
                    "deal",
                    parseInt(dealId),
                    name,
                    data.path,
                    "",
                    adminUser.id,
                    DealDocumentType.INVESTMENT_DOCUMENT
                );
            } catch (error) {
                console.error('unable to createDocumentEntry:', getErrorMessage(error));
                return jsonResponse(getErrorMessage(error), 500);
            }
        }
        return jsonResponse({ message: `${files.length} files uploaded successfully` });
    } catch (error) {
        console.error('unable to read files:', getErrorMessage(error));
        return jsonResponse(getErrorMessage(error), 500);
    }
}
