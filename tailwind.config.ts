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
        bg: '#080B14',
        surface: '#0E1220',
        surface2: '#141826',
        accent: '#6C63FF',
        accent2: '#8B84FF',
        gold: '#FFB547',
        green: '#3FFFA2',
        red: '#FF5C7A',
      },
      fontFamily: {
        head: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
