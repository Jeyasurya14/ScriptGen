# ✅ Promo Code Feature Added!

## What's Been Implemented

I've added a complete promo code redemption system to your ScriptGen app. Users can now get bonus tokens by entering promo codes!

## Features

✅ **Promo code input field** in the payment modal
✅ **Real-time validation** - checks if code is valid
✅ **One-time use per user** - prevents abuse
✅ **Instant token delivery** - tokens added immediately
✅ **Visual feedback** - success/error messages
✅ **Auto-close modal** - closes after successful redemption

## Active Promo Codes

| Code | Tokens | Purpose |
|------|--------|---------|
| `PRODUCTHUNT` | 100 | Product Hunt launch special |
| `WELCOME50` | 50 | Welcome bonus |

## Files Changed

### 1. `app/api/promo/route.ts` (NEW)
- API endpoint to redeem promo codes
- Validates codes and prevents duplicate redemptions
- Updates user token balance

### 2. `prisma/schema.prisma`
- Added `PromoRedemption` model to track used codes
- Unique constraint ensures one redemption per user per code

### 3. `app/ScriptGenerator.tsx`
- Added promo code input UI in payment modal
- Added state management for promo code
- Added `handlePromoCode()` function
- Added success/error messages

## How It Looks

**In the Payment Modal:**
```
┌─────────────────────────────┐
│   Recharge Tokens      ×    │
├─────────────────────────────┤
│                             │
│  [Token packages...]        │
│                             │
│  [Buy tokens with Razorpay] │
│                             │
│ ──────────────────────────  │
│  🏷️ Have a promo code?      │
│  ┌──────────────┬────────┐  │
│  │ Enter code   │ Apply  │  │
│  └──────────────┴────────┘  │
│  ✅ Success! 200 tokens     │
│     added 🎉                │
└─────────────────────────────┘
```

## User Flow

1. User clicks "Recharge Tokens"
2. Scrolls to bottom of modal
3. Sees "Have a promo code?" section
4. Enters `PRODUCTHUNT`
5. Clicks "Apply"
6. Sees success message: "Success! 100 tokens added 🎉"
7. Modal auto-closes after 2 seconds
8. Token balance updates in header

## For Your Product Hunt Launch

**In your first comment on Product Hunt:**

```markdown
Special offer for PH community: Use code **PRODUCTHUNT** for 100 bonus tokens 🎁

That's enough for 2-3 complete script generations (script + SEO + chapters + B-roll + shorts)!
```

This will:
- Drive immediate signups
- Increase engagement
- Create goodwill with the PH community
- Give users enough tokens to really test your product

## Next Step: Database Migration

⚠️ **IMPORTANT:** You need to run a database migration before this feature works.

See `PROMO_CODE_MIGRATION.md` for detailed instructions.

**Quick command (when deploying):**
```bash
npx prisma migrate deploy
```

Or manually run the SQL in `PROMO_CODE_MIGRATION.md`.

## Adding More Promo Codes

Edit `app/api/promo/route.ts` and add to the `PROMO_CODES` object:

```typescript
const PROMO_CODES = {
    PRODUCTHUNT: { tokens: 100, description: "Product Hunt Launch Special" },
    WELCOME50: { tokens: 50, description: "Welcome Bonus" },
    NEWYEAR: { tokens: 100, description: "New Year Special" }, // Add here
};
```

## Testing

1. Deploy your changes
2. Run the database migration
3. Sign in to your app
4. Click "Recharge Tokens"
5. Enter `PRODUCTHUNT`
6. Click "Apply"
7. Should see success message and tokens added!

---

**Ready for launch! 🚀**

Your Product Hunt first comment is ready with the promo code. Users will love getting 100 free tokens!
