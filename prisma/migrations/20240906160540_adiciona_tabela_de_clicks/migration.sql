-- CreateTable
CREATE TABLE "clicks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "link_id" TEXT NOT NULL,
    "identity_hash" TEXT NOT NULL,
    "destination_url" TEXT NOT NULL,
    "referer" TEXT NOT NULL,
    "referer_url" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "device_vendor" TEXT NOT NULL,
    "device_model" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "browser_version" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "engine_version" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "os_version" TEXT NOT NULL,
    "cpu_architecture" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "is_bot" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clicks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
