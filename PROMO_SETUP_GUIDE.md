# 🎁 Promo Code Setup Guide

## Quick Summary

Your promo code feature is **ready to use**! The code is complete, but the database needs one new table.

## Database Migration Options

Choose the easiest method for you:

### ⭐ Option 1: Run SQL in Render Dashboard (EASIEST)

1. Go to your **Render dashboard**: https://dashboard.render.com
2. Click on your **PostgreSQL database**
3. Click **"Connect"** → **"External Connection"** or find the SQL console
4. Copy and paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS "promo_redemptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "promo_redemptions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "promo_redemptions_user_id_idx" 
    ON "promo_redemptions"("user_id");

CREATE UNIQUE INDEX IF NOT EXISTS "promo_redemptions_user_id_code_key" 
    ON "promo_redemptions"("user_id", "code");

ALTER TABLE "promo_redemptions" 
    ADD CONSTRAINT "promo_redemptions_user_id_fkey" 
    FOREIGN KEY ("user_id") 
    REFERENCES "users"("id") 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;
```

5. Click **"Run"** or **"Execute"**
6. Done! ✅

### Option 2: Using pgAdmin or DBeaver

1. Connect to your database using the connection string from `.env`
2. Open a SQL query window
3. Run the SQL above
4. Done! ✅

### Option 3: Prisma Migrate (if available)

If your database isn't locked:
```bash
npx prisma migrate deploy
```

---

## Testing the Feature

After running the migration:

1. **Deploy your code** to Vercel/production
2. **Sign in** to your app
3. **Click "Recharge Tokens"**
4. Scroll down to **"Have a promo code?"**
5. Enter: `PRODUCTHUNT`
6. Click **"Apply"**
7. Should see: ✅ **"Success! 200 tokens added 🎉"**

---

## Active Promo Codes

| Code | Tokens | Purpose |
|------|--------|---------|
| **PRODUCTHUNT** | 100 | Product Hunt launch (mention in first comment!) |
| **WELCOME50** | 50 | General welcome bonus |

---

## For Your Product Hunt Launch

Copy this into your **first comment**:

```markdown
🎁 **Special offer for PH community:** 

Use code **PRODUCTHUNT** for 100 bonus tokens!

That's enough for 2-3 complete script generations 
(script + SEO + chapters + B-roll + shorts).

Just sign in with Google and apply the code in the 
"Recharge Tokens" modal. No card required!
```

---

## Adding More Promo Codes

Edit `app/api/promo/route.ts`:

```typescript
const PROMO_CODES: { [key: string]: { tokens: number; description: string } } = {
    PRODUCTHUNT: { tokens: 200, description: "Product Hunt Launch Special" },
    WELCOME50: { tokens: 50, description: "Welcome Bonus" },
    NEWYEAR: { tokens: 100, description: "New Year Promo" }, // Add here
};
```

Redeploy and the new code is live!

---

## Files You've Got

✅ `app/api/promo/route.ts` - API endpoint (handles redemption)
✅ `app/ScriptGenerator.tsx` - UI with promo input field
✅ `prisma/schema.prisma` - Database schema updated
✅ `run-promo-migration.sql` - SQL migration file
✅ Migration files in `prisma/migrations/`

---

## Troubleshooting

**Q: "You've already used this promo code"**
- Each user can only use each code once (prevents abuse)
- This is expected behavior!

**Q: "Invalid promo code"**
- Check spelling (codes are case-insensitive, but must match exactly)
- Make sure code exists in `app/api/promo/route.ts`

**Q: Migration fails with "relation already exists"**
- The table is already there! You're good to go ✅
- Just test the feature

---

## Ready to Launch?

1. ✅ Code is ready
2. ⏭️ Run the SQL migration in Render dashboard
3. ⏭️ Deploy to production
4. ⏭️ Test with `PRODUCTHUNT` code
5. ⏭️ Launch on Product Hunt!

**The promo code will drive massive engagement. Let's go! 🚀**
