import type { MetadataRoute } from "next";

// Use a dedicated site URL var so the sitemap never picks up NEXTAUTH_URL
// mismatches set by the hosting provider (e.g. Vercel auto-sets NEXTAUTH_URL).
// Set NEXT_PUBLIC_SITE_URL in your production env dashboard.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://scriptgen.learnmade.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const apr2026 = new Date("2026-04-15");
  const mar2026 = new Date("2026-03-15");
  const feb2026 = new Date("2026-02-01");

  return [
    // ── Core pages ──────────────────────────────────────────
    {
      url: `${siteUrl}/`,
      lastModified: apr2026,
      changeFrequency: "weekly",
      priority: 1,
    },
    // ── Primary SEO landing pages (high-volume keywords) ────
    {
      url: `${siteUrl}/youtube-script-writer`,
      lastModified: apr2026,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/free-script-generator`,
      lastModified: apr2026,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/ai-script-writer`,
      lastModified: apr2026,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/script-writer-online`,
      lastModified: apr2026,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // ── App pages ───────────────────────────────────────────
    {
      url: `${siteUrl}/generate`,
      lastModified: apr2026,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // ── Blog index ──────────────────────────────────────────
    {
      url: `${siteUrl}/blog`,
      lastModified: apr2026,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // ── Blog posts ──────────────────────────────────────────
    {
      url: `${siteUrl}/blog/how-to-write-youtube-scripts`,
      lastModified: apr2026,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog/ai-script-generator-guide`,
      lastModified: feb2026,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${siteUrl}/blog/youtube-seo-checklist`,
      lastModified: feb2026,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${siteUrl}/blog/best-ai-script-generators-2026`,
      lastModified: apr2026,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog/how-to-use-ai-for-youtube-scripts`,
      lastModified: apr2026,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog/youtube-script-writer-tool`,
      lastModified: apr2026,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    // ── Legal pages ─────────────────────────────────────────
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: feb2026,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-conditions`,
      lastModified: feb2026,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/refund-policy`,
      lastModified: feb2026,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
