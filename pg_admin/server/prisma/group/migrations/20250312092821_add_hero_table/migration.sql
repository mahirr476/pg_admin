-- CreateEnum
CREATE TYPE "HeroStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "companies" TEXT NOT NULL,
    "projects" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "employees" TEXT NOT NULL,
    "industries" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "established" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "HeroStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);
