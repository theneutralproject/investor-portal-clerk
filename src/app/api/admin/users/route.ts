import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { createChangeLog } from '@/libs/changelog/utils.server';
import { shareProjectDocsWithUser } from '@/libs/hubspot/utils.server';
import Logger from '@/libs/logger';
import { findOrCreateClerkUser } from '@/libs/maintenance/utils.server';
import prisma from '@/libs/prisma.server';
import { UserCreateSchema, zUserCreateSchema } from '@/libs/user/schema';
import { createUserInDbAndHubspotFromAdmin } from '@/libs/user/utils.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { Role } from '@prisma/client';
import type { NextRequest } from 'next/server';

// get all users with their orgs
export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  try {
    const allUsers = await prisma.user.findMany({
      include: {
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
      },
    });
    return jsonResponse(allUsers);
  } catch (error) {
    return errorResponse('unable to fetch users', 500, {
      request,
      extra: { error },
    });
  }
}

export async function POST(request: NextRequest) {
  let adminUser;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let postData: UserCreateSchema;
  try {
    const requestBody = (await request.json()) as UserCreateSchema;
    postData = zUserCreateSchema.parse(requestBody);
  } catch (parseError) {
    return errorResponse(getErrorMessage(parseError), 400, {
      request,
      extra: { error: parseError },
    });
  }

  try {
    const cleanPhone = postData.phoneNumber?.replace(/\D/g, '');
    const clerkUser = await findOrCreateClerkUser(
      postData.email.toLocaleLowerCase(),
      postData.firstName,
      postData.lastName,
      cleanPhone,
      {
        role: Role.USER,
      }
    );
    postData.clerkId = clerkUser?.id;
    postData.phoneNumber = cleanPhone;
    const newUser = await createUserInDbAndHubspotFromAdmin(postData);
    const userWithOrgs = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: {
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
      },
    });

    if (postData.projectSlug) {
      // invite user to review project documents
      shareProjectDocsWithUser(
        parseInt(newUser.hubspotId, 10),
        postData.projectSlug
      );
    }
    await createChangeLog({
      userId: adminUser.id,
      entityId: newUser.id,
      entityName: 'USER',
      newValue: postData,
    });

    return jsonResponse(userWithOrgs);
  } catch (error) {
    return errorResponse('unable to create user', 500, {
      request,
      extra: { error },
    });
  }
}
