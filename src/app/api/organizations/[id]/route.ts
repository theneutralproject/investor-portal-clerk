'use server';
import {
  type OrganizationUpdateSchema,
  zOrganizationUpdateSchema,
} from '@/libs/organization/schema';
import { sanitizeOrganization } from '@/libs/organization/utils';
import prisma from '@/libs/prisma.server';
import { getErrorMessage, jsonResponse } from '@/libs/utils';
import { currentUser } from '@clerk/nextjs/server';
import { DealOwnershipType } from '@prisma/client';
import { isNumber } from 'lodash';
import type { NextRequest } from 'next/server';

async function getUserAndOrg(request: NextRequest) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() ?? '');
  if (!id || !isNumber(id)) {
    throw new Error('id is required in url');
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error('Clerk user not found');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      address: true,
      organizationMember: true,
    },
  });

  if (!user) {
    console.error(
      `User record with clerkid ${clerkUser.id} not found in prisma (GET)`
    );
    throw new Error(
      `User record with clerkid ${clerkUser.id} not found in prisma (GET)`
    );
  }

  // get org by id if they are a member
  const organization = await prisma.organization.findFirst({
    where: {
      AND: [{ members: { some: { userId: user.id } } }, { id: id }],
    },
    include: {
      address: true,
      members: {
        include: {
          user: true,
        },
      },
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
    return jsonResponse(getErrorMessage(error), 400);
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
      throw new Error('You do not have access to this organization');
    }

    const requestBody = (await request.json()) as OrganizationUpdateSchema;
    let putData: OrganizationUpdateSchema;
    try {
      putData = zOrganizationUpdateSchema.parse(requestBody);
    } catch (parseError) {
      console.error('ERROR: unable to parse PUT body:\n', parseError);
      throw new Error(
        `Input data malformatted: \n${(parseError as Error).message}`
      );
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
          console.error('ERROR: unable to upsert address:\n', dbError);
          throw new Error('unable to update the organization');
        });
    }

    if (orgData.ownershipType) {
      if (
        orgToUpdate.isPrimary &&
        orgData.ownershipType !== DealOwnershipType.INDIVIDUAL
      ) {
        throw new Error(
          'Cannot update primary organization to non-INDIVIDUAL ownership type'
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

    const updatedOrg = await prisma.organization
      .update({
        where: {
          ownerId: user.id,
          id: orgToUpdate.id,
        },
        data: orgData,
        include: { members: true, address: true },
      })
      .catch(dbError => {
        console.error('ERROR: unable to update org:\n', dbError);
        throw new Error('unable to update the organization');
      });

    return jsonResponse(sanitizeOrganization(updatedOrg));
  } catch (error: unknown) {
    return jsonResponse(getErrorMessage(error), 400);
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
      throw new Error('You do not have access to this organization');
    }

    // check if org has existing deals
    const orgDeals = await prisma.deal.findMany({
      where: { organizationId: orgToDelete.id },
    });
    if (orgDeals.length > 0) {
      throw new Error('Organization has existing deals and cannot be deleted');
    }

    if (orgToDelete.isPrimary) {
      throw new Error('Cannot delete primary organization');
    }

    if (orgToDelete.ownerId !== user.id) {
      throw new Error(
        'Only the organization owner can delete the organization'
      );
    }

    await prisma.organization
      .delete({ where: { id: orgToDelete.id, ownerId: user.id } })
      .catch(dbError => {
        console.error('ERROR: unable to delete org:\n', dbError);
        throw new Error('unable to delete the organization');
      });

    return jsonResponse(
      { success: true, message: 'organization successfully deleted' },
      200
    );
  } catch (error: unknown) {
    return jsonResponse(getErrorMessage(error), 400);
  }
}
