/*
  Warnings:

  - You are about to drop the column `android_aaid` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `android_id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `ios_idfa` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `ios_idfv` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `device_id` to the `attributions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_id` to the `purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_id` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `had_to_update_storage_device_id` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_first_session` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Made the column `sdk_name` on table `sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sdk_version` on table `sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `framework` on table `sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `device_time` on table `sessions` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `os` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Made the column `package` on table `sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "DeviceOs" AS ENUM ('android', 'ios');

-- AlterTable
ALTER TABLE "attributions" ADD COLUMN     "device_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "device_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "android_aaid",
DROP COLUMN "android_id",
DROP COLUMN "ios_idfa",
DROP COLUMN "ios_idfv",
ADD COLUMN     "device_id" TEXT NOT NULL,
ADD COLUMN     "had_to_update_storage_device_id" BOOLEAN NOT NULL,
ADD COLUMN     "is_first_session" BOOLEAN NOT NULL,
ALTER COLUMN "sdk_name" SET NOT NULL,
ALTER COLUMN "sdk_version" SET NOT NULL,
ALTER COLUMN "framework" SET NOT NULL,
ALTER COLUMN "device_time" SET NOT NULL,
DROP COLUMN "os",
ADD COLUMN     "os" "DeviceOs" NOT NULL,
ALTER COLUMN "package" SET NOT NULL;

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "os" "DeviceOs" NOT NULL,
    "android_aaid" TEXT,
    "android_id" TEXT,
    "ios_idfv" TEXT,
    "ios_idfa" TEXT,
    "app_id" TEXT NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_app_id_android_aaid_key" ON "devices"("app_id", "android_aaid");

-- CreateIndex
CREATE UNIQUE INDEX "devices_app_id_android_id_key" ON "devices"("app_id", "android_id");

-- CreateIndex
CREATE UNIQUE INDEX "devices_app_id_ios_idfv_key" ON "devices"("app_id", "ios_idfv");

-- CreateIndex
CREATE UNIQUE INDEX "devices_app_id_ios_idfa_key" ON "devices"("app_id", "ios_idfa");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributions" ADD CONSTRAINT "attributions_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
