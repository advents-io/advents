/*
  Warnings:

  - Changed the type of `method` on the `attributions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `os` on the `devices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `os` on the `sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "device_os" AS ENUM ('android', 'ios');

-- CreateEnum
CREATE TYPE "attribution_method" AS ENUM ('android_deterministic_referrer', 'android_probabilistic', 'ios_deterministic_click', 'ios_probabilistic');

-- AlterTable
ALTER TABLE "attributions" DROP COLUMN "method",
ADD COLUMN     "method" "attribution_method" NOT NULL;

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "os",
ADD COLUMN     "os" "device_os" NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "os",
ADD COLUMN     "os" "device_os" NOT NULL;

-- DropEnum
DROP TYPE "AttributionMethod";

-- DropEnum
DROP TYPE "DeviceOs";
