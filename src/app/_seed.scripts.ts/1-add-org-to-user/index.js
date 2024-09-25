// This script needs to be run after the 20240925210818_add_organization_step1 has been migrated
import prisma from "@/libs/prisma";

// 1. pull all users
// 2. create an organization name for the user
// 3. add an organization to the org db
// 4. find all of the user's deals
// 5. update the deal.organizationId 


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


Promise.all(allUsersPromiseArr)
.then((orgs) => {
    const usersWithOrganizationsPromise = orgs.map((org) => {
        if(org.ownerId) {
            console.log(`Connecting Org id ${org.id} to user id ${org.ownerId}`)
            return prisma.user.update(
                {
                    where: { id: org.ownerId },
                    data: {
                        organization: { connect: [{ id: org.id }] }

                    }
                }
            )
        } else return Promise.resolve(null);
    });

    // Promise.all(usersWithOrganizationsPromise)
    // .then((usersOrNull) => {
    //     usersOrNull.forEach((user) => {
    //         if (user && user.userOrgId) {
    //             // upate deal
    //             return prisma.deal.updateMany({
    //                 where: { userId: user.id},
    //                 data: {organizationId: user.userOrgId}
    //             })
    //         }
    //     })
    // })

});
