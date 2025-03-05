'use server';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import type { NextRequest } from 'next/server';
import { getUserAndOrg } from '../helpers';
import { isNumber } from 'lodash';
import {
  type OrganizationMemberUpdateSchema,
  zOrganizationMemberUpdateSchema,
} from '@/libs/organization/schema';
import { updateHubspotContact } from '@/libs/hubspot/utils.server';
import type { HubspotContactCreateUpdateSchema } from '@/libs/hubspot/schema';
import Logger from '@/libs/logger';

/**
 * Remove one member at the time (but not self)
 * @param request
 */
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const memberId = parseInt(url.pathname.split('/').pop() ?? '');
    if (!memberId || !isNumber(memberId)) {
      return errorResponse('userId is required in url', 400, { request });
    }

    const { user: dbUser, organization } = await getUserAndOrg(request, 2);
    if (!organization) {
      return errorResponse('Organization not found', 404, { request });
    }
    if (!dbUser) {
      return errorResponse('User not found', 404, { request });
    }

    if (organization.ownerId === memberId) {
      return errorResponse(
        'You cannot remove the owner of the organization',
        403,
        { request }
      );
    }

    if (organization.ownerId !== dbUser.id) {
      return errorResponse(
        'Only org owners can edit organization members',
        403,
        { request }
      );
    }

    // get the member to be deleted
    const memberToDelete = organization.members.find(
      member => member.id === memberId
    );
    if (!memberToDelete?.user.clerkId) {
      // they are a ghost user, delete them from the db
      Logger.log(
        { message: `deleting ghost user: memberToDelete?.user.id` },
        request
      );
      try {
        await prisma.user.delete({ where: { id: memberToDelete?.user.id } });
        const updatedOrg = await prisma.organization.findUnique({
          where: { id: organization.id },
          include: { members: { include: { user: true } } },
        });
        return jsonResponse(updatedOrg);
      } catch (deleteError: unknown) {
        return errorResponse(
          `The user could not be deleted from the database`,
          400,
          { request, extra: { error: deleteError } }
        );
      }
    } else {
      // they already signed up for an account. Only disassociate them from the org
      Logger.log({ message: `disassociating user from org` }, request);
      try {
        const updatedOrg = await prisma.organization.update({
          where: { id: organization.id },
          data: { members: { delete: { id: memberId } } },
          include: { members: { include: { user: true } } },
        });
        return jsonResponse(updatedOrg);
      } catch (deleteError) {
        return errorResponse(
          'The user could not be deleted from the organization',
          500,
          { request, extra: { error: deleteError } }
        );
      }
    }
  } catch (error: unknown) {
    return errorResponse('Unknown Error', 500, { request, extra: { error } });
  }
}

/**
 * Update a member's details
 * @param request
 * @returns the updated member (Member)
 */
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const memberId = parseInt(url.pathname.split('/').pop() ?? '');
    if (!memberId || !isNumber(memberId)) {
      return errorResponse('userId is required in url', 400, { request });
    }
    const { user: dbUser, organization } = await getUserAndOrg(request, 2);
    if (!organization) {
      return errorResponse('Organization not found', 404, { request });
    }
    if (!dbUser) {
      return errorResponse('User not found', 404, { request });
    }

    if (organization.ownerId === memberId) {
      return errorResponse(
        'You cannot edit the owner of the organization',
        403,
        { request }
      );
    }

    if (organization.ownerId !== dbUser.id) {
      return errorResponse(
        'Only org owners can edit organization members',
        403,
        { request }
      );
    }

    const requestBody =
      (await request.json()) as OrganizationMemberUpdateSchema;
    let putData: OrganizationMemberUpdateSchema;

    try {
      putData = zOrganizationMemberUpdateSchema.parse(requestBody);
    } catch (parseError) {
      return errorResponse('Input data malformatted', 400, {
        request,
        extra: { error: parseError },
      });
    }

    // get the member to be updated
    const memberToUpdate = organization.members.find(
      member => member.id === memberId
    );
    if (!memberToUpdate) {
      return errorResponse('Member not found', 404, { request });
    }

    if (memberToUpdate.user.clerkId) {
      return errorResponse(
        'Cannot update a user who has already signed up for an account',
        403,
        { request }
      );
    }

    // update the member
    try {
      const updatedMember = await prisma.member.update({
        where: { id: memberId },
        data: {
          type: putData.type,
          title: putData.title,
          user: {
            update: {
              email: putData.user?.email,
              phoneNumber: putData.user?.phoneNumber,
              firstName: putData.user?.firstName,
              lastName: putData.user?.lastName,
            },
          },
        },
        include: { user: true },
      });

      // also update them in hubspot
      const hubspotContact: HubspotContactCreateUpdateSchema = {
        hubspotId: updatedMember.user.hubspotId,
        email: updatedMember.user.email,
        properties: {
          firstname: updatedMember.user.firstName,
          lastname: updatedMember.user.lastName,
        },
      };
      if (updatedMember.user.phoneNumber) {
        hubspotContact.properties.phone = updatedMember.user.phoneNumber;
      }
      try {
        await updateHubspotContact(hubspotContact);
      } catch (hubspotError) {
        Logger.error('Unable to update hubspot contact', request, {
          hubspotError,
        });
      }
      return jsonResponse(updatedMember);
    } catch (updateError) {
      return errorResponse('The member could not be updated', 400, {
        request,
        extra: { error: updateError },
      });
    }
  } catch (error: unknown) {
    return errorResponse('The member could not be updated', 500, {
      request,
      extra: { error },
    });
  }
}
