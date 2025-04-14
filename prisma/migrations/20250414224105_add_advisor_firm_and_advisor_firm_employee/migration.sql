-- CreateEnum
CREATE TYPE "AdvisorEmployeeRole" AS ENUM ('ADMIN', 'STAFF');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "advisorFirmId" INTEGER;

-- CreateTable
CREATE TABLE "AdvisorFirm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryContactId" INTEGER NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdvisorFirm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvisorFirmEmployee" (
    "id" SERIAL NOT NULL,
    "advisorFirmId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "AdvisorEmployeeRole" NOT NULL,

    CONSTRAINT "AdvisorFirmEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdvisorFirm_primaryContactId_key" ON "AdvisorFirm"("primaryContactId");

-- CreateIndex
CREATE UNIQUE INDEX "AdvisorFirmEmployee_advisorFirmId_userId_key" ON "AdvisorFirmEmployee"("advisorFirmId", "userId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_advisorFirmId_fkey" FOREIGN KEY ("advisorFirmId") REFERENCES "AdvisorFirm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorFirm" ADD CONSTRAINT "AdvisorFirm_primaryContactId_fkey" FOREIGN KEY ("primaryContactId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorFirmEmployee" ADD CONSTRAINT "AdvisorFirmEmployee_advisorFirmId_fkey" FOREIGN KEY ("advisorFirmId") REFERENCES "AdvisorFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorFirmEmployee" ADD CONSTRAINT "AdvisorFirmEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
