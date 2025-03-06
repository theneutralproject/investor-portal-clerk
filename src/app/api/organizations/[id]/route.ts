'use server';
import { getAuth } from '@clerk/nextjs/server';
import { DealOwnershipType } from '@prisma/client';
import { isNumber } from 'lodash';
import type { NextRequest } from 'next/server';
import {
  type OrganizationUpdateSchema,
  zOrganizationUpdateSchema,
} from '@/libs/organization/schema';
import { sanitizeOrganization } from '@/libs/organization/utils';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';

async function getUserAndOrg(request: NextRequest) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() ?? '');
  if (!id || !isNumber(id)) {
    throw new Error('id is required in url');
  }

  const { userId } = getAuth(request);
  if (!userId) {
    throw new Error('Clerk user not found');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { address: true, organizationMember: true },
  });

  if (!user) {
    throw new Error(
      `User record with clerkid ${userId} not found in prisma (GET)`
    );
  }

  // get org by id if they are a member
  const organization = await prisma.organization.findFirst({
    where: { AND: [{ members: { some: { userId: user.id } } }, { id: id }] },
    include: {
      address: true,
      members: { include: { user: true } },
      document: true,
    },
  });

  return { user, organization };
}

/**
 * Get an organization by id if the requesting user is a member
 * @param request
 * @returns Promise <Organization | null>
 */
export async function GET(request: NextRequest) {
  try {
    const { organization } = await getUserAndOrg(request);

    return jsonResponse(
      organization ? sanitizeOrganization(organization) : organization
    );
  } catch (error: unknown) {
    return errorResponse(getErrorMessage(error), 400, {
      request,
      extra: { error },
    });
  }
}

/**
 * Update an existing org  - exclusive of its members
 * @param request with body:OrganizationUpdateSchema
 * @returns updated organization
 **/
export async function PUT(request: NextRequest) {
  try {
    const { user, organization: orgToUpdate } = await getUserAndOrg(request);
    if (!orgToUpdate) {
      return errorResponse('Organization not found', 404, { request });
    }

    const requestBody = (await request.json()) as OrganizationUpdateSchema;
    let putData: OrganizationUpdateSchema;
    try {
      putData = zOrganizationUpdateSchema.parse(requestBody);
    } catch (parseError) {
      return errorResponse('Input data malformatted', 400, {
        request,
        extra: { error: parseError },
      });
    }

    const { address, ...orgData } = putData;

    // upsert address
    if (address) {
      await prisma.address
        .upsert({
          where: { organizationId: orgToUpdate.id },
          create: { ...address, organizationId: orgToUpdate.id },
          update: { ...address, organizationId: orgToUpdate.id },
        })
        .catch(dbError => {
          return errorResponse('Unable to update the organization', 500, {
            request,
            extra: { error: dbError },
          });
        });
    }

    if (orgData.ownershipType) {
      if (
        orgToUpdate.isPrimary &&
        orgData.ownershipType !== DealOwnershipType.INDIVIDUAL
      ) {
        return errorResponse(
          'Cannot update primary organization to non-INDIVIDUAL ownership type',
          400,
          { request }
        );
      }
    }

    if (orgData.tin) {
      if (orgData.tin.startsWith('***-**')) {
        delete orgData.tin;
      } else {
        const presanitizedTIN = orgData.tin.replace(/\D/g, '');
        if (presanitizedTIN.length !== 9) {
          return jsonResponse({ error: 'TIN must be 9 digits' }, 400);
        }
        orgData.tin = presanitizedTIN;
      }
    }
    try {
      const updatedOrg = await prisma.organization.update({
        where: { ownerId: user.id, id: orgToUpdate.id },
        data: orgData,
        include: { members: true, address: true },
      });

      return jsonResponse(sanitizeOrganization(updatedOrg));
    } catch (error) {
      return errorResponse('Unable to update the organization', 500, {
        request,
        extra: { error },
      });
    }
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }
}

/**
 * Delete an organization (if it has no deals, and if it is not the last INDIVIDUAL one) by its owner
 * @param request with query param: {id: number}
 * @returns 200 if successful
 */
export async function DELETE(request: NextRequest) {
  try {
    const { user, organization: orgToDelete } = await getUserAndOrg(request);

    if (!orgToDelete) {
      return errorResponse('Organization not found', 404, { request });
    }

    // check if org has existing deals
    const orgDeals = await prisma.deal.findMany({
      where: { organizationId: orgToDelete.id },
    });
    if (orgDeals.length > 0) {
      return errorResponse(
        'Organization has existing deals and cannot be deleted',
        400,
        { request }
      );
    }

    if (orgToDelete.isPrimary) {
      return errorResponse('Cannot delete primary organization', 400, {
        request,
      });
    }

    if (orgToDelete.ownerId !== user.id) {
      return errorResponse(
        'Only the organization owner can delete the organization',
        400,
        { request }
      );
    }
    try {
      await prisma.organization.delete({
        where: { id: orgToDelete.id, ownerId: user.id },
      });

      return jsonResponse(
        { success: true, message: 'organization successfully deleted' },
        200
      );
    } catch (error) {
      return errorResponse('Unable to delete the organization', 500, {
        request,
        extra: { error },
      });
    }
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }
}
