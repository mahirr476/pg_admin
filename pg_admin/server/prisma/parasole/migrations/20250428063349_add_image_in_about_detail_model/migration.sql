-- DropIndex
DROP INDEX "AboutDetail_index_key";

-- AlterTable
ALTER TABLE "AboutDetail" ADD COLUMN     "image" VARCHAR(255),
ADD COLUMN     "link" VARCHAR(255),
ALTER COLUMN "index" DROP NOT NULL;
