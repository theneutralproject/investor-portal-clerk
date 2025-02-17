'use server';
import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { jsonResponse } from '@/libs/utils.server';

/**
 * @param request
 * @returns Return organizations owned by the currently logged in user
 */
export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return jsonResponse({ error: 'Clerk user not found' }, 404);
  }
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    console.error(
      `User record with clerkid ${userId} not found in prisma (GET)`
    );
    return jsonResponse(
      {
        error: `User record with clerkid ${userId} not found in prisma (GET)`,
      },
      404
    );
  }

  // get all organizations owned by the user, exclude TIN and SSN
  const organizations = await prisma.organization.findMany({
    where: {
      ownerId: user.id,
    },
    select: {
      deals: true,
      id: true,
      name: true,
      ownerId: true,
      dateOfCreation: true,
      juristication: true,
      ownershipType: true,
      isPrimary: true,
      members: {
        include: {
          user: {
            select: {
              id: true,
              role: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              hubspotId: true,
              userOrgId: true,
              referralSource: true,
              dateOfBirth: true,
              dateCreated: true,
              dateUpdated: true,
            },
          },
        },
      },
    },
  });

  return jsonResponse(organizations);
}
