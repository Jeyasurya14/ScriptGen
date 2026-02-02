-- Run this SQL directly in your database (Render dashboard or pgAdmin)
-- This adds the promo_redemptions table

CREATE TABLE IF NOT EXISTS "promo_redemptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_redemptions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "promo_redemptions_user_id_idx" ON "promo_redemptions"("user_id");

CREATE UNIQUE INDEX IF NOT EXISTS "promo_redemptions_user_id_code_key" ON "promo_redemptions"("user_id", "code");

ALTER TABLE "promo_redemptions" 
    ADD CONSTRAINT "promo_redemptions_user_id_fkey" 
    FOREIGN KEY ("user_id") 
    REFERENCES "users"("id") 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

-- Mark migration as applied
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count")
VALUES (
    gen_random_uuid()::text,
    'migration_checksum',
    NOW(),
    '20260203003831_add_promo_redemptions',
    NULL,
    NULL,
    NOW(),
    1
);
