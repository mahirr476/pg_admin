/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Hero` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `HeroDetail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Hero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `HeroDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hero" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "HeroDetail" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hero_slug_key" ON "Hero"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HeroDetail_slug_key" ON "HeroDetail"("slug");
