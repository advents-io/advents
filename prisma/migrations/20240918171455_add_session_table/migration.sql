-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sdk_name" TEXT NOT NULL,
    "sdk_version" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "android_id" TEXT,
    "android_install_referrer" TEXT,
    "android_install_time" TIMESTAMP(3),
    "user_agent" TEXT,
    "device_name" TEXT,
    "device_brand" TEXT,
    "device_model" TEXT,
    "device_year_class" TEXT,
    "os_version" TEXT,
    "app_version" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);
