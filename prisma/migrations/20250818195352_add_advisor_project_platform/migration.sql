-- CreateTable
CREATE TABLE "AdvisorProjectPlatform" (
    "id" SERIAL NOT NULL,
    "advisorId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'UPCOMING',
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "AdvisorProjectPlatform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdvisorProjectPlatform_advisorId_projectId_key" ON "AdvisorProjectPlatform"("advisorId", "projectId");

-- AddForeignKey
ALTER TABLE "AdvisorProjectPlatform" ADD CONSTRAINT "AdvisorProjectPlatform_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "AdvisorFirm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorProjectPlatform" ADD CONSTRAINT "AdvisorProjectPlatform_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorProjectPlatform" ADD CONSTRAINT "AdvisorProjectPlatform_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
