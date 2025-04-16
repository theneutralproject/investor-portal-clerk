-- CreateTable
CREATE TABLE "EquityMilestoneFile" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "versionNum" INTEGER NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquityMilestoneFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EquityMilestoneFile_projectId_fileName_versionNum_key" ON "EquityMilestoneFile"("projectId", "fileName", "versionNum");

-- AddForeignKey
ALTER TABLE "EquityMilestoneFile" ADD CONSTRAINT "EquityMilestoneFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
