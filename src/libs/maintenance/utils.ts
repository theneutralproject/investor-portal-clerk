import { Role } from '@prisma/client';
import prisma from '../prisma.server';
import { clerkClient } from '@clerk/nextjs/server';
import { getErrorMessage } from '../utils';

export async function isAdminUser(clerkId: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { clerkId, role: Role.ADMIN },
  });
  return !!user;
}

export async function findOrCreateClerkUser(
  email: string,
  firstname: string,
  lastname: string,
  phone?: string
) {
  const clerkData = {
    emailAddress: [email],
    firstName: firstname.trim(),
    lastName: lastname.trim(),
  } as {
    emailAddress: string[];
    firstName: string;
    lastName: string;
    phoneNumber?: string[];
  };

  if (phone) clerkData.phoneNumber = [phone];
  const authClient = await clerkClient();

  try {
    const exisingClerkUsers = await authClient.users.getUserList({
      emailAddress: [email],
    });
    if (exisingClerkUsers.data[0]) {
      console.log('User already exists in Clerk', email);
      return exisingClerkUsers.data[0];
    }

    if (!phone) {
      console.log(
        'User does not exist in Clerk and phone number is missing for user:',
        email
      );
      return null;
    }
    const newClerkUser = await authClient.users.createUser(clerkData);
    if (!newClerkUser) {
      throw new Error('Error creating Clerk user');
    }
    return newClerkUser;
  } catch (e) {
    console.error('Error creating Clerk user for clerkdata', clerkData);
    console.error(getErrorMessage(e));
    throw new Error(getErrorMessage(e));
  }
}
