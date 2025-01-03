import { ProjectName } from "@/libs/project/schema";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import path from "path";
import { Deal, PaymentMethod } from "@prisma/client";
import { DealUpdateSchema } from "@/libs/deal/schema";
import { updateDeal } from "@/libs/deal/utils.server";
import { isAdminUser } from "@/libs/user/utils";
import { getDealsFromCsv } from "@/libs/maintenance/utils.server";

const projectName: ProjectName = ProjectName['519 W Main'];
const filePath = path.join(
    './seedData',
    `Investor Cap Table - ${projectName}.csv`
);


export async function POST() {
    const requestingClerkUser = await currentUser();
    if (!requestingClerkUser)
        return jsonResponse({ error: 'Clerk User not found' }, 404);
    if (! await isAdminUser(requestingClerkUser.id)) return jsonResponse({ error: "User is not an admin" }, 403);

    //   read csv file
    const dealInputs = await getDealsFromCsv(filePath);
    let resultsArray: Promise<Deal>[] = [];
    let i = 0;
    dealInputs.forEach(async (dealInput) => {
        i++;
        if (i > 10) return;
        const { dealHubspotId, dateFunded, dateSigned, debtMaxTerm, debtMinTerm } = dealInput;
        const dealUpdate = {
            hubspotId: dealHubspotId,
            closingDate: dateFunded,
            signaturesCompletedDate: dateSigned,
            dateFundsSent: dateFunded,
            paymentMethod: PaymentMethod.CHECK,
        } as DealUpdateSchema;
        console.log('dealUpdate:', dealHubspotId);
        const promise = updateDeal(dealUpdate, false, true);
        // console.log('promise:', promise.closingDate);
        resultsArray.push(promise);
    });
    console.log('3');
    await Promise.all(resultsArray);
    console.log('4', resultsArray);
    return jsonResponse(resultsArray);

}