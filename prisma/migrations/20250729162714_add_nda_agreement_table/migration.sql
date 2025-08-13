-- CreateTable
CREATE TABLE "NDAAgreement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT true,
    "dateSigned" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revision" INTEGER NOT NULL,

    CONSTRAINT "NDAAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NDAAgreement_userId_key" ON "NDAAgreement"("userId");

-- AddForeignKey
ALTER TABLE "NDAAgreement" ADD CONSTRAINT "NDAAgreement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
