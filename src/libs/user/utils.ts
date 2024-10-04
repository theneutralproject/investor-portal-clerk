import { isError } from "lodash";
import { HubspotContact } from "../hubspot/schema";
import { createOrUpdateHubspotContact } from "../hubspot/utils";
import prisma from "../prisma";
import { UserCreateSchema } from "./schema";
import { getErrorMessage } from "../utils";
import { User } from "@prisma/client";

/**
 * creates a user in both hubspot and our DB
 * @param data 
 */
export async function createUserInDbAndHubspot(data: UserCreateSchema): Promise<User> {

    const { address, ...userData } = data;
    /* Upsert user in Hubspot**/
    const hsUserData = {
        email: userData.email,
        properties: [
            { property: `userid`, value: userData.clerkId ?? "invitePending" },
            { property: `firstname`, value: userData.firstName },
            { property: `lastname`, value: userData.lastName },
            { property: `phone`, value: userData.phoneNumber },
        ],
    } as HubspotContact;

    let hsUpdate;
    try {
        hsUpdate = await createOrUpdateHubspotContact(hsUserData);
    } catch (error) {
        console.error("Unable to create user in hubspot:\n", error);
        throw new Error(getErrorMessage(error));
    }
    const hubspotUserId = isError(hsUpdate) ? "" : hsUpdate.vid.toString()

    let userOrgId: number;
    try {
        // create a personal org:
        const userOrg = await prisma.organization.create({
            data: {
                name: `${userData.firstName} ${userData.lastName}'s Org`,
            }
        });
        userOrgId = userOrg.id;
        console.log(`created user org with id ${userOrg.id}`);
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }

    let userCreateData = {
        ...userData,
        hubspotId: hubspotUserId,
        organization: { connect: [{ id: userOrgId }] },
    }

    try {
        if (address) {
            const userAddress = await prisma.address.create({ data: address });
            console.log(`created address for new user`);
            const addressId = userAddress.id;
            userCreateData = { ...userCreateData, ...{ address: { connect: { id: addressId } }, addressId: addressId } }
        }

        const dbUser = await prisma.user.create({
            data: userCreateData,
        });

        console.log(`created dbUser with id ${dbUser.id}`)
        const updatedOrg = await prisma.organization.update({
            where: { id: userOrgId },
            data: { ownerId: dbUser.id }
        })
        console.log(`updated org with id ${updatedOrg.id}`)
        return dbUser;

    } catch (error) {
        console.error("ERROR: Cannot create user and org:\n", error);
        throw new Error(getErrorMessage(error));
    }
}