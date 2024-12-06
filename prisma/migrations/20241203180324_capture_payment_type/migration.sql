-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ACH', 'WIRE', 'CHECK');

-- AlterTable
ALTER TABLE "DealInvestmentStats" ADD COLUMN     "dateFundsSent" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" "PaymentMethod";
