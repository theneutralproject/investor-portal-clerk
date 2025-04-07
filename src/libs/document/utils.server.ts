import { NextRequest } from 'next/server';
import prisma from '../prisma.server';
import { UserWithOrganizations } from '../types';
import { getAuth } from '@clerk/nextjs/server';

export async function validateAccess(
  dbUser: UserWithOrganizations,
  type: string,
  id: number
) {
  if (type === 'deal') {
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      throw new Error('Deal not found');
    }
    if (
      !dbUser.organizationsOwned.some(org => org.id === deal.organizationId)
    ) {
      throw new Error(
        'You are not the owner of the organization that the deal belongs to'
      );
    }
  } else {
    if (!dbUser.organizationsOwned.some(org => org.id === id)) {
      throw new Error(
        'You are not the owner of the organization you are trying to upload a document for'
      );
    }
  }
}

export async function validateUser(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    throw new Error('User not found');
  }

  const dbUser = (await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { organizationsOwned: true },
  })) as UserWithOrganizations;

  if (!dbUser) {
    throw new Error(`User record with clerkid ${userId} not found in prisma`);
  }

  return dbUser;
}
