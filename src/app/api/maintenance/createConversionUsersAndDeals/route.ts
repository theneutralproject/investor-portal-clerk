'use server';
import {
  DealFinancingType,
  DealOwnershipType,
  DealStatus,
  MembershipType,
} from '@prisma/client';
import { parse } from 'csv-parse';
import path from 'path';
import fs from 'fs';
import { finished } from 'stream';
import { promisify } from 'util';
import { getAuth } from '@clerk/nextjs/server';
import { getErrorMessage, jsonResponse } from '@/libs/utils.server';
import prisma from '@/libs/prisma.server';
import {
  getDealsWithContactsFromHubspot,
  updateHubspotDealProperties,
} from '@/libs/hubspot/utils.server';
import type { UserCreateSchema } from '@/libs/user/schema';
import { createUserInDbAndHubspot } from '@/libs/user/utils.server';
import { DealStage, type DealCreateSchema } from '@/libs/deal/schema';
import { createDealForAdmin } from '@/libs/deal/utils.server';
import type { DealWithInvestmentStats } from '@/libs/types';
import {
  findOrCreateClerkUser,
  isAdminUser,
} from '@/libs/maintenance/utils.server';
import { InvestmentEntity, ProjectName } from '@/libs/project/schema';
import { NextRequest } from 'next/server';
import { HubspotDealUpdate } from '@/libs/hubspot/schema';

