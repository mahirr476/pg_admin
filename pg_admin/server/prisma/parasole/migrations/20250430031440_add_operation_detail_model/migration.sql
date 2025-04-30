-- CreateTable
CREATE TABLE "OperationDetail" (
    "id" SERIAL NOT NULL,
    "operationId" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdBy" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(100),
    "updatedAt" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "OperationDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OperationDetail_slug_key" ON "OperationDetail"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "OperationDetail_index_key" ON "OperationDetail"("index");

-- AddForeignKey
ALTER TABLE "OperationDetail" ADD CONSTRAINT "OperationDetail_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
