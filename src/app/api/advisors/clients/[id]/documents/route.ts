import { getAuth } from '@clerk/nextjs/server';
import { Role, DealDocumentType } from '@prisma/client';
import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { getSupabaseDownloadUrl } from '@/libs/supabase';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { mapDocumentTypeSearch } from '@/libs/advisorFirm/utils.server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const rawClientId = (await params).id;

  if (!rawClientId) {
    return errorResponse('Must specify client ID', 400, {
      request,
      extra: { user: dbUser, clientId: rawClientId },
    });
  }
  const clientId = parseInt(rawClientId, 10);

  if (Number.isNaN(clientId)) {
    return errorResponse('Client ID not valid', 400, {
      request,
      extra: { user: dbUser, clientId: rawClientId },
    });
  }

  const organization = await prisma.organization.findFirst({
    where: {
      id: clientId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!organization) {
    return errorResponse('Organization not found', 404, {
      request,
      extra: { user: dbUser, clientId, organization },
    });
  }

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
      WHERE o.id = $1 AND o."advisorFirmId" = $2
      ${
        matchedType
          ? `AND dd.type = $3::"DealDocumentType"`
          : `AND LOWER(dd.name) LIKE '%' || $3 || '%'`
      }
      ORDER BY dd."dateCreated" DESC
      `,
      clientId,
      advisorFirm.advisorFirmId,
      matchedType ?? search
    );

    const documents = await Promise.all(
      rows.map(async row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        projectName: row.projectName,
        dealId: row.dealId,
        projectId: row.projectId,
        clientName: '',
        dateCreated: row.dateCreated,
        downloadUrl: await getSupabaseDownloadUrl(row.path, 'deal-documents'),
      }))
    );

    const types = documents.reduce((acc: { [x: string]: string }, document) => {
      acc[document.type] = document.type;
      return acc;
    }, {});

    return jsonResponse({
      documents,
      types: Object.values(types),
    });
  } catch (error) {
    Logger.error('Error fetching client documents', request, { extra: error });
    return errorResponse('Error fetching documents', 500, {
      request,
      extra: { error },
    });
  }
}
