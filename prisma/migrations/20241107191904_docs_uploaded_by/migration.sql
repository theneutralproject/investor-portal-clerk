/*
  Warnings:

  - Added the required column `uploadedById` to the `DealDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedById` to the `OrganizationDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DealDocument" ADD COLUMN     "uploadedById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationDocument" ADD COLUMN     "uploadedById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DealDocument" ADD CONSTRAINT "DealDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationDocument" ADD CONSTRAINT "OrganizationDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
