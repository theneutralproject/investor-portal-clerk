/*
  Warnings:

  - You are about to drop the column `debtPaumentFreqMonths` on the `DealInvestmentStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DealInvestmentStats" DROP COLUMN "debtPaumentFreqMonths",
ADD COLUMN     "debtPaymentFreqMonths" INTEGER NOT NULL DEFAULT 0;
