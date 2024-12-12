import type { DealUpdateSchema } from "@/libs/deal/schema";
import { updateDeal } from "@/libs/deal/utils.server";
import { isAdminUser } from "@/libs/maintenance/utils";
import prisma from "@/libs/prisma.server";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import { type Deal, PaymentMethod, Role } from "@prisma/client";


export async function POST() {
    const clerkUser = await currentUser();
    if (!clerkUser) return jsonResponse({ error: "User not found" }, 404);
    if(!isAdminUser(clerkUser.id)) return jsonResponse({ error: "User is not an admin" }, 403);

    // get all deals
    const deals = await prisma.deal.findMany({
        include: {
            investmentStats: true,
        },
        take: 30,
        skip: 0
    });
    const resultsArray: Deal[] = [];
    for await (const deal of deals) {
        const { hubspotId, dealStage, investmentStats, projectId, closingDate, signaturesCompletedDate, dateFundsSent, paymentMethod, paymentReferenceId } = deal;
        let tempDealStage = dealStage;
        let boolResetDealStage = false;
        if (tempDealStage === 5) {
            console.log("Deal ID:", deal.id, "is DealStage 5. Resetting to DealStage 3 temporarily");
            tempDealStage = 3;
            boolResetDealStage = true;
        }

        const dealUpdate: DealUpdateSchema = {
            hubspotId,
            projectId,
            dealStage: tempDealStage,
            closingDate: closingDate ?? new Date(2023, 1, 15),
            signaturesCompletedDate: signaturesCompletedDate ?? new Date(2023, 1, 15),
            dateFundsSent: dateFundsSent ?? new Date(2023, 1, 15),
            paymentMethod: paymentMethod ?? PaymentMethod.CHECK,
            paymentReferenceId: paymentReferenceId ?? "test-payment-reference-id",
        }
        if (investmentStats?.amount) dealUpdate.investmentStats = { amount: investmentStats.amount };

        let updatedDeal: Deal | null = null;
        try {
            updatedDeal = await updateDeal(dealUpdate, false, true);
        } catch (e) {
            console.error("updateDeal1 failed for deal", deal.id);
            console.error(e);
        }
        if (boolResetDealStage) {
            try {
                updatedDeal = await updateDeal({ hubspotId, dealStage: 5 });
            } catch (e) {
                console.error("!!!!!!updateDeal2 failed for deal. Need to manually set dealstage to 5 in the DB for Deal ID:", deal.id);
                console.error(e);
            }
        }
        if (updatedDeal) {
            resultsArray.push(updatedDeal)
        }
        else {
            console.error("Deal not updated", deal.id);
        }
    };
    return jsonResponse(resultsArray);
}
