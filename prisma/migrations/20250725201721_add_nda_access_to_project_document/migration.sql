-- AlterTable
ALTER TABLE "ProjectDocument" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresNDA" BOOLEAN NOT NULL DEFAULT false;
