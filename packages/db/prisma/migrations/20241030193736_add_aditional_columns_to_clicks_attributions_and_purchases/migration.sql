/*
  Warnings:

  - You are about to drop the `purchase_events` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `app_id` to the `attributions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_id` to the `attributions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `app_id` to the `clicks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "purchase_events" DROP CONSTRAINT "purchase_events_session_id_fkey";

-- AlterTable
ALTER TABLE "attributions" ADD COLUMN     "app_id" TEXT NOT NULL,
ADD COLUMN     "link_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "clicks" ADD COLUMN     "app_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "purchase_events";

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,
    "session_id" TEXT NOT NULL,
    "link_id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributions" ADD CONSTRAINT "attributions_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributions" ADD CONSTRAINT "attributions_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
