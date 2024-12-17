import { DealFinancingType, PaymentMethod, User } from "@prisma/client";
import { parse } from 'csv-parse';
import path from "path";
import fs from "fs";
import { finished } from "stream";
import { promisify } from "util";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { jsonResponse } from "@/libs/utils";
import prisma from "@/libs/prisma.server";
import { getDealsWithContactsFromHubspot } from "@/libs/hubspot/utils";
import { UserCreateSchema } from "@/libs/user/schema";
import { createUserInDbAndHubspot } from "@/libs/user/utils";
import {  DealCreateSchema } from "@/libs/deal/schema";
import { ProjectName } from "@/libs/schema";
import { createDealForAdmin } from "@/libs/deal/utils.server";
import { DealWithInvestmentStats } from "@/libs/types";

const finishedAsync = promisify(finished);

const projectName: ProjectName = ProjectName["Bakers Place"];
const filePath = path.join('./seedData', `Investor Cap Table - ${projectName}.csv`);

interface DealRecord {
    V2?: string;
    investorName: string;
    dealHubspotId: string;
    dealFinancingType: DealFinancingType;
    dealAmount?: number;
    dateSigned: Date;
    dateFunded: Date;
    equityUnitType?: string;
    debtInterestRatePerc?: number;
    linkToDocumentFolder: string;
}

function getDealType(dealType: string): DealFinancingType {
    switch (dealType) {
        case 'E':
            return DealFinancingType.equity;
        case 'PN':
            return DealFinancingType.promissory_note_now;
        case 'PN to E':
            return DealFinancingType.promissory_to_equity;
        case 'PN to PN':
            return DealFinancingType.promissory_note_at_closing;
        default:
            throw new Error(`Invalid deal type: ${dealType}`);
    }
}

function getNumbersFromString(val: string): number | undefined {
    if (!val || val === "N/A") return undefined;
    const num = val.replace(/[^0-9.-]+/g, '');
    return parseFloat(num);
}

function getEquityUnitType(val: string): string | undefined {
    return val === "A" || val === "C" ? val : undefined;
}

async function getDealsFromCsv() {
    // read csv file
    const csvAsString = fs.readFileSync(filePath, 'utf8');
    const parser = parse(csvAsString, { columns: true });
    const dealRecords: DealRecord[] = [];

    parser.on('readable', () => {
        let record;
        while (record = parser.read()) {
            let dealRecord: DealRecord | null = null;
            try {
                dealRecord = {
                    investorName: record['Investor Name'],
                    dealHubspotId: record['Hubspot ID'],
                    dealFinancingType: getDealType(record['Type']),
                    dealAmount: getNumbersFromString(record['Amount ($)']),
                    dateSigned: new Date(record['Date Investor Signed']),
                    dateFunded: new Date(record['Effective/Funded Date']),
                    equityUnitType: getEquityUnitType(record['Equity Unit']),
                    debtInterestRatePerc: getNumbersFromString(record['PN Unit']),
                    linkToDocumentFolder: record['Link to Documents'],
                    V2: record.V2
                }
                if (dealRecord.V2 === 'TRUE') dealRecords.push(dealRecord);

            } catch (e) {
                console.error("unable to create deal record - skipping to next one:\n", e);
            }
        }
    });
    parser.on('error', function (err) {
        console.error("error parsing csv file");
        console.error(err.message);
        throw new Error(err.message);
    });
    parser.on('end', function () {
        console.log("done parsing csv file", dealRecords.length);
        return dealRecords;
    });
    await finishedAsync(parser);
    return dealRecords;
};


export async function POST() {
    const clerkUser = await currentUser();
    if (!clerkUser) return jsonResponse({ error: "User not found" }, 404);
    // if (! await isAdminUser(clerkUser.id)) return jsonResponse({ error: "User is not an admin" }, 403);

    const dealInputs = await getDealsFromCsv();
    const dealHubspotIds = dealInputs.map(deal => deal.dealHubspotId);


    // get deal and user info from hubspot
    const hsSearchResults = await getDealsWithContactsFromHubspot(dealHubspotIds);

    if (dealHubspotIds.length !== hsSearchResults.deals?.length) {
        console.error("Some deals not found in hubspot");
    } else {
        console.log("All deals found in hubspot");
    }

    const newDealsArr: DealWithInvestmentStats[] = [];
    // loop through deals and create missing users and deals
    let i = 0;
    for await (const dealcontact of hsSearchResults.dealContacts) {
        // create user if not found
        const { email, firstname, lastname, hs_object_id, phone } = dealcontact.contact.properties;
        if (!email || !firstname || !lastname || !hs_object_id) {
            console.error("SKIPPING - deal contact incomplete:", dealcontact.contact);
            continue;
        }
        const clerkData = {
            emailAddress: [email],
            firstName: firstname,
            lastName: lastname,
        } as {
            emailAddress: string[];
            firstName: string;
            lastName: string;
            phoneNumber?: string[];
        }

        if (phone) clerkData.phoneNumber = [phone];
        let dealOwner = await prisma.user.findFirst({ where: { email } });
        console.log("i:", i);
        if (i > 2) break;
        if (!dealOwner) {
            try {
                const clerkUser = await clerkClient.users.createUser(clerkData);
                console.log("User created:", clerkUser);

                const dbUserData = {
                    clerkId: clerkUser.id,
                    email,
                    firstName: firstname,
                    lastName: lastname,
                    hubspotId: hs_object_id,
                } as UserCreateSchema;
                if (phone) dbUserData.phoneNumber = phone;
                dbUserData.hubspotId = dbUserData.hubspotId || '';

                dealOwner = await createUserInDbAndHubspot(dbUserData);

            } catch (e) {
                console.error("Error creating user:", e);
            }
        }

        if (!dealOwner?.userOrgId) {
            console.error("User not found or created");
            continue;
        }

        // we now have a user with org. create deal
        const hsDeal = dealcontact.deal;
        if (!hsDeal) {
            console.error("Deal not found for contact:", dealcontact.contact);
            continue;
        }
        const { id } = hsDeal;

        // find deal in csvdata

        const dealInput = dealInputs.find(deal => deal.dealHubspotId === id);
        if (!dealInput?.dealAmount) {
            console.error("Deal not found in csv data");
            continue;
        }

        // get project id:

        let projectId: number;
        switch (projectName) {
            case ProjectName["Bakers Place"]:
                projectId = 2;
                break;
            case ProjectName["519 W Main"]:
                projectId = 3;
                break;
            case ProjectName["The Edison"]:
                projectId = 1;
                break;
            default:
                console.error("Project not found"); 
                continue;
        }
console.log("dealInput", dealInput);
        const dealCreateData: DealCreateSchema = {
            amount: dealInput.dealAmount,
            projectId: projectId,
            organizationId: dealOwner.userOrgId,
            dealStage: 5,
            financingType: dealInput.dealFinancingType,
            hubspotId: id,
            closingDate: dealInput.dateFunded,
            signaturesCompletedDate: dealInput.dateSigned,
            dateFundsSent: dealInput.dateFunded,
            paymentMethod: PaymentMethod.CHECK,
            paymentReferenceId: 'N/A',
        }

        const newDeal = await createDealForAdmin(dealCreateData, dealOwner);
        newDealsArr.push(newDeal);

        i++;
    }

    return jsonResponse(newDealsArr, 201);
}
