-- CreateTable
CREATE TABLE "ContactMedia" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "facebook" VARCHAR(255),
    "instagram" VARCHAR(255),
    "twitter" VARCHAR(255),
    "linkedin" VARCHAR(255),
    "youtube" VARCHAR(255),
    "tiktok" VARCHAR(255),
    "telegram" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(255),
    "address" VARCHAR(255),
    "map" VARCHAR(255),
    "createdBy" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(100),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ContactMedia_pkey" PRIMARY KEY ("id")
);
