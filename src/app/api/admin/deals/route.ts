import { createDocumentEntry, getAdminFromRequest } from "@/libs/admin/utils";
import prisma from "@/libs/prisma.server";
import { errorResponse, getErrorMessage, jsonResponse } from "@/libs/utils";
import { isError } from "lodash";
import type { NextRequest } from "next/server";
import { DealDocumentType, type DealFinancingType, type Prisma } from "@prisma/client";
import { storageClient } from "@/libs/supabase";

/**
 * can filter by email, projectName, minDealstage (default = 5), includeTaxDocument (default = false)
 * @param request 
 * @returns 
 */
export async function GET(request: NextRequest) {
    const adminUser = await getAdminFromRequest(request);
    if (isError(adminUser)) {
        console.error(getErrorMessage(adminUser));
        return errorResponse(getErrorMessage(adminUser), 401);
    }

    let email: string | undefined;
    let projectName: string | undefined;
    let minDealstage: number | undefined;
    let documentType = '';
    let amountStr: string | undefined;
    let closingYearStr: string | undefined;
    let financingTypeStr: string | undefined;

    try {
        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        email = queryParams.get("email") ?? undefined;
        projectName = queryParams.get("projectName") ?? undefined;
        minDealstage = parseInt(queryParams.get("minDealstage") ?? "5");
        documentType = queryParams.get("documentType") ?? '';
        amountStr = queryParams.get("amount") ?? undefined;
        closingYearStr = queryParams.get("closingYear") ?? undefined;
        financingTypeStr = queryParams.get("financingType") ?? undefined;
    }
    catch (error) {
        return errorResponse(getErrorMessage(error), 500);
    }

    // return all deals if includeTaxDocument is true
    if (documentType.toLowerCase() === "tax") {
        const allDeals = await prisma.deal.findMany({
            where: {
                dealStage: { gte: minDealstage, lt: 6 },
            },
            include: {
                document: {
                    where: { type: DealDocumentType.K1 },
                    include: { uploadedBy: true }
                }
            }
        });

        return jsonResponse(allDeals);
    }
    else {
        let projectId: number | undefined;
        if (projectName) {
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
            projectId = project.id;
        }

        let ownerOrgIds: number[] = [];
        if (email) {
            const owners = await prisma.user.findMany({
                where: {
                    email: {
                        contains: email,
                        mode: "insensitive"
                    },
                },
                include: { organizationsOwned: true }
            });

            ownerOrgIds = owners.map(owner => owner.organizationsOwned.map(org => org.id)).flat();
            if (!ownerOrgIds.length) {
                return errorResponse(`User with email containing ${email} not found`, 404);
            }
        }

        const where: Prisma.DealWhereInput = {
            dealStage: { gte: minDealstage, lt: 6 },
        };
        if (projectId) {
            where.projectId = projectId;
        }
        if (email) {
            where.organizationId = { in: ownerOrgIds };
        }

        if (closingYearStr) {
            const closingYear = parseInt(closingYearStr);
            where.closingDate = { gte: new Date(`${closingYear}-01-01`), lt: new Date(`${closingYear + 1}-01-01`) };
        }

        if (amountStr ?? financingTypeStr) {
            where.investmentStats = {};
            if (amountStr) {
                where.investmentStats.amount = parseInt(amountStr);
            }
            if (financingTypeStr) {
                where.investmentStats.financingType = financingTypeStr as DealFinancingType;
            }
        }

        const deals = await prisma.deal.findMany({
            where: where,
            include: {
                organization: { include: { ownedBy: true } },
                investmentStats: true,
                document: {
                    where: { type: DealDocumentType.INVESTMENT_DOCUMENT },
                    include: { uploadedBy: true }
                }
            }
        });
        return jsonResponse(deals);
    }
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
    const newPath = `deal-${dealId}/${pdfName}`;
    const { error } = await storageClient.from(`deal-documents`).move(`tempPdfStorage/${pdfName}`, newPath);
    if (error) {
        console.error("unable to move file from temp storage to deal:");
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
