/*
  Warnings:

  - You are about to alter the column `name` on the `apps` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `slug` on the `apps` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(48)`.
  - You are about to alter the column `title` on the `links` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `slug` on the `links` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `name` on the `teams` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `slug` on the `teams` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(48)`.

*/
-- AlterTable
ALTER TABLE "apps" ALTER COLUMN "name" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(48);

-- AlterTable
ALTER TABLE "links" ALTER COLUMN "title" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "name" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(48);
