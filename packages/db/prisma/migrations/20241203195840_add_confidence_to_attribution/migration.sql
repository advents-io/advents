/*
  Warnings:

  - Added the required column `confidence` to the `attributions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attributions" ADD COLUMN     "confidence" DOUBLE PRECISION NOT NULL;
