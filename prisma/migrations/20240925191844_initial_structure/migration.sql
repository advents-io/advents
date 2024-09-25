-- CreateEnum
CREATE TYPE "AttributionMethod" AS ENUM ('android_deterministic_referrer', 'ios_deterministic_click', 'ios_probabilistc');

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "domain" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "android_url" TEXT NOT NULL,
    "ios_url" TEXT NOT NULL,
    "fallback_url" TEXT NOT NULL,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "install_count" INTEGER NOT NULL DEFAULT 0,
    "app_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "default_domain" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "android_url" TEXT NOT NULL,
    "ios_url" TEXT NOT NULL,
    "default_fallback_url" TEXT,
    "qrcode_logo_url" TEXT,
    "team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clicks" (
    "id" TEXT NOT NULL,
    "destination_url" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "referer" TEXT NOT NULL,
    "referer_url" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "device_brand" TEXT NOT NULL,
    "device_model" TEXT NOT NULL,
    "device_type" TEXT NOT NULL,
    "os_version" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "browser_version" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "engine_version" TEXT NOT NULL,
    "cpu_architecture" TEXT NOT NULL,
    "is_bot" BOOLEAN NOT NULL,
    "ip" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "link_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sdk_name" TEXT,
    "sdk_version" TEXT,
    "framework" TEXT,
    "device_time" TIMESTAMP(3),
    "os" TEXT,
    "package" TEXT,
    "android_aaid" TEXT,
    "android_id" TEXT,
    "android_install_referrer" TEXT,
    "ios_idfv" TEXT,
    "ios_idfa" TEXT,
    "ios_att_permission_status" TEXT,
    "ios_clipboard_click_id" TEXT,
    "ios_device_model_id" TEXT,
    "install_time" TIMESTAMP(3),
    "user_agent" TEXT,
    "device_name" TEXT,
    "device_brand" TEXT,
    "device_model" TEXT,
    "device_type" TEXT,
    "device_year_class" TEXT,
    "os_version" TEXT,
    "os_build_id" TEXT,
    "app_version" TEXT,
    "ip" TEXT,
    "continent" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "app_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attributions" (
    "id" TEXT NOT NULL,
    "method" "AttributionMethod" NOT NULL,
    "session_id" TEXT NOT NULL,
    "click_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attributions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "links_domain_slug_key" ON "links"("domain", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "apps_slug_team_id_key" ON "apps"("slug", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_slug_key" ON "teams"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "members_user_id_key" ON "members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "attributions_session_id_key" ON "attributions"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "attributions_click_id_key" ON "attributions"("click_id");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apps" ADD CONSTRAINT "apps_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributions" ADD CONSTRAINT "attributions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributions" ADD CONSTRAINT "attributions_click_id_fkey" FOREIGN KEY ("click_id") REFERENCES "clicks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
