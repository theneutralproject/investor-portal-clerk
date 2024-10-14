import { isError } from "lodash";
import { HubspotContact } from "../hubspot/schema";
import { associateContactWithDeal, createOrUpdateHubspotContact } from "../hubspot/utils";
import prisma from "../prisma";
import { UserCreateSchema } from "./schema";
import { getErrorMessage } from "../utils";
import { Deal, User } from "@prisma/client";

/**
 * creates a user in both hubspot and our DB
 * @param data 
 */
export async function createUserInDbAndHubspot(data: UserCreateSchema, dealId?: number): Promise<User> {

    const { address, ...userData } = data;

    let deal: Deal | null = null;
    if (dealId) {
        // attach user to hubspot deal
        deal = await prisma.deal.findUnique({where : {id: dealId}});
        if (!deal) {
            throw new Error(`Deal with id ${dealId} not found`);
        }
    }
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

    // create user and address in DB
    let userOrgId: number;
    try {
        let userCreateData = {
            ...userData,
            hubspotId: hubspotUserId,
        }
        if (address) {
            const userAddress = await prisma.address.create({ data: address });
            console.log(`created address for new user`);
            const addressId = userAddress.id;
            userCreateData = { ...userCreateData, ...{ address: { connect: { id: addressId } }, addressId: addressId } }
        }

        const dbUser = await prisma.user.create({
            data: userCreateData,
        });


        // create a personal org:
        const userOrg = await prisma.organization.create({
            data: {
                name: `${userData.firstName} ${userData.lastName}'s Organization`,
                ownedBy: { connect: { id: dbUser.id } }
            }
        });
        userOrgId = userOrg.id;

        // add orgId to user
        const updatedUser = await prisma.user.update({ where: { id: dbUser.id }, data: { userOrgId } });

        if (deal)
        {
            const res = await associateContactWithDeal(hubspotUserId, deal.hubspotId);
            if (isError(res)) {
                console.error("Unable to associate user with deal in hubspot:\n", res);
            }
        }

        return updatedUser;

    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
}