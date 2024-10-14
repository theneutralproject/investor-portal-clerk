import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

    const allDeals = await prisma.deal.findMany()
    // {
    //     // process 10 at the time by advancing the skip value by 10
    //     // take: 10,
    //     // skip: 0
    // });

    console.log(`found ${allDeals.length} deals`);

    const dealStats = await prisma.dealInvestmentStats.findMany();
    const existingIds = dealStats.map(ds => ds.dealId)
    console.log(`existingIds`, existingIds);

    try {
        for (const dealData of allDeals) {
            const { id: dealId, amount, financingType } = dealData;
            console.log(dealData)
            console
            if (existingIds.includes(dealId)) {
                console.log(`dealstat for deal ${dealId} already exists. Skipping`);
                continue;
            }

            if (isNaN(amount) || !financingType) console.log(`missing data for deal id ${dealData.id}`);
            await prisma.dealInvestmentStats.create({
                data: {
                    dealId,
                    amount,
                    financingType,
                }
            });
            console.log(`creating dealstats for id${dealId}`);
        }
    }
    catch (seedErr) {
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