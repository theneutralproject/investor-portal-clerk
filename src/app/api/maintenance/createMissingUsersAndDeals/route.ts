'use server';
import {
  DealFinancingType,
  DealOwnershipType,
  MembershipType,
  PaymentMethod,
} from '@prisma/client';
import { parse } from 'csv-parse';
import path from 'path';
import fs from 'fs';
import { finished } from 'stream';
import { promisify } from 'util';
import { getAuth } from '@clerk/nextjs/server';
import { getErrorMessage, jsonResponse } from '@/libs/utils.server';
import prisma from '@/libs/prisma.server';
import { getDealsWithContactsFromHubspot } from '@/libs/hubspot/utils.server';
import type { UserCreateSchema } from '@/libs/user/schema';
import { createUserInDbAndHubspot } from '@/libs/user/utils.server';
import { DealStage, type DealCreateSchema } from '@/libs/deal/schema';
import { createDealForAdmin } from '@/libs/deal/utils.server';
import type { DealWithInvestmentStats } from '@/libs/types';
import {
  findOrCreateClerkUser,
  isAdminUser,
} from '@/libs/maintenance/utils.server';
import { ProjectName } from '@/libs/project/schema';
import { NextRequest } from 'next/server';
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { DealContact } from '@/libs/hubspot/schema';

const finishedAsync = promisify(finished);

// const projectName: ProjectName = ProjectName['519 W Main'];
const projectName: ProjectName = ProjectName['The Edison'];
const projectId = 2;
const filePath = path.join(
  './seedData',
  `Investor Cap Table - ${projectName}.csv`
);

interface DealRecord {
  V2?: string;
  addedInV2?: string;
  investorName: string;
  orgName?: string;
  dealHubspotId: string;
  financingType: DealFinancingType;
  ownershipType: DealOwnershipType;
  investmentEntity?: string;
  dealAmount?: number;
  dateSigned: Date;
  dateFunded: Date;
  equityUnitType?: string;
  debtInterestRatePerc?: number;
  debtMinTerm?: number;
  debtMaxTerm?: number;
  debtTerm?: number;
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
  if (!val || val === 'N/A') return undefined;
  const num = val.replace(/[^0-9.-]+/g, '');
  return parseFloat(num);
}

function getEquityUnitType(val: string): string | undefined {
  return val === 'A' || val === 'C' ? val : undefined;
}

