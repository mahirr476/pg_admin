/*
  Warnings:

  - You are about to drop the column `description` on the `Companies` table. All the data in the column will be lost.
  - Added the required column `category` to the `Companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientSatisfaction` to the `Companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `founded` to the `Companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `globalPresence` to the `Companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longDes` to the `Companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenue` to the `Companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDes` to the `Companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamSize` to the `Companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Companies" DROP COLUMN "description",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "clientSatisfaction" TEXT NOT NULL,
ADD COLUMN     "founded" TEXT NOT NULL,
ADD COLUMN     "globalPresence" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "longDes" TEXT NOT NULL,
ADD COLUMN     "revenue" TEXT NOT NULL,
ADD COLUMN     "shortDes" TEXT NOT NULL,
ADD COLUMN     "teamSize" TEXT NOT NULL;
