import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { toTokenBalance } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

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
  const normalized = language.toLowerCase();

  if (normalized === "thanglish") return "border border-accent/20 bg-accent-glow text-accent2";
  if (normalized === "english") return "border border-sky-400/20 bg-sky-400/10 text-sky-300";
  if (normalized === "hindi") return "border border-orange-400/20 bg-orange-400/10 text-orange-300";
  if (normalized === "tamil") return "border border-green/20 bg-green-bg text-green";

  return "border border-border2 bg-surface2 text-muted";
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

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
  const weeklyScripts = scripts.filter((script) => script.createdAt >= oneWeekAgo).length;

  const seoScores = scripts
    .map((script) => extractAverageSeoScore(script.seoData))
    .filter((score): score is number => score !== null);
  const averageSeoScore =
    seoScores.length > 0
      ? Math.round(seoScores.reduce((total, score) => total + score, 0) / seoScores.length)
      : 0;

  const shortsExtracted = scripts.reduce((total, script) => total + extractShortsCount(script.shortsData), 0);
  const tokensRemaining = tokenBalance?.totalTokens ?? 0;

  const stats = [
    {
      label: "Scripts Generated",
      value: scripts.length,
      subtext: `+${weeklyScripts} this week`,
      accent: "text-accent2",
    },
    {
      label: "Tokens Remaining",
      value: tokensRemaining,
      subtext: `~${Math.floor(tokensRemaining / 10)} full scripts left`,
      accent: "text-gold",
      low: tokensRemaining < 10,
    },
    {
      label: "Avg SEO Score",
      value: averageSeoScore,
      subtext: "Out of 100",
      accent: "text-green",
    },
    {
      label: "Shorts Extracted",
      value: shortsExtracted,
      subtext: "Auto-clipped highlights",
      accent: "text-red",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-8">
      <div className="mb-8">
        <h1 className="font-head text-3xl font-bold text-white">
          Good morning, {getFirstName(session.user.name)} 👋
        </h1>
        <p className="mt-2 text-sm text-muted">Here&apos;s your content overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{stat.label}</p>
                {stat.low ? <Badge variant="draft" className="text-red">Low balance</Badge> : null}
              </div>
              <p className={`font-head text-4xl font-bold ${stat.accent}`}>
                {stat.label === "Avg SEO Score" ? `${stat.value}` : stat.value}
              </p>
              <p className="text-sm text-muted">{stat.subtext}</p>
              {stat.label === "Avg SEO Score" ? (
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#3FFFA2,#7DFFBF)]"
                    style={{ width: `${Math.min(100, averageSeoScore)}%` }}
                  />
                </div>
              ) : null}
            </CardBody>
          </Card>
        ))}
      </div>

      <section id="recent-scripts" className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-head text-2xl font-semibold text-white">Recent Scripts</h2>
            <p className="text-sm text-muted">Your latest generated work, ready to reopen and refine.</p>
          </div>
          <Link href="/generate" className="text-sm font-medium text-accent2 underline-offset-4 hover:underline">
            View All
          </Link>
        </div>

        {recentScripts.length === 0 ? (
          <Card>
            <CardBody className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <h3 className="font-head text-2xl font-semibold text-white">No scripts yet</h3>
              <p className="max-w-md text-sm text-muted">
                Your dashboard will light up as soon as you generate your first script.
              </p>
              <Link href="/generate">
                <Button>Start Generating</Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-border bg-surface">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] border-b border-border px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-muted">
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
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_80px] items-center gap-4 px-4 py-4 text-sm ${index < recentScripts.length - 1 ? "border-b border-border" : ""} hover:bg-surface2/70`}
                >
                  <Link href={`/generate?id=${script.id}`} className="truncate font-medium text-white transition hover:text-accent2">
                    {script.title}
                  </Link>
                  <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${getLanguageBadge(language)}`}>
                    {language}
                  </span>
                  <span className={seoTone}>{seoScore ?? "—"}</span>
                  <span className="text-muted">
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
