-- CreateTable
CREATE TABLE "ProjectReport" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3),
    "quarter" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "ProjectReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectReport" ADD CONSTRAINT "ProjectReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
