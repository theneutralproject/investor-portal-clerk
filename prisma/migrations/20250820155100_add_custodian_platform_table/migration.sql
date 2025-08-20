-- CreateTable
CREATE TABLE "CustodianPlatform" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UPCOMING',
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "CustodianPlatform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CustodianToAdvisor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CustodianToAdvisor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CustodianToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CustodianToProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CustodianToAdvisor_B_index" ON "_CustodianToAdvisor"("B");

-- CreateIndex
CREATE INDEX "_CustodianToProject_B_index" ON "_CustodianToProject"("B");

-- AddForeignKey
ALTER TABLE "CustodianPlatform" ADD CONSTRAINT "CustodianPlatform_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustodianToAdvisor" ADD CONSTRAINT "_CustodianToAdvisor_A_fkey" FOREIGN KEY ("A") REFERENCES "AdvisorFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustodianToAdvisor" ADD CONSTRAINT "_CustodianToAdvisor_B_fkey" FOREIGN KEY ("B") REFERENCES "CustodianPlatform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustodianToProject" ADD CONSTRAINT "_CustodianToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "CustodianPlatform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustodianToProject" ADD CONSTRAINT "_CustodianToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
