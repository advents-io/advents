/*
  Warnings:

  - A unique constraint covering the columns `[sub_domain]` on the table `apps` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sub_domain` to the `apps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "apps" ADD COLUMN     "sub_domain" VARCHAR(48) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "apps_sub_domain_key" ON "apps"("sub_domain");
