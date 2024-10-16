/*
  Warnings:

  - Added the required column `email` to the `AccreditationVerifier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccreditationVerifier" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;
