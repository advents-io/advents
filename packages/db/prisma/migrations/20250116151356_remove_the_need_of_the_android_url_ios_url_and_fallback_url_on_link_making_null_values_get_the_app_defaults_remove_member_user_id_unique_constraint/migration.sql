/*
  Warnings:

  - You are about to drop the column `default_disable_ios_preview_page` on the `apps` table. All the data in the column will be lost.
  - You are about to drop the column `default_fallback_url` on the `apps` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,team_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fallback_url` to the `apps` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "members_user_id_key";

-- First add the new columns
ALTER TABLE "apps" ADD COLUMN "disable_ios_preview_page" BOOLEAN;
ALTER TABLE "apps" ADD COLUMN "fallback_url" TEXT;

-- Copy data from old columns to new ones
UPDATE "apps"
SET "disable_ios_preview_page" = "default_disable_ios_preview_page",
    "fallback_url" = "default_fallback_url";

-- Now drop the old columns
ALTER TABLE "apps" DROP COLUMN "default_disable_ios_preview_page",
DROP COLUMN "default_fallback_url";

-- Set the NOT NULL constraints and defaults after data migration
ALTER TABLE "apps"
ALTER COLUMN "disable_ios_preview_page" SET NOT NULL,
ALTER COLUMN "disable_ios_preview_page" SET DEFAULT false,
ALTER COLUMN "fallback_url" SET NOT NULL;

-- AlterTable
ALTER TABLE "links" ALTER COLUMN "android_url" DROP NOT NULL,
ALTER COLUMN "ios_url" DROP NOT NULL,
ALTER COLUMN "fallback_url" DROP NOT NULL,
ALTER COLUMN "disable_ios_preview_page" DROP NOT NULL,
ALTER COLUMN "disable_ios_preview_page" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "members_user_id_team_id_key" ON "members"("user_id", "team_id");
