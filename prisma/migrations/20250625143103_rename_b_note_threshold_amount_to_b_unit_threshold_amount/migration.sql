/*
  Warnings:

  - You are about to drop the column `bNoteThresholdAmount` on the `ProjectInvestmentStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectInvestmentStats" DROP COLUMN "bNoteThresholdAmount",
ADD COLUMN     "bUnitThresholdAmount" DOUBLE PRECISION DEFAULT 250000.0;
