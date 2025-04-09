/*
  Warnings:

  - You are about to drop the column `sliderImage` on the `Business` table. All the data in the column will be lost.
  - Added the required column `bannerImage` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "sliderImage",
ADD COLUMN     "bannerImage" TEXT NOT NULL;
