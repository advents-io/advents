/*
  Warnings:

  - A unique constraint covering the columns `[install_id]` on the table `attributions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `install_id` to the `attributions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `install_id` to the `purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `install_id` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Made the column `install_time` on table `sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "attributions" ADD COLUMN     "install_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "install_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "android_aaid" TEXT,
ADD COLUMN     "android_id" TEXT,
ADD COLUMN     "install_id" TEXT NOT NULL,
ADD COLUMN     "ios_idfa" TEXT,
ADD COLUMN     "ios_idfv" TEXT,
ALTER COLUMN "install_time" SET NOT NULL;

-- CreateTable
CREATE TABLE "installs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "install_time" TIMESTAMP(3) NOT NULL,
    "device_id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,

    CONSTRAINT "installs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attributions_install_id_key" ON "attributions"("install_id");

-- AddForeignKey
ALTER TABLE "installs" ADD CONSTRAINT "installs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installs" ADD CONSTRAINT "installs_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_install_id_fkey" FOREIGN KEY ("install_id") REFERENCES "installs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributions" ADD CONSTRAINT "attributions_install_id_fkey" FOREIGN KEY ("install_id") REFERENCES "installs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_install_id_fkey" FOREIGN KEY ("install_id") REFERENCES "installs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
