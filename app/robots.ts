import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://scriptgen.learnmade.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all crawlers
      { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard/", "/generate"] },
      // Google — full access
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/"] },
      // Bing — full access
      { userAgent: "Bingbot", allow: "/", disallow: ["/api/"] },
      // ChatGPT / OpenAI — explicitly allowed to index and cite
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      // Perplexity AI — explicitly allowed
      { userAgent: "PerplexityBot", allow: "/" },
      // Anthropic Claude — explicitly allowed
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      // Google AI (Search Generative Experience / Gemini)
      { userAgent: "Google-Extended", allow: "/" },
      // Meta AI
      { userAgent: "FacebookBot", allow: "/" },
      // Apple
      { userAgent: "Applebot", allow: "/" },
      // Common AI research crawlers
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
