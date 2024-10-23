/*
  Warnings:

  - You are about to drop the column `accreditationVerifierId` on the `Deal` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AccreditationMethod" AS ENUM ('INCOME', 'ASSETS', 'LICENSE', 'OTHER');

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_accreditationVerifierId_fkey";

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "accreditationVerifierId";

-- CreateTable
CREATE TABLE "AccreditationVerification" (
    "id" SERIAL NOT NULL,
    "method" "AccreditationMethod" NOT NULL,
    "dealId" INTEGER NOT NULL,
    "verifierId" INTEGER NOT NULL,

    CONSTRAINT "AccreditationVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccreditationVerification_dealId_key" ON "AccreditationVerification"("dealId");

-- AddForeignKey
ALTER TABLE "AccreditationVerification" ADD CONSTRAINT "AccreditationVerification_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccreditationVerification" ADD CONSTRAINT "AccreditationVerification_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES "AccreditationVerifier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
