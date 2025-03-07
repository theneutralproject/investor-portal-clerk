'use server';
import {
  type OrganizationMemberCreateSchema,
  zOrganizationMemberCreateSchema,
} from '@/libs/organization/schema';
import prisma from '@/libs/prisma.server';
import {
  createUserInDbAndHubspot,
  sanitizeUser,
} from '@/libs/user/utils.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import type { User } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { getUserAndOrg } from './helpers';

/**
 * Add one member to an org (but not self)
 * Will create a user if they do not yet exist, or add an existing user to the organization
 
 * @param request 
 * returns the member, and a status message
 */
export async function POST(request: NextRequest) {
  try {
    const { user: dbUser, organization } = await getUserAndOrg(request, 1);
    if (!organization) {
      return errorResponse('Organization not found', 404, { request });
    }
    if (!dbUser) {
      return errorResponse('User not found', 404, { request });
    }

    const requestBody =
      (await request.json()) as OrganizationMemberCreateSchema;
    let postData: OrganizationMemberCreateSchema;

    try {
      postData = zOrganizationMemberCreateSchema.parse(requestBody);
    } catch (parseError) {
      return errorResponse('Input data malformatted', 400, {
        request,
        extra: { error: parseError },
      });
    }

    // extract email from postdata.user
    const {
      user: { email, ...userData },
      dealId,
    } = postData;

    // 1. make sure that the requester is the owner of the org in question
    if (organization.ownerId !== dbUser.id) {
      return errorResponse(
        'Only org owners can edit organization members',
        401,
        { request }
      );
    }

    // check if user already exists as org member:
    const existingMember = organization.members.find(
      member => member.user.email === email.toLowerCase()
    );
    if (existingMember) {
      return errorResponse(
        `User ${email.toLowerCase()} already exists as a member of the specified organization`,
        403,
        { request }
      );
    }

    // user does not yet exist in org. See if they already exist in the db:
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { phoneNumber: userData.phoneNumber },
        ],
      },
    });
    if (existingUser) {
      try {
        const newMember = await prisma.member.create({
          data: {
            userId: existingUser.id,
            organizationId: organization.id,
            type: postData.type,
            title: postData.title,
          },
          include: { user: true },
        });
        const { user, ...rest } = newMember;
        return jsonResponse(
          { existingUserFound: true, user: sanitizeUser(user), ...rest },
          201
        );
      } catch (error) {
        return errorResponse(
          `Unable to CONNECT existing user to org with id ${organization.id}`,
          400,
          { request, extra: { error } }
        );
      }
    }

    // create a new user
    let newUser: User;
    try {
      newUser = await createUserInDbAndHubspot(
        { ...userData, email: email.toLowerCase() },
        dealId
      );
    } catch (createUserError) {
      return errorResponse('The user could not be created', 400, {
        request,
        extra: { error: createUserError },
      });
    }

    try {
      const newMember = await prisma.member.create({
        data: {
          userId: newUser.id,
          organizationId: organization.id,
          type: postData.type,
          title: postData.title,
        },
        include: { user: true },
      });

      const { user, ...rest } = newMember;
      return jsonResponse(
        { existingUserFound: false, user: sanitizeUser(user), ...rest },
        201
      );
    } catch (error) {
      return errorResponse(
        `Unable to CONNECT new user to org with id ${organization.id}`,
        400,
        {
          request,
          extra: { error },
        }
      );
    }
  } catch (error: unknown) {
    return errorResponse('The member could not be added', 500, {
      request,
      extra: { error },
    });
  }
}
