/*
  Warnings:

  - You are about to drop the column `qrcode_logo` on the `apps` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `apps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "apps" DROP COLUMN "qrcode_logo",
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "qrcode_logo_url" TEXT;
