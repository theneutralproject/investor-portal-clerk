import 'server-only';
import { isError } from 'lodash';
import type { HubspotContactCreateUpdateSchema } from '../hubspot/schema';
import {
  associateContactWithDealInHubspot,
  createOrUpdateHubspotContact,
  formatDateForHubspot,
  updateHubspotContact,
} from '../hubspot/utils.server';
import prisma from '../prisma.server';
import type { UserCreateSchema, UserUpdateSchema } from './schema';
import { getErrorMessage } from '../utils.server';
import {
  type Deal,
  MembershipType,
  Prisma,
  PrismaClient,
  type User,
} from '@prisma/client';
import type { UserWithAddress } from '../types';
import type { AddressCreateSchema } from '../address/schema';
import { clerkClient } from '@clerk/nextjs/server';
import { ReferralSource } from '../hubspot/utils.client';
import Logger from '../logger';

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

/**
 * format user data for hubspot
 */
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

  // default notifyUserOnCreate to true if not provided, so that they will enroll in email flow
  hsUserData.properties.notify_user_on_create = (
    userData.notifyUserOnCreate === null ||
    userData.notifyUserOnCreate === undefined
      ? true
      : userData.notifyUserOnCreate
  )
    .toString()
    .toUpperCase();

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
  dealId?: number,
  tx?: PrismaClient | Prisma.TransactionClient
): Promise<User> {
  const db = tx ?? prisma;
  const { address, ...userData } = data;
  userData.email = userData.email.toLowerCase();
  console.log(data);

  let deal: Deal | null = null;
  if (dealId) {
    // attach user to hubspot deal
    deal = await db.deal.findUnique({ where: { id: dealId } });
    if (!deal) {
      throw new Error(`Deal with id ${dealId} not found`);
    }
  }

  const hsUserData = getHsUserData(userData, address);

  let hsContactId: string;
  if (userData.hubspotId) {
    // we know that the user already exists in hubspot. Just update the HS with the new user data
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
      hsContactId = await createOrUpdateHubspotContact(hsUserData);
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
      const userAddress = await db.address.create({ data: address });
      console.log(`created address for new user`);
      const addressId = userAddress.id;
      userCreateData = {
        ...userCreateData,
        ...{ address: { connect: { id: addressId } } },
      };
    }
    Logger.log({ message: 'begin creating user in db', extra: userCreateData });
    delete userCreateData.notifyUserOnCreate;
    const dbUser = await db.user.create({
      data: userCreateData,
    });

    // create a personal org:
    const userOrg = await db.organization.create({
      data: {
        name: `${userData.firstName} ${userData.lastName}'s Organization`,
        ownedBy: { connect: { id: dbUser.id } },
        members: { create: { userId: dbUser.id, type: MembershipType.OWNER } },
        isPrimary: true,
      },
    });
    userOrgId = userOrg.id;

    // add orgId to user
    updatedUser = await db.user.update({
      where: { id: dbUser.id },
      data: {
        userOrgId,
      },
    });
  } catch (error) {
    // this should only happen if a duplicate webhook is received from clerk
    console.warn('Unable to create user in DB:\n', getErrorMessage(error));
    // check if user already exists in DB:
    const existingUser = await db.user.findUnique({
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
  Logger.log({
    message: 'done creating user with org in db and hubspot',
    extra: updatedUser,
  });
  return updatedUser;
}

async function updateUserInClerk(
  clerkId: string,
  firstName?: string,
  lastName?: string,
  email?: string
) {
  const authClient = await clerkClient();
  if (email) {
    try {
      await authClient.emailAddresses.createEmailAddress({
        userId: clerkId!,
        emailAddress: email,
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
            // check if this email address is associated with the user we are looking to update:
            const existingUsers = await authClient.users.getUserList({
              emailAddress: [email],
            });
            if (existingUsers?.data[0]?.id === clerkId) {
              console.log(
                `Email address ${email} is already associated with user ${clerkId}. We will still update Hubspot and DB.`
              );
            }
            return existingUsers?.data[0];
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
  return authClient.users.updateUser(clerkId, { firstName, lastName });
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
    const foundUser = await prisma.user.findUnique({
      where: { id: userData.id },
    });
    if (!foundUser?.clerkId) {
      throw new Error(
        `User with id ${userData.id} not found, or clerkId is missing`
      );
    }

    /* First update user in clerk**/
    await updateUserInClerk(
      foundUser.clerkId,
      userData.firstName,
      userData.lastName,
      userData.email
    );

    /* Second Upsert user in Hubspot**/
    const hsUserData = getHsUserData(userData, address);
    hsUserData.hubspotId = foundUser.hubspotId;
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
