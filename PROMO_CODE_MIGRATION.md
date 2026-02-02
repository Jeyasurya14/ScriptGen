# Promo Code Feature - Database Migration

## What's New

Added a promo code redemption feature that allows users to get bonus tokens by entering promo codes.

**Active Promo Codes:**
- `PRODUCTHUNT` - 100 bonus tokens (for Product Hunt launch)
- `WELCOME50` - 50 bonus tokens

## Database Changes Required

You need to add a new table to track promo code redemptions. Run this SQL migration or use Prisma migrate:

### Option 1: Manual SQL Migration

Connect to your database and run:

```sql
-- Create promo_redemptions table
CREATE TABLE "promo_redemptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_redemptions_pkey" PRIMARY KEY ("id")
);

-- Add foreign key
ALTER TABLE "promo_redemptions" ADD CONSTRAINT "promo_redemptions_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create unique constraint (user can only use each code once)
ALTER TABLE "promo_redemptions" ADD CONSTRAINT "promo_redemptions_user_id_code_key" 
    UNIQUE ("user_id", "code");

-- Create index
CREATE INDEX "promo_redemptions_user_id_idx" ON "promo_redemptions"("user_id");
```

### Option 2: Using Prisma Migrate (Local Development)

If you're working locally with full database access:

```bash
npx prisma migrate dev --name add_promo_redemptions
```

### Option 3: Deploy to Production

When deploying to production (Vercel/Render):

```bash
npx prisma migrate deploy
```

## Files Changed

1. **`prisma/schema.prisma`** - Added `PromoRedemption` model
2. **`app/api/promo/route.ts`** - New API endpoint to redeem codes
3. **`app/ScriptGenerator.tsx`** - Added promo code UI in payment modal

## How It Works

1. User opens the "Recharge Tokens" modal
2. Scrolls down to see "Have a promo code?" section
3. Enters code (e.g., `PRODUCTHUNT`)
4. Clicks "Apply"
5. If valid and not previously used, tokens are added instantly
6. Modal closes automatically after 2 seconds

## Adding New Promo Codes

Edit `app/api/promo/route.ts`:

```typescript
const PROMO_CODES: { [key: string]: { tokens: number; description: string } } = {
    PRODUCTHUNT: { tokens: 100, description: "Product Hunt Launch Special" },
    WELCOME50: { tokens: 50, description: "Welcome Bonus" },
    NEWYEAR2026: { tokens: 100, description: "New Year Special" }, // Add new code here
};
```

## Testing

1. Sign in to your app
2. Open "Recharge Tokens" modal
3. Enter `PRODUCTHUNT` in the promo code field
4. Click "Apply"
5. You should see: "Success! 200 tokens added 🎉"
6. Try the same code again - should see: "You've already used this promo code"

## For Product Hunt Launch

In your first comment on Product Hunt, mention:

> Special offer for PH community: Use code **PRODUCTHUNT** for 200 bonus tokens 🎁

This will drive immediate engagement and conversions!
