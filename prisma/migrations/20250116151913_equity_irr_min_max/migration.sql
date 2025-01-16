/*
  Warnings:

  - You are about to drop the column `equityIRR` on the `ProjectInvestmentStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectInvestmentStats" DROP COLUMN "equityIRR",
ADD COLUMN     "equityIRRMax" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "equityIRRMin" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
