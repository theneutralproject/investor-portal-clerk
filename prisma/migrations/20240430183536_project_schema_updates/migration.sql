/*
  Warnings:

  - You are about to drop the column `numUnits` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projectIrr` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "numUnits",
DROP COLUMN "projectIrr",
ADD COLUMN     "buildingAvgRent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "buildingAvgUnitSize" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "buildingCommSqFt" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "buildingUnits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "debtInterestRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "debtMinInvestment" INTEGER NOT NULL DEFAULT 25000,
ADD COLUMN     "debtPaymentFreq" TEXT NOT NULL DEFAULT 'quarterly',
ADD COLUMN     "debtTermMonths" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "equityIRR" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "equityMinInvestment" INTEGER NOT NULL DEFAULT 250000,
ADD COLUMN     "equityPaymentFreq" TEXT NOT NULL DEFAULT 'quarterly',
ADD COLUMN     "equityTermMonths" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "marketHighlights" TEXT NOT NULL DEFAULT '';
