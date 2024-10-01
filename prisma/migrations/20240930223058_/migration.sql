/*
  Warnings:

  - You are about to drop the column `numberAUnits` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `numberCUnits` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `unitType` on the `Deal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "numberAUnits",
DROP COLUMN "numberCUnits",
DROP COLUMN "unitType";

-- CreateTable
CREATE TABLE "DealInvestmentStats" (
    "id" SERIAL NOT NULL,
    "dealId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "financingType" "DealFinancingType" DEFAULT 'equity',
    "unitType" "DealUnitType" NOT NULL DEFAULT 'AUNIT',
    "ownershipType" "DealOwnershipType" DEFAULT 'INDIVIDUAL',
    "numberAUnits" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "numberCUnits" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "DealInvestmentStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DealInvestmentStats_dealId_key" ON "DealInvestmentStats"("dealId");

-- AddForeignKey
ALTER TABLE "DealInvestmentStats" ADD CONSTRAINT "DealInvestmentStats_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
