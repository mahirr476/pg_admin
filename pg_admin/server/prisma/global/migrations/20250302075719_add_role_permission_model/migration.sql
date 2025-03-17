-- CreateTable
CREATE TABLE "RolePermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "paragon_group_view" BOOLEAN NOT NULL DEFAULT false,
    "paragon_group_create" BOOLEAN NOT NULL DEFAULT false,
    "paragon_group_edit" BOOLEAN NOT NULL DEFAULT false,
    "paragon_group_delete" BOOLEAN NOT NULL DEFAULT false,
    "parasole_view" BOOLEAN NOT NULL DEFAULT false,
    "parasole_create" BOOLEAN NOT NULL DEFAULT false,
    "parasole_edit" BOOLEAN NOT NULL DEFAULT false,
    "parasole_delete" BOOLEAN NOT NULL DEFAULT false,
    "dashboard" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_key" ON "RolePermission"("roleId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
