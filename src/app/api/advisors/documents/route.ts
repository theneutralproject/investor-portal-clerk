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

export async function GET(request: NextRequest) {
  const context = await getAdvisorContext(request);

  if ('status' in context) return context;

  const { advisorFirm } = context;

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
      advisorFirm.id,
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

    const types = documents.reduce((acc: { [x: string]: string }, document) => {
      acc[document.type] = document.type;
      return acc;
    }, {});

    return jsonResponse({
      documents,
      clients: Object.values(clients),
      types: Object.values(types),
    });
  } catch (error) {
    Logger.error('Error fetching advisor documents', request, { extra: error });
    return errorResponse('Error fetching documents', 500, {
      request,
      extra: { error },
    });
  }
}
