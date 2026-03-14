import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";
const siteName = "ScriptGen";
const siteTitle = "ScriptGen — AI YouTube Script Generator";
const siteDescription =
  "Generate high-converting YouTube scripts with AI in minutes. English, Tamil, Thanglish, Hindi. SEO, chapters, B-roll, shorts. 50 free tokens. Start free.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/logo-sg.svg",
    shortcut: "/logo-sg.svg",
    apple: "/logo-sg.svg",
  },
  title: {
    default: siteTitle,
    template: "%s | ScriptGen",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "script generator",
    "AI script generator",
    "YouTube script generator",
    "AI script writer",
    "scriptwriter ai",
    "video script generator free",
    "free script generator",
    "AI YouTube script generator",
    "video script maker",
    "content script generator",
    "script writing software",
    "automated script generator",
    "Tamil script generator",
    "Hindi script generator",
    "multilingual script generator",
    "YouTube SEO tools",
    "video content creator",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName,
    locale: "en_IN",
    images: [
      { url: "/og-scriptgen.png", width: 1200, height: 630, alt: "ScriptGen – YouTube Script Generator" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-scriptgen.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${dmSans.variable} font-body antialiased bg-bg text-white`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
