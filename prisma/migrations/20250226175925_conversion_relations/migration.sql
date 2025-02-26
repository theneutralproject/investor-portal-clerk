/*
  Warnings:

  - You are about to drop the column `conversionId` on the `Deal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_conversionId_fkey";

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "conversionId";

-- AddForeignKey
ALTER TABLE "DealConversion" ADD CONSTRAINT "DealConversion_startDealId_fkey" FOREIGN KEY ("startDealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealConversion" ADD CONSTRAINT "DealConversion_endDealId_fkey" FOREIGN KEY ("endDealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
