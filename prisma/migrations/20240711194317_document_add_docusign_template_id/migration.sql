-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "docusignTemplateId" TEXT,
ALTER COLUMN "link" DROP NOT NULL;
