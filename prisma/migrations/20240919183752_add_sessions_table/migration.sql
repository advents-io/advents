-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sdk_name" TEXT NOT NULL,
    "sdk_version" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "android_id" TEXT,
    "android_install_referrer" TEXT,
    "install_time" TIMESTAMP(3),
    "user_agent" TEXT,
    "device_name" TEXT,
    "device_brand" TEXT,
    "device_model" TEXT,
    "device_year_class" TEXT,
    "os_version" TEXT,
    "app_version" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "app_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
