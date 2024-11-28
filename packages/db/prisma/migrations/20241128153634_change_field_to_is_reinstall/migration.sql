/*
  Warnings:

  - You are about to drop the column `had_to_update_storage_device_id` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `is_reinstall` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "had_to_update_storage_device_id",
ADD COLUMN     "is_reinstall" BOOLEAN NOT NULL;
