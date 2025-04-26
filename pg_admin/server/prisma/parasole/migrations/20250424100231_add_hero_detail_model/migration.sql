/*
  Warnings:

  - You are about to alter the column `title` on the `Hero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `image` on the `Hero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `createdBy` on the `Hero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `updatedBy` on the `Hero` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "Hero" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "image" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "createdBy" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "updatedBy" DROP NOT NULL,
ALTER COLUMN "updatedBy" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "HeroDetail" (
    "id" SERIAL NOT NULL,
    "heroId" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "image" VARCHAR(255),
    "index" INTEGER NOT NULL,
    "createdBy" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(100),
    "updatedAt" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "HeroDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroDetail_index_key" ON "HeroDetail"("index");

-- AddForeignKey
ALTER TABLE "HeroDetail" ADD CONSTRAINT "HeroDetail_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE CASCADE ON UPDATE CASCADE;
