import { getAuth, clerkClient, User } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { UserCreateSchema } from '@/libs/user/schema';
import { createUserInDbAndHubspot } from '@/libs/user/utils.server';
import { errorResponse } from '@/libs/utils.server';

/**
 * Handles a POST request to check if a user exists in the database.
 * If the user does not exist, it retrieves their information from Clerk
 * and creates a new record in the database and HubSpot.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<Response>} A JSON response indicating whether the user exists or was created.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const { userId } = getAuth(request);

  if (!userId) {
    return errorResponse('User not authenticated', 401);
  }

  // Check if the user already exists in the database
  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  let clerkUser: User | null = null;
  // Fetch user details from Clerk
  const authClient = await clerkClient();

  try {
    clerkUser = await authClient.users.getUser(userId);
  } catch (__error) {
    return errorResponse('User not found', 401, { request });
  }

  if (dbUser) {
    if (!clerkUser.publicMetadata.onboardingComplete) {
      await authClient.users.updateUser(userId, {
        publicMetadata: {
          onboardingComplete: true,
          investorPortalId: dbUser.id,
        },
      });
    }
    return new Response(JSON.stringify({ data: 'User exists' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    Logger.log({
      message: `Creating new user with Clerk ID: ${userId}`,
      extra: clerkUser,
    });

    const {
      primaryEmailAddressId,
      emailAddresses,
      primaryPhoneNumberId,
      phoneNumbers,
    } = clerkUser;

    // Extract email and phone number from Clerk data
    const email = primaryEmailAddressId
      ? (emailAddresses.find(({ id }) => id === primaryEmailAddressId)
          ?.emailAddress ?? '')
      : (emailAddresses[0]?.emailAddress ?? '');

    const phoneNumber = primaryPhoneNumberId
      ? (phoneNumbers.find(({ id }) => id === primaryPhoneNumberId)
          ?.phoneNumber ?? '')
      : (phoneNumbers[0]?.phoneNumber ?? '');

    // Create a new user object
    const newUserData: UserCreateSchema = {
      clerkId: userId,
      email,
      firstName: clerkUser?.firstName || '',
      lastName: clerkUser?.lastName || '',
      phoneNumber,
      address: undefined,
      notifyUserOnCreate: true,
    };

    if (!email) {
      return errorResponse(
        `No email found for new clerk user: ${userId}`,
        500,
        { request }
      );
    }

    // Store the user in the database and HubSpot
    const user = await createUserInDbAndHubspot(newUserData);

    try {
      await authClient.users.updateUser(userId, {
        publicMetadata: {
          onboardingComplete: true,
          investorPortalId: user.id,
        },
      });
    } catch (error) {
      return errorResponse(
        'There was an error updating the user metadata.',
        500,
        { request, extra: { error } }
      );
    }

    return new Response(
      JSON.stringify({
        data: {
          id: user.id,
          clerkId: user.clerkId,
          referralSource: user.referralSource,
          hubspotId: user.hubspotId,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
