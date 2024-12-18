/*
  Warnings:

  - You are about to drop the column `equiteTermMonths` on the `DealInvestmentStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DealInvestmentStats" DROP COLUMN "equiteTermMonths",
ADD COLUMN     "equityTermMonths" INTEGER NOT NULL DEFAULT 0;
