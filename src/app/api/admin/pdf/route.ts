import {  getAdminFromRequest, matchDealWithPdf } from "@/libs/admin/utils";
import { zPdfBulkUploadSchema } from "@/libs/document/schema";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { isError } from "lodash";
import type { NextRequest } from "next/server";
import type { MatchResponseObject } from "@/libs/admin/schema";
import prisma from "@/libs/prisma.server";
import { storageClient } from "@/libs/supabase";

/**
 * Admin can upload up to 20 PDFs at a time
 * @param request formData with PdfDocumentCreateSchema
 * @returns 
 */
export async function POST(request: NextRequest) {
    // check if they are an admin user by checkingthe auth token
    const adminUser = await getAdminFromRequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return jsonResponse(getErrorMessage(adminUser), 401);
    }
    
    // get all deals
    const deals = (await prisma.deal.findMany({
        include: {
            organization: {
                include: {
                    members: { include: { user: { include: { address: true } } } },
                    address: true
                }
            },
            project: true,
        }
    }))
    try {
        const formData = await request.formData();
        const { files } = zPdfBulkUploadSchema.parse(formData);
        const {data, error } = await storageClient.from(`deal-documents`).list('tempPdfStorage');
        if (isError(error)) {
            console.error(getErrorMessage(error));
        }
        if(data?.length) {
            console.log("Deleting all files in tempPdfStorage folder");
            console.log(data.map(file => file.name));
            const deleteResult = await storageClient.from(`deal-documents`).remove(data.map(file => `tempPdfStorage/${file.name}`));
            if (deleteResult.error) {
                console.error("COULD NOT DELETE:")
                console.error(getErrorMessage(deleteResult.error));
                return jsonResponse({ error: getErrorMessage(deleteResult.error) }, 500);
            }
        }

        const retArr = [] as (MatchResponseObject | null)[];
        for (const file of files) {
            const { error } = await storageClient
            .from(`deal-documents`)
            .upload(`tempPdfStorage/${file.name as string}`, file, {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                // @ts-expect-error type issue
                contentType: file.type as string
            });
            if(error) {
                console.error("unable to upload file to temp storage:");
                console.error(error.message);
                console.error(error);
                return jsonResponse({ error: getErrorMessage(error) }, 500);
            }
            console.log(`File name: ${file.name}`);

            // match the files to the correct deal
            console.log("Matching file to deal");
            const match = await matchDealWithPdf(deals, file);
            // return an array of match results
            if (isError(match)) {
                console.error(getErrorMessage(match));
                retArr.push();
            }
            else retArr.push(match);
        };

        return jsonResponse(retArr);
    }
    catch (err) {
        console.error(err);
        return jsonResponse({ error: getErrorMessage(err) }, 500);
    }
}
