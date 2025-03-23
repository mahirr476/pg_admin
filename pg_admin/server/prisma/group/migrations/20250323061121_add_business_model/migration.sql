/*
  Warnings:

  - The `status` column on the `Milestone` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `MilestoneDetail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Milestonestatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MileDetailstatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "status",
ADD COLUMN     "status" "Milestonestatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "MilestoneDetail" DROP COLUMN "status",
ADD COLUMN     "status" "MileDetailstatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "MileDetailtatus";

-- DropEnum
DROP TYPE "Milestonetatus";

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDes" TEXT NOT NULL,
    "longDes" TEXT NOT NULL,
    "videoLink" TEXT,
    "image" TEXT,
    "createdBy" TEXT NOT NULL,
    "status" "BusinessStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");
