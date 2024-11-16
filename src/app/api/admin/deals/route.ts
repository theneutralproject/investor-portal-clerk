import { createDocumentEntry, getAdminFromRequest } from "@/libs/admin/utils";
import prisma from "@/libs/prisma.server";
import { errorResponse, getErrorMessage, jsonResponse } from "@/libs/utils";
import { isError } from "lodash";
import type { NextRequest } from "next/server";
import { DealDocumentType, Prisma } from "@prisma/client";
import { storageClient } from "@/libs/supabase";

// get deals by email and project name OR with dealdocument
export async function GET(request: NextRequest) {
    const adminUser = await getAdminFromRequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return errorResponse(getErrorMessage(adminUser), 401);
    }

    let email: string | undefined;
    let projectName: string | undefined;
    let minDealstage: number | undefined;
    let includeDealDocument = false;
    try {
        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        email = queryParams.get("email") ?? undefined;
        projectName = queryParams.get("projectName") ?? undefined;
        minDealstage = parseInt(queryParams.get("minDealstage") ?? "5");
        includeDealDocument = queryParams.get("includeDealDocument") === "true";
    }
    catch (error) {
        return errorResponse(getErrorMessage(error), 500);
    }

    // return all deals if includeDealDocument is true
    if (includeDealDocument) {
        const allDeals = await prisma.deal.findMany({
            where: {
                dealStage: { gte: minDealstage },
            },
            include: {
                document: {include: {uploadedBy: true}}
            }
        });

        return jsonResponse(allDeals.map(deal => {
            return {
                ...deal,
                document: deal.document.filter(doc => doc.type === DealDocumentType.K1)
            };
        }));
    }

    // else return deals by email and project name
    if (!email || !projectName) {
        return errorResponse("Missing required query parameters", 400);
    }

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

    const owners = await prisma.user.findMany({
        where: {
            email: {
                contains: email,
                mode: "insensitive"
            },
        },
        include: { organizationsOwned: true }
    });

    if (!owners?.length) {
        return errorResponse(`User with email containing ${email} not found`, 404);
    }
    const ownerOrgIds = owners.map(owner => owner.organizationsOwned.map(org => org.id)).flat();
    const deals = await prisma.deal.findMany({
        where: {
            organizationId: { in: ownerOrgIds },
            projectId: project.id,
            dealStage: { gte: minDealstage }
        }, include: {
            organization: true,
            // project: true
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
    const adminUser = await getAdminFromRequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return errorResponse(getErrorMessage(adminUser), 401);
    }

    const requestBody = (await request.json()) as { dealId: number, pdfName: string, taxYear: number };
    const { dealId, pdfName, taxYear } = requestBody;
    if (!dealId) {
        return errorResponse("Missing required dealId", 400);
    }
    const newPath = `deal/${dealId}/${pdfName}`;
    const { error } = await storageClient.from(`deal-documents`).move(`tempPdfStorage/${pdfName}`, newPath);
    if (error) {
        console.error("unable to move file to temp storage:");
        console.error(getErrorMessage(error));
        return jsonResponse({ error: getErrorMessage(error) }, 500);
    }
    try {
        const newDocEntry = await createDocumentEntry("deal", dealId, pdfName, newPath, "", adminUser.id, DealDocumentType.K1, taxYear);

        return jsonResponse({
            success: true,
            document: newDocEntry,
        });
    } catch (error) {
        console.error("Error processing upload:", error);
        return errorResponse(getErrorMessage(error), 500);
    }
}
