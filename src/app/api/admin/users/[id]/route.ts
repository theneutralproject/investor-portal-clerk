import { getAdminFromRequest } from '@/libs/admin/utils.server';
import prisma from '@/libs/prisma.server';
import { UserUpdateSchema, zUserUpdateSchema } from '@/libs/user/schema';
import { updateUserInDbAndHubspotAndClerk } from '@/libs/user/utils.server';
import { getErrorMessage, jsonResponse } from '@/libs/utils.server';
import { isError, isNumber } from 'lodash';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    console.error(getErrorMessage(adminUser));
    return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
  }

  let userId: number;
  try {
    const url = new URL(request.url);
    userId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!userId || !isNumber(userId)) {
      throw new Error('userId is required in url');
    }
  } catch (__error) {
    return jsonResponse({ error: `userId is required in url` }, 400);
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
        organizationsOwned: {
          select: {
            id: true,
            name: true,
            address: true,
            tin: true,
            isPrimary: true,
            ownershipType: true,
          },
        },
        address: true,
        organizationMember: {
          select: {
            organization: {
              select: {
                id: true,
                name: true,
                address: true,
                tin: true,
                isPrimary: true,
                ownershipType: true,
                deals: {
                  select: {
                    id: true,
                    transactionId: true,
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
    return jsonResponse(error, 404);
  }
}

export async function PUT(request: NextRequest) {
  // const adminUser = await getAdminFromRequest(request);
  // if (isError(adminUser)) {
  //   console.error(getErrorMessage(adminUser));
  //   return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
  // }

  let userId: number;
  try {
    const url = new URL(request.url);
    console.log(url.pathname.split('/'));
    userId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!userId || !isNumber(userId)) {
      throw new Error('userId is required in url');
    }
  } catch (__error) {
    return jsonResponse({ error: `userId is required in url` }, 400);
  }

  let putData: UserUpdateSchema;
  try {
    const requestBody = (await request.json()) as UserUpdateSchema;
    putData = zUserUpdateSchema.parse(requestBody);
  } catch (parseError) {
    console.error(
      'ERROR: unable to parse users PUT body:\n',
      getErrorMessage(parseError)
    );
    return jsonResponse({ error: getErrorMessage(parseError) }, 400);
  }

  try {
    putData.id = userId;
    const updatedUser = await updateUserInDbAndHubspotAndClerk(putData);
    return jsonResponse(updatedUser);
  } catch (error) {
    console.error('unable to update user:', getErrorMessage(error));
    return jsonResponse({ error: getErrorMessage(error) }, 500);
  }
}
