/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `ProjectInvestmentStats` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId]` on the table `ProjectPropertyStats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectInvestmentStats_projectId_key" ON "ProjectInvestmentStats"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectPropertyStats_projectId_key" ON "ProjectPropertyStats"("projectId");
