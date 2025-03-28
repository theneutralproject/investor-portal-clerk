/*
  Warnings:

  - Added the required column `name` to the `ProjectReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectReport" ADD COLUMN     "name" TEXT NOT NULL;
