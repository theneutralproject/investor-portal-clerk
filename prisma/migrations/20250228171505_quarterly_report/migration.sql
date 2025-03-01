-- AlterEnum
ALTER TYPE "DealDocumentType" ADD VALUE 'REPORT';

-- AlterTable
ALTER TABLE "DealDocument" ADD COLUMN     "dateUpdated" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProjectDocument" ADD COLUMN     "dateCreated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateUpdated" TIMESTAMP(3);
