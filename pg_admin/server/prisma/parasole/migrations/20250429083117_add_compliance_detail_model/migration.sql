-- CreateTable
CREATE TABLE "ComplianceDetail" (
    "id" SERIAL NOT NULL,
    "complianceId" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" TEXT NOT NULL,
    "image" VARCHAR(255),
    "index" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescrip" TEXT,
    "createdBy" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(100),
    "updatedAt" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "ComplianceDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComplianceDetail_slug_key" ON "ComplianceDetail"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ComplianceDetail_index_key" ON "ComplianceDetail"("index");

-- AddForeignKey
ALTER TABLE "ComplianceDetail" ADD CONSTRAINT "ComplianceDetail_complianceId_fkey" FOREIGN KEY ("complianceId") REFERENCES "Compliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
