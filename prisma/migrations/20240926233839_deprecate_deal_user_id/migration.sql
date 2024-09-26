/*
  Warnings:

  - The values [CORPROTATION] on the enum `DealOwnershipType` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `organizationId` on table `Deal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DealOwnershipType_new" AS ENUM ('INDIVIDUAL', 'JOINT', 'CORPORATION', 'TRUST', 'OTHER', 'MARITAL', 'COMMON', 'PARTNERSHIP');
ALTER TABLE "Deal" ALTER COLUMN "ownershipType" TYPE "DealOwnershipType_new" USING ("ownershipType"::text::"DealOwnershipType_new");
ALTER TYPE "DealOwnershipType" RENAME TO "DealOwnershipType_old";
ALTER TYPE "DealOwnershipType_new" RENAME TO "DealOwnershipType";
DROP TYPE "DealOwnershipType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_userId_fkey";

-- AlterTable
ALTER TABLE "Deal" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "amount" SET DEFAULT 0.0,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "ownershipType" SET DEFAULT 'INDIVIDUAL',
ALTER COLUMN "organizationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
