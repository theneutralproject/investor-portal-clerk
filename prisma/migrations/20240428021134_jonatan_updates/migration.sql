/*
  Warnings:

  - You are about to alter the column `projectIrr` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - A unique constraint covering the columns `[hubspotId]` on the table `Deal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hubspotId` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Deal` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hubspotId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DealFinancingType" AS ENUM ('equity', 'promissory_note_now', 'promissory_to_equity');

-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_userId_fkey";

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "financingType" "DealFinancingType",
ADD COLUMN     "hubspotId" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "investmentGoal" SET DEFAULT 0.0,
ALTER COLUMN "investmentGoal" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "investmentRaised" SET DEFAULT 0.0,
ALTER COLUMN "investmentRaised" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "projectIrr" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hubspotId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Deal_hubspotId_key" ON "Deal"("hubspotId");

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
