import { createDocumentEntry, getAdminFromRequest } from "@/libs/admin/utils";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import type { NextRequest } from "next/server";
import { isError } from "lodash";
import { zPdfBulkUploadSchema } from "@/libs/document/schema";
import { storageClient } from "@/libs/supabase";
import { DealDocument, DealDocumentType } from "@prisma/client";
import prisma from "@/libs/prisma.server";


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
            if (file instanceof File) {
                const { name, type } = file;
                const { data, error } = await storageClient.from('deal-documents').upload(
                    `deal-${dealId}/${name}`, file,
                    { contentType: type }
                )

                if (error) {
                    console.error(`unable to upload file ${name}:`);
                    console.error(error);
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
            } else {
                console.error('invalid file:', file);
                return jsonResponse('invalid file', 400);
            }
        }
        return jsonResponse({ message: `${files.length} files uploaded successfully` });
    } catch (error) {
        console.error('unable to read files:', getErrorMessage(error));
        return jsonResponse(getErrorMessage(error), 500);
    }
}

/**
 * Get dealdocs with download URL by dealId
 * @param request 
 * @returns 
 */
export async function GET(request: NextRequest) {
    const adminUser = await getAdminFromRequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return jsonResponse(getErrorMessage(adminUser), 401);
    }
    let dealId: number | null = null;
    try {
        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        dealId = parseInt(queryParams.get('dealId') ?? '');

    } catch (error) {
        console.error('unable to read query params:', getErrorMessage(error));
        return jsonResponse(getErrorMessage(error), 500);
    }

    if (!dealId) {
        return jsonResponse('dealId is required', 400);
    }
    try {
        const dealDocs = await prisma.dealDocument.findMany({
            where: {
                dealId: dealId
            }
        });

        interface docWithUrl extends DealDocument {
            downloadUrl: string;
        }

        const fullDocsPromise = dealDocs.map(async doc => {
            const fullDoc = doc as docWithUrl;
            const storageRes = await storageClient.from('deal-documents').createSignedUrl(doc.path, 60 * 60 * 24);
            fullDoc.downloadUrl = storageRes.data?.signedUrl ?? '';
            return fullDoc;
        });
        return Promise.all(fullDocsPromise).then(fullDocs => {
            return jsonResponse(fullDocs);
        }).catch(error => {
            console.error('unable to get deal documents:', getErrorMessage(error));
            return jsonResponse(getErrorMessage(error), 500);
        });
    } catch (error) {
        console.error('unable to get deal documents:', getErrorMessage(error));
        return jsonResponse(getErrorMessage(error), 500);
    }
};

/**
* Delete a deal document by fileId
* @param request 
* @returns 
*/
export async function DELETE(request: NextRequest) {
    const adminUser = await getAdminFromRequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return jsonResponse(getErrorMessage(adminUser), 401);
    }

    let fileId: number | null = null;
    try {
        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        fileId = parseInt(queryParams.get('fileId') ?? '');
    } catch (error) {
        console.error('unable to read query params:', getErrorMessage(error));
        return jsonResponse(getErrorMessage(error), 500);
    }
    if (!fileId) {
        return jsonResponse('fileId is required', 400);
    }

    try {
        const res = await prisma.dealDocument.delete({
            where: {
                id: fileId
            }
        });
        await storageClient.from('deal-documents').remove([`${res.path}`]);

        return jsonResponse(res);
    } catch (error) {
        console.error('unable to delete deal document:', getErrorMessage(error));
        return jsonResponse(getErrorMessage(error), 500);
    }
}
