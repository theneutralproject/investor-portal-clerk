import 'server-only';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.server';
import { DealDocumentType, MembershipType, Role } from '@prisma/client';
import { type MatchResponseObject, MatchConfidence } from './schema';
import { storageClient } from '../supabase';
import type { DealWithFullOrgAndSlimProject } from '../types';
import Logger from '../logger';
import { isFileLike } from '../document/utils.client';

// eslint-disable-next-line
const PdfParse = require('pdf-parse');

/**
 *
 * @param request
 * @returns an admin user if the jwt is valid
 */
export async function getAdminFromRequest(request: NextRequest) {
  // get jwt from request headers
  const token = request.headers.get('Authorization');

  if (!token) {
    throw new Error('No token provided');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const { email } = decoded as { id: number; email: string };
    if (!email) {
      throw new Error('No email found in token');
    }
    const adminUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase(), role: Role.ADMIN },
    });
    if (!adminUser) {
      throw new Error('Admin user not found');
    }
    return adminUser;
  } catch (__error) {
    // return new Error('Invalid or Expired token');
    throw __error;
  }
}

function calcConfidenceScore(matchCount: number): MatchConfidence {
  if (matchCount >= 6.5) {
    return MatchConfidence.HIGH;
  } else if (matchCount >= 4) {
    return MatchConfidence.MEDIUM;
  } else if (matchCount >= 3) {
    return MatchConfidence.LOW;
  } else return MatchConfidence.NONE;
}

export async function matchDealWithPdf(
  deals: DealWithFullOrgAndSlimProject[],
  file: File
) {
  // match the file to the correct deal
  const arrayBuffer = await file.arrayBuffer();
  const dataBuffer = Buffer.from(arrayBuffer);

  const { text } = (await PdfParse(dataBuffer)) as { text: string };
  let i = 0;
  let bestMatch: MatchResponseObject = {
    pdfName: file.name,
    confidence: MatchConfidence.NONE,
    matchedWords: [],
    matchScore: 0,
  };
  while (i < deals.length) {
    const deal = deals[i];
    if (!deal) {
      i++;
      continue;
    }

    // console.log(`Matching deal ${deal.transactionId}`);
    const {
      organization,
      transactionId,
      project: { name: projectName },
    } = deal;
    const orgMembers = organization.members;
    const owner = orgMembers.find(
      member => member.type === MembershipType.OWNER
    );
    if (!owner || !owner.user) {
      i++;
      continue;
    }
    const wordScoreTuple = [] as [string, number][];
    const { firstName, lastName, ssn, address } = owner.user;
    wordScoreTuple.push([firstName.toLowerCase(), 1]);
    wordScoreTuple.push([lastName.toLowerCase(), 1]);
    wordScoreTuple.push([`${firstName} ${lastName}`.toLowerCase(), 2]);
    wordScoreTuple.push([projectName.toLowerCase(), 2]);
    wordScoreTuple.push([transactionId.toLowerCase(), 1]);
    wordScoreTuple.push([organization.name.toLowerCase(), 2]);
    if (ssn) {
      wordScoreTuple.push([ssn.slice(-4), 0.8]);
      wordScoreTuple.push([ssn, 3]);
    }
    if (address) {
      wordScoreTuple.push([address.street.toLowerCase(), 0.5]);
      wordScoreTuple.push([address.city.toLowerCase(), 0.3]);
      wordScoreTuple.push([address.zipcode.toLowerCase(), 0.3]);
    }
    if (organization.address) {
      wordScoreTuple.push([organization.address.street.toLowerCase(), 0.5]);
      wordScoreTuple.push([organization.address.city.toLowerCase(), 0.3]);
      wordScoreTuple.push([organization.address.zipcode.toLowerCase(), 0.3]);
    }
    if (organization.tin) {
      wordScoreTuple.push([organization.tin.slice(-4), 0.8]);
      wordScoreTuple.push([organization.tin, 3]);
    }
    let matchScore = 0.0;
    const matchedWords = [] as string[];
    wordScoreTuple.forEach(([word, score]) => {
      if (word.length < 3) return; // skip short words
      // const numMatches = text.toLowerCase().split(word).length - 1;
      // if (numMatches > 0) {
      //     matchScore += numMatches * score;
      //     matchedWords.push(word);
      //     console.log(`found match for ${word}`);
      // }
      if (text.toLowerCase().includes(word)) {
        matchScore += score;
        matchedWords.push(word);
        // console.log(`found match for ${word}`);
      }
    });
    if (matchScore >= 3) {
      if (!bestMatch || matchScore > bestMatch?.matchedWords.length) {
        console.log(`\t-->best match so far: ${transactionId}`);
        deal.organizationId = organization.id;
        bestMatch = {
          pdfName: file.name,
          deal: deal,
          owner: owner.user,
          organization,
          projectName,
          confidence: calcConfidenceScore(matchScore),
          matchedWords,
          matchScore,
        };
      }
    }
    i++;
  }
  return bestMatch;
}

