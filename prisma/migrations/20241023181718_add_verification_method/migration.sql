/*
  Warnings:

  - Added the required column `option` to the `AccreditationVerification` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `method` on the `AccreditationVerification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VerificationMethod" AS ENUM ('SELF', 'THIRD_PARTY');

-- AlterTable
ALTER TABLE "AccreditationVerification" ADD COLUMN     "option" "VerificationBasis" NOT NULL,
DROP COLUMN "method",
ADD COLUMN     "method" "VerificationMethod" NOT NULL;