async function getDealsFromCsv() {
  // read csv file
  const csvAsString = fs.readFileSync(filePath, 'utf8');
  const parser = parse(csvAsString, { columns: true });
  const dealRecords: DealRecord[] = [];

  parser.on('readable', () => {
    let record;
    while ((record = parser.read())) {
      if (record.V2 === 'TRUE' && record.addedInV2 === 'FALSE') {
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
            investmentEntity: record['Entity Name'],
            debtInterestRatePerc: getNumbersFromString(record['PN Unit']),
            V2: record.V2,
            addedInV2: record.addedInV2,
            debtMinTerm:
              getNumbersFromString(record['PN Min Term Months']) ??
              48 /**not listed in Edison data */,
            debtMaxTerm:
              getNumbersFromString(record['PN Max Term Months']) ??
              48 /**not listed in Edison data */,
            debtTerm:
              getNumbersFromString(record['PN Term']) ??
              48 /**not reliably listed in Edison data */,
          };
          dealRecords.push(dealRecord);
        } catch (e) {
          console.error(
            'unable to parse deal record - skipping to next one:\n',
            getErrorMessage(e)
          );
        }
      }
    }
  });
  parser.on('error', function (err) {
    console.error('error parsing csv file');
    console.error(err.message);
    throw new Error(err.message);
  });
  parser.on('end', function () {
    console.log('done parsing csv file', dealRecords.length);
    return dealRecords;
  });
  await finishedAsync(parser);
  return dealRecords;
}

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) return jsonResponse({ error: 'Clerk User not found' }, 404);
  if (!(await isAdminUser(userId))) {
    return jsonResponse({ error: 'User is not an admin' }, 403);
  }

  const dealInputs = (await getDealsFromCsv()).filter(
    deal =>
      deal.financingType === 'promissory_note_now' ||
      deal.financingType === 'equity'
  );
  const dealHubspotIds = dealInputs.map(deal => deal.dealHubspotId);
  console.log(dealHubspotIds);

  // get deal and user info from hubspot
  let hsSearchResults: {
    deals: SimplePublicObject[];
    contacts: SimplePublicObject[];
    dealContacts: DealContact[];
  };
  try {
    hsSearchResults = await getDealsWithContactsFromHubspot(dealHubspotIds);
  } catch (e) {
    console.error('Error fetching deals from hubspot:', e);
    return jsonResponse({ error: 'Error fetching deals from hubspot' }, 500);
  }
  console.log('hsSearchResults:', hsSearchResults.deals?.length);
  if (dealHubspotIds.length !== hsSearchResults.deals?.length) {
    console.error('Some deals not found in hubspot');
  } else {
    console.log('All deals found in hubspot');
  }

  // find all deals in db
  const allDBDeals = await prisma.deal.findMany({
    where: { projectId, dealStage: DealStage.CLOSED },
    // select: { hubspotId: true }
  });
  // filter out deals that are already in the db
  const missingHubspotDeals = hsSearchResults.deals?.filter(
    hsDeal => !allDBDeals.find(dbDeal => dbDeal.hubspotId === hsDeal.id)
  );
  const extraDBDeals = allDBDeals.filter(dbDeal =>
    hsSearchResults.deals?.find(hsDeal => hsDeal.id === dbDeal.hubspotId)
  );
  console.log('missingHubspotDeals:', missingHubspotDeals?.length);
  console.log(missingHubspotDeals?.map(deal => deal.id));
  console.log('allDBDeals:', allDBDeals.length);
  console.log(allDBDeals.map(deal => deal.hubspotId));
  console.log('extraDBDeals:', extraDBDeals.length);
  console.log(extraDBDeals.map(deal => deal.hubspotId));
  // return jsonResponse({ missingHubspotDeals, allDBDeals }, 200);

  const newDealsArr: DealWithInvestmentStats[] = [];
  // loop through deals and create missing users and deals
  let i = -1;
  for await (const dealcontact of hsSearchResults.dealContacts) {
    // create user if not found
    i++;
    console.log('i:', i);
    if (i > 3) break;
    const { email, firstname, lastname, hs_object_id, phone } =
      dealcontact.contact.properties;
    if (!email || !firstname || !lastname || !hs_object_id) {
      console.error('SKIPPING - deal contact incomplete:', dealcontact.contact);
      continue;
    }
    const cleanPhone = phone?.replace(/\D/g, '');
    let dealOwner = await prisma.user.findFirst({ where: { email } });
    if (!dealOwner) {
      try {
        const clerkUser = await findOrCreateClerkUser(
          email,
          firstname,
          lastname,
          cleanPhone
        );

        const dbUserData = {
          clerkId: clerkUser?.id,
          email,
          firstName: firstname.trim(),
          lastName: lastname.trim(),
          hubspotId: hs_object_id,
        } as UserCreateSchema;
        if (cleanPhone) dbUserData.phoneNumber = cleanPhone;
        dbUserData.hubspotId = dbUserData.hubspotId ?? '';

        dealOwner = await createUserInDbAndHubspot(dbUserData);
      } catch (__e) {
        console.error(`Error creating Clerk user with email ${email}`);
      }
    }

    if (!dealOwner?.userOrgId) {
      console.error('User not found or created');
      continue;
    }

    // we now have a user with org. create deal
    const hsDeal = dealcontact.deal;
    if (!hsDeal) {
      console.error('Deal not found for contact:', dealcontact.contact);
      continue;
    }
    const { id: hubspotId } = hsDeal;

    // find deal in csvdata
    const dealInput = dealInputs.find(deal => deal.dealHubspotId === hubspotId);
    if (!dealInput?.dealAmount) {
      console.error('Deal not found in csv data');
      continue;
    }

    // get project id:
    let projectId: number;
    switch (projectName) {
      case ProjectName['Bakers Place']:
        projectId = 2;
        break;
      case ProjectName['519 W Main']:
        projectId = 3;
        break;
      case ProjectName['The Edison']:
        projectId = 1;
        break;
      default:
        console.error('Project not found');
        continue;
    }

    // potentially create a second org for joint ownership
    let altOrgId: number | undefined;
    if (
      dealInput.ownershipType !== DealOwnershipType.INDIVIDUAL &&
      dealInput.orgName
    ) {
      // check if org already exists
      const altOrg = (
        await prisma.organization.findMany({ where: { ownerId: dealOwner.id } })
      ).filter(org => org.name === dealInput.orgName)[0];
      if (altOrg) {
        altOrgId = altOrg.id;
      } else {
        // create an org of this type
        const orgCreateData = {
          name: dealInput.orgName.trim(),
          ownershipType: dealInput.ownershipType,
          ownerId: dealOwner.id,
          members: {
            create: { type: MembershipType.OWNER, userId: dealOwner.id },
          },
        };
        try {
          const newOrg = await prisma.organization.create({
            data: orgCreateData,
          });
          altOrgId = newOrg.id;
        } catch (e) {
          console.error('Error creating organization:', e);
        }
      }
    }

    console.log(
      'Creating deal for user:',
      dealOwner.firstName,
      dealOwner.lastName,
      'deal amount:',
      dealInput.dealAmount
    );

    const dealCreateData: DealCreateSchema = {
      amount: dealInput.dealAmount,
      projectId: projectId,
      organizationId: altOrgId ?? dealOwner.userOrgId,
      dealStage: DealStage.CLOSED,
      financingType: dealInput.financingType,
      hubspotId,
      closingDate: dealInput.dateFunded,
      signaturesCompletedDate: dealInput.dateSigned,
      dateFundsSent: dealInput.dateFunded,
      paymentMethod: PaymentMethod.CHECK,
      paymentReferenceId: 'N/A',
      investmentEntity: dealInput.investmentEntity,
    };
    if (dealInput.debtMinTerm)
      dealCreateData.debtMinTerm = dealInput.debtMinTerm;
    if (dealInput.debtMaxTerm)
      dealCreateData.debtMaxTerm = dealInput.debtMaxTerm;
    if (dealInput.debtInterestRatePerc)
      dealCreateData.debtInterestRatePerc = dealInput.debtInterestRatePerc;
    console.log('dealCreateData:', dealCreateData);
    try {
      const newDeal = await createDealForAdmin(dealCreateData, dealOwner);
      newDealsArr.push(newDeal);
    } catch (__e) {
      console.error('Error creating deal above', dealOwner);
      continue;
    }
  }

  return jsonResponse(newDealsArr, 201);
}
