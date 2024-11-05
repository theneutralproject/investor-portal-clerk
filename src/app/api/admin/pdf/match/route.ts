import { getAdminFromrequest, matchDealWithPdf } from "@/libs/admin/utils";
import { zPdfBulkUploadSchema } from "@/libs/document/schema";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { isError } from "lodash";
import type { NextRequest } from "next/server";
import fs from 'fs';
import prisma from "@/libs/prisma";

/**
 * Admin can upload up to 20 PDFs at a time
 * @param request formData with PdfDocumentCreateSchema
 * @returns 
 */
export async function POST(request: NextRequest) {
    // check if they are an admin user by checkingthe auth token
    const adminUser = await getAdminFromrequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return jsonResponse(getErrorMessage(adminUser), 401);
    }
    // get all deals
    const deals = await prisma.deal.findMany({
        include: {
            organization: {
                include: {
                    members: {include: {user: true}}
                }
            }, 
            project: true,
        }
    });
    // get the pdfs from the request
    const { files } = zPdfBulkUploadSchema.parse(await request.formData());

    console.log(`Admin ${adminUser.email} uploaded ${files.length} files`);
    const storagePath = `../../../libs/admin/tempPdfFilesDir`;
    const retArr = [] as any[];
    // for (const file of files) {
    //     console.log(`File name: ${file.name}`);
    //     const buffer = Buffer.from(await file.arrayBuffer());
    //     // fs.writeFileSync(`${storagePath}/${file.name}`, buffer);
    //     fs.writeFile(`${storagePath}/${file.name}`, buffer, (err: any) => {
    //         if (err) {
    //             console.error(err);
    //             return jsonResponse({ error: getErrorMessage(err) }, 500);
    //         }
    //     });    

    // // match the files to the correct deal
    //   const matchingDeal = await matchDealWithPdf(deals, file);
    // // return an array of match results
    //     if (isError(matchingDeal)) {
    //         console.error(getErrorMessage(matchingDeal));
    //         retArr.push();
    //     }
    //     else retArr.push(matchingDeal);
    // };

    return jsonResponse(retArr);
}