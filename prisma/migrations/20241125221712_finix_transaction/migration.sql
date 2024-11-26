-- CreateEnum
CREATE TYPE "FinixTransactionStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "FinixTransaction" (
    "id" SERIAL NOT NULL,
    "dealId" INTEGER NOT NULL,
    "traceId" TEXT NOT NULL,
    "status" "FinixTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinixTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinixTransaction_traceId_key" ON "FinixTransaction"("traceId");

-- AddForeignKey
ALTER TABLE "FinixTransaction" ADD CONSTRAINT "FinixTransaction_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
