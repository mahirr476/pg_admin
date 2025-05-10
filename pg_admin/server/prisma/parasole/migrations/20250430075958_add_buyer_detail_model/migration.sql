-- CreateTable
CREATE TABLE "BuyerDetail" (
    "id" SERIAL NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image" VARCHAR(255),
    "type" VARCHAR(255),
    "year" VARCHAR(255),
    "createdBy" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(100),
    "updatedAt" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "BuyerDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BuyerDetail_slug_key" ON "BuyerDetail"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BuyerDetail_index_key" ON "BuyerDetail"("index");

-- AddForeignKey
ALTER TABLE "BuyerDetail" ADD CONSTRAINT "BuyerDetail_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
