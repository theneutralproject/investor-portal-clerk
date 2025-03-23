/*
  Warnings:

  - A unique constraint covering the columns `[userId,itemId,type]` on the table `ActivityFeedItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ActivityFeedItem_userId_itemId_type_key" ON "ActivityFeedItem"("userId", "itemId", "type");
