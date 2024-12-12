import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // get all deals
    const deals = await prisma.deal.findMany({
        include: {
            project: { include: { investmentStats: true, milestones: true } }
        }
    });

    for (const deal of deals) {
        const { project } = deal;
        if (!project) {
            console.log(`Deal ${deal.id} does not have a project`);
            continue;
        };

        const { investmentStats, milestones } = project;
        if (!investmentStats || !milestones) {
            console.log(`Project ${project.id} does not have investment stats or milestones`);
            continue;
        };

        // TODO: complete logic to backfill payment terms for closed deals. In prod, there is a lot of missing data

    }
};

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});