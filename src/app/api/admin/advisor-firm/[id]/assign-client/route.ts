'use server';

import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import Logger from '@/libs/logger';
import {
  zAssignClientToAdvisorFirmSchema,
  AssignClientToAdvisorFirmSchema,
} from '@/libs/advisorFirm/schema';

/**
 * POST /api/admin/advisor-firms/:advisorFirmId/assign-client
 *
 * Assigns a client organization to an advisor firm. Only accessible by admin users.
 * Accepts advisorFirmId from route params and organizationId from the request body.
 *
 * @param request - Next.js API request
 * @param params - Object containing route parameters
 * @returns A success or error response
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let adminUser;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 401, { request });
  }

  const { id } = await params;
  const advisorFirmId = parseInt(id, 10);
  if (isNaN(advisorFirmId)) {
    return errorResponse('Invalid advisorFirmId', 400, { request });
  }

  let body: AssignClientToAdvisorFirmSchema;
  try {
    const raw = await request.json();
    body = zAssignClientToAdvisorFirmSchema.parse(raw);
  } catch (error) {
    return errorResponse('Invalid request body', 400, {
      request,
      extra: { error },
    });
  }

  const { organizationId } = body;

  try {
    const result = await prisma.$transaction(async tx => {
      const advisorFirm = await tx.advisorFirm.findUnique({
        where: { id: advisorFirmId },
        select: { id: true },
      });

      if (!advisorFirm) {
        return errorResponse(
          `AdvisorFirm with id ${advisorFirmId} not found`,
          404,
          { request }
        );
      }

      const organization = await tx.organization.findUnique({
        where: { id: organizationId },
        select: {
          id: true,
          name: true,
          advisorFirmId: true,
        },
      });

      if (!organization) {
        return errorResponse(
          `Organization with id ${organizationId} not found`,
          404,
          { request }
        );
      }

      if (organization.advisorFirmId === advisorFirmId) {
        return errorResponse(
          'Organization is already assigned to this advisor firm',
          409,
          { request }
        );
      }

      await tx.advisorFirm.update({
        where: { id: advisorFirmId },
        data: {
          clientOrganizations: {
            connect: { id: organizationId },
          },
        },
      });

      Logger.log(
        {
          message: `Admin ${adminUser.email} assigned organization ${organizationId} to advisor firm ${advisorFirmId}`,
          extra: {
            organization,
            advisorFirm,
            user: {
              email: adminUser.email,
              id: adminUser.id,
              clerkId: adminUser.clerkId,
              hubspotId: adminUser.hubspotId,
            },
          },
        },
        request
      );

      return jsonResponse(
        {
          message: 'Client organization assigned successfully',
          advisorFirmId,
          organizationId,
        },
        200
      );
    });

    return result;
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }
}
