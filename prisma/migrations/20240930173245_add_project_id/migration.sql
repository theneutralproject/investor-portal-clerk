/*
  Warnings:

  - Added the required column `projectId` to the `ProjectInvestmentStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `ProjectPropertyStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectInvestmentStats" ADD COLUMN     "projectId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProjectPropertyStats" ADD COLUMN     "projectId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectPropertyStats" ADD CONSTRAINT "ProjectPropertyStats_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInvestmentStats" ADD CONSTRAINT "ProjectInvestmentStats_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
