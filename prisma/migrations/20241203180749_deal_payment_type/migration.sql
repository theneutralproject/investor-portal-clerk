/*
  Warnings:

  - You are about to drop the column `dateFundsSent` on the `DealInvestmentStats` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `DealInvestmentStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "dateFundsSent" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" "PaymentMethod";

-- AlterTable
ALTER TABLE "DealInvestmentStats" DROP COLUMN "dateFundsSent",
DROP COLUMN "paymentMethod";
