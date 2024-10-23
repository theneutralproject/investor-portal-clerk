/*
  Warnings:

  - A unique constraint covering the columns `[verifierId]` on the table `AccreditationVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AccreditationVerification" DROP CONSTRAINT "AccreditationVerification_verifierId_fkey";

-- AlterTable
ALTER TABLE "AccreditationVerification" ALTER COLUMN "verifierId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AccreditationVerification_verifierId_key" ON "AccreditationVerification"("verifierId");

-- AddForeignKey
ALTER TABLE "AccreditationVerification" ADD CONSTRAINT "AccreditationVerification_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES "AccreditationVerifier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
