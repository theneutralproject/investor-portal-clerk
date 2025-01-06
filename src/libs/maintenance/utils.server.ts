import { DealFinancingType, DealOwnershipType } from '@prisma/client';
import { parse } from 'csv-parse';
import fs from 'fs';
import { finished } from 'stream';
import { promisify } from 'util';

const finishedAsync = promisify(finished);

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
    /* eslint-disable */
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
        /* eslint-enable */
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
