-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "equityReturnsFile" TEXT;

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

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMilestones_projectId_key" ON "ProjectMilestones"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectMilestones" ADD CONSTRAINT "ProjectMilestones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
