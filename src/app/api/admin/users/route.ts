import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { shareProjectDocsWithUser } from '@/libs/hubspot/utils.server';
import { findOrCreateClerkUser } from '@/libs/maintenance/utils.server';
import prisma from '@/libs/prisma.server';
import { UserCreateSchema, zUserCreateSchema } from '@/libs/user/schema';
import { createUserInDbAndHubspot } from '@/libs/user/utils.server';
import { getErrorMessage, jsonResponse } from '@/libs/utils.server';
import { isError } from 'lodash';
import type { NextRequest } from 'next/server';

// get all users with their orgs
export async function GET(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    console.error(getErrorMessage(adminUser));
    return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
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
    console.error('unable to fetch users:', getErrorMessage(error));
    return jsonResponse({ error: getErrorMessage(error) }, 500);
  }
}

export async function POST(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    console.error(getErrorMessage(adminUser));
    return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
  }

  let postData: UserCreateSchema;
  try {
    const requestBody = (await request.json()) as UserCreateSchema;
    postData = zUserCreateSchema.parse(requestBody);
  } catch (parseError) {
    console.error(
      'ERROR: unable to parse users POST body:\n',
      getErrorMessage(parseError)
    );
    return jsonResponse({ error: getErrorMessage(parseError) }, 400);
  }

  try {
    const cleanPhone = postData.phoneNumber?.replace(/\D/g, '');
    const clerkUser = await findOrCreateClerkUser(
      postData.email.toLocaleLowerCase(),
      postData.firstName,
      postData.lastName,
      cleanPhone
    );
    postData.clerkId = clerkUser?.id;
    postData.phoneNumber = cleanPhone;
    const newUser = await createUserInDbAndHubspot(postData);
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

    return jsonResponse(userWithOrgs);
  } catch (error) {
    console.error('unable to create user:', getErrorMessage(error));
    return jsonResponse({ error: getErrorMessage(error) }, 500);
  }
}
