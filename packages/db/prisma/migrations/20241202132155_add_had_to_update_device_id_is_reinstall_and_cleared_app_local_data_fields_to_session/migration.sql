/*
  Warnings:

  - You are about to drop the column `android_aaid` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `android_id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `install_time` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `ios_idfa` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `ios_idfv` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `cleared_app_local_data` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `had_to_update_device_id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "android_aaid",
DROP COLUMN "android_id",
DROP COLUMN "install_time",
DROP COLUMN "ios_idfa",
DROP COLUMN "ios_idfv",
ADD COLUMN     "cleared_app_local_data" BOOLEAN NOT NULL,
ADD COLUMN     "had_to_update_device_id" BOOLEAN NOT NULL;
