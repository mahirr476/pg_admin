/*
  Warnings:

  - You are about to drop the `BusinessDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BusinessOperationStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "BusinessDetail" DROP CONSTRAINT "BusinessDetail_businessId_fkey";

-- DropTable
DROP TABLE "BusinessDetail";

-- DropEnum
DROP TYPE "BusinessDetailStatus";

-- CreateTable
CREATE TABLE "BusinessOperation" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "status" "BusinessOperationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BusinessOperation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BusinessOperation" ADD CONSTRAINT "BusinessOperation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
