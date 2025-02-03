/*
  Warnings:

  - A unique constraint covering the columns `[sub_domain]` on the table `apps` will be added. If there are existing duplicate values, this will fail.
  - The current values in the `slug` column will be copied to the `sub_domain` column before enforcing NOT NULL.
*/

-- Step 1: Add the sub_domain column as nullable
ALTER TABLE "apps" ADD COLUMN "sub_domain" VARCHAR(48);

-- Step 2: Populate sub_domain with the current slug values
UPDATE "apps" SET "sub_domain" = slug;

-- Step 3: Enforce the NOT NULL constraint on sub_domain
ALTER TABLE "apps" ALTER COLUMN "sub_domain" SET NOT NULL;

-- Step 4: Create a unique index on sub_domain
CREATE UNIQUE INDEX "apps_sub_domain_key" ON "apps"("sub_domain");
