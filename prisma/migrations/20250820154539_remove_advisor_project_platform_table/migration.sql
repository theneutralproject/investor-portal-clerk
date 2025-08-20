/*
  Warnings:

  - You are about to drop the `AdvisorProjectPlatform` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdvisorProjectPlatform" DROP CONSTRAINT "AdvisorProjectPlatform_advisorId_fkey";

-- DropForeignKey
ALTER TABLE "AdvisorProjectPlatform" DROP CONSTRAINT "AdvisorProjectPlatform_createdById_fkey";

-- DropForeignKey
ALTER TABLE "AdvisorProjectPlatform" DROP CONSTRAINT "AdvisorProjectPlatform_projectId_fkey";

-- DropTable
DROP TABLE "AdvisorProjectPlatform";
