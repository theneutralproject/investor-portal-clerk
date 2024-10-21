/*
  Warnings:

  - You are about to drop the column `amount` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `financingType` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `ownershipType` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Deal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_userId_fkey";

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "amount",
DROP COLUMN "financingType",
DROP COLUMN "ownershipType",
DROP COLUMN "userId";
