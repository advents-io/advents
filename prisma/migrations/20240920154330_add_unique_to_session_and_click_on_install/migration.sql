/*
  Warnings:

  - A unique constraint covering the columns `[session_id]` on the table `installs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[click_id]` on the table `installs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "installs_session_id_key" ON "installs"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "installs_click_id_key" ON "installs"("click_id");
