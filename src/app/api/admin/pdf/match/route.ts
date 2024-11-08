import { deleteAllFiles, getAdminFromRequest, matchDealWithPdf, pdfTempStoragePath } from "@/libs/admin/utils";
import { zPdfBulkUploadSchema } from "@/libs/document/schema";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { isError } from "lodash";
import type { NextRequest } from "next/server";
import fs from 'fs/promises';
import type { MatchResponseObject } from "@/libs/admin/schema";
import prisma from "@/libs/prisma.server";

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
    console.log("Admin user", adminUser);
    // get all deals
    const deals = (await prisma.deal.findMany({
        take: 10,
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

        const deleteResult = await deleteAllFiles(pdfTempStoragePath);
        if(isError(deleteResult)) {
            console.error(getErrorMessage(deleteResult));
            return jsonResponse({ error: getErrorMessage(deleteResult) }, 500);
        }
        const retArr = [] as (MatchResponseObject | null)[];
        for (const file of files) {
            console.log(`File name: ${file.name}`);
            const buffer = Buffer.from(await file.arrayBuffer());
            try {
                await fs.writeFile(`${pdfTempStoragePath}/${file.name}`, buffer);
            }
            catch (err) {
                console.error(err);
                return jsonResponse({ error: getErrorMessage(err) }, 500);
            }

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
