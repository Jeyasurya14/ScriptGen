import ScriptGenerator from "../ScriptGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Scripts",
  description: "Create YouTube scripts with AI. Generate script, SEO, chapters, B-roll, and shorts. Tamil, Hindi, English, Thunglish. Sign in to start.",
  openGraph: { title: "Create Scripts | ScriptGen", description: "Generate YouTube scripts with AI in minutes." },
  robots: { index: true, follow: true },
};

export default function AppPage() {
  return <ScriptGenerator />;
}
