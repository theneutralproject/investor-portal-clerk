/*
  Warnings:

  - You are about to drop the column `docusignTemplateId` on the `Document` table. All the data in the column will be lost.
  - Made the column `link` on table `Document` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "docusignTemplateId",
ALTER COLUMN "link" SET NOT NULL;
