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
  if (!name) return "Creator";
  return name.split(" ")[0] || "Creator";
}

function extractAverageSeoScore(seoData: unknown): number | null {
  if (!seoData || typeof seoData !== "object") return null;
  const titles = (seoData as { titles?: Array<{ score?: unknown }> }).titles;
  if (!Array.isArray(titles) || titles.length === 0) return null;
  const scores = titles
    .map((title) => (typeof title?.score === "number" ? title.score : null))
    .filter((score): score is number => score !== null);
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);
}

function extractLanguage(seoData: unknown) {
  if (!seoData || typeof seoData !== "object") return "Unknown";
  const metaLanguage = (seoData as { meta?: { language?: unknown } }).meta?.language;
  return typeof metaLanguage === "string" && metaLanguage.length > 0 ? metaLanguage : "Unknown";
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

function getLanguageBadge(language: string) {
  const n = language.toLowerCase();
  if (n === "thanglish") return "border border-accent/20 bg-accent/10 text-accent2";
  if (n === "english") return "border border-sky-400/20 bg-sky-400/10 text-sky-300";
  if (n === "hindi") return "border border-orange-400/20 bg-orange-400/10 text-orange-300";
  if (n === "tamil") return "border border-green/20 bg-green-bg text-green";
  return "border border-border2 bg-surface2 text-muted";
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      credits: true,
      scripts: {
        select: {
          id: true,
          title: true,
          seoData: true,
          shortsData: true,
          scriptContent: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const scripts = user?.scripts ?? [];
  const recentScripts = scripts.slice(0, 10);
  const tokenBalance = user?.credits ? toTokenBalance(user.credits) : null;
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyScripts = scripts.filter((s) => s.createdAt >= oneWeekAgo).length;

  const seoScores = scripts
    .map((s) => extractAverageSeoScore(s.seoData))
    .filter((sc): sc is number => sc !== null);
  const averageSeoScore =
    seoScores.length > 0
      ? Math.round(seoScores.reduce((t, s) => t + s, 0) / seoScores.length)
      : 0;

  const shortsExtracted = scripts.reduce((t, s) => t + extractShortsCount(s.shortsData), 0);
  const tokensRemaining = tokenBalance?.totalTokens ?? 0;

  const stats = [
    { label: "Scripts Generated", value: scripts.length, subtext: `+${weeklyScripts} this week`, color: "text-accent2" },
    { label: "Tokens Remaining", value: tokensRemaining, subtext: `~${Math.floor(tokensRemaining / 10)} scripts left`, color: "text-gold", low: tokensRemaining < 10 },
    { label: "Avg SEO Score", value: averageSeoScore, subtext: "Out of 100", color: "text-green", showBar: true },
    { label: "Shorts Extracted", value: shortsExtracted, subtext: "Auto-clipped highlights", color: "text-red" },
  ];

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-xl font-semibold text-white">
          Good morning, {getFirstName(session.user.name)} 👋
        </h1>
        <p className="mt-1 text-sm text-muted">Here&apos;s your content overview.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-muted">{stat.label}</p>
              {stat.low ? (
                <Badge variant="draft" className="text-red">Low</Badge>
              ) : null}
            </div>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-xs text-muted">{stat.subtext}</p>
            {stat.showBar ? (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface2">
                <div
                  className="h-full rounded-full bg-green/60"
                  style={{ width: `${Math.min(100, averageSeoScore)}%` }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Recent Scripts */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Scripts</h2>
            <p className="mt-0.5 text-xs text-muted">Your latest generated work.</p>
          </div>
          <Link href="/generate" className="text-xs font-medium text-accent2 hover:underline">
            New Script →
          </Link>
        </div>

        {recentScripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface py-16 text-center">
            <h3 className="text-base font-semibold text-white">No scripts yet</h3>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Generate your first script to see it here.
            </p>
            <Link href="/generate" className="mt-4">
              <Button>Start Generating</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] border-b border-border bg-surface px-4 py-2.5 text-xs font-medium text-muted">
              <span>Title</span>
              <span>Language</span>
              <span>SEO Score</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            {recentScripts.map((script, index) => {
              const seoScore = extractAverageSeoScore(script.seoData);
              const language = extractLanguage(script.seoData);
              const seoTone =
                seoScore === null ? "text-muted" : seoScore >= 80 ? "text-green" : seoScore >= 60 ? "text-gold" : "text-red";
              const status = script.scriptContent ? "Done" : "Draft";

              return (
                <div
                  key={script.id}
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_80px] items-center gap-4 px-4 py-3 text-sm transition hover:bg-surface2 ${index < recentScripts.length - 1 ? "border-b border-border" : ""}`}
                >
                  <Link href={`/generate?id=${script.id}`} className="truncate font-medium text-white hover:text-accent2">
                    {script.title}
                  </Link>
                  <span className={`inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-medium ${getLanguageBadge(language)}`}>
                    {language}
                  </span>
                  <span className={`text-sm ${seoTone}`}>{seoScore ?? "—"}</span>
                  <span className="text-xs text-muted">
                    {formatDistanceToNow(script.createdAt, { addSuffix: true })}
                  </span>
                  <span>
                    <Badge variant={status === "Done" ? "success" : "draft"}>{status}</Badge>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
