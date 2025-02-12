'use server';
import prisma from '@/libs/prisma.server';
import { createHubspotContact } from '@/libs/hubspot/utils.server';
import { jsonResponse } from '@/libs/utils.server';
import {
  findOrCreateClerkUser,
  isAdminUser,
} from '@/libs/maintenance/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) return jsonResponse({ error: 'User not found' }, 404);
  if (!(await isAdminUser(userId))) {
    return jsonResponse({ error: 'User is not an admin' }, 403);
  }

  const allUsers = await prisma.user.findMany();
  const promiseArr = [];
  for (const user of allUsers) {
    console.log(`Processing user ${user.email} with clerkId ${user.clerkId}`);
    if (!user.clerkId) {
      console.log(`User ${user.id} does not have a clerkId`);
      continue;
    }
    const { clerkId, email, firstName, lastName, phoneNumber } = user;
    const cleanPhone = phoneNumber?.replace(/\D/g, '');
    // check if user exists in clerk
    const clerkUser = await findOrCreateClerkUser(
      email,
      firstName,
      lastName,
      cleanPhone
    );
    if (!clerkUser) {
      promiseArr.push({ id: null, status: 'skipped', email });
      continue;
    }

    // create user in clerk and update user in db and hubspot
    if (clerkUser?.id !== clerkId) {
      console.log(
        `User ${user.id} clerkId ${clerkId} does not match clerkId ${clerkUser?.id}`
      );
      try {
        // update user in hubspot
        const hsId = await createHubspotContact({
          email,
          properties: {
            userid: clerkUser.id,
            firstname: firstName,
            lastname: lastName,
          },
        });

        await prisma.user.update({
          where: { id: user.id },
          data: { clerkId: clerkUser.id, hubspotId: hsId },
        });
        promiseArr.push({ id: hsId, status: 'updated' });
      } catch (error) {
        console.error(`Error updating user ${user.id} in hubspot:`, error);
      }
    } else {
      promiseArr.push({ id: user.hubspotId, status: 'skipped' });
    }
  }
  const resArr = Promise.all(promiseArr);
  return jsonResponse(resArr);
}
