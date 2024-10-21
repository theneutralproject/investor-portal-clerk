-- DropForeignKey
ALTER TABLE "DealInvestmentStats" DROP CONSTRAINT "DealInvestmentStats_dealId_fkey";

-- AddForeignKey
ALTER TABLE "DealInvestmentStats" ADD CONSTRAINT "DealInvestmentStats_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
