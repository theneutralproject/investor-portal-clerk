-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('EVENT', 'PAYOUT', 'TAX_DOCUMENT', 'INVESTOR_DOCUMENT', 'INVESTOR_REPORT', 'NEW_INVESTMENT');

-- CreateTable
CREATE TABLE "ActivityFeedItem" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "header" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "link" TEXT,
    "type" "ActivityType" NOT NULL,

    CONSTRAINT "ActivityFeedItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityFeedItem" ADD CONSTRAINT "ActivityFeedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
