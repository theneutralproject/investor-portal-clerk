-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('ACTIVE', 'PENDING', 'MATURED');

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "conversionId" INTEGER,
ADD COLUMN     "dateMatured" TIMESTAMP(3),
ADD COLUMN     "status" "DealStatus" DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "DealConversion" (
    "id" SERIAL NOT NULL,
    "startDealId" INTEGER NOT NULL,
    "endDealId" INTEGER NOT NULL,
    "dateCreated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3),

    CONSTRAINT "DealConversion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DealConversion_startDealId_key" ON "DealConversion"("startDealId");

-- CreateIndex
CREATE UNIQUE INDEX "DealConversion_endDealId_key" ON "DealConversion"("endDealId");

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_conversionId_fkey" FOREIGN KEY ("conversionId") REFERENCES "DealConversion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
