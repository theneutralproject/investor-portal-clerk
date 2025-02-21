'use server';
import { getAuth } from '@clerk/nextjs/server';
import { DealOwnershipType, MembershipType } from '@prisma/client';
import type { NextRequest } from 'next/server';
import {
  type OrganizationCreateSchema,
  zOrganizationCreateSchema,
} from '@/libs/organization/schema';
import { sanitizeOrganization } from '@/libs/organization/utils';
import prisma from '@/libs/prisma.server';
import { getErrorMessage, jsonResponse } from '@/libs/utils.server';

/**
 * @param request GET all organizations that a user is a member of
 */
export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return jsonResponse({ error: 'Clerk user not found' }, 404);
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { address: true, organizationMember: true },
  });

  if (!dbUser) {
    console.error(
      `User record with clerkid ${userId} not found in prisma (GET)`
    );
    return jsonResponse(
      { error: `User record with clerkid ${userId} not found in prisma (GET)` },
      404
    );
  }

  // get orgs they are a member of
  const userOrganizations = await prisma.organization.findMany({
    where: { members: { some: { userId: dbUser.id } } },
  });

  // encypt TIN on orgs
  return jsonResponse(userOrganizations.map(sanitizeOrganization), 200);
}

/**
 * Create a new organization without specifying members
 * @param request POST create a new organization
 */
export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return jsonResponse({ error: 'Clerk user not found' }, 404);
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { address: true },
  });

  if (!dbUser) {
    console.error(
      `User record with clerkid ${userId} not found in prisma (GET)`
    );
    return jsonResponse(
      { error: `User record with clerkid ${userId} not found in prisma (GET)` },
      404
    );
  }

  const requestBody = (await request.json()) as OrganizationCreateSchema;
  let postData: OrganizationCreateSchema;
  try {
    postData = zOrganizationCreateSchema.parse(requestBody);
  } catch (parseError) {
    console.error(
      'ERROR: unable to parse org PUT body:\n',
      getErrorMessage(parseError)
    );
    return jsonResponse(
      { error: `Input data malformatted: \n${(parseError as Error).message}` },
      400
    );
  }

  const getOrgName = () => {
    if (postData.name) {
      return postData.name;
    }
    switch (postData.ownershipType) {
      case DealOwnershipType.CORPORATION: {
        return `Corporation of ${dbUser.firstName} ${dbUser.lastName}`;
      }
      case DealOwnershipType.PARTNERSHIP: {
        return `${dbUser.firstName} ${dbUser.lastName}'s Partnership Organization`;
      }
      case DealOwnershipType.MARITAL: {
        return `${dbUser.firstName} ${dbUser.lastName}'s Marital Organization`;
      }
      case DealOwnershipType.COMMON: {
        return `${dbUser.firstName} ${dbUser.lastName}'s Common Organization`;
      }
      case DealOwnershipType.TRUST: {
        return `${dbUser.firstName} ${dbUser.lastName}'s Trust Organization`;
      }
      default:
        return `${dbUser.firstName} ${dbUser.lastName}'s Organization`;
    }
  };

  if (postData.tin && postData.tin.replace(/\D/g, '').length !== 9) {
    return jsonResponse({ error: 'TIN must be 9 digits' }, 400);
  }

  const orgCreateData = {
    name: getOrgName(),
    ownershipType: postData.ownershipType ?? DealOwnershipType.INDIVIDUAL,
    ownerId: dbUser.id,
    tin: postData.tin,
    dateOfCreation: postData.dateOfCreation,
    juristication: postData.juristication,
    members: { create: { type: MembershipType.OWNER, userId: dbUser.id } },
  };
  try {
    const newOrg = await prisma.organization.create({ data: orgCreateData });
    return jsonResponse(sanitizeOrganization(newOrg), 201);
  } catch (dbError) {
    console.error('ERROR: unable to update org:\n', dbError);
    return jsonResponse({ error: dbError }, 400);
  }
}
