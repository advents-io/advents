-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "comment" TEXT,
    "data" JSONB NOT NULL,
    "install_referrer" TEXT,
    "install_time" TIMESTAMP(3),
    "device_id" TEXT,
    "device_name" TEXT,
    "os_name" TEXT,
    "os_version" TEXT,
    "device_brand" TEXT,
    "device_model" TEXT,
    "device_year_class" TEXT,
    "app_version" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);
