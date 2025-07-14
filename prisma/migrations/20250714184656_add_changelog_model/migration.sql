-- CreateTable
CREATE TABLE "Changelog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "entityId" INTEGER NOT NULL,
    "entityName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previousValue" JSONB NOT NULL,
    "newValue" JSONB NOT NULL,

    CONSTRAINT "Changelog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Changelog_entityId_entityName_idx" ON "Changelog"("entityId", "entityName");

-- CreateIndex
CREATE INDEX "Changelog_userId_idx" ON "Changelog"("userId");

-- AddForeignKey
ALTER TABLE "Changelog" ADD CONSTRAINT "Changelog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
