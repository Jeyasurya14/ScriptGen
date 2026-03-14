"use client";

import dynamic from "next/dynamic";

const ScriptGenerator = dynamic(() => import("../ScriptGenerator"), {
  ssr: false,
});

export default function ClientPage() {
  return <ScriptGenerator />;
}
