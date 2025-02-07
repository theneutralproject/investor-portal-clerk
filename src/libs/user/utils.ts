import 'server-only';
import { isError } from 'lodash';
import type { HubspotContactCreateUpdateSchema } from '../hubspot/schema';
import {
  associateContactWithDealInHubspot,
  createHubspotContact,
  formatDateForHubspot,
  ReferralSource,
  updateHubspotContact,
} from '../hubspot/utils';
import prisma from '../prisma.server';
import type {
  ClerkUserUpdateSchema,
  UserCreateSchema,
  UserUpdateSchema,
} from './schema';
import { getErrorMessage } from '../utils';
import { type Deal, MembershipType, type User } from '@prisma/client';
import type { UserWithAddress } from '../types';
import type { AddressCreateSchema } from '../address/schema';
import { clerkClient } from '@clerk/nextjs/server';

interface ClerkAPIErrorResponse {
  clerkError: boolean;
  errors: ClerkAPIError[];
}

interface ClerkAPIError {
  code: string;
  message: string;
  longMessage: string;
  meta: Record<string, any>;
}

const getHsUserData = (
  userData: UserCreateSchema | UserUpdateSchema,
  address: AddressCreateSchema | undefined
) => {
  const hsUserData: HubspotContactCreateUpdateSchema = {
    email: userData.email,
    properties: {},
  };
  if (userData.firstName) hsUserData.properties.firstname = userData.firstName;
  if (userData.lastName) hsUserData.properties.lastname = userData.lastName;
  if ('clerkId' in userData && userData.clerkId)
    hsUserData.properties.userid = userData.clerkId;
  if (userData.phoneNumber) hsUserData.properties.phone = userData.phoneNumber;

  if (address) {
    hsUserData.properties.address = address.street;
    hsUserData.properties.state = address.state;
    hsUserData.properties.city = address.city;
    hsUserData.properties.zip = address.zipcode;
    hsUserData.properties.country = address.country;
  }

  return hsUserData;
};

/**
 * creates a user in both hubspot and our DB
 * @param data
 */
export async function createUserInDbAndHubspot(
  data: UserCreateSchema,
  dealId?: number
) {
  const { address, ...userData } = data;
  userData.email = userData.email.toLowerCase();

  let deal: Deal | null = null;
  if (dealId) {
    // attach user to hubspot deal
    deal = await prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) {
      throw new Error(`Deal with id ${dealId} not found`);
    }
  }
  /* Upsert user in Hubspot**/
  const hsUserData = getHsUserData(userData, address);

  let hsContactId: string;
  if (userData.hubspotId) {
    hsUserData.hubspotId = userData.hubspotId;
    hsContactId = userData.hubspotId;
    hsUserData.properties.date_signed_up = formatDateForHubspot(new Date());
    // update user in hubspot
    try {
      await updateHubspotContact(hsUserData);
    } catch (error) {
      console.error('Unable to update user in hubspot1:\n', error);
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
        isPrimary: true,
      },
    });
    userOrgId = userOrg.id;

    // add orgId to user
    updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        userOrgId,
      },
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
        'User neither created nor found in DB - smells fishy!:\n',
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

async function updateUserInClerk(userData: User) {
  const clerkUpdate: ClerkUserUpdateSchema = {
    firstName: userData.firstName,
    lastName: userData.lastName,
  };
  if (userData.email) {
    try {
      await clerkClient.emailAddresses.createEmailAddress({
        userId: userData.clerkId!,
        emailAddress: userData.email,
        primary: false,
        verified: false,
      });
    } catch (error) {
      if ((error as ClerkAPIErrorResponse).clerkError) {
        console.error('Clerk API Error :)');
        // Handle Clerk API errors
        const clerkErrors = (error as ClerkAPIErrorResponse).errors;
        clerkErrors.forEach(async err => {
          console.error(`Clerk API Error: ${err.code} - ${err.message}`);
          // Implement specific error handling based on err.code
          if (err.code === 'form_identifier_exists') {
            console.error(
              `This email address already exists for user ${userData.clerkId}`,
              err.message
            );

            // check if this email address is associated with the user we are looking to update:
            const existingUsers = await clerkClient.users.getUserList({
              emailAddress: [userData.email],
            });
            if (existingUsers[0]?.id === userData.clerkId) {
              console.log(
                `Email address ${userData.email} is already associated with user ${userData.clerkId}. We will still update Hubspot and DB.`
              );
            }
            return existingUsers[0];
          }
          throw new Error(err.message);
        });
      } else {
        // Handle other types of errors
        console.error('An unexpected Clerk error occurred:', error);
        throw error;
      }
    }
  }
  return await clerkClient.users.updateUser(userData.clerkId!, clerkUpdate);
}

export async function updateUserInDbAndHubspotAndClerk(data: UserUpdateSchema) {
  const { address, ...userData } = data;
  if (!userData.id) {
    throw new Error('User ID is required to update user');
  }

  // update user and address in db
  try {
    if (address) {
      // upsert address
      await prisma.address
        .upsert({
          where: { userId: userData.id },
          create: { ...address, userId: userData.id },
          update: { ...address, userId: userData.id },
        })
        .catch(error => {
          console.error('ERROR: unable to upsert address:\n', error);
          throw new Error(getErrorMessage(error));
        });
    }

    if (userData.ssn) {
      if (userData.ssn.length === 0) {
        delete userData.ssn;
      } else if (userData.ssn.startsWith('***-**')) {
        delete userData.ssn;
      } else {
        const presanitizedSSN = userData.ssn.replace(/\D/g, '');
        if (presanitizedSSN.length !== 9) {
          throw new Error('SSN must be 9 digits');
        }
        userData.ssn = presanitizedSSN;
      }
    }
    if (userData.phoneNumber?.length === 0) delete userData.phoneNumber;

    if (userData.referralSource) {
      if (userData.referralSource?.length === 0) delete userData.referralSource;
      else if (
        ReferralSource[
          userData.referralSource as unknown as keyof typeof ReferralSource
        ] === undefined
      ) {
        throw new Error('Invalid referral source');
      }
    }
    const userToUpdate = await prisma.user.findUnique({
      where: { id: userData.id },
    });
    if (!userToUpdate) {
      throw new Error(`User with id ${userData.id} not found`);
    }

    /* First update user in clerk**/
    await updateUserInClerk(userToUpdate);

    /* Second Upsert user in Hubspot**/
    const hsUserData = getHsUserData(userData, address);
    hsUserData.hubspotId = userToUpdate.hubspotId;
    await updateHubspotContact(hsUserData);

    /* Third update user in DB**/
    console.log('updating user in db', userData);
    const updatedUser = await prisma.user.update({
      where: { id: userData.id },
      data: userData,
      include: { address: true },
    });
    return updatedUser;
  } catch (error) {
    console.error('ERROR: unable to update user:\n', error);
    throw new Error(getErrorMessage(error));
  }
}

export function sanitizeUser(user: User | UserWithAddress) {
  return {
    ...user,
    ssn: user.ssn ? `***-**-${user.ssn.slice(-4)}` : null,
  };
}
