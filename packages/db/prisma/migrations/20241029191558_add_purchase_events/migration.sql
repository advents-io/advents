-- CreateTable
CREATE TABLE "purchase_events" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "purchase_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "purchase_events" ADD CONSTRAINT "purchase_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
