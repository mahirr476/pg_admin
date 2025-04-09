/*
  Warnings:

  - A unique constraint covering the columns `[orderIndex]` on the table `Milestone` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderIndex` to the `Milestone` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MileDetailtatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Milestonetatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Milestone" ADD COLUMN     "orderIndex" INTEGER NOT NULL,
ADD COLUMN     "status" "Milestonetatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "MilestoneDetail" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "status" "MileDetailtatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MilestoneDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Milestone_orderIndex_key" ON "Milestone"("orderIndex");
