import { getAuth } from '@clerk/nextjs/server';
import { Role, DealDocumentType } from '@prisma/client';
import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { getSupabaseDownloadUrl } from '@/libs/supabase';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export async function GET(request: NextRequest) {
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

  const advisorFirm = await prisma.advisorFirmEmployee.findFirst({
    where: { userId: dbUser.id },
    select: { advisorFirmId: true },
  });

  if (!advisorFirm) {
    return errorResponse('User is not assigned to an advisor firm', 400, {
      request,
      extra: { user: dbUser },
    });
  }

  Logger.log({
    message: `Advisor ${dbUser.email} is loading firm documents`,
    extra: { advisorFirm },
  });

  const { searchParams } = new URL(request.url);
  const rawSearch = searchParams.get('search') ?? '';
  const search = rawSearch.trim().toLowerCase() ?? '';
  const matchedType = mapDocumentTypeSearch(rawSearch);

  try {
    const rows = await prisma.$queryRawUnsafe<
      Array<{
        id: number;
        name: string;
        type: DealDocumentType;
        projectName: string;
        dealId: number;
        projectId: number;
        dateCreated: Date;
        path: string;
        userId: number;
      }>
    >(
      `
      SELECT
        dd.id,
        dd.name,
        dd.type,
        p.name AS "projectName",
        dd."dealId",
        d."projectId",
        dd."dateCreated",
        dd.path,
        u.id AS "userId"
      FROM "DealDocument" dd
      INNER JOIN "Deal" d ON dd."dealId" = d.id
      INNER JOIN "Project" p ON d."projectId" = p.id
      INNER JOIN "Organization" o ON d."organizationId" = o.id
      INNER JOIN "User" u ON o."ownerId" = u.id
      WHERE o."advisorFirmId" = $1
      ${
        matchedType
          ? `AND dd.type = $2::"DealDocumentType"`
          : `AND LOWER(dd.name) LIKE '%' || $2 || '%'`
      }
      ORDER BY dd."dateCreated" DESC
      `,
      advisorFirm.advisorFirmId,
      matchedType ?? search
    );

    const clientIds = rows.map(row => row.userId);
    const clients = (
      await prisma.user.findMany({
        where: {
          id: {
            in: clientIds,
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      })
    ).reduce((acc: { [x: string]: string }, user) => {
      acc[user.id] = [user.firstName, user.lastName].join(' ');
      return acc;
    }, {});

    const documents = await Promise.all(
      rows.map(async row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        projectName: row.projectName,
        dealId: row.dealId,
        projectId: row.projectId,
        clientName: clients[row.userId],
        dateCreated: row.dateCreated,
        downloadUrl: await getSupabaseDownloadUrl(row.path, 'deal-documents'),
      }))
    );

    return jsonResponse({ documents, clients: Object.values(clients) });
  } catch (error) {
    Logger.error('Error fetching advisor documents', request, { extra: error });
    return errorResponse('Error fetching documents', 500, {
      request,
      extra: { error },
    });
  }
}
