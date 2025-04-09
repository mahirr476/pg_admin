/*
  Warnings:

  - The `status` column on the `BusinessCertification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `BusinessOperation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `BusinessProduct` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `BusinessUnit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `MediaGallery` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "BusinessCertification" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "BusinessOperation" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "BusinessProduct" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "BusinessUnit" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Companies" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "MediaGallery" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "BusinessCertiStatus";

-- DropEnum
DROP TYPE "BusinessOperationStatus";

-- DropEnum
DROP TYPE "BusinessProductStatus";

-- DropEnum
DROP TYPE "BusinessUnitStatus";

-- DropEnum
DROP TYPE "CompaniesStatus";

-- DropEnum
DROP TYPE "mediaGalleryStatus";

-- DropEnum
DROP TYPE "mediaStatus";

-- CreateTable
CREATE TABLE "MediaNews" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MediaNews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaNews_slug_key" ON "MediaNews"("slug");
