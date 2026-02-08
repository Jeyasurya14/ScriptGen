import { Suspense } from "react";
import ScriptGenerator from "../ScriptGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Scripts",
  description: "Create YouTube scripts with AI. Generate script, SEO, chapters, B-roll, and shorts. English, Tamil, Thanglish, Hindi. Sign in to start.",
  openGraph: { title: "Create Scripts | ScriptGen", description: "Generate YouTube scripts with AI in minutes." },
  robots: { index: true, follow: true },
};

export default function AppPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50/80">
        <div className="flex flex-col items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">SG</span>
          </div>
          <div className="loader" />
          <p className="text-slate-500 text-sm font-medium">Loading…</p>
        </div>
      </div>
    }>
      <ScriptGenerator />
    </Suspense>
  );
}
