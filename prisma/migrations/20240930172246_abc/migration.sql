-- AlterTable
ALTER TABLE "ProjectDocument" RENAME CONSTRAINT "Document_pkey" TO "ProjectDocument_pkey";

-- AlterTable
ALTER TABLE "ProjectPicture" RENAME CONSTRAINT "Pictures_pkey" TO "ProjectPicture_pkey";

-- RenameForeignKey
ALTER TABLE "ProjectDocument" RENAME CONSTRAINT "Document_projectId_fkey" TO "ProjectDocument_projectId_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectPicture" RENAME CONSTRAINT "Pictures_projectId_fkey" TO "ProjectPicture_projectId_fkey";
