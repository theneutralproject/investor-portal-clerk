-- AlterTable
ALTER TABLE "ProjectInvestmentStats" ADD COLUMN     "debtPaymentFreqMonths" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "debtTermMonthsMax" INTEGER NOT NULL DEFAULT 48,
ADD COLUMN     "debtTermMonthsMin" INTEGER NOT NULL DEFAULT 48,
ADD COLUMN     "equityPaymentFreqMonths" INTEGER NOT NULL DEFAULT 3;
