/*
  Warnings:

  - You are about to drop the `FinixTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FinixTransaction" DROP CONSTRAINT "FinixTransaction_dealId_fkey";

-- DropTable
DROP TABLE "FinixTransaction";

-- DropEnum
DROP TYPE "FinixTransactionStatus";
