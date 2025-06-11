import { getAuth } from '@clerk/nextjs/server';
import { DealDocumentType, Role } from '@prisma/client';
import { NextRequest } from 'next/server';
import Logger from '../logger';
import prisma from '../prisma.server';
import { errorResponse } from '../utils.server';
import { AdvisorContext } from './schema';

/**
 * Converts a user-entered search term into a matching DealDocumentType if valid.
 * @param input The raw search term from the user.
 * @returns A matching DealDocumentType or null if none matches.
 */
export function mapDocumentTypeSearch(
  input?: string | null
): DealDocumentType | null {
  if (!input) return null;

  const normalized = input.trim().toLowerCase();

  if (DealDocumentType[input as keyof typeof DealDocumentType])
    return DealDocumentType[input as keyof typeof DealDocumentType];

  switch (normalized) {
    case 'k1':
      return DealDocumentType.K1;
    case 'report':
    case 'project report':
      return DealDocumentType.REPORT;
    case 'investment':
    case 'investment document':
    case 'doc':
    case 'document':
      return DealDocumentType.INVESTMENT_DOCUMENT;
    case 'accreditation':
    case 'verification':
    case 'verification accreditation':
      return DealDocumentType.VERIFICATION_ACCREDITATION;
    default:
      return null;
  }
}

export async function getAdvisorContext(
  request: NextRequest
): Promise<AdvisorContext> {
  const { userId: clerkId, sessionClaims } = getAuth(request);

  if (!clerkId) {
    Logger.warn('User not authenticated');
    return errorResponse('User not authenticated', 401);
  }

  const userId = sessionClaims?.metadata?.investorPortalId;

  if (!userId) {
    return errorResponse('User not found', 404, {
      request,
      extra: { method: 'sessionClaims?.metadata?.investorPortalId' },
    });
  }

  const dbUser = await prisma.user.findFirst({
    where: { OR: [{ clerkId }, { id: userId }] },
  });

  if (!dbUser || dbUser.role !== Role.ADVISOR) {
    return errorResponse('Unauthorized or not found', 403, {
      request,
      extra: { user: dbUser },
    });
  }

  const advisorFirmEmployee = await prisma.advisorFirmEmployee.findFirst({
    where: { userId: dbUser.id },
    include: { advisorFirm: true },
  });

  if (!advisorFirmEmployee) {
    return errorResponse('User is not assigned to an advisor firm', 400, {
      request,
      extra: { user: dbUser },
    });
  }

  Logger.log({
    message: `Advisor ${dbUser.email} is loading advisor firm data`,
    extra: { advisorFirmEmployee },
  });

  return {
    dbUser,
    advisorFirmEmployee,
    advisorFirm: advisorFirmEmployee.advisorFirm,
  };
}
