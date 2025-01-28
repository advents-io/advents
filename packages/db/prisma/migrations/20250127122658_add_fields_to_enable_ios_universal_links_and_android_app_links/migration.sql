-- AlterTable
ALTER TABLE "apps" ADD COLUMN     "enable_android_app_links" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enable_ios_universal_links" BOOLEAN NOT NULL DEFAULT false;
