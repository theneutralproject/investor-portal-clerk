'use server';
import type { HubspotContactCreateUpdateSchema } from '@/libs/hubspot/schema';
import { updateHubspotContact } from '@/libs/hubspot/utils.server';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { type UserUpdateSchema, zUserUpdateSchema } from '@/libs/user/schema';
import { sanitizeUser } from '@/libs/user/utils.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
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
    return errorResponse('userId is required in url', 400, { request });
  }

  const { userId: clerkUserId } = getAuth(request);
  if (!clerkUserId) {
    return errorResponse('Clerk user not found', 404, { request });
  }

  const requestingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });
  if (!requestingUser) {
    return errorResponse('Requesting user not found', 404, { request });
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
    return errorResponse('User to update not found', 404, {
      request,
      extra: { userId },
    });
  }

  // get the organization of the requester and make sure the user to update is a member
  if (userToUpdate.clerkId === clerkUserId) {
    return errorResponse(
      'use /api/users PUT route to update your own user data',
      401,
      { request }
    );
  }

  if (userToUpdate.clerkId) {
    return errorResponse(
      'You cannot update a user that is not a ghost user',
      401,
      { request }
    );
  }

  // make sure the requester is the owner of the organization
  if (
    !userToUpdate.organizationMember
      .map(member => member.organization)
      .filter(org => org.ownerId === requestingUser.id).length
  ) {
    return errorResponse(
      'You are not authorized to update users outside of your organization',
      401,
      { request }
    );
  }

  // update the user
  const requestBody = await request.json();
  const result = zUserUpdateSchema.partial().strip().safeParse(requestBody);

  if (!result.success) {
    return errorResponse('Input data malformed', 400, {
      request,
      extra: { error: result.error },
    });
  }

  const putData = result.data as UserUpdateSchema;

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
      Logger.error('Hubspot User update error', request, {
        hubspotError: hsError,
      });
    }
  }

  if (userUpdateData.ssn && !userUpdateData.ssn.startsWith('***-**-')) {
    const presanitizedSSN = userUpdateData.ssn.replace(/\D/g, '');
    if (presanitizedSSN.length !== 9) {
      Logger.warn('SSN must be 9 digits', request);
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
        return errorResponse(`unable to upsert address`, 400, {
          request,
          extra: { error: dbError },
        });
      });

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userToUpdate.id },
        data: userUpdateData,
        include: { address: true },
      });
      return jsonResponse(sanitizeUser(updatedUser));
    } catch (dbError) {
      return errorResponse('Unable to update user', 400, {
        request,
        extra: { error: dbError },
      });
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
      return errorResponse('Unknown user update error', 500, {
        request,
        extra: { error: dbError },
      });
    }
  }
}
