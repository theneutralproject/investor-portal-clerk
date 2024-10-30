/*
  Warnings:

  - You are about to drop the column `link` on the `DealDocument` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `OrganizationDocument` table. All the data in the column will be lost.
  - Added the required column `url` to the `DealDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `OrganizationDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DealDocument" DROP COLUMN "link",
ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationDocument" DROP COLUMN "link",
ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "url" TEXT NOT NULL;
