/*
  Warnings:

  - You are about to drop the `_organizationUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('OWNER', 'COINVESTOR', 'CPA');

-- DropForeignKey
ALTER TABLE "_organizationUsers" DROP CONSTRAINT "_allOrgs_A_fkey";

-- DropForeignKey
ALTER TABLE "_organizationUsers" DROP CONSTRAINT "_allOrgs_B_fkey";

-- DropTable
DROP TABLE "_organizationUsers";

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "type" "MembershipType" NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
