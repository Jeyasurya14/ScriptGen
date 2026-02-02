import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ScriptGen – YouTube Script Generator",
    short_name: "ScriptGen",
    description: "Generate high-converting YouTube scripts with AI. Tamil, Hindi, English, Thunglish. SEO, chapters, B-roll, shorts.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/logo-sg.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["productivity", "business"],
  };
}
