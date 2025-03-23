import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { DealStage } from '@/libs/deal/schema';
import Logger from '@/libs/logger';
import {
  AdminOrganizationMemberCreateSchema,
  AdminOrganizationMemberDeleteSchema,
} from '@/libs/organization/schema';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { isNumber } from 'lodash';
import { NextRequest } from 'next/server';

// POST request to add a member to an organization
export async function POST(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let organizationId: number;
  try {
    const url = new URL(request.url);
    console.log(url.pathname.split('/'));
    organizationId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!organizationId || !isNumber(organizationId)) {
      throw new Error('orgId is required in url');
    }
  } catch (__error) {
    return errorResponse(`orgId is required in url`, 400, { request });
  }
  let postData: AdminOrganizationMemberCreateSchema;
  try {
    const requestBody =
      (await request.json()) as AdminOrganizationMemberCreateSchema;
    postData = requestBody;
  } catch (parseError) {
    return errorResponse(getErrorMessage(parseError), 400, {
      request,
      extra: { error: getErrorMessage(parseError) },
    });
  }

  const { userId, type, title } = postData;

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { members: true },
    });

    // check if user already exists as org member:
    const existingMember = organization?.members.find(
      member => member.userId === userId
    );
    if (existingMember) {
      return errorResponse(
        `User with id ${userId} already exists as a member of the organization: ${organization?.name}`,
        403,
        { request }
      );
    }
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, { request });
  }

  try {
    const newMember = await prisma.member.create({
      data: {
        userId,
        organizationId,
        type,
        title,
      },
      //   include: { user: true },
    });
    return jsonResponse(newMember, 201);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, { request });
  }
}

// DELETE request to remove a member from an organization
export async function DELETE(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let deleteData: AdminOrganizationMemberDeleteSchema;
  try {
    const requestBody =
      (await request.json()) as AdminOrganizationMemberDeleteSchema;
    deleteData = requestBody;
  } catch (parseError) {
    return errorResponse(getErrorMessage(parseError), 400, {
      request,
      extra: { error: getErrorMessage(parseError) },
    });
  }

  const { id: memberId } = deleteData;
  try {
    const memberWithOrgAndDeals = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        organization: {
          include: {
            deals: { where: { dealStage: { not: DealStage.CLOSED_LOST } } },
          },
        },
      },
    });
    // check if the organization has deals
    if (!memberWithOrgAndDeals) {
      return errorResponse(`Member with id ${memberId} does not exist`, 404, {
        request,
      });
    }
    if (memberWithOrgAndDeals?.organization?.deals?.length > 0) {
      return errorResponse(
        `Organization with id ${memberWithOrgAndDeals.organizationId} has deals associated with it, and you cannot delete members.`,
        403,
        { request }
      );
    }
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, { request });
  }

  try {
    const deletedMember = await prisma.member.delete({
      where: { id: memberId },
    });

    return jsonResponse(deletedMember, 200);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, { request });
  }
}
