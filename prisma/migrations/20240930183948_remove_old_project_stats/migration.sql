/*
  Warnings:

  - You are about to drop the column `buildingAvgRent` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `buildingAvgUnitSize` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `buildingCommSqFt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `buildingUnits` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `cUnitThresholdAmount` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `debtInterestRate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `debtMinInvestment` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `debtPaymentFreq` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `debtTermMonths` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `equityIRR` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `equityMinInvestment` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `equityPaymentFreq` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `equityTermMonths` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `investmentGoal` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `investmentRaised` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `preferredReturn` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `targetEquityMultiple` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "buildingAvgRent",
DROP COLUMN "buildingAvgUnitSize",
DROP COLUMN "buildingCommSqFt",
DROP COLUMN "buildingUnits",
DROP COLUMN "cUnitThresholdAmount",
DROP COLUMN "debtInterestRate",
DROP COLUMN "debtMinInvestment",
DROP COLUMN "debtPaymentFreq",
DROP COLUMN "debtTermMonths",
DROP COLUMN "equityIRR",
DROP COLUMN "equityMinInvestment",
DROP COLUMN "equityPaymentFreq",
DROP COLUMN "equityTermMonths",
DROP COLUMN "investmentGoal",
DROP COLUMN "investmentRaised",
DROP COLUMN "preferredReturn",
DROP COLUMN "targetEquityMultiple";
