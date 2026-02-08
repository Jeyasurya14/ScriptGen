# Production Checklist

Before deploying ScriptGen to production, ensure the following.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Random secret for session encryption (32+ chars) |
| `NEXTAUTH_URL` | ✅ | Public URL of your app (e.g. `https://scriptgen.example.com`) |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret |
| `OPENAI_API_KEY` | ✅ | OpenAI API key (server-side only) |
| `RAZORPAY_KEY_ID` | ⬜ | Razorpay key (for payments) |
| `RAZORPAY_KEY_SECRET` | ⬜ | Razorpay secret (for payments) |
| `RAZORPAY_BUSINESS_NAME` | ⬜ | Business name displayed in Razorpay checkout (defaults to "ScriptGen") |

## Security

- [ ] **NEXTAUTH_SECRET** – Generate with `openssl rand -base64 32`
- [ ] **OPENAI_API_KEY** – Never expose in client; use `OPENAI_API_KEY` (not `NEXT_PUBLIC_`)
- [ ] **Database** – Use connection pooling in production (e.g. PgBouncer)
- [ ] **HTTPS** – Enforce HTTPS (HSTS header is set when `NODE_ENV=production`)

## Razorpay Configuration

- [ ] **RAZORPAY_BUSINESS_NAME** – Set to match the business name registered with your Razorpay account (defaults to "ScriptGen")
- [ ] **Business Model Match** – Ensure the business model/vertical registered with Razorpay matches your website's business type (SaaS/Software)
- [ ] **Account Verification** – Verify that your Razorpay account business details match the website domain and business model

## Database

- [ ] Run `npx prisma migrate deploy` (or apply migrations manually)
- [ ] Run `referral-migration.sql` if using the referral feature
- [ ] Ensure indexes exist for high-traffic queries

## Referral

- [ ] **NEXTAUTH_URL** – Must be set in production so referral links use the correct domain
- [ ] **referral-migration.sql** – Run before enabling (users.referral_code, referrals table)
- [ ] Referral codes use crypto-random generation; duplicate handling via P2002 retry

## Monitoring

- [ ] **Health check** – `GET /api/health` returns 200 when DB is reachable
- [ ] **Error tracking** – Integrate Sentry or similar (add to `global-error.tsx` and `error.tsx`)
- [ ] **Logging** – Configure log aggregation (e.g. Vercel, Datadog)

## Performance

- [ ] **Images** – Use `next/image` with proper `sizes` for responsive images
- [ ] **Prisma** – Connection pool is reused in serverless (singleton)
- [ ] **Build** – Run `npm run build` and fix any warnings

## Rate Limiting (Optional)

For high-traffic deployments, consider:

- Vercel: Edge middleware or Vercel Firewall
- Upstash Redis: `@upstash/ratelimit` for API routes
- Cloudflare: Rate limiting rules

## Deployment

1. `npm run build` – Verify build succeeds
2. `npm run start` – Test production build locally
3. Deploy to Vercel / Render / your platform
4. Set all env vars in the hosting dashboard
5. Point domain and enable HTTPS
