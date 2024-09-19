/*
  Warnings:

  - You are about to drop the column `identity_hash` on the `clicks` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `device_timestamp` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clicks" DROP COLUMN "identity_hash",
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "timestamp",
ADD COLUMN     "device_timestamp" TIMESTAMP(3) NOT NULL;
