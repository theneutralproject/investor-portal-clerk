/*
  Warnings:

  - You are about to drop the column `url` on the `DealDocument` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `OrganizationDocument` table. All the data in the column will be lost.
  - Added the required column `path` to the `DealDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `OrganizationDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DealDocument" DROP COLUMN "url",
ADD COLUMN     "path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationDocument" DROP COLUMN "url",
ADD COLUMN     "path" TEXT NOT NULL;
