'use server';
import prisma from '@/libs/prisma.server';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { isNumber } from 'lodash';

export async function getUserAndOrg(request: NextRequest, idIdxFromRight = 0) {
  const url = new URL(request.url);
  const urlBits = url.pathname.split('/');
  const id = parseInt(urlBits[urlBits.length - 1 - idIdxFromRight] ?? '');
  if (!id || !isNumber(id)) {
    throw new Error(`id: number is required in url. We found ${id}`);
  }
  const { userId } = getAuth(request);
  if (!userId) {
    throw new Error('Clerk user not found');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      address: true,
      // organizationsOwned: { include: { members: { include: { user: true } } } },
    },
  });

  if (!user) {
    throw new Error(
      `User record with clerkid ${userId} not found in prisma (GET)`
    );
  }

  // get org by id if they are a member
  const organization = await prisma.organization.findFirst({
    where: {
      AND: [{ members: { some: { userId: user.id } } }, { id: id }],
    },
    include: { members: { include: { user: true } } },
  });

  return { user, organization };
}
