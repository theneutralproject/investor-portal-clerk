'use server';
import {
  type OrganizationMemberCreateSchema,
  zOrganizationMemberCreateSchema,
} from '@/libs/organization/schema';
import prisma from '@/libs/prisma.server';
import { createUserInDbAndHubspot, sanitizeUser } from '@/libs/user/utils';
import { getErrorMessage, jsonResponse } from '@/libs/utils';
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
      throw new Error('Organization not found');
    }
    if (!dbUser) {
      throw new Error('User not found');
    }

    const requestBody =
      (await request.json()) as OrganizationMemberCreateSchema;
    let postData: OrganizationMemberCreateSchema;

    try {
      postData = zOrganizationMemberCreateSchema.parse(requestBody);
    } catch (parseError) {
      console.error('unable to parse POST body:\n', parseError);
      return jsonResponse(
        {
          error: `Input data malformatted: \n${(parseError as Error).message}`,
        },
        400
      );
    }

    // extract email from postdata.user
    const {
      user: { email, ...userData },
      dealId,
    } = postData;

    // 1. make sure that the requester is the owner of the org in question
    if (organization.ownerId !== dbUser.id) {
      console.error(
        `User ${dbUser.id} is not authorized to edit the orgToUpdate with id ${organization.id}:\n`
      );
      return jsonResponse(
        {
          error:
            'You are not the owner of the organization you are looking to edit',
        },
        401
      );
    }

    // check if user already exists as org member:
    const existingMember = organization.members.find(
      member => member.user.email === email.toLowerCase()
    );
    if (existingMember) {
      return jsonResponse(
        {
          error: `User ${email.toLowerCase()} already exists as a member of the specified organization`,
        },
        403
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
        console.error(
          `ERROR: unable to CONNECT existing user to org with id ${organization.id}:\n`,
          error
        );
        return jsonResponse(getErrorMessage(error), 400);
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
      console.error('ERROR: unable to create user:\n', createUserError);
      return jsonResponse({ error: 'The user could not be created' }, 400);
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
      console.error(
        `ERROR: unable to CONNECT new user to org with id ${organization.id}:\n`,
        error
      );
      return jsonResponse(getErrorMessage(error), 400);
    }
  } catch (error: unknown) {
    console.error('ERROR: unable to add user to org:\n', error);
    return jsonResponse(getErrorMessage(error), 400);
  }
}
