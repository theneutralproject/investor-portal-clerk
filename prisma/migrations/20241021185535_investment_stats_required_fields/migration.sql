/*
  Warnings:

  - Made the column `financingType` on table `DealInvestmentStats` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ownershipType` on table `DealInvestmentStats` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DealInvestmentStats" ALTER COLUMN "financingType" SET NOT NULL,
ALTER COLUMN "ownershipType" SET NOT NULL;
