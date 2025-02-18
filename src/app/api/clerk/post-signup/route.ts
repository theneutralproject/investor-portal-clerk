import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { UserCreateSchema } from '@/libs/user/schema';
import { createUserInDbAndHubspot } from '@/libs/user/utils.server';
import { errorResponse } from '@/libs/utils.server';
import { getAuth, clerkClient, User } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

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

  if (dbUser) {
    return new Response(JSON.stringify({ data: 'User exists' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    let clerkUser: User | null = null;

    try {
      // Fetch user details from Clerk
      const authClient = await clerkClient();
      clerkUser = await authClient.users.getUser(userId);
    } catch (__error) {
      return errorResponse('User not found', 401);
    }

    Logger.log({
      message: `User Clerk: ${userId}`,
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
    };

    Logger.log({
      message: `User DB: ${newUserData.clerkId}`,
      extra: newUserData,
    });

    // Store the user in the database and HubSpot
    const user = await createUserInDbAndHubspot(newUserData);

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
