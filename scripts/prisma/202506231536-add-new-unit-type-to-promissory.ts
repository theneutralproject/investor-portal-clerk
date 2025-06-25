import { DealFinancingType, DealUnitType, PrismaClient } from '@prisma/client';
import _ from 'lodash';

const prisma = new PrismaClient();

const setUnitType = (amount?: number, bNoteThresholdAmount?: number | null): DealUnitType => {
  if (!amount || !bNoteThresholdAmount) return DealUnitType.ANOTE;

  return (amount >= bNoteThresholdAmount) ? DealUnitType.BNOTE : DealUnitType.ANOTE;
};

async function main() {
  console.log('Seeding Activity Feed...');

  // Fetch promissory_note_now Deals
  // const dealInvestments = await prisma.dealInvestmentStats.findMany({
  //   where: {
  //     financingType: DealFinancingType.promissory_note_now,
  //   },
  //   select: {
  //     id: true,
  //     financingType: true,
  //     unitType: true,
  //     amount: true,
  //   }
  // });

  const deals = await prisma.deal.findMany({
    select: {
      id: true,
      project: {
        select: {
          investmentStats: {
            select: {
              bNoteThresholdAmount: true,
              cUnitThresholdAmount: true,
            }
          }
        }
      },
      investmentStats: {
        where: {
          financingType: DealFinancingType.promissory_note_now,
        },
        select: {
          financingType: true,
          unitType: true,
          amount: true,
        }
      }
    }
  });

  console.log(`Found ${deals.length} deals`);

  // bNoteThresholdAmount
  // cNoteThresholdAmount

  const dealsToUpdate = [];

  for (const deal of deals) {
    const unitType = setUnitType(deal.investmentStats?.amount, deal.project.investmentStats?.bNoteThresholdAmount);

    // console.log(`Deal #${deal.id}: currentUnitType = ${deal.investmentStats?.unitType}, newUnitType: ${unitType}`);

    dealsToUpdate.push({
      id: deal.id,
      amount: deal.investmentStats?.amount,
      bNoteThresholdAmount: deal.project.investmentStats?.bNoteThresholdAmount,
      currentUnitType: deal.investmentStats?.unitType,
      unitType,
    });

  }

  console.table(dealsToUpdate);
  

  console.log('Seed Completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error('Error during backfill:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
