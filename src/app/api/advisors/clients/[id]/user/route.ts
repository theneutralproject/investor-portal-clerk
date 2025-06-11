import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { Role } from '@prisma/client';

import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { sanitizeUser } from '@/libs/user/utils.server';
import {
  ClerkUserUpdateSchema,
  UserUpdateSchema,
  zUserUpdateSchema,
} from '@/libs/user/schema';
import { updateHubspotContact } from '@/libs/hubspot/utils.server';
import { HubspotContactCreateUpdateSchema } from '@/libs/hubspot/schema';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = await getAdvisorContext(request);

  if ('status' in context) return context;

  const { dbUser } = context;

  const rawOrganizationId = (await params).id;

  if (!rawOrganizationId) {
    return errorResponse('Must specify client ID', 400, {
      request,
      extra: { user: dbUser, organizationId: rawOrganizationId },
    });
  }
  const organizationId = parseInt(rawOrganizationId, 10);

  if (Number.isNaN(organizationId)) {
    return errorResponse('Client ID not valid', 400, {
      request,
      extra: { user: dbUser, organizationId: rawOrganizationId },
    });
  }

  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
    },
    select: {
      id: true,
      name: true,
      ownedBy: {
        select: {
          id: true,
          clerkId: true,
        },
      },
    },
  });

  if (!organization) {
    return errorResponse('Organization not found', 404, {
      request,
      extra: { user: dbUser, organizationId, organization },
    });
  }

  if (!organization.ownedBy.clerkId) {
    return errorResponse("Organization's owner not found", 404, {
      request,
      extra: { user: dbUser, organizationId, organization },
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: organization.ownedBy.id },
    include: { address: true },
  });

  if (!user) {
    return errorResponse('User not found', 404, {
      request,
      extra: { advisorUser: dbUser, userId: organization.ownedBy.id, user },
    });
  }

  return jsonResponse({ organization, user: sanitizeUser(user) });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: clerkId, sessionClaims } = getAuth(request);

  if (!clerkId) {
    return errorResponse('User not authenticated', 401, { request });
  }

  const advisorUserId = sessionClaims?.metadata?.investorPortalId;

  if (!advisorUserId) {
    return errorResponse('Advisor user not found', 404, { request });
  }

  const dbUser = await prisma.user.findFirst({
    where: { OR: [{ clerkId }, { id: advisorUserId }] },
  });

  if (!dbUser || dbUser.role !== Role.ADVISOR) {
    return errorResponse('Unauthorized or not found', 403, { request });
  }

  const rawClientId = (await params).id;
  const clientId = parseInt(rawClientId, 10);

  if (!rawClientId || Number.isNaN(clientId)) {
    return errorResponse('Client ID not valid', 400, {
      request,
      extra: { rawClientId },
    });
  }

  const organization = await prisma.organization.findFirst({
    where: { id: clientId },
    select: {
      ownedBy: { select: { id: true, clerkId: true, hubspotId: true } },
    },
  });

  if (!organization?.ownedBy) {
    return errorResponse('Client owner not found', 404, { request });
  }

  const targetUser = organization.ownedBy;

  const requestBody = await request.json();
  const result = zUserUpdateSchema.partial().strip().safeParse(requestBody);

  if (!result.success) {
    return errorResponse('Input data malformed', 400, {
      request,
      extra: { error: result.error },
    });
  }

  const putData = result.data as UserUpdateSchema;
  const { address, ...userData } = putData;

  if (userData.firstName || userData.lastName || userData.referralSource) {
    const clerkUpdate: ClerkUserUpdateSchema = {};
    const hsUpdateData: HubspotContactCreateUpdateSchema = {
      hubspotId: targetUser.hubspotId,
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
      Logger.error('Error updating HubSpot contact', request, {
        error: hsError,
      });
    }

    try {
      await (
        await clerkClient()
      ).users.updateUser(targetUser.clerkId!, clerkUpdate);
    } catch (clerkError) {
      Logger.error('Error updating Clerk user', request, { error: clerkError });
    }
  }

  if (userData.ssn) {
    if (userData.ssn.startsWith('***-**-')) {
      delete userData.ssn;
    } else {
      const rawSSN = userData.ssn.replace(/\D/g, '');
      if (rawSSN.length !== 9) {
        return errorResponse('SSN must be 9 digits', 400, { request });
      }
      userData.ssn = rawSSN;
    }
  }

  try {
    if (address) {
      await prisma.address.upsert({
        where: { userId: targetUser.id },
        create: { ...address, userId: targetUser.id },
        update: { ...address },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: userData,
      include: { address: true },
    });

    Logger.log({
      message: `User ${updatedUser.id} updated by advisor ${dbUser.email}`,
    });

    return jsonResponse(sanitizeUser(updatedUser));
  } catch (dbError) {
    Logger.error('Error updating user', request, { error: dbError });
    return errorResponse('Unable to update user', 400, {
      request,
      extra: { error: dbError },
    });
  }
}
