/*
  Warnings:

  - Added the required column `android_package_name` to the `apps` table without a default value. This is not possible if the table is not empty.

*/
-- First add the column as nullable
ALTER TABLE "apps" ADD COLUMN "android_package_name" TEXT;

-- Update existing records
UPDATE "apps" SET "android_package_name" = '';

-- Make the column NOT NULL
ALTER TABLE "apps" ALTER COLUMN "android_package_name" SET NOT NULL;

-- Add the remaining columns
ALTER TABLE "apps" ADD COLUMN "apple_team_id" TEXT,
ADD COLUMN "scheme" TEXT;

-- CreateTable
CREATE TABLE "ios_bundle_ids" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "bundle_id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,

    CONSTRAINT "ios_bundle_ids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "android_cert_fingerprints" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "sha256_fingerprint" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,

    CONSTRAINT "android_cert_fingerprints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ios_bundle_ids_bundle_id_app_id_key" ON "ios_bundle_ids"("bundle_id", "app_id");

-- CreateIndex
CREATE UNIQUE INDEX "android_cert_fingerprints_sha256_fingerprint_app_id_key" ON "android_cert_fingerprints"("sha256_fingerprint", "app_id");

-- AddForeignKey
ALTER TABLE "ios_bundle_ids" ADD CONSTRAINT "ios_bundle_ids_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "android_cert_fingerprints" ADD CONSTRAINT "android_cert_fingerprints_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
