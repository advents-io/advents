-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_app_id_fkey";

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
