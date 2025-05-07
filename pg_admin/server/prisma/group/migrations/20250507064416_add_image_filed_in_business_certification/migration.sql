/*
  Warnings:

  - The `image` column on the `BusinessCertification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BusinessCertification" DROP COLUMN "image",
ADD COLUMN     "image" TEXT[] DEFAULT ARRAY[]::TEXT[];
