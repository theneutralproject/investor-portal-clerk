-- DropForeignKey
ALTER TABLE "DocumentEvent" DROP CONSTRAINT "DocumentEvent_documentId_fkey";

-- AddForeignKey
ALTER TABLE "DocumentEvent" ADD CONSTRAINT "DocumentEvent_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ProjectDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
