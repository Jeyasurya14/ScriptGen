import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const syne = Syne({
  variable: "--font-head",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";
const siteName = "ScriptGen";
const siteTitle = "ScriptGen — AI YouTube Script Generator for Tamil Creators";
const siteDescription =
  "Generate production-ready YouTube scripts in Thanglish, Tamil, Hindi, or English. SEO pack, B-Roll list, Shorts extraction, and 4 intelligent AI stages.";

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
    "youtube script generator",
    "tamil creator tools",
    "thanglish ai",
    "scriptgen",
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
    title: "ScriptGen — AI YouTube Script Generator",
    description: "Built for Tamil YouTube creators. Thanglish engine, SEO pack, 4-stage AI pipeline.",
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
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-bg font-body text-white antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#0E1220",
                  color: "#F0F2FF",
                  border: "1px solid rgba(255,255,255,0.07)",
                },
              }}
            />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
