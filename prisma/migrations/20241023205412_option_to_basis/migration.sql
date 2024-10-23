/*
  Warnings:

  - You are about to drop the column `option` on the `AccreditationVerification` table. All the data in the column will be lost.
  - Added the required column `basis` to the `AccreditationVerification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccreditationVerification" DROP COLUMN "option",
ADD COLUMN     "basis" "VerificationBasis" NOT NULL;
