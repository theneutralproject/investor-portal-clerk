-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "financingTypes" "DealFinancingType"[] DEFAULT ARRAY[]::"DealFinancingType"[];
