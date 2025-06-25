/*
  Warnings:

  - You are about to drop the column `bUnitThresholdAmount` on the `ProjectInvestmentStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectInvestmentStats" DROP COLUMN "bUnitThresholdAmount",
ADD COLUMN     "bNoteThresholdAmount" DOUBLE PRECISION DEFAULT 250000.0;
