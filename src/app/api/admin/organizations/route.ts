import { getAdminFromRequest } from '@/libs/admin/utils.server';
import Logger from '@/libs/logger';
import { OrganizationCreateSchema } from '@/libs/organization/schema';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { MembershipType, Prisma } from '@prisma/client';
import { User } from '@sentry/nextjs';
import { startCase } from 'lodash';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let postData: OrganizationCreateSchema;
  try {
    const requestBody = (await request.json()) as OrganizationCreateSchema;
    postData = requestBody;
  } catch (parseError) {
    return errorResponse(getErrorMessage(parseError), 400, {
      request,
      extra: { parseError },
    });
  }

  if (!postData.ownerId)
    return errorResponse('ownerId is required', 400, { request });

  let owner: User | null = null;
  try {
    owner = await prisma.user.findUnique({
      where: { id: postData.ownerId },
    });
  } catch (__error) {
    return errorResponse(
      `unable to find user with id ${postData.ownerId}`,
      404,
      { request }
    );
  }
  if (!owner)
    return errorResponse(
      `unable to find user with id ${postData.ownerId}`,
      404,
      { request }
    );

  if (!postData.ownershipType) postData.ownershipType = 'INDIVIDUAL';
  if (!postData.name) {
    postData.name = `${owner.firstName} ${owner.lastName}'s ${startCase(postData.ownershipType.toLowerCase())} Organization`;
  }

  if (postData.advisorFirmId) {
    const advisorFirm = await prisma.advisorFirm.findUnique({
      where: {
        id: postData.advisorFirmId,
      },
    });

    if (!advisorFirm) {
      return errorResponse(
        `unable to find advisor firm with id ${postData.advisorFirmId}`,
        404,
        { request }
      );
    }
  }

  const data: Prisma.OrganizationUncheckedCreateInput = {
    ownerId: postData.ownerId,
    name: postData.name,
    ownershipType: postData.ownershipType,
    isPrimary: false,
    members: {
      create: {
        type: MembershipType.OWNER,
        userId: postData.ownerId,
      },
    },
    advisorFirmId: postData.advisorFirmId || null,
  };

  if (postData.tin) {
    const presanitizedTIN = postData.tin.replace(/\D/g, '');
    if (presanitizedTIN.length !== 9) {
      Logger.log({ message: `TIN ${postData.tin} must be 9 digits` }, request);
      return errorResponse(`TIN ${postData.tin} must be 9 digits`, 400);
    }
    data.tin = presanitizedTIN;
  }

  try {
    const newOrg = await prisma.organization.create({
      data,
    });
    return jsonResponse(newOrg);
  } catch (error) {
    return errorResponse('unable to create organization', 500, {
      request,
      extra: { error },
    });
  }
}
