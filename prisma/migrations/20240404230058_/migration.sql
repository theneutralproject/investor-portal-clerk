-- CreateEnum
CREATE TYPE "Project_Status" AS ENUM ('NOT_STARTED', 'ACTIVE', 'FUNDED');

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Project_Status" NOT NULL DEFAULT 'ACTIVE',
    "location" TEXT NOT NULL,
    "num_units" INTEGER NOT NULL,
    "investment_goal" DOUBLE PRECISION NOT NULL,
    "investment_raised" DOUBLE PRECISION NOT NULL,
    "project_irr" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
