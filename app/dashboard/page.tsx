import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { toTokenBalance } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function getFirstName(name?: string | null) {
  if (!name) return "there";
  return name.split(" ")[0] || "there";
}

function extractAverageSeoScore(seoData: unknown): number | null {
  if (!seoData || typeof seoData !== "object") return null;
  const titles = (seoData as { titles?: Array<{ score?: unknown }> }).titles;
  if (!Array.isArray(titles) || titles.length === 0) return null;
  const scores = titles.map((t) => (typeof t?.score === "number" ? t.score : null)).filter((s): s is number => s !== null);
  return scores.length === 0 ? null : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function extractLanguage(seoData: unknown) {
  if (!seoData || typeof seoData !== "object") return null;
  const lang = (seoData as { meta?: { language?: unknown } }).meta?.language;
  return typeof lang === "string" && lang.length > 0 ? lang : null;
}

function extractShortsCount(shortsData: unknown) {
  if (!shortsData) return 0;
  if (Array.isArray(shortsData)) return shortsData.length;
  if (typeof shortsData === "object" && shortsData !== null) {
    const items = (shortsData as { items?: unknown[] }).items;
    if (Array.isArray(items)) return items.length;
  }
  return 0;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/");

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        credits: true,
        scripts: {
          select: { id: true, title: true, seoData: true, shortsData: true, scriptContent: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (e) {
    console.error("[dashboard] DB error:", e);
  }

  const scripts = user?.scripts ?? [];
  const tokenBalance = user?.credits ? toTokenBalance(user.credits) : null;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyCount = scripts.filter((s) => s.createdAt >= weekAgo).length;
  const seoScores = scripts.map((s) => extractAverageSeoScore(s.seoData)).filter((s): s is number => s !== null);
  const avgSeo = seoScores.length > 0 ? Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length) : null;
  const totalShorts = scripts.reduce((t, s) => t + extractShortsCount(s.shortsData), 0);
  const tokens = tokenBalance?.totalTokens ?? 0;
  const recentScripts = scripts.slice(0, 10);

  const stats = [
    { label: "Scripts", value: scripts.length, sub: `${weeklyCount} this week` },
    { label: "Tokens left", value: tokens, sub: `~${Math.floor(tokens / 10)} scripts remaining`, warn: tokens < 10 },
    { label: "Avg SEO score", value: avgSeo !== null ? avgSeo : "—", sub: "Average across all scripts" },
    { label: "Shorts extracted", value: totalShorts, sub: "Clip-ready moments" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white">Hello, {getFirstName(session.user.name)}</h1>
        <p className="mt-0.5 text-sm text-muted">Here&apos;s an overview of your ScriptGen activity.</p>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-2 gap-px border border-border bg-border xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-bg px-5 py-4">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="mt-1.5 text-2xl font-semibold text-white">{s.value}</p>
            <p className="mt-1 text-xs text-hint">{s.sub}</p>
            {s.warn && <p className="mt-1 text-[10px] font-medium text-gold">Low balance</p>}
          </div>
        ))}
      </div>

      {/* Recent scripts */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent scripts</h2>
          <Link href="/generate" className="text-xs text-accent2 hover:underline">New script →</Link>
        </div>

        {recentScripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded border border-border bg-surface py-14 text-center">
            <p className="text-sm font-medium text-white">No scripts yet</p>
            <p className="mt-1.5 max-w-xs text-xs text-muted">Generate your first script to see it here.</p>
            <Link href="/generate" className="mt-4">
              <Button size="sm">Generate now</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded border border-border">
            {/* Table head */}
            <div className="grid grid-cols-[1fr_100px_80px_120px_70px] border-b border-border bg-surface px-4 py-2 text-[11px] font-medium text-muted">
              <span>Title</span>
              <span>Language</span>
              <span>SEO</span>
              <span>Created</span>
              <span>Status</span>
            </div>

            {recentScripts.map((script, i) => {
              const seoScore = extractAverageSeoScore(script.seoData);
              const language = extractLanguage(script.seoData);
              const isDone = !!script.scriptContent;
              const seoColor = seoScore === null ? "text-hint" : seoScore >= 80 ? "text-green" : seoScore >= 60 ? "text-gold" : "text-red";

              return (
                <div
                  key={script.id}
                  className={`grid grid-cols-[1fr_100px_80px_120px_70px] items-center gap-4 px-4 py-3 text-sm transition-colors hover:bg-surface ${i < recentScripts.length - 1 ? "border-b border-border" : ""}`}
                >
                  <Link href={`/generate?id=${script.id}`} className="truncate text-sm text-white hover:text-accent2">
                    {script.title}
                  </Link>
                  <span className="truncate text-xs text-muted capitalize">{language ?? "—"}</span>
                  <span className={`text-xs font-medium ${seoColor}`}>{seoScore ?? "—"}</span>
                  <span className="text-xs text-muted">{formatDistanceToNow(script.createdAt, { addSuffix: true })}</span>
                  <Badge variant={isDone ? "success" : "draft"}>{isDone ? "Done" : "Draft"}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
