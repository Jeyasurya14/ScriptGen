/**
 * Canonical site URL used for SEO metadata, sitemaps, and robots.txt.
 *
 * Priority order:
 * 1. NEXT_PUBLIC_SITE_URL  — set this in your hosting dashboard (Vercel/Render)
 *                            to the exact production domain, e.g. https://scriptgen.learnmade.in
 * 2. NEXTAUTH_URL          — fallback (but Vercel auto-sets this to the preview URL!)
 * 3. Hardcoded canonical   — always the correct production domain as last resort
 *
 * WHY: NEXTAUTH_URL is often overridden by hosting providers to a preview/branch URL,
 * which corrupts sitemap and canonical tags. Use NEXT_PUBLIC_SITE_URL instead.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://scriptgen.learnmade.in";
