import { MembershipType, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // find all organizations
    const allOrganizations = await prisma.organization.findMany();

    try {

        // for each organization, create a member
        for (const organization of allOrganizations) {
            const { id: organizationId, name, ownerId } = organization;
            await prisma.member.create({
                data: {
                    organizationId,
                    type: MembershipType.OWNER,
                    userId: ownerId!,
                }
            });
        }

    } catch (seedErr) {
        console.log("Seed Error")
        console.error(seedErr);
        throw seedErr;
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })