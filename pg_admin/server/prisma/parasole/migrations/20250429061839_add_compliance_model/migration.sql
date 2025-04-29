-- CreateTable
CREATE TABLE "Compliance" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "index" INTEGER NOT NULL,
    "createdBy" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(100),
    "updatedAt" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Compliance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Compliance_slug_key" ON "Compliance"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Compliance_index_key" ON "Compliance"("index");
