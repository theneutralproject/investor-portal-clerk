import { getAdminFromRequest, matchDealWithPdf } from "@/libs/admin/utils";
import { zPdfBulkUploadSchema } from "@/libs/document/schema";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { isError } from "lodash";
import type { NextRequest } from "next/server";
import type { MatchResponseObject } from "@/libs/admin/schema";
import prisma from "@/libs/prisma.server";
import { storageClient } from "@/libs/supabase";
import type { DealWithFullOrgAndSlimProject } from "@/libs/types";

/**
 * Admin can upload up to 20 PDFs at a time
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

    let taxYear: number | null = null;
    try {
        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        taxYear = parseInt(queryParams.get('taxYear') ?? '-1');
    } catch (error) {
        console.error('unable to read query params:', getErrorMessage(error));
        return jsonResponse(getErrorMessage(error), 500);
    }

    if (!taxYear || taxYear < 2018) {
        return jsonResponse('taxYear query param is required and must be 2018 or later', 400);
    }

    let pdfFiles: FormDataEntryValue[] = [];
    try {
        const formData = await request.formData();
        const files = formData.getAll('files');
        pdfFiles = zPdfBulkUploadSchema.parse(files);
        const { data, error } = await storageClient.from(`deal-documents`).list('tempPdfStorage');
        if (isError(error)) {
            console.error(getErrorMessage(error));
        }
        if (data?.length) {
            console.log("Deleting all files in tempPdfStorage folder");
            const deleteResult = await storageClient.from(`deal-documents`).remove(data.map(file => `tempPdfStorage/${file.name}`));
            if (deleteResult.error) {
                console.error("COULD NOT DELETE:")
                console.error(getErrorMessage(deleteResult.error));
                return jsonResponse({ error: getErrorMessage(deleteResult.error) }, 500);
            }
        }
    } catch (error) {
        console.error("unable to read form data");
        return jsonResponse({ error: getErrorMessage(error) }, 500);
    }

    let deals: DealWithFullOrgAndSlimProject[] = [];
    try {
        // get all closed deals
        deals = (await prisma.deal.findMany({
            where: {
                dealStage: 5,
                closingDate: { gte: new Date(`${taxYear}-01-01`), lt: new Date(`${taxYear + 1}-01-01`) }
            },
            include: {
                organization: {
                    include: {
                        members: { include: { user: { include: { address: true } } } },
                        address: true
                    }
                },
                project: true,
            }
        }));
    } catch (error) {
        console.error("unable to get deals from database");
        return jsonResponse({ error: getErrorMessage(error) }, 500);
    };

    try {
        const retArr = [] as (MatchResponseObject)[];
        const matchPromises = pdfFiles.map(async (file) => {
            if (file instanceof File) {
                const { name, type } = file;
                console.log(`Uploading ${name} to temp storage`);
                const { error } = await storageClient
                    .from(`deal-documents`)
                    .upload(
                        `tempPdfStorage/${name}`,
                        file,
                        { contentType: type }
                    );
                if (error) {
                    console.error(`unable to upload file ${name} to temp storage:`);
                    console.error(error.message);
                    console.error(error);
                    return jsonResponse({ error: getErrorMessage(error) }, 500);
                }

                // match the files to the correct deal
                const match = await matchDealWithPdf(deals, file);
                retArr.push(match);
            } else {
                console.error("file is not instance of File");
                return jsonResponse({ error: "file is not instance of File" }, 400);
            }
        });
        await Promise.all(matchPromises);
        return jsonResponse(retArr);
    }
    catch (err) {
        console.error(err);
        return jsonResponse({ error: getErrorMessage(err) }, 500);
    }
}
