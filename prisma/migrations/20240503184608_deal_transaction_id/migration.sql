-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'UPCOMING';

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "transactionId" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "financingType" SET DEFAULT 'equity';

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "debtTermMonths" SET DEFAULT 48;
