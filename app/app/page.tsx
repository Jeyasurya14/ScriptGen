import { Suspense } from "react";
import ScriptGenerator from "../ScriptGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Scripts",
  description: "Create YouTube scripts with AI. Generate script, SEO, chapters, B-roll, and shorts. Tamil, Hindi, English, Thunglish. Sign in to start.",
  openGraph: { title: "Create Scripts | ScriptGen", description: "Generate YouTube scripts with AI in minutes." },
  robots: { index: true, follow: true },
};

export default function AppPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse text-slate-400">Loading...</div></div>}>
      <ScriptGenerator />
    </Suspense>
  );
}