const finishedAsync = promisify(finished);

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
  entityTin?: string; //TODO: add to schema
  dateSigned: Date;
  startDealAmount?: number;
  dateStartFunded: Date;
  endDealAmount?: number; //TODO: add to schema
  dateEndFunded?: Date; //TODO: add to schema
  debtEndInterestRatePerc?: number;
  endEquityUnitType?: string;
  endDebtMinTerm?: number;
  endDebtMaxTerm?: number;
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
      let dealRecord: DealRecord | null = null;
      try {
        if (record.V2 === 'TRUE' && record.addedInV2 !== 'TRUE') {
          dealRecord = {
            investorName: record['Investor Name'],
            orgName: record['Investing Entity'],
            entityTin: record['Entity TIN'],
            dealHubspotId: record['Hubspot ID'],
            financingType: getDealType(record['Type']),
            ownershipType: getDealOwnershipType(record['OwnershipType']),
            startDealAmount: getNumbersFromString(record['Amount ($)']),
            endDealAmount: getNumbersFromString(record['Conversion Amount']),
            dateSigned: new Date(record['Date Investor Signed']),
            dateStartFunded: new Date(record['Effective/Funded Date']),
            endEquityUnitType: getEquityUnitType(record['Equity Unit']),
            dateEndFunded: new Date(record['Conversion Date']),
            investmentEntity: record['Entity Name'],
            debtEndInterestRatePerc: getNumbersFromString(record['PN Unit']),
            V2: record.V2,
            addedInV2: record['addedInV2'],
            endDebtMinTerm: getNumbersFromString(record['PN Term']) ?? 48,
            endDebtMaxTerm: getNumbersFromString(record['PN Term']) ?? 48,
          };

          dealRecords.push(dealRecord);
        }
      } catch (e) {
        console.error(
          `unable to create deal record for HSID ${record['Hubspot ID']} - skipping to next one:\n`,
          e
        );
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

  const dealInputs = (await getDealsFromCsv()).filter(d => {
    return (
      d.financingType === DealFinancingType.promissory_to_equity ||
      d.financingType === DealFinancingType.promissory_note_at_closing
    );
  });
  const dealHubspotIds = dealInputs.map(deal => deal.dealHubspotId);

  // get deal and user info from hubspot
  const hsSearchResults = await getDealsWithContactsFromHubspot(dealHubspotIds);

  if (dealHubspotIds.length !== hsSearchResults.deals?.length) {
    console.error('Some deals not found in hubspot:');
    console.error(
      dealHubspotIds.filter(
        id => !hsSearchResults.deals?.find(deal => deal.id === id)
      )
    );
  } else {
    console.log('All deals found in hubspot');
  }

  // find all deals in db for this project
  const allDBDeals = await prisma.deal.findMany({
    where: { projectId, dealStage: DealStage.CLOSED },
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

  // for conversion deals:
  // 1. create the old deal, and set status to converted. Also set status to converted in hubspot
  // 2. create the new deal, and create the new deal in hubspot

  const newStartDealsArr: DealWithInvestmentStats[] = [];
  const newEndDealsArr: DealWithInvestmentStats[] = [];
  // loop through deals and create missing users and deals
  let i = -1;
  for await (const dealcontact of hsSearchResults.dealContacts) {
    // create user if not found
    i++;
    console.log('i:', i);
    if (i > 2) break;
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
      } catch (userCreateError) {
        console.error(`Error creating Clerk user with email ${email}`);
        console.error(getErrorMessage(userCreateError));
      }
    }

    if (!dealOwner?.userOrgId) {
      console.error('User not found or created');
      continue;
    }

    // we now have a user with org. create FIRST deal
    const hsDeal = dealcontact.deal;
    if (!hsDeal) {
      console.error('hubspot Deal not found for contact:', dealcontact.contact);
      continue;
    }
    const { id: hubspotId } = hsDeal;

    // find deal in csvdata
    const dealInput = dealInputs.find(deal => deal.dealHubspotId === hubspotId);
    if (!dealInput?.startDealAmount) {
      console.error('Deal not found in csv data');
      continue;
    }

    if (
      dealInput.financingType === 'promissory_note_now' ||
      dealInput.financingType === 'equity'
    ) {
      console.warn(
        'Deal financing type not supported by this function:',
        dealInput.financingType
      );
      continue;
    }
    // potentially create a second org for joint ownership
    let altOrgId: number | undefined;
    if (dealInput.ownershipType !== DealOwnershipType.INDIVIDUAL) {
      if (!dealInput.orgName) {
        console.error('Org name missing in spreadsheet', dealInput);
        continue;
      }

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

    console.log(
      'Creating START deal for user:',
      dealOwner.firstName,
      dealOwner.lastName,
      'deal amount:',
      dealInput.startDealAmount
    );

    const startDealCreateData: DealCreateSchema = {
      amount: dealInput.startDealAmount,
      projectId: projectId,
      organizationId: altOrgId ?? dealOwner.userOrgId,
      dealStage: DealStage.CLOSED,
      financingType: DealFinancingType.promissory_note_now,
      hubspotId,
      closingDate: dealInput.dateStartFunded,
      signaturesCompletedDate: dealInput.dateSigned,
      dateFundsSent: dealInput.dateStartFunded,
      investmentEntity: dealInput.investmentEntity,
      dateMatured: dealInput.dateEndFunded,
      status: DealStatus.MATURED,
    };
    if (dealInput.endDebtMinTerm)
      startDealCreateData.debtMinTerm = dealInput.endDebtMinTerm;
    if (dealInput.endDebtMaxTerm)
      startDealCreateData.debtMaxTerm = dealInput.endDebtMaxTerm;
    if (dealInput.debtEndInterestRatePerc)
      startDealCreateData.debtInterestRatePerc =
        dealInput.debtEndInterestRatePerc;
    console.log('dealCreateData:', startDealCreateData);
    let newStartDeal: DealWithInvestmentStats;
    let newEndDeal: DealWithInvestmentStats;
    try {
      newStartDeal = await createDealForAdmin(startDealCreateData, dealOwner);
      newStartDealsArr.push(newStartDeal);
    } catch (startDealCreateError) {
      console.error('Error creating start deal', dealInput);
      console.error(getErrorMessage(startDealCreateError));
      continue;
    }

    // create END deal
    const endDealCreateData: DealCreateSchema = {
      amount: dealInput.endDealAmount,
      projectId: projectId,
      organizationId: altOrgId ?? dealOwner.userOrgId,
      dealStage: DealStage.CLOSED,
      financingType:
        dealInput.financingType === DealFinancingType.promissory_to_equity
          ? DealFinancingType.equity
          : DealFinancingType.promissory_note_now,
      closingDate: dealInput.dateEndFunded,
      signaturesCompletedDate: dealInput.dateSigned,
      investmentEntity: InvestmentEntity[projectName],
      status: DealStatus.ACTIVE,
    };
    if (
      endDealCreateData.financingType === DealFinancingType.promissory_note_now
    ) {
      endDealCreateData.debtMinTerm = dealInput.endDebtMinTerm;
      endDealCreateData.debtMaxTerm = dealInput.endDebtMaxTerm;
      endDealCreateData.debtInterestRatePerc =
        dealInput.debtEndInterestRatePerc;
    }
    try {
      newEndDeal = await createDealForAdmin(endDealCreateData, dealOwner);
      newEndDealsArr.push(newEndDeal);
    } catch (endDealCreateError) {
      console.error('Error creating end deal', dealInput);
      console.error(getErrorMessage(endDealCreateError));
      continue;
    }

    // create conversion entry
    const conversionData = {
      startDealId: newStartDeal.id,
      endDealId: newEndDeal.id,
    };
    await prisma.dealConversion.create({ data: conversionData });

    try {
      // update hubspot deals with new start and end deal ids
      const hsStartDealUpdate: HubspotDealUpdate = {
        hubspotDealId: parseInt(newStartDeal.hubspotId),
        properties: [
          { name: 'deal_status', value: DealStatus.MATURED },
          { name: 'hubspot_start_deal_id', value: newStartDeal.hubspotId },
          { name: 'hubspot_end_deal_id', value: newEndDeal.hubspotId },
        ],
      };
      await updateHubspotDealProperties(hsStartDealUpdate);

      const hsEndDealUpdate: HubspotDealUpdate = {
        hubspotDealId: parseInt(newEndDeal.hubspotId),
        properties: [
          { name: 'hubspot_start_deal_id', value: newStartDeal.hubspotId },
          { name: 'hubspot_end_deal_id', value: newEndDeal.hubspotId },
        ],
      };
      await updateHubspotDealProperties(hsEndDealUpdate);
    } catch (e) {
      console.error('Error creating Hubspot conversion:', e);
    }
  }

  return jsonResponse({ newStartDealsArr, newEndDealsArr }, 201);
}
