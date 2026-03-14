import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

const ScriptGenerator = dynamic(() => import("../ScriptGenerator"), {
  ssr: false,
});

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "Create Scripts",
  description: "Create YouTube scripts with AI. Generate script, SEO, chapters, B-roll, and shorts. English, Tamil, Thanglish, Hindi. Sign in to start.",
  alternates: { canonical: `${siteUrl}/app` },
  openGraph: { title: "Create Scripts | ScriptGen", description: "Generate YouTube scripts with AI in minutes." },
  robots: { index: true, follow: true },
};

export default function AppPage() {
  return (
    <div className="bg-bg min-h-screen">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg">
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-surface2 flex items-center justify-center animate-pulse">
              <span className="text-accent font-head font-black text-xl">SG</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 rounded-full bg-accent animate-bounce"></div>
            </div>
          </div>
        </div>
      }>
        <ScriptGenerator />
      </Suspense>
    </div>
  );
}

