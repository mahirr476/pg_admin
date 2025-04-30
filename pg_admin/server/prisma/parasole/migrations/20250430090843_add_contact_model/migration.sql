-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" VARCHAR(255),
    "index" INTEGER NOT NULL,
    "createdBy" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(100),
    "updatedAt" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_slug_key" ON "Contact"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_index_key" ON "Contact"("index");
