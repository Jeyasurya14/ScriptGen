-- Run this SQL in your database (e.g. Render PostgreSQL) to add referral support.
-- 1. Add referral_code column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- 2. Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON referrals(referrer_id);
