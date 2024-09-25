/*
  Warnings:

  - The values [REVOCABLEGRANTOR] on the enum `DealOwnershipType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `coSignerEmail` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `coSignerFullName` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `verifierEmail` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `verifierFullName` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meeting` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userOrgId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DealDocumentType" AS ENUM ('K1', 'VERIFICATION_ACCREDITATION');

-- AlterEnum
BEGIN;
CREATE TYPE "DealOwnershipType_new" AS ENUM ('INDIVIDUAL', 'JOINT', 'CORPROTATION', 'TRUST', 'OTHER', 'MARITAL', 'COMMON', 'PARTNERSHIP');
ALTER TABLE "Deal" ALTER COLUMN "ownershipType" TYPE "DealOwnershipType_new" USING ("ownershipType"::text::"DealOwnershipType_new");
ALTER TYPE "DealOwnershipType" RENAME TO "DealOwnershipType_old";
ALTER TYPE "DealOwnershipType_new" RENAME TO "DealOwnershipType";
DROP TYPE "DealOwnershipType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_userId_fkey";

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "coSignerEmail",
DROP COLUMN "coSignerFullName",
DROP COLUMN "verifierEmail",
DROP COLUMN "verifierFullName",
ADD COLUMN     "accreditationVerifierId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userOrgId" INTEGER;

-- DropTable
DROP TABLE "Contact";

-- DropTable
DROP TABLE "Meeting";

-- DropEnum
DROP TYPE "ContactType";

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER,
    "tin" TEXT,
    "dateOfCreation" TIMESTAMP(3),
    "juristication" TEXT,
    "addressId" INTEGER,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccreditationVerifier" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "AccreditationVerifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealDocument" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "type" "DealDocumentType" NOT NULL,
    "dealId" INTEGER NOT NULL,

    CONSTRAINT "DealDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationDocument" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "OrganizationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_allOrgs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_ownerId_key" ON "Organization"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "_allOrgs_AB_unique" ON "_allOrgs"("A", "B");

-- CreateIndex
CREATE INDEX "_allOrgs_B_index" ON "_allOrgs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_userOrgId_key" ON "User"("userOrgId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userOrgId_fkey" FOREIGN KEY ("userOrgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_accreditationVerifierId_fkey" FOREIGN KEY ("accreditationVerifierId") REFERENCES "AccreditationVerifier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealDocument" ADD CONSTRAINT "DealDocument_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationDocument" ADD CONSTRAINT "OrganizationDocument_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allOrgs" ADD CONSTRAINT "_allOrgs_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allOrgs" ADD CONSTRAINT "_allOrgs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
