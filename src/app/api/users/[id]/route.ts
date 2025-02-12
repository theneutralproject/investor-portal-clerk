'use server';
import type { HubspotContactCreateUpdateSchema } from '@/libs/hubspot/schema';
import { updateHubspotContact } from '@/libs/hubspot/utils';
import prisma from '@/libs/prisma.server';
import { type UserUpdateSchema, zUserUpdateSchema } from '@/libs/user/schema';
import { sanitizeUser } from '@/libs/user/utils';
import { getErrorMessage, jsonResponse } from '@/libs/utils';
import { getAuth } from '@clerk/nextjs/server';
import { isNumber } from 'lodash';
import type { NextRequest } from 'next/server';

/**
 * Update information of a ghost user that is a member of the requester's organization
 * @param request
 * @returns
 */
export async function PUT(request: NextRequest) {
  let userId: number;
  try {
    const url = new URL(request.url);
    userId = parseInt(url.pathname.split('/').pop() ?? '');
    if (!userId || !isNumber(userId)) {
      throw new Error('userId is required in url');
    }
  } catch (__error: unknown) {
    return jsonResponse({ error: `userId is required in url` }, 400);
  }

  const { userId: clerkUserId } = getAuth(request);
  if (!clerkUserId) {
    return jsonResponse({ error: 'Clerk user not found' }, 404);
  }

  const requestingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });
  if (!requestingUser) {
    return jsonResponse({ error: 'Requesting user not found' }, 404);
  }

  // get the user to update and make sure they are a ghost user
  const userToUpdate = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      organizationMember: {
        include: { organization: { include: { members: true } } },
      },
    },
  });

  if (!userToUpdate) {
    return jsonResponse({ error: 'User to update not found' }, 404);
  }

  // get the organization of the requester and make sure the user to update is a member
  if (userToUpdate.clerkId === clerkUserId) {
    return jsonResponse(
      { error: 'use /api/users PUT route to update your own user data' },
      401
    );
  }

  if (userToUpdate.clerkId) {
    return jsonResponse(
      { error: 'You cannot update a user that is not a ghost user' },
      401
    );
  }

  // make sure the requester is the owner of the organization
  if (
    !userToUpdate.organizationMember
      .map(member => member.organization)
      .filter(org => org.ownerId === requestingUser.id).length
  ) {
    return jsonResponse(
      {
        error:
          'You are not authorized to update users outside of your organization',
      },
      401
    );
  }

  // update the user
  const requestBody = (await request.json()) as UserUpdateSchema;
  let putData: UserUpdateSchema;
  try {
    putData = zUserUpdateSchema.parse(requestBody);
  } catch (parseError) {
    console.error(
      'ERROR: unable to parse user/id PUT body:\n',
      getErrorMessage(parseError)
    );
    return jsonResponse(
      { error: `Input data malformatted: \n${(parseError as Error).message}` },
      400
    );
  }

  const { address, ...userUpdateData } = putData;
  //  Check if hubspot needs to be updated
  let hubspotNeedsUpdate = false;
  if (userUpdateData.email && userToUpdate.email !== userUpdateData.email) {
    hubspotNeedsUpdate = true;
  }
  if (
    userUpdateData.phoneNumber &&
    userToUpdate.phoneNumber !== userUpdateData.phoneNumber
  ) {
    hubspotNeedsUpdate = true;
  }
  if (
    userUpdateData.firstName &&
    userToUpdate.firstName !== userUpdateData.firstName
  ) {
    hubspotNeedsUpdate = true;
  }
  if (
    userUpdateData.lastName &&
    userToUpdate.lastName !== userUpdateData.lastName
  ) {
    hubspotNeedsUpdate = true;
  }
  if (userToUpdate.referralSource !== userUpdateData.referralSource) {
    hubspotNeedsUpdate = true;
  }

  if (hubspotNeedsUpdate) {
    const hsUpdateData: HubspotContactCreateUpdateSchema = {
      hubspotId: userToUpdate.hubspotId,
      properties: {},
    };
    if (userUpdateData.firstName)
      hsUpdateData.properties.firstname = userUpdateData.firstName;
    if (userUpdateData.lastName)
      hsUpdateData.properties.lastname = userUpdateData.lastName;
    if (userUpdateData.email) hsUpdateData.email = userUpdateData.email;
    if (userUpdateData.phoneNumber)
      hsUpdateData.properties.phone = userUpdateData.phoneNumber;
    try {
      await updateHubspotContact(hsUpdateData);
    } catch (hsError) {
      console.log(hsError);
    }
  }

  if (userUpdateData.ssn && !userUpdateData.ssn.startsWith('***-**-')) {
    const presanitizedSSN = userUpdateData.ssn.replace(/\D/g, '');
    if (presanitizedSSN.length !== 9) {
      return jsonResponse({ error: 'SSN must be 9 digits' }, 400);
    }
    userUpdateData.ssn = presanitizedSSN;
  }

  if (address) {
    // upsert address
    await prisma.address
      .upsert({
        where: { userId: userToUpdate.id },
        create: { ...address, userId: userToUpdate.id },
        update: { ...address, userId: userToUpdate.id },
      })
      .catch(dbError => {
        console.error('ERROR: unable to upsert address:\n', dbError);
        return jsonResponse(
          { error: `unable to upsert address:\n${getErrorMessage(dbError)}` },
          400
        );
      });

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userToUpdate.id },
        data: userUpdateData,
        include: { address: true },
      });
      return jsonResponse(sanitizeUser(updatedUser));
    } catch (dbError) {
      console.error('ERROR: unable to update user:\n', dbError);
      return jsonResponse({ error: 'unable to update user1' }, 400);
    }
  } else {
    // no address to update, just update user data
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userToUpdate.id },
        data: userUpdateData,
        include: { address: true },
      });

      return jsonResponse(sanitizeUser(updatedUser));
    } catch (dbError) {
      console.error('ERROR: unable to update user:\n', dbError);
      return jsonResponse({ error: 'unable to update user2' }, 400);
    }
  }
}
