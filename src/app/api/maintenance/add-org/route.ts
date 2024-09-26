/**
 * This script needs to be run after the 20240925210818_add_organization_step1 has been migrated.
 * To run it, use postman. Generate the Bearer token by logging into the portal and running this command in the consolde:
 * await window.Clerk.session.getToken({ template: 'postman-test' })
 * 
 *  */ 
// 

import prisma from "@/libs/prisma";
import { isNull } from "lodash";

// 1. pull all users
// 2. create an organization name for the user
// 3. add an organization to the org db
// 4. find all of the user's deals
// 5. update the deal.organizationId 

export async function POST() {

    const allUsers = await prisma.user.findMany();

    console.log(`found ${allUsers.length} users`);
    const allUsersPromiseArr = allUsers.map((user) => {
        return prisma.organization.create({
            data: {
                ownerId: user.id,
                name: `${user.firstName} ${user.lastName}'s Org`,
                members: {
                    connect: [{ id: user.id }]
                }
            }
        });
    });


    const orgs = await Promise.all(allUsersPromiseArr);

    console.log(`Created ${orgs.length} orgs`);

    const usersWithOrganizationsPromise = orgs.map((org) => {
        if (org.ownerId) {
            console.log(`Connecting Org id ${org.id} to user id ${org.ownerId}`)
            return prisma.user.update(
                {
                    where: { id: org.ownerId },
                    data: {
                        organization: { connect: [{ id: org.id }] },
                        userOrgId: org.id,
                    }
                }
            )
        } else return Promise.resolve(null);
    });

    const users = (await Promise.all(usersWithOrganizationsPromise)).filter((u => !isNull(u)));

    console.log("matched users and orgs");

    const dealsPromise = users.map((user) => {
        if(!user) return Promise.resolve();
        console.log(`user id ${user.id}: org id: ${user.userOrgId}`)

        return prisma.deal.updateMany(
            {
                where: { userId: user.id },
                data: { organizationId: user.userOrgId }
            }
        );
    });

    return Promise.all(dealsPromise).then((dealsWOrgs) => {
        return new Response(JSON.stringify(dealsWOrgs), {
            headers: { "Content-Type": "application/json" },
        });
    })

}