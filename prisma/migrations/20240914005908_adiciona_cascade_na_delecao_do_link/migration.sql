-- DropForeignKey
ALTER TABLE "clicks" DROP CONSTRAINT "clicks_link_id_fkey";

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
