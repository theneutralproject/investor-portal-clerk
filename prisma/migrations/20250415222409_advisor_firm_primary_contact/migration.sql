-- DropForeignKey
ALTER TABLE "AdvisorFirm" DROP CONSTRAINT "AdvisorFirm_primaryContactId_fkey";

-- AlterTable
ALTER TABLE "AdvisorFirm" ALTER COLUMN "primaryContactId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AdvisorFirmEmployee" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "AdvisorFirm" ADD CONSTRAINT "AdvisorFirm_primaryContactId_fkey" FOREIGN KEY ("primaryContactId") REFERENCES "AdvisorFirmEmployee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
