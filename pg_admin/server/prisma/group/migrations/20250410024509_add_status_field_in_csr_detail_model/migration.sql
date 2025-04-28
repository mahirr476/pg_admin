/*
  Warnings:

  - The `status` column on the `Business` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `CSR` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Hero` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Impact` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Milestone` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `MilestoneDetail` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[index]` on the table `Hero` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `Impact` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "CSR" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "CsrDetail" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Hero" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Impact" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "MilestoneDetail" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "BusinessStatus";

-- DropEnum
DROP TYPE "CSRStatus";

-- DropEnum
DROP TYPE "HeroStatus";

-- DropEnum
DROP TYPE "ImpactStatus";

-- DropEnum
DROP TYPE "MileDetailstatus";

-- DropEnum
DROP TYPE "Milestonestatus";

-- CreateIndex
CREATE UNIQUE INDEX "Hero_index_key" ON "Hero"("index");

-- CreateIndex
CREATE UNIQUE INDEX "Impact_number_key" ON "Impact"("number");
