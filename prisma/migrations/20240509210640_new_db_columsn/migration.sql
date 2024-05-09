-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('YOUTUBE', 'DOCUSIGN', 'DOCUMENT');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "documentType" "DocumentType" NOT NULL DEFAULT 'DOCUMENT';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "preferredReturn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "targetEquityMultiple" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ALTER COLUMN "debtInterestRate" SET DEFAULT '',
ALTER COLUMN "debtInterestRate" SET DATA TYPE TEXT;
