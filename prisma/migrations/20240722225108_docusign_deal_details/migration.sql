-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('COSIGNER', 'VERIFIER');

-- CreateEnum
CREATE TYPE "DealOwnershipType" AS ENUM ('INDIVIDUAL', 'JOINT', 'CORPROTATION', 'REVOCABLEGRANTOR', 'OTHER', 'MARITAL', 'COMMON', 'PARTNERSHIP');

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "numberAUnits" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "numberCUnits" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "ownershipType" "DealOwnershipType",
ADD COLUMN     "ownershipTypeOtherValue" TEXT;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "docusignTemplateId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "addressId" INTEGER,
ADD COLUMN     "ssn" DOUBLE PRECISION,
ADD COLUMN     "title" TEXT;

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
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "title" TEXT,
    "ssn" DOUBLE PRECISION,
    "type" "ContactType" NOT NULL,
    "addressId" INTEGER,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
