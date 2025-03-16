/*
  Warnings:

  - You are about to drop the column `companies` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `employees` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `established` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `industries` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `products` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `projects` on the `Hero` table. All the data in the column will be lost.
  - Added the required column `index` to the `Hero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Impact` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImpactStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Hero" DROP COLUMN "companies",
DROP COLUMN "employees",
DROP COLUMN "established",
DROP COLUMN "industries",
DROP COLUMN "location",
DROP COLUMN "products",
DROP COLUMN "projects",
ADD COLUMN     "index" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Impact" ADD COLUMN     "number" TEXT NOT NULL;
