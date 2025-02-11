'use server';
import { isAdminUser } from '@/libs/maintenance/utils';
import prisma from '@/libs/prisma.server';
import { UserCreateSchema } from '@/libs/user/schema';
import { createUserInDbAndHubspot } from '@/libs/user/utils';
import { getErrorMessage, jsonResponse } from '@/libs/utils';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

export async function POST() {
  const clerkUser = await currentUser();
  if (!clerkUser) return jsonResponse({ error: 'User not found' }, 404);
  if (!(await isAdminUser(clerkUser.id))) {
    return jsonResponse({ error: 'User is not an admin' }, 403);
  }

  // get all users from clerk
  const clerkUsers = await (
    await clerkClient()
  ).users.getUserList({
    limit: 400,
    offset: 400,
  });

  // get all users from db
  const dbUsers = await prisma.user.findMany();

  // find clerkusers that are unaccounted for in db
  const missingUsers = clerkUsers.data.filter(
    clerkUser => !dbUsers.find(dbUser => dbUser.clerkId === clerkUser.id)
  );
  const createPromisesArr: Promise<User>[] = [];
  missingUsers.forEach(missingUser => {
    const {
      id,
      primaryEmailAddressId,
      emailAddresses,
      primaryPhoneNumberId,
      firstName,
      lastName,
      phoneNumbers,
    } = missingUser;

    const email = primaryEmailAddressId
      ? (emailAddresses.find(({ id }) => id === primaryEmailAddressId)
          ?.emailAddress ?? '')
      : (emailAddresses[0]?.emailAddress ?? '');
    const phonenumber = primaryPhoneNumberId
      ? (phoneNumbers.find(({ id }) => id === primaryPhoneNumberId)
          ?.phoneNumber ?? '')
      : (phoneNumbers[0]?.phoneNumber ?? '');
    if (email === '') {
      // TODO: log this error. The user will not be created in the DB!
      console.error('No email found for user', missingUser.id);
      return new Response(
        JSON.stringify({ error: `No email found for new clerk user!!!` }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const newUserData = {
      clerkId: id,
      email: email.toLowerCase(),
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phonenumber,
      address: undefined,
    } as UserCreateSchema;

    /* Store user in DB**/
    try {
      createPromisesArr.push(createUserInDbAndHubspot(newUserData));
    } catch (userCreateError) {
      console.error('Error creating user in DB', id);
      console.error(getErrorMessage(userCreateError));
      // return new Response(JSON.stringify(userCreateError), {
      //   status: 500,
      //   headers: { 'Content-Type': 'application/json' },
      // });
    }
  });

  const newUsers = await Promise.all(createPromisesArr);

  return jsonResponse({ newUsers });
}
