-- CreateEnum
CREATE TYPE "DealTransactionType" AS ENUM ('NOTE_MATURITY', 'NOTE_COMPLETION', 'NOTE_INTEREST_PAYMENT', 'NOTE_PRINCIPAL_PAYMENT', 'NOTE_EXTENSION', 'NOTE_CONVERSION', 'EQUITY_ASSIGNMENT', 'EQUITY_DISTRIBUTION', 'EQUITY_EXIT', 'EQUITY_PARTIAL_PAYMENT');

-- CreateTable
CREATE TABLE "DealTransaction" (
    "id" SERIAL NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dealId" INTEGER NOT NULL,
    "type" "DealTransactionType" NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "fullTransactionAmount" DOUBLE PRECISION,
    "interestAmount" DOUBLE PRECISION,
    "principalAmount" DOUBLE PRECISION,
    "startPeriod" TIMESTAMP(3),
    "endPeriod" TIMESTAMP(3),
    "notes" TEXT,
    "newMaturityDate" TIMESTAMP(3),

    CONSTRAINT "DealTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DealTransaction" ADD CONSTRAINT "DealTransaction_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
