import 'server-only';
import { isError } from 'lodash';
import type { HubspotContactCreateUpdateSchema } from '../hubspot/schema';
import {
  associateContactWithDealInHubspot,
  createHubspotContact,
  updateHubspotContact,
} from '../hubspot/utils';
import prisma from '../prisma.server';
import type { UserCreateSchema } from './schema';
import { getErrorMessage } from '../utils';
import { type Deal, MembershipType, Role, type User } from '@prisma/client';
import type { UserWithAddress } from '../types';

/**
 * creates a user in both hubspot and our DB
 * @param data
 */
export async function createUserInDbAndHubspot(
  data: UserCreateSchema,
  dealId?: number
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { address, ...userData } = data;

  let deal: Deal | null = null;
  if (dealId) {
    // attach user to hubspot deal
    deal = await prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) {
      throw new Error(`Deal with id ${dealId} not found`);
    }
  }
  /* Upsert user in Hubspot**/
  const hsUserData: HubspotContactCreateUpdateSchema = {
    email: userData.email,
    properties: {
      userid: userData.clerkId ?? 'invitePending',
      firstname: userData.firstName,
      lastname: userData.lastName,
    },
  };
  if (userData.phoneNumber) hsUserData.properties.phone = userData.phoneNumber;

  if (address) {
    hsUserData.properties.address = address.street;
    hsUserData.properties.state = address.state;
    hsUserData.properties.city = address.city;
    hsUserData.properties.zip = address.zipcode;
    hsUserData.properties.country = address.country;
  }

  let hsContactId: string;
  if (userData.hubspotId) {
    hsUserData.hubspotId = userData.hubspotId;
    hsContactId = userData.hubspotId;
    // update user in hubspot
    try {
      await updateHubspotContact(hsUserData);
    } catch (error) {
      console.error('Unable to update user in hubspot:\n', error);
    }
  } else {
    // create new user in hubspot
    try {
      hsContactId = await createHubspotContact(hsUserData);
    } catch (error) {
      console.error('Unable to create user in hubspot:\n', error);
      throw new Error(getErrorMessage(error));
    }
  }

  // create user and address in DB
  let userOrgId: number;
  let updatedUser: User;
  try {
    let userCreateData = {
      ...userData,
      hubspotId: hsContactId,
    };

    if (address) {
      const userAddress = await prisma.address.create({ data: address });
      console.log(`created address for new user`);
      const addressId = userAddress.id;
      userCreateData = {
        ...userCreateData,
        ...{ address: { connect: userAddress.id }, addressId: addressId },
      };
    }
    console.log('creating user in db', userCreateData.email);
    const dbUser = await prisma.user.create({
      data: userCreateData,
    });

    // create a personal org:
    const userOrg = await prisma.organization.create({
      data: {
        name: `${userData.firstName} ${userData.lastName}'s Organization`,
        ownedBy: { connect: { id: dbUser.id } },
        members: { create: { userId: dbUser.id, type: MembershipType.OWNER } },
      },
    });
    userOrgId = userOrg.id;

    // add orgId to user
    updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: { userOrgId },
    });
  } catch (error) {
    // this should only happen if a duplicate webhook is received from clerk
    console.warn('Unable to create user in DB:\n', getErrorMessage(error));
    // check if user already exists in DB:
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (!existingUser) {
      console.error(
        'User neither created nor found  in DB:\n',
        getErrorMessage(error)
      );
      throw new Error(getErrorMessage(error));
    } else {
      console.warn(`Processing existing user ${existingUser.email}`);
      updatedUser = existingUser;
    }
  }
  if (deal) {
    const res = await associateContactWithDealInHubspot(
      hsContactId,
      deal.hubspotId
    );
    if (isError(res)) {
      console.error('Unable to associate user with deal in hubspot:\n', res);
    }
  }

  return updatedUser;
}

export function sanitizeUser(user: User | UserWithAddress) {
  return {
    ...user,
    ssn: user.ssn ? `***-**-${user.ssn.slice(-4)}` : null,
  };
}

export async function isAdminUser(clerkId: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { clerkId, role: Role.ADMIN },
  });
  return !!user;
}
