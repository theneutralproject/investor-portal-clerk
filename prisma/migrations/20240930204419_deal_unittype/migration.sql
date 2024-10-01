-- CreateEnum
CREATE TYPE "DealUnitType" AS ENUM ('AUNIT', 'CUNIT');

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "unitType" "DealUnitType" NOT NULL DEFAULT 'AUNIT';
