/*
  Warnings:

  - You are about to drop the column `debtTermMonths` on the `ProjectInvestmentStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectInvestmentStats" DROP COLUMN "debtTermMonths",
ADD COLUMN     "boolDebt" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "boolEquity" BOOLEAN NOT NULL DEFAULT true;
