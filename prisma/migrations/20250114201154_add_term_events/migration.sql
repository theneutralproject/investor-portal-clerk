-- CreateTable
CREATE TABLE "TermsEvents" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "dateAccepted" TIMESTAMP(3) NOT NULL,
    "revision" INTEGER NOT NULL,

    CONSTRAINT "TermsEvents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TermsEvents" ADD CONSTRAINT "TermsEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
