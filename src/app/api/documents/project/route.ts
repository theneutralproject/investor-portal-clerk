import prisma from "@/libs/prisma.server";
import { currentUser } from "@clerk/nextjs/server";
import {
    DealFinancingType,
    type DocumentEvent,
} from "@prisma/client";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * 
 * @param request Get documents for a project
 * @returns 
 */
export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { id } = user;
        const neutralUser = await prisma.user.findUnique({
            where: { clerkId: id },
        });

        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        const projectId = parseInt(queryParams.get("projectId") ?? "", 10);
        const dealStage = parseInt(queryParams.get("dealStage") ?? "", 10);
        const financingType = queryParams.get("financingType") ?? "";

        if (isNaN(projectId)) {
            return new Response(JSON.stringify({ error: "Invalid Project ID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const isDealFinancingType = Object.values(DealFinancingType).includes(
            financingType as DealFinancingType
        );

        const documents = await prisma.projectDocument.findMany({
            where: {
                projectId: projectId,
                ...(dealStage ? { dealStage: dealStage } : {}),
                ...(isDealFinancingType
                    ? {
                        OR: [
                            { financingTypes: { has: financingType as DealFinancingType } },
                            { financingTypes: { equals: [] } },
                        ],
                    }
                    : { financingTypes: { equals: [] } }),
            },
            include: {
                documentEvents: {
                    where: { userId: neutralUser?.id },
                },
            },
        });

        const results = documents.map((doc) => ({
            ...doc,
            completed: doc.documentEvents.some(
                (event: DocumentEvent) => event.documentId === doc.id
            ),
        }));

        results.sort((a, b) => {
            if (a.link.includes("youtube") && !b.link.includes("youtube")) return -1;
            if (!a.link.includes("youtube") && b.link.includes("youtube")) return 1;
            if (a.link.includes("docusign") && !b.link.includes("docusign")) return 1;
            if (!a.link.includes("docusign") && b.link.includes("docusign"))
                return -1;
            return 0;
        });

        return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Error fetching data" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
