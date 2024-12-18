import { DealFinancingType, DealOwnershipType, MembershipType, PaymentMethod } from "@prisma/client";
import { parse } from 'csv-parse';
import path from "path";
import fs from "fs";
import { finished } from "stream";
import { promisify } from "util";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import prisma from "@/libs/prisma.server";
import { getDealsWithContactsFromHubspot } from "@/libs/hubspot/utils";
import type { UserCreateSchema } from "@/libs/user/schema";
import { createUserInDbAndHubspot } from "@/libs/user/utils";
import type { DealCreateSchema } from "@/libs/deal/schema";
import { ProjectName } from "@/libs/schema";
import { createDealForAdmin } from "@/libs/deal/utils.server";
import type { DealWithInvestmentStats } from "@/libs/types";

const finishedAsync = promisify(finished);

const projectName: ProjectName = ProjectName["Bakers Place"];
const filePath = path.join('./seedData', `Investor Cap Table - ${projectName}.csv`);

interface DealRecord {
    V2?: string;
    investorName: string;
    orgName?: string;
    dealHubspotId: string;
    financingType: DealFinancingType;
    ownershipType: DealOwnershipType;
    dealAmount?: number;
    dateSigned: Date;
    dateFunded: Date;
    equityUnitType?: string;
    debtInterestRatePerc?: number;
    linkToDocumentFolder: string;
    debtMinTerm?: number;
    debtMaxTerm?: number;
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

function getDealOwnershipType(ownershipType: string): DealOwnershipType {
    switch (ownershipType) {
        case 'COMMON':
            return DealOwnershipType.COMMON;
        case 'CORPORATION':
            return DealOwnershipType.CORPORATION;
        case 'INDIVIDUAL':
            return DealOwnershipType.INDIVIDUAL;
        case 'JOINT':
            return DealOwnershipType.JOINT;
        case 'MARITAL':
            return DealOwnershipType.MARITAL;
        case 'TRUST':
            return DealOwnershipType.TRUST;
        case 'PARTNERSHIP':
            return DealOwnershipType.PARTNERSHIP;
        case 'OTHER':
            return DealOwnershipType.OTHER;
        default:
            throw new Error(`Invalid ownership type: ${ownershipType}`);
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
        /* eslint-disable */
        let record;
        while (record = parser.read()) {
            let dealRecord: DealRecord | null = null;
            try {
                dealRecord = {
                    investorName: record['Investor Name'],
                    orgName: record['Investing Entity'],
                    dealHubspotId: record['Hubspot ID'],
                    financingType: getDealType(record['Type']),
                    ownershipType: getDealOwnershipType(record['OwnershipType']),
                    dealAmount: getNumbersFromString(record['Amount ($)']),
                    dateSigned: new Date(record['Date Investor Signed']),
                    dateFunded: new Date(record['Effective/Funded Date']),
                    equityUnitType: getEquityUnitType(record['Equity Unit']),
                    debtInterestRatePerc: getNumbersFromString(record['PN Unit']),
                    linkToDocumentFolder: record['Link to Documents'],
                    V2: record.V2,
                    debtMinTerm: getNumbersFromString(record['PN Min Term Months']),
                    debtMaxTerm: getNumbersFromString(record['PN Max Term Months']),
                }
                if (dealRecord.V2 === 'TRUE') dealRecords.push(dealRecord);
                /* eslint-enable */
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

async function findOrCreateClerkUser(email: string, firstname: string, lastname: string, phone?: string) {
    const clerkData = {
        emailAddress: [email],
        firstName: firstname.trim(),
        lastName: lastname.trim(),
    } as {
        emailAddress: string[];
        firstName: string;
        lastName: string;
        phoneNumber?: string[];
    }

    if (phone) clerkData.phoneNumber = [phone];

    try {
        const exisingClerkUsers = await clerkClient.users.getUserList({ emailAddress: [email] });
        if (exisingClerkUsers[0]) {
            return exisingClerkUsers[0];
        }

        const newClerkUser = await clerkClient.users.createUser(clerkData);
        if (!newClerkUser) {
            throw new Error("Error creating Clerk user");
        }
        return newClerkUser;
    } catch (e) {
        console.error("Error creating Clerk user for clerkdata", clerkData);
        console.error(getErrorMessage(e));
        throw new Error(getErrorMessage(e));
    }

}

export async function POST() {
    const requestingClerkUser = await currentUser();
    if (!requestingClerkUser) return jsonResponse({ error: "Clerk User not found" }, 404);
    // if (! await isAdminUser(requestingClerkUser.id)) return jsonResponse({ error: "User is not an admin" }, 403);

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
        const cleanPhone = phone?.replace(/\D/g, '');

        let dealOwner = await prisma.user.findFirst({ where: { email } });
        console.log("i:", i);
        if (i > 10) break;
        if (!dealOwner) {
            try {
                const clerkUser = await findOrCreateClerkUser(email, firstname, lastname, cleanPhone);

                const dbUserData = {
                    clerkId: clerkUser.id,
                    email,
                    firstName: firstname.trim(),
                    lastName: lastname.trim(),
                    hubspotId: hs_object_id,
                } as UserCreateSchema;
                if (cleanPhone) dbUserData.phoneNumber = cleanPhone;
                dbUserData.hubspotId = dbUserData.hubspotId ?? '';

                dealOwner = await createUserInDbAndHubspot(dbUserData);

            } catch (e) {
                console.error(`Error creating Clerk user with email ${email}`);
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

        // potentially create a second org for joint ownership
        let altOrgId: number | undefined;
        if (dealInput.ownershipType !== DealOwnershipType.INDIVIDUAL && dealInput.orgName) {
            // create an org of this type
            const orgCreateData = {
                name: dealInput.orgName.trim(),
                ownershipType: dealInput.ownershipType,
                ownerId: dealOwner.id,
                members: {
                    create: {
                        type: MembershipType.OWNER,
                        userId: dealOwner.id
                    }
                }
            };
            try {
                const newOrg = await prisma.organization.create({
                    data: orgCreateData
                });
                altOrgId = newOrg.id;
            } catch (e) {
                console.error("Error creating organization:", e);
            }
        }

        const dealCreateData: DealCreateSchema = {
            amount: dealInput.dealAmount,
            projectId: projectId,
            organizationId: altOrgId ?? dealOwner.userOrgId,
            dealStage: 5,
            financingType: dealInput.financingType,
            hubspotId: id,
            closingDate: dealInput.dateFunded,
            signaturesCompletedDate: dealInput.dateSigned,
            dateFundsSent: dealInput.dateFunded,
            paymentMethod: PaymentMethod.CHECK,
            paymentReferenceId: 'N/A',
        }
        if (dealInput.debtMinTerm) dealCreateData.debtMinTerm = dealInput.debtMinTerm;
        if (dealInput.debtMaxTerm) dealCreateData.debtMaxTerm = dealInput.debtMaxTerm;
        if (dealInput.debtInterestRatePerc) dealCreateData.debtInterestRatePerc = dealInput.debtInterestRatePerc

        const newDeal = await createDealForAdmin(dealCreateData, dealOwner);
        newDealsArr.push(newDeal);

        i++;
    }

    return jsonResponse(newDealsArr, 201);
}
