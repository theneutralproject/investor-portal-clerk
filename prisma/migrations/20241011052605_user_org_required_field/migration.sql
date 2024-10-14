/*
  Warnings:

  - You are about to drop the column `title` on the `User` table. All the data in the column will be lost.
  - Made the column `ownerId` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userOrgId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userOrgId_fkey";

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "ownerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "title",
ALTER COLUMN "userOrgId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
