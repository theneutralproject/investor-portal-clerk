
-- AlterTable
-- ALTER TABLE "ProjectInvestmentStats" RENAME COLUMN "preferredReturn" TO "equityPreferredReturn";
ALTER TABLE "DocusignEvent" RENAME COLUMN "signatureCompleted" TO "allSignaturesCompleted";
ALTER TABLE "DocusignEvent" ADD COLUMN     "investorSignatureCompleted" BOOLEAN NOT NULL DEFAULT false;
