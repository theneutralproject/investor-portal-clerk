-- AlterTable
ALTER TABLE "Document" RENAME TO "ProjectDocument";

-- AlterTable
ALTER TABLE "Pictures" RENAME TO "ProjectPicture";

-- CreateTable
CREATE TABLE "ProjectPropertyStats" (
    "id" SERIAL NOT NULL,
    "avgRent" INTEGER NOT NULL DEFAULT 0,
    "avgUnitSize" INTEGER NOT NULL DEFAULT 0,
    "commercialSqFt" INTEGER NOT NULL DEFAULT 0,
    "numUnits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectPropertyStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectInvestmentStats" (
    "id" SERIAL NOT NULL,
    "cUnitThresholdAmount" DOUBLE PRECISION NOT NULL DEFAULT 200000.0,
    "debtInterestRate" TEXT NOT NULL DEFAULT '',
    "debtMinInvestment" INTEGER NOT NULL DEFAULT 25000,
    "debtPaymentFreq" TEXT NOT NULL DEFAULT 'quarterly',
    "debtTermMonths" INTEGER NOT NULL DEFAULT 48,
    "equityIRR" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "equityMinInvestment" INTEGER NOT NULL DEFAULT 250000,
    "equityPaymentFreq" TEXT NOT NULL DEFAULT 'quarterly',
    "equityTermMonths" INTEGER NOT NULL DEFAULT 60,
    "preferredReturn" TEXT NOT NULL DEFAULT '',
    "investmentGoal" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "investmentRaised" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "ProjectInvestmentStats_pkey" PRIMARY KEY ("id")
);