-- AlterTable
ALTER TABLE "RolePermission" ADD COLUMN     "analytics_view" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "settings_create" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "settings_edit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "settings_view" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_create" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_delete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_edit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_view" BOOLEAN NOT NULL DEFAULT false;
