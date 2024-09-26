-- CreateEnum
CREATE TYPE "DealDocumentType" AS ENUM ('K1', 'VERIFICATION_ACCREDITATION');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'UPCOMING');

-- CreateEnum
CREATE TYPE "PictureType" AS ENUM ('HEADER', 'GALLERY', 'OTHER', 'CARD');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('YOUTUBE', 'DOCUSIGN', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "DocumentEventType" AS ENUM ('VIEW', 'DOWNLOAD', 'SIGN');

-- CreateEnum
CREATE TYPE "DealFinancingType" AS ENUM ('equity', 'promissory_note_now', 'promissory_to_equity', 'promissory_note_at_closing');

-- CreateEnum
CREATE TYPE "DealOwnershipType" AS ENUM ('INDIVIDUAL', 'JOINT', 'CORPROTATION', 'TRUST', 'OTHER', 'MARITAL', 'COMMON', 'PARTNERSHIP');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "hubspotId" TEXT NOT NULL,
    "addressId" INTEGER,
    "ssn" TEXT,
    "title" TEXT,
    "userOrgId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "dealStage" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "financingType" "DealFinancingType" DEFAULT 'equity',
    "hubspotId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL DEFAULT '',
    "investmentEntity" TEXT NOT NULL,
    "numberAUnits" DOUBLE PRECISION DEFAULT 0.0,
    "numberCUnits" DOUBLE PRECISION DEFAULT 0.0,
    "ownershipType" "DealOwnershipType",
    "accreditationVerifierId" INTEGER,
    "organizationId" INTEGER,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "investmentGoal" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "investmentRaised" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "tags" TEXT NOT NULL DEFAULT '',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT NOT NULL,
    "buildingAvgRent" INTEGER NOT NULL DEFAULT 0,
    "buildingAvgUnitSize" INTEGER NOT NULL DEFAULT 0,
    "buildingCommSqFt" INTEGER NOT NULL DEFAULT 0,
    "buildingUnits" INTEGER NOT NULL DEFAULT 0,
    "debtInterestRate" TEXT NOT NULL DEFAULT '',
    "debtMinInvestment" INTEGER NOT NULL DEFAULT 25000,
    "debtPaymentFreq" TEXT NOT NULL DEFAULT 'quarterly',
    "debtTermMonths" INTEGER NOT NULL DEFAULT 48,
    "equityIRR" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "equityMinInvestment" INTEGER NOT NULL DEFAULT 250000,
    "equityPaymentFreq" TEXT NOT NULL DEFAULT 'quarterly',
    "equityTermMonths" INTEGER NOT NULL DEFAULT 60,
    "marketHighlights" TEXT NOT NULL DEFAULT '',
    "youtubeUrl" TEXT NOT NULL DEFAULT '',
    "preferredReturn" TEXT NOT NULL DEFAULT '',
    "targetEquityMultiple" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "slug" TEXT NOT NULL,
    "equityReturnsFile" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMilestones" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "equityContribution" TIMESTAMP(3) NOT NULL,
    "financialClosing" TIMESTAMP(3) NOT NULL,
    "groundBreakingCeremony" TIMESTAMP(3),
    "startVerticalConstruction" TIMESTAMP(3),
    "toppingOut" TIMESTAMP(3),
    "preLeasing" TIMESTAMP(3),
    "fullEnclosure" TIMESTAMP(3),
    "temporaryOccupancy" TIMESTAMP(3) NOT NULL,
    "grandOpening" TIMESTAMP(3) NOT NULL,
    "stabilized" TIMESTAMP(3) NOT NULL,
    "refinance" TIMESTAMP(3) NOT NULL,
    "sale" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMilestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pictures" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" "PictureType" NOT NULL,

    CONSTRAINT "Pictures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "dealStage" INTEGER NOT NULL,
    "financingTypes" "DealFinancingType"[] DEFAULT ARRAY[]::"DealFinancingType"[],
    "documentType" "DocumentType" NOT NULL DEFAULT 'DOCUMENT',
    "docusignTemplateId" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentEvent" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "DocumentEventType" NOT NULL,

    CONSTRAINT "DocumentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_allOrgs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userOrgId_key" ON "User"("userOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "Deal_hubspotId_key" ON "Deal"("hubspotId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_ownerId_key" ON "Organization"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMilestones_projectId_key" ON "ProjectMilestones"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "_allOrgs_AB_unique" ON "_allOrgs"("A", "B");

-- CreateIndex
CREATE INDEX "_allOrgs_B_index" ON "_allOrgs"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userOrgId_fkey" FOREIGN KEY ("userOrgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_accreditationVerifierId_fkey" FOREIGN KEY ("accreditationVerifierId") REFERENCES "AccreditationVerifier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealDocument" ADD CONSTRAINT "DealDocument_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationDocument" ADD CONSTRAINT "OrganizationDocument_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestones" ADD CONSTRAINT "ProjectMilestones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pictures" ADD CONSTRAINT "Pictures_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEvent" ADD CONSTRAINT "DocumentEvent_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEvent" ADD CONSTRAINT "DocumentEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allOrgs" ADD CONSTRAINT "_allOrgs_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allOrgs" ADD CONSTRAINT "_allOrgs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
