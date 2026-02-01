-- Supabase Database Schema for Script Generator
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User credits table
CREATE TABLE IF NOT EXISTS user_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    free_scripts_used INTEGER DEFAULT 0,
    paid_credits INTEGER DEFAULT 0,
    total_generated INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    credits_purchased INTEGER DEFAULT 1,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scripts history table
CREATE TABLE IF NOT EXISTS scripts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    channel_name TEXT,
    duration INTEGER,
    content_type TEXT,
    script_content TEXT,
    seo_data JSONB,
    images_data JSONB,
    chapters_data JSONB,
    broll_data JSONB,
    shorts_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Policies (adjust based on your needs)
-- For service role access (used by the API)
CREATE POLICY "Service role can access all users" ON users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all credits" ON user_credits
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all transactions" ON transactions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all scripts" ON scripts
    FOR ALL USING (auth.role() = 'service_role');
