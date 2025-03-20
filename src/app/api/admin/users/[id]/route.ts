import { getAdminFromRequest } from '@/libs/admin/utils.server';
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
    const detailedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        hubspotId: true,
        referralSource: true,
        ssn: true,
        dateOfBirth: true,
        dateCreated: true,
        address: true,
        organizationMember: {
          select: {
            type: true,
            organization: {
              select: {
                id: true,
                name: true,
                address: true,
                tin: true,
                isPrimary: true,
                ownershipType: true,
                deals: {
                  where: {
                    dealStage: { lte: DealStage.CLOSED },
                    status: DealStatus.ACTIVE,
                  },
                  select: {
                    id: true,
                    transactionId: true,
                    status: true,
                    dealStage: true,
                    document: true,
                    hubspotId: true,
                    investmentEntity: true,
                    closingDate: true,
                    signaturesCompletedDate: true,
                    project: {
                      select: {
                        id: true,
                        name: true,
                        pictures: {
                          where: { type: 'CARD' },
                        },
                      },
                    },
                    investmentStats: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return jsonResponse(detailedUser);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let userId: number;
  try {
    const url = new URL(request.url);
    console.log(url.pathname.split('/'));
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

  try {
    putData.id = userId;
    const updatedUser = await updateUserInDbAndHubspotAndClerk(putData);
    return jsonResponse(updatedUser);
  } catch (error) {
    return errorResponse('unable to update user', 500, {
      request,
      extra: { error },
    });
  }
}
