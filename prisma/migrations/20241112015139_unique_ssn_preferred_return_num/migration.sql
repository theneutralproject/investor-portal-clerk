/*
  Warnings:

  - A unique constraint covering the columns `[ssn]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProjectInvestmentStats" ADD COLUMN     "preferredReturnNum" DOUBLE PRECISION NOT NULL DEFAULT 0.1;

-- CreateIndex
CREATE UNIQUE INDEX "User_ssn_key" ON "User"("ssn");
