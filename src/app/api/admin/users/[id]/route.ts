import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { createChangeLog } from '@/libs/changelog/utils.server';
import { DealStage } from '@/libs/deal/schema';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { UserUpdateSchema, zUserUpdateSchema } from '@/libs/user/schema';
import { updateUserInDbAndHubspotAndClerk } from '@/libs/user/utils.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { DealStatus } from '@prisma/client';
import { isNumber } from 'lodash';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let userId: number;
  try {
    const url = new URL(request.url);
    userId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!userId || !isNumber(userId)) {
      throw new Error('userId is required in url');
    }
  } catch (__error) {
    return errorResponse(`userId is required in url`, 500, { request });
  }
  try {
    // get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { address: true },
    });

    const organizations = await prisma.organization.findMany({
      where: { members: { some: { userId } } },
      select: {
        id: true,
        name: true,
        tin: true,
        ownershipType: true,
        isPrimary: true,
        advisorFirmId: true,
        deals: {
          where: { dealStage: { not: DealStage.CLOSED_LOST } },
          select: {
            id: true,
          },
        },
        address: true,
        members: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                id: true,
              },
            },
            type: true,
            title: true,
            id: true,
          },
        },
      },
    });

    const deals = await prisma.deal.findMany({
      where: {
        organizationId: { in: organizations.map(org => org.id) },
        status: DealStatus.ACTIVE,
        dealStage: { not: DealStage.CLOSED_LOST },
      },
      select: {
        investmentStats: true,
        id: true,
        transactionId: true,
        dealStage: true,
        closingDate: true,
        dateUpdated: true,
        dateCreated: true,
        organizationId: true,
        project: {
          select: {
            id: true,
            name: true,
            pictures: {
              where: { type: 'CARD' },
            },
          },
        },
      },
    });

    return jsonResponse({ user, deals, organizations });
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }
}

export async function PUT(request: NextRequest) {
  let adminUser;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let userId: number;
  try {
    const url = new URL(request.url);
    userId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!userId || !isNumber(userId)) {
      throw new Error('userId is required in url');
    }
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }

  let putData: UserUpdateSchema;
  try {
    const requestBody = (await request.json()) as UserUpdateSchema;
    putData = zUserUpdateSchema.parse(requestBody);
  } catch (parseError) {
    return errorResponse(getErrorMessage(parseError), 500, {
      request,
      extra: { error: parseError },
    });
  }
  const previousDataUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      address: true,
    },
  });

  try {
    putData.id = userId;
    const updatedUser = await updateUserInDbAndHubspotAndClerk(putData);

    await createChangeLog({
      userId: adminUser.id,
      entityId: userId,
      entityName: 'USER',
      previousValue: previousDataUser,
      newValue: putData,
    });

    return jsonResponse(updatedUser);
  } catch (error) {
    return errorResponse('unable to update user', 500, {
      request,
      extra: { error },
    });
  }
}
