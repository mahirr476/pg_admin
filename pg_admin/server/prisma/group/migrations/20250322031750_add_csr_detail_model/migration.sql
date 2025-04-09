-- CreateTable
CREATE TABLE "CsrDetail" (
    "id" SERIAL NOT NULL,
    "csr_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CsrDetail_pkey" PRIMARY KEY ("id")
);
