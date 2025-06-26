import { PrismaClient } from '@prisma/client';
import _ from 'lodash';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting unit type to promissory_note_now deals...');

  const data = await prisma.$queryRaw<{
    total_updated: number, updated_to_anote: number, updated_to_bnote: number,
  }[]>`
    WITH updated AS (
      UPDATE "DealInvestmentStats" dealInvestmentStats
      SET "unitType" = (
        CASE
          WHEN dealInvestmentStats."amount" >= pis."bNoteThresholdAmount" THEN 'BNOTE'
          ELSE 'ANOTE'
        END
      )::"DealUnitType"
      FROM "Deal" deal
      JOIN "Project" project ON project.id = deal."projectId"
      JOIN "ProjectInvestmentStats" pis ON pis."projectId" = project.id
      WHERE dealInvestmentStats."dealId" = deal.id
        AND dealInvestmentStats."financingType" = 'promissory_note_now'
      RETURNING dealInvestmentStats.id, dealInvestmentStats."unitType"
    )
    SELECT
      COUNT(*) AS total_updated,
      SUM(CASE WHEN "unitType" = 'ANOTE' THEN 1 ELSE 0 END) AS updated_to_anote,
      SUM(CASE WHEN "unitType" = 'BNOTE' THEN 1 ELSE 0 END) AS updated_to_bnote
    FROM updated;
    `;

  
  const [result] = data;

  console.log(`Deals found: ${result?.total_updated}\n# Updated to ANOTE: ${result?.updated_to_anote}\n# Updated to BNOTE: ${result?.updated_to_bnote}`);

  console.log('Migration completed!');
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