// Type definitions for file-like objects
interface FileDetails {
  name: string;
  type: string;
  size?: number;
}

// Helper function to safely get file details
export function getFileDetails(file: FormDataEntryValue): FileDetails {
  if (isFileLike(file)) {
    return {
      name: file.name,
      type: file.type,
      size: file.size,
    };
  }
  // Fallback for non-File objects
  return {
    name: `upload-${Date.now()}`,
    type: 'application/octet-stream',
  };
}

export function getFileExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'application/pdf': '.pdf',
    'image/png': '.png',
    'image/jpg': '.jpg',
    'image/jpeg': '.jpg',
  };
  return extensions[mimeType] ?? '';
}

export async function uploadFile(
  file: FormDataEntryValue,
  type: string,
  dealOrOrgId: number
): Promise<string> {
  const fileDetails = getFileDetails(file);
  let fileName = `${fileDetails.name || `upload-${Date.now()}`}`;
  if (!fileName.toLowerCase().endsWith('.pdf')) {
    fileName += '.pdf';
  }

  try {
    let fileData: ArrayBuffer;
    if (isFileLike(file)) {
      fileData = await file.arrayBuffer();
    } else if (typeof file === 'string') {
      // Handle string data if needed
      fileData = new TextEncoder().encode(file).buffer;
    } else {
      throw new Error('Invalid file format');
    }
    console.log('uploading file to storage');
    console.log('type', type);
    console.log('dealOrOrgId', dealOrOrgId);
    console.log('fileName', fileName);
    console.log('type', fileDetails.type);
    const { data, error } = await storageClient
      .from(`${type}-documents`)
      .upload(`${type}-${dealOrOrgId}/${fileName}`, fileData, {
        contentType: fileDetails.type,
      });

    if (error) {
      console.error('File upload error:', error);
      throw new Error(`File upload failed: ${error.message}`);
    }

    if (!data?.path) {
      throw new Error('No path returned from storage');
    }

    return data.path;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
}

export async function createDocumentEntry(
  documentType: string,
  id: number,
  name: string,
  path: string,
  key: string,
  userId: number,
  dealDocumentType?: DealDocumentType,
  taxYear?: number
) {
  Logger.log({
    message: 'Creating document entry:',
    extra: {
      documentType,
      id,
      name,
      path,
      key,
      userId,
      dealDocumentType,
      taxYear,
    },
  });
  try {
    if (documentType === 'deal') {
      if (!dealDocumentType) {
        throw new Error('Missing required dealDocumentType field');
      }
      if (dealDocumentType === DealDocumentType.K1 && !taxYear) {
        throw new Error('Missing required taxYear field for K1 document');
      }
      return await prisma.dealDocument.create({
        data: {
          dealId: id,
          name,
          path,
          type: dealDocumentType,
          uploadedById: userId,
          taxYear,
        },
      });
    } else {
      return await prisma.organizationDocument.create({
        data: {
          organizationId: id,
          name,
          path,
          key,
          uploadedById: userId,
        },
      });
    }
  } catch (error) {
    Logger.error(error, null, {
      message: `Error creating document entry: ${(error as Error).message}`,
    });
    throw error;
  }
}
