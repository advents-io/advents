-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ios_url" TEXT NOT NULL,
    "android_url" TEXT NOT NULL,
    "fallback_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "links_domain_slug_key" ON "links"("domain", "slug");
