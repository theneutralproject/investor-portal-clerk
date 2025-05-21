import { DealDocumentType } from '@prisma/client';
import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { getSupabaseDownloadUrl } from '@/libs/supabase';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';
import {
  getAdvisorContext,
  mapDocumentTypeSearch,
} from '@/libs/advisorFirm/utils.server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = await getAdvisorContext(request);

  if ('status' in context) return context;

  const { dbUser, advisorFirm } = context;

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

  const user = await prisma.user.findFirst({
    where: {
      organizationMember: {
        some: {
          organizationId: clientId,
        },
      },
    },
    include: {
      organizationMember: {
        include: {
          organization: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
  const organizationsMemberIds =
    user?.organizationMember.map(o => o.organizationId) ?? [];

  if (organizationsMemberIds.length === 0) {
    return jsonResponse({ documents: [] });
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
        organizationName: string;
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
        u.id AS "userId",
        o.name AS "organizationName"
      FROM "DealDocument" dd
      INNER JOIN "Deal" d ON dd."dealId" = d.id
      INNER JOIN "Project" p ON d."projectId" = p.id
      INNER JOIN "Organization" o ON d."organizationId" = o.id
      INNER JOIN "User" u ON o."ownerId" = u.id
      WHERE o.id = ANY($1::int[]) AND o."advisorFirmId" = $2
      ${
        matchedType
          ? `AND dd.type = $3::"DealDocumentType"`
          : `AND LOWER(dd.name) LIKE '%' || $3 || '%'`
      }
      ORDER BY dd."dateCreated" DESC
      `,
      organizationsMemberIds,
      advisorFirm.id,
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
        organizationName: row.organizationName,
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
