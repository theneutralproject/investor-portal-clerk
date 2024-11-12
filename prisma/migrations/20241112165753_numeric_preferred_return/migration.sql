/*
  Warnings:

  - You are about to drop the column `preferredReturnNum` on the `ProjectInvestmentStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectInvestmentStats" DROP COLUMN "preferredReturnNum",
ADD COLUMN     "preferredReturn" DOUBLE PRECISION NOT NULL DEFAULT 0.1;
