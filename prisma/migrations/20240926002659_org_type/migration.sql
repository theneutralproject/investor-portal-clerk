/*
  Warnings:

  - You are about to drop the column `ownershipTypeOtherValue` on the `Deal` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Deal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "ownershipTypeOtherValue";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "type" "DealOwnershipType" NOT NULL DEFAULT 'INDIVIDUAL';

-- CreateIndex
CREATE UNIQUE INDEX "Deal_userId_key" ON "Deal"("userId");
