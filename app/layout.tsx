import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from "next/script";

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://scriptgen.learnmade.in";
const siteName = "ScriptGen";
const siteTitle = "ScriptGen — AI Script Writer & YouTube Script Generator";
const siteDescription =
  "ScriptGen is an AI script writer and YouTube script generator. Generate production-ready video scripts with SEO, B-Roll, Shorts extraction & 4-stage AI pipeline. Free to start. Supports English, Tamil, Thanglish, Hindi.";

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
    // Primary high-volume
    "AI script writer",
    "YouTube script writer",
    "script writer online",
    "AI script generator",
    "YouTube script generator",
    "free script generator",
    "video script writer",
    "script writing tool",
    // Secondary
    "online script writer",
    "AI video script generator",
    "YouTube script writing",
    "auto script generator",
    "script generator AI",
    "content script generator",
    "YouTube content creator tools",
    "video script generator free",
    "AI content writer for YouTube",
    // Niche / long-tail
    "tamil script generator",
    "thanglish AI generator",
    "tamil youtube creator tools",
    "thanglish content creator",
    "hindi script generator",
    "multilingual script generator",
    "B-roll script generator",
    "YouTube SEO script writer",
    "ScriptGen",
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
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "ScriptGen — AI Script Writer & YouTube Script Generator",
    description: "AI script writer for YouTube creators. Generate professional scripts with SEO, B-Roll, chapters & Shorts extraction. English, Tamil, Thanglish, Hindi. Free to start.",
    siteName,
    locale: "en_IN",
    images: [
      { url: "/og-scriptgen.png", width: 1200, height: 630, alt: "ScriptGen – AI YouTube Script Writer" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-scriptgen.png"],
    creator: "@scriptgen_ai",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

// Global Organization + WebSite JSON-LD for AI entity recognition
const globalJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "ScriptGen",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo-sg.svg`,
    },
    description: "ScriptGen is an AI script writer and YouTube script generator that helps content creators generate production-ready video scripts with SEO, B-Roll suggestions, chapter timestamps, and Shorts extraction.",
    foundingDate: "2024",
    sameAs: [
      "https://twitter.com/scriptgen_ai",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English", "Tamil", "Hindi"],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "ScriptGen",
    description: "AI script writer and YouTube script generator. Generate professional video scripts with SEO, B-Roll, chapters, and Shorts extraction.",
    publisher: { "@id": `${siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/generate?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
              `,
            }}
          />
        )}
      </head>
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
                  background: "#161616",
                  color: "#e8e8e8",
                  border: "1px solid #252525",
                  fontSize: "13px",
                },
              }}
            />
          </AuthProvider>
        </ErrorBoundary>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
