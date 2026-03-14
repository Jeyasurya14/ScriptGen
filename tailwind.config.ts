import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080B14",
        surface: "#0E1220",
        surface2: "#141826",
        accent: "#6C63FF",
        accent2: "#8B84FF",
        "accent-glow": "rgba(108,99,255,0.15)",
        gold: "#FFB547",
        "gold-bg": "rgba(255,181,71,0.1)",
        green: "#3FFFA2",
        "green-bg": "rgba(63,255,162,0.08)",
        red: "#FF5C7A",
        "red-bg": "rgba(255,92,122,0.1)",
        border: "rgba(255,255,255,0.07)",
        border2: "rgba(255,255,255,0.13)",
        muted: "#8B92B8",
        hint: "#555C80",
      },
      fontFamily: {
        head: ["var(--font-head)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(108,99,255,0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(108,99,255,0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
