-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hero_index_key" ON "Hero"("index");
