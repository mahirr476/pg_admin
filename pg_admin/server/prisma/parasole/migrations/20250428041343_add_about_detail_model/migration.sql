-- CreateTable
CREATE TABLE "AboutDetail" (
    "id" SERIAL NOT NULL,
    "aboutId" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "createdBy" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(100),
    "updatedAt" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "AboutDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AboutDetail_slug_key" ON "AboutDetail"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AboutDetail_index_key" ON "AboutDetail"("index");

-- AddForeignKey
ALTER TABLE "AboutDetail" ADD CONSTRAINT "AboutDetail_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "About"("id") ON DELETE CASCADE ON UPDATE CASCADE;
