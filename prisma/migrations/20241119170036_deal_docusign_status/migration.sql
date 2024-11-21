-- AlterEnum
ALTER TYPE "DealDocumentType" ADD VALUE 'INVESTMENT_DOCUMENT';

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "signaturesCompletedDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "DocusignEvent" (
    "id" SERIAL NOT NULL,
    "envelopeId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "dealId" INTEGER NOT NULL,
    "dateSent" TIMESTAMP(3),
    "dateCompleted" TIMESTAMP(3),
    "signatureCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DocusignEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocusignEvent_envelopeId_key" ON "DocusignEvent"("envelopeId");

-- AddForeignKey
ALTER TABLE "DocusignEvent" ADD CONSTRAINT "DocusignEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocusignEvent" ADD CONSTRAINT "DocusignEvent_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
