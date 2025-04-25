'use server';
import { DealFinancingType, DealOwnershipType, Role } from '@prisma/client';
import { parse } from 'csv-parse';
import fs from 'fs';
import { finished } from 'stream';
import { promisify } from 'util';
import { getErrorMessage } from '../utils.server';
import { clerkClient } from '@clerk/nextjs/server';
import prisma from '../prisma.server';

const finishedAsync = promisify(finished);

export async function isAdminUser(clerkId: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { clerkId, role: Role.ADMIN },
  });
  return !!user;
}

export async function findOrCreateClerkUser(
  email: string,
  firstname: string,
  lastname: string,
  phone?: string,
  metadata?: { [x: string]: any }
) {
  const clerkData = {
    emailAddress: [email],
    firstName: firstname.trim(),
    lastName: lastname.trim(),
  } as {
    emailAddress: string[];
    firstName: string;
    lastName: string;
    phoneNumber?: string[];
  };

  if (phone) clerkData.phoneNumber = [phone];
  const authClient = await clerkClient();

  try {
    const exisingClerkUsers = await authClient.users.getUserList({
      emailAddress: [email],
    });
    if (exisingClerkUsers.data[0]) {
      console.log('User already exists in Clerk', email);
      return exisingClerkUsers.data[0];
    }

    if (!phone) {
      console.log(
        'User does not exist in Clerk and phone number is missing for user:',
        email
      );
      return null;
    }
    const newClerkUser = await authClient.users.createUser({
      ...clerkData,
      publicMetadata: metadata,
    });
    if (!newClerkUser) {
      throw new Error('Error creating Clerk user');
    }
    return newClerkUser;
  } catch (e) {
    console.error('Error creating Clerk user for clerkdata', clerkData);
    console.error(getErrorMessage(e));
    throw new Error(getErrorMessage(e));
  }
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

export interface DealRecord {
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

export async function getDealsFromCsv(filePath: string) {
  // read csv file
  const csvAsString = fs.readFileSync(filePath, 'utf8');
  const parser = parse(csvAsString, { columns: true });
  const dealRecords: DealRecord[] = [];

  parser.on('readable', () => {
    let record;
    while ((record = parser.read())) {
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
        };
        if (dealRecord.V2 === 'TRUE') dealRecords.push(dealRecord);
      } catch (e) {
        console.error(
          'unable to create deal record - skipping to next one:\n',
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
