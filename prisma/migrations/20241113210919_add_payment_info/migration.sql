-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "closingDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ProjectPaymentInfo" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "investmentEntity" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,

    CONSTRAINT "ProjectPaymentInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectPaymentInfo" ADD CONSTRAINT "ProjectPaymentInfo_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
