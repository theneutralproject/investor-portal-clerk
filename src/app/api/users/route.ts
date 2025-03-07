'use server';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import {
  type ClerkUserUpdateSchema,
  type UserUpdateSchema,
  zUserUpdateSchema,
} from '@/libs/user/schema';
import { updateHubspotContact } from '@/libs/hubspot/utils.server';
import { sanitizeUser } from '@/libs/user/utils.server';
import type { HubspotContactCreateUpdateSchema } from '@/libs/hubspot/schema';
import Logger from '@/libs/logger';

/**
 * @param request
 * @returns the full user data for the currently logged in user
 */
export async function GET(request: NextRequest) {
  const { userId: clerkId } = getAuth(request);
  if (!clerkId) {
    return errorResponse('Clerk user not found', 404, {
      request,
      extra: { clerkId },
    });
  }
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkId },
    include: { address: true },
  });

  if (!user) {
    return errorResponse(
      `User record with clerkid ${clerkId} not found in prisma (GET)`,
      404,
      { request }
    );
  }

  return jsonResponse(sanitizeUser(user));
}

/**
 * Update own user information
 * This function handles create and update of user address and user information
 * @param request with body:UserUpdateSchema
 * @returns updated user as Promise<UserWithAddress>
 */
export async function PUT(request: NextRequest) {
  // user can only update their own information
  const { userId: clerkId } = getAuth(request);
  if (!clerkId) {
    return errorResponse('Clerk user not found', 404, {
      request,
      extra: { clerkId },
    });
  }

  const requestingUser = await prisma.user.findUnique({
    where: { clerkId: clerkId },
  });
  if (!requestingUser) {
    return errorResponse('Requesting user not found', 404, { request });
  }

  const requestBody = (await request.json()) as UserUpdateSchema;
  let putData: UserUpdateSchema;
  try {
    putData = zUserUpdateSchema.parse(requestBody);
  } catch (parseError) {
    return errorResponse('Input data malformed', 400, {
      request,
      extra: { error: parseError },
    });
  }

  //TODO: use new updateUserInDbAndHubspot function instead of this, but might need to unsanitize ssn first
  const { address, ...userData } = putData;
  //  Check if hubspot and clerk needs to be updated, and then update them
  if (userData.firstName || userData.lastName || userData.referralSource) {
    const clerkUpdate: ClerkUserUpdateSchema = {};
    const hsUpdateData: HubspotContactCreateUpdateSchema = {
      hubspotId: requestingUser.hubspotId,
      properties: {},
    };
    if (userData.firstName) {
      hsUpdateData.properties.firstname = userData.firstName;
      clerkUpdate.firstName = userData.firstName;
    }
    if (userData.lastName) {
      hsUpdateData.properties.lastname = userData.lastName;
      clerkUpdate.lastName = userData.lastName;
    }
    if (userData.referralSource) {
      hsUpdateData.properties.referral_source = userData.referralSource;
    }

    try {
      await updateHubspotContact(hsUpdateData);
    } catch (hsError) {
      Logger.error('Error updating Hubspot contact', request, {
        error: hsError,
      });
    }
    try {
      await (await clerkClient()).users.updateUser(clerkId, clerkUpdate);
    } catch (clerkError) {
      Logger.error('Error updating Clerk user', request, { error: clerkError });
    }
  }

  if (userData.ssn) {
    if (userData.ssn.startsWith('***-**-')) {
      delete userData.ssn;
    } else {
      // sanitize it (digits only) and encrypt SSN before storing it:
      const presanitizedSSN = userData.ssn.replace(/\D/g, '');
      if (presanitizedSSN.length !== 9) {
        return errorResponse('SSN must be 9 digits', 400, {
          request,
        });
      }
      userData.ssn = presanitizedSSN;
    }
  }

  if (address) {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    });
    if (!existingUser) {
      return errorResponse('User not found', 404, {
        request,
      });
    }

    // upsert address
    await prisma.address
      .upsert({
        where: { userId: existingUser.id },
        create: { ...address, userId: existingUser.id },
        update: { ...address, userId: existingUser.id },
      })
      .catch(dbError => {
        console.error('ERROR: unable to upsert address:\n', dbError);
        return errorResponse(
          `unable to upsert address:\n${getErrorMessage(dbError)}`,
          400,
          { request, extra: { error: dbError } }
        );
      });

    try {
      const updatedUser = await prisma.user.update({
        where: { clerkId },
        data: userData,
        include: { address: true },
      });
      return jsonResponse(sanitizeUser(updatedUser));
    } catch (dbError) {
      console.error('ERROR: unable to update user:\n', dbError);
      return errorResponse('unable to update user1', 400, {
        request,
        extra: { error: dbError },
      });
    }
  } else {
    // no address to update, just update user data
    try {
      const updatedUser = await prisma.user.update({
        where: { clerkId },
        data: userData,
        include: { address: true },
      });

      return jsonResponse(sanitizeUser(updatedUser));
    } catch (dbError) {
      console.error('ERROR: unable to update user:\n', dbError);
      return errorResponse('unable to update user2', 400, {
        request,
        extra: { error: dbError },
      });
    }
  }
}
