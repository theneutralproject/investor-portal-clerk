import { createDocumentEntry, getAdminFromrequest, uploadFile } from "@/libs/admin/utils";
import prisma from "@/libs/prisma";
import { errorResponse, getErrorMessage, jsonResponse } from "@/libs/utils";
import { isError } from "lodash";
import type { NextRequest } from "next/server";
import fs from 'fs/promises';
import { DealDocumentType } from "@prisma/client";

// get deals by first and last name and project name
export async function GET(request: NextRequest) {
    const adminUser = await getAdminFromrequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return errorResponse(getErrorMessage(adminUser), 401);
    }

    let firstName: string | undefined;
    let lastName: string | undefined;
    let projectName: string | undefined;
    try {
        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        firstName = queryParams.get("firstName") ?? undefined;
        lastName = queryParams.get("lastName") ?? undefined;
        projectName = queryParams.get("projectName") ?? undefined;
    }
    catch (error) {
        return errorResponse(getErrorMessage(error), 500);
    }

    if (!firstName || !lastName || !projectName) {
        return errorResponse("Missing required query parameters", 400);
    }

    // get deals by first and last name and project name
    const project = await prisma.project.findFirst({
        where: {
            name: {
                contains: projectName,
                mode: "insensitive"
            },
        }
    });

    if (!project) {
        return errorResponse(`Project with name containing ${projectName} not found`, 404);
    }

    const owner = await prisma.user.findFirst({
        where: {
            firstName: {
                contains: firstName,
                mode: "insensitive"
            },
            lastName: {
                contains: lastName,
                mode: "insensitive"
            },
        },
        include: { organizationsOwned: true }
    });
    if (!owner) {
        return errorResponse(`User with first name containing ${firstName} and last name containing ${lastName} not found`, 404);
    }

    const deals = await prisma.deal.findMany({
        where: {
            organizationId: { in: owner.organizationsOwned.map(org => org.id) },
            projectId: project.id
        }, include: {
            organization: true,
            project: true
        }
    });
    return jsonResponse(deals);
}

/**
 * Store PDF matched with deal
 * @param request 
 * @returns 
 */
export async function POST(request: NextRequest) {
    const adminUser = await getAdminFromrequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return errorResponse(getErrorMessage(adminUser), 401);
    }

    const requestBody = (await request.json()) as { dealId: number, pdfName: string, taxYear: number };
    const { dealId, pdfName, taxYear } = requestBody;
    if (!dealId) {
        return errorResponse("Missing required dealId", 400);
    }
    // get PDF from temp storage
    const storagePath = `./src/libs/admin/tempPdfFilesDir`;
    let pdfBuffer: Buffer;
    try {
        pdfBuffer = await fs.readFile(`${storagePath}/${pdfName}`);
    } catch (error) {
        console.error(error);
        return errorResponse(getErrorMessage(error), 500);
    }
    const file = new File([pdfBuffer], pdfName.replace(".pdf", ""), { type: "application/pdf" });
    let path = ""
    try {
        path = await uploadFile(file, "deal", dealId);
    } catch (error) {
        console.error(error);
        return errorResponse(getErrorMessage(error), 500);
    }
    try {
        const newDocEntry = await createDocumentEntry("deal", dealId, pdfName, path, "", adminUser.id, DealDocumentType.K1, taxYear);

        return jsonResponse({
            success: true,
            document: newDocEntry,
        });
    } catch (error) {
        console.error("Error processing upload:", error);
        return errorResponse(getErrorMessage(error), 500);
    }
}
