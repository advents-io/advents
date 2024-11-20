-- AlterTable
ALTER TABLE "apps" ADD COLUMN     "default_disable_ios_preview_page" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "links" ADD COLUMN     "disable_ios_preview_page" BOOLEAN NOT NULL DEFAULT false;
