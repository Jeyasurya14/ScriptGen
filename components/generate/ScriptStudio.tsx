"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Copy, Download, LoaderCircle, Save, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import type { GenerateRequest, ScriptStages, SEOPack } from "@/types";
import {
  ASSET_OPTIONS,
  buildTimestamps,
  ChapterItem,
  CONTENT_TYPE_OPTIONS,
  EMPTY_STAGES,
  getMinutesForLength,
  ImagePromptItem,
  LANGUAGE_OPTIONS,
  mapContentTypeToLegacy,
  mapLanguageToLegacy,
  normalizeBroll,
  normalizeChapters,
  normalizeImagePrompts,
  normalizeSeo,
  normalizeShorts,
  parseSavedStages,
  serializeStages,
  ShortItem,
  STAGE_LABELS,
  STAGE_ORDER,
  STORAGE_KEY,
  VIDEO_LENGTH_OPTIONS,
  BRollItem,
} from "@/components/generate/helpers";

type ActiveTab = keyof ScriptStages | "seo" | "assets";

type TokenState = {
  totalTokens: number;
  canGenerate: boolean;
};

const StageContent = React.memo(function StageContent({
  value,
  loading,
}: {
  value: string;
  loading?: boolean;
}) {
  if (loading && !value) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[85%]" />
        <Skeleton className="h-3 w-[60%]" />
      </div>
    );
  }

  return <div className="whitespace-pre-wrap">{value}</div>;
});

function createInitialAssets(): GenerateRequest["assets"] {
  return {
    seo: true,
    broll: true,
    shorts: false,
    imagePrompts: false,
    tamilContext: true,
  };
}

export default function ScriptStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, update } = useSession();
  const referralHandled = useRef(false);

  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<GenerateRequest["language"]>("thanglish");
  const [tamilRatio, setTamilRatio] = useState(40);
  const [vidLength, setVidLength] = useState<GenerateRequest["vidLength"]>("medium");
  const [contentType, setContentType] = useState<GenerateRequest["contentType"]>("tutorial");
  const [assets, setAssets] = useState<GenerateRequest["assets"]>(createInitialAssets());
  const [tokenState, setTokenState] = useState<TokenState>({
    totalTokens: session?.user?.tokenBalance?.totalTokens ?? session?.user?.tokens ?? 0,
    canGenerate: true,
  });
  const [stages, setStages] = useState<ScriptStages>(EMPTY_STAGES);
  const [seo, setSeo] = useState<SEOPack | null>(null);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [broll, setBroll] = useState<BRollItem[]>([]);
  const [shorts, setShorts] = useState<ShortItem[]>([]);
  const [imagePrompts, setImagePrompts] = useState<ImagePromptItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("hook");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageLabel, setStageLabel] = useState("Ready");
  const tabs: ActiveTab[] = [...STAGE_ORDER, "seo", "assets"];

  const tokenCost =
    10 +
    (assets.seo ? 2 : 0) +
    (assets.broll ? 1 : 0) +
    (assets.shorts ? 2 : 0) +
    (assets.imagePrompts ? 2 : 0);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as {
        language?: GenerateRequest["language"];
        vidLength?: GenerateRequest["vidLength"];
      };
      if (parsed.language) setLanguage(parsed.language);
      if (parsed.vidLength) setVidLength(parsed.vidLength);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ language, vidLength }));
  }, [language, vidLength]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !isGenerating) {
        void handleGenerate();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isGenerating, topic, language, vidLength, contentType, assets, tamilRatio, tokenState.totalTokens]);

  useEffect(() => {
    void fetchCredits();
  }, [session?.user?.email]);

  useEffect(() => {
    const scriptId = searchParams.get("id");
    if (scriptId) {
      void loadSavedScript(scriptId);
    }
  }, [searchParams]);

  useEffect(() => {
    const referralCode = searchParams.get("ref");
    if (!referralCode || !session?.user?.email || referralHandled.current) return;
    referralHandled.current = true;
    void applyReferral(referralCode);
  }, [searchParams, session?.user?.email]);

  async function fetchCredits() {
    try {
      const response = await fetch("/api/credits");
      if (!response.ok) return;
      const payload = await response.json();
      setTokenState({ totalTokens: payload.totalTokens, canGenerate: payload.canGenerate });
    } catch (error) {
      console.error("Failed to fetch credits", error);
    }
  }

  async function applyReferral(code: string) {
    try {
      const response = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const payload = await response.json();
      if (response.ok) {
        toast.success(payload.message || "Referral applied!");
        await fetchCredits();
        await update();
      }
    } catch (error) {
      console.error("Referral apply failed", error);
    } finally {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("ref");
      router.replace(params.size ? `/generate?${params.toString()}` : "/generate");
    }
  }

  async function loadSavedScript(scriptId: string) {
    setIsLoadingSaved(true);
    try {
      const response = await fetch(`/api/scripts/${scriptId}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Failed to load script");

      const saved = payload.script;
      setTopic(saved.title || "");
      setStages(parseSavedStages(saved.script_content));
      setSeo(saved.seo_data ? normalizeSeo(JSON.stringify(saved.seo_data)) : null);
      setChapters(saved.chapters_data ? normalizeChapters(JSON.stringify(saved.chapters_data)) : []);
      setBroll(saved.broll_data ? normalizeBroll(JSON.stringify(saved.broll_data)) : []);
      setShorts(saved.shorts_data ? normalizeShorts(JSON.stringify(saved.shorts_data)) : []);
      setImagePrompts(saved.images_data ? normalizeImagePrompts(JSON.stringify(saved.images_data)) : []);

      const meta = saved.seo_data?.meta;
      if (meta?.language) setLanguage(meta.language);
      if (meta?.contentType) setContentType(meta.contentType);

      setIsGenerated(true);
      setActiveTab("hook");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load script");
    } finally {
      setIsLoadingSaved(false);
    }
  }

  function getBasePayload() {
    return {
      topic,
      language,
      tamilRatio: language === "thanglish" ? tamilRatio : undefined,
      vidLength,
      contentType,
      assets,
      formData: {
        title: topic,
        channelName: "",
        duration: getMinutesForLength(vidLength),
        contentType: mapContentTypeToLegacy(contentType),
        difficulty: "intermediate",
        tone: "engaging",
        language: mapLanguageToLegacy(language),
        includeCode: contentType === "tutorial" || contentType === "live-build",
        localContext: assets.tamilContext,
        generateImages: assets.imagePrompts,
        includeChapters: assets.broll,
        includeBRoll: assets.broll,
        includeShorts: assets.shorts,
        imageFormat: "landscape",
      },
      timestamps: buildTimestamps(vidLength),
    };
  }

  async function callGenerate(body: Record<string, unknown>) {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = await response.json();
    if (!response.ok) {
      const message = Array.isArray(payload.error)
        ? payload.error[0]?.message
        : payload.error;
      throw new Error(message || "Generation failed");
    }

    return payload.content as string;
  }

  async function deductTokens(count: number) {
    const response = await fetch("/api/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Failed to update credits");
    }

    setTokenState({ totalTokens: payload.totalTokens, canGenerate: payload.canGenerate });
    await update();
  }

  async function handleGenerate() {
    if (topic.trim().length < 10) {
      toast.error("Topic must be at least 10 characters.");
      return;
    }

    if (tokenState.totalTokens < tokenCost) {
      toast("⚠️ Low token balance", { icon: "⚡" });
      return;
    }

    const base = getBasePayload();
    setIsGenerating(true);
    setIsGenerated(false);
    setStages(EMPTY_STAGES);
    setSeo(null);
    setChapters([]);
    setBroll([]);
    setShorts([]);
    setImagePrompts([]);

    try {
      setCurrentStage(1);
      setStageLabel("Stage 1 of 4 — Hook & Intro");
      const hook = await callGenerate({ ...base, type: "section", stage: "hook_intro", previousContent: "" });

      setCurrentStage(2);
      setStageLabel("Stage 2 of 4 — Main Content");
      const content = await callGenerate({ ...base, type: "section", stage: "main_content", previousContent: hook });

      setCurrentStage(3);
      setStageLabel("Stage 3 of 4 — Demo & Outro");
      const outro = await callGenerate({
        ...base,
        type: "section",
        stage: "demo_outro",
        previousContent: `${hook}\n\n${content}`,
      });

      setCurrentStage(4);
      setStageLabel("Stage 4 of 4 — Production");
      const production = await callGenerate({
        ...base,
        type: "production_notes",
        fullScript: [hook, content, outro].join("\n\n"),
      });

      const nextStages = { hook, content, outro, production };
      const fullScript = serializeStages(nextStages);

      setStages(nextStages);

      if (assets.seo) {
        const seoContent = await callGenerate({ ...base, type: "seo", fullScript });
        setSeo(normalizeSeo(seoContent));
      }

      if (assets.broll) {
        const chapterContent = await callGenerate({ ...base, type: "chapters", fullScript });
        setChapters(normalizeChapters(chapterContent));
        const brollContent = await callGenerate({ ...base, type: "broll", fullScript });
        setBroll(normalizeBroll(brollContent));
      }

      if (assets.shorts) {
        const shortsContent = await callGenerate({ ...base, type: "shorts", fullScript });
        setShorts(normalizeShorts(shortsContent));
      }

      if (assets.imagePrompts) {
        const imageContent = await callGenerate({ ...base, type: "image_prompts", fullScript });
        setImagePrompts(normalizeImagePrompts(imageContent));
      }

      await deductTokens(tokenCost);
      setIsGenerated(true);
      setActiveTab("hook");
      toast.success("✨ Script generated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(false);
      setCurrentStage(0);
      await fetchCredits();
    }
  }

  async function handleSave() {
    if (!isGenerated) return;
    setIsSaving(true);

    try {
      const response = await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: topic,
          duration: getMinutesForLength(vidLength),
          contentType,
          scriptContent: serializeStages(stages),
          seoData: seo
            ? { ...seo, meta: { language, contentType } }
            : { meta: { language, contentType } },
          imagesData: imagePrompts,
          chaptersData: chapters,
          brollData: { items: broll },
          shortsData: { items: shorts },
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Failed to save script");

      toast.success("💾 Script saved!");
      if (payload.scriptId) {
        router.replace(`/generate?id=${payload.scriptId}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save script");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRegenerate() {
    if (!["hook", "content", "outro", "production"].includes(activeTab)) {
      toast.error("Choose a stage tab to regenerate.");
      return;
    }

    if (tokenState.totalTokens < 2) {
      toast("⚠️ Low token balance", { icon: "⚡" });
      return;
    }

    const base = getBasePayload();
    setIsRegenerating(true);

    try {
      let value = "";

      if (activeTab === "hook") {
        value = await callGenerate({ ...base, type: "section", stage: "hook_intro", previousContent: "" });
      } else if (activeTab === "content") {
        value = await callGenerate({ ...base, type: "section", stage: "main_content", previousContent: stages.hook });
      } else if (activeTab === "outro") {
        value = await callGenerate({
          ...base,
          type: "section",
          stage: "demo_outro",
          previousContent: `${stages.hook}\n\n${stages.content}`,
        });
      } else {
        value = await callGenerate({
          ...base,
          type: "production_notes",
          fullScript: serializeStages(stages),
        });
      }

      setStages((prev) => ({ ...prev, [activeTab]: value }));
      await deductTokens(2);
      toast.success("Stage regenerated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to regenerate stage");
    } finally {
      setIsRegenerating(false);
    }
  }

  function handleCopy() {
    let value = "";

    if (activeTab === "seo") {
      value = seo ? `${seo.description}\n\n${seo.tags.join(", ")}` : "";
    } else if (activeTab === "assets") {
      value = [
        "B-Roll",
        ...broll.map((item) => `${item.timestamp} - ${item.suggestion}`),
        "",
        "Chapters",
        ...chapters.map((item) => `${item.timestamp} - ${item.title}`),
        "",
        "Shorts",
        ...shorts.map((item) => `${item.title}: ${item.content}`),
        "",
        "Image Prompts",
        ...imagePrompts.map((item) => `${item.timestamp} - ${item.prompt}`),
      ].join("\n");
    } else {
      value = stages[activeTab];
    }

    if (!value) {
      toast.error("Nothing to copy yet.");
      return;
    }

    void navigator.clipboard.writeText(value);
    toast.success("📋 Copied to clipboard!");
  }

  function handleDownload() {
    const blob = new Blob([serializeStages(stages)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${topic || "scriptgen-script"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const canGenerate = tokenState.totalTokens >= tokenCost && topic.trim().length >= 10;

  return (
    <div className="grid min-h-[calc(100vh-60px)] gap-6 p-6 lg:grid-cols-[minmax(340px,38%)_minmax(0,1fr)]">
      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card className="max-h-[calc(100vh-96px)] overflow-hidden">
          <CardBody className="studio-scrollbar max-h-[calc(100vh-96px)] space-y-6 overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Script Settings</p>
                <h1 className="mt-2 font-head text-2xl font-bold text-white">Script settings</h1>
              </div>
              <div className="rounded-full border border-gold/20 bg-gold-bg px-3 py-1.5 text-xs font-semibold text-gold">
                ⚡ {tokenState.totalTokens}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <label htmlFor="topic" className="text-sm font-medium text-white">Video Topic *</label>
                <span className={`text-xs ${topic.length >= 480 ? "text-red" : topic.length >= 400 ? "text-gold" : "text-muted"}`}>
                  {topic.length}/500
                </span>
              </div>
              <Textarea
                id="topic"
                rows={4}
                value={topic}
                onChange={(event) => setTopic(event.target.value.slice(0, 500))}
                placeholder="e.g. FastAPI + Celery tutorial for Tamil developers — building background job queues"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Select label="Video Length" value={vidLength} onChange={(event) => setVidLength(event.target.value as GenerateRequest["vidLength"])} options={VIDEO_LENGTH_OPTIONS} />
              <Select label="Content Type" value={contentType} onChange={(event) => setContentType(event.target.value as GenerateRequest["contentType"])} options={CONTENT_TYPE_OPTIONS} />
            </div>

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Language</p>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLanguage(option.value)}
                    className={`rounded-2xl border px-4 py-3 text-sm transition ${language === option.value ? "border-accent/30 bg-accent-glow text-accent2" : "border-border2 text-muted hover:text-white"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {language === "thanglish" ? (
              <div className="rounded-3xl border border-border bg-surface2 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white">Tamil Ratio in Thanglish</p>
                  <span className="font-semibold text-accent2">{tamilRatio}%</span>
                </div>
                <input type="range" min={10} max={90} step={5} value={tamilRatio} onChange={(event) => setTamilRatio(Number(event.target.value))} className="mt-4 w-full accent-accent" />
                <div className="mt-2 flex justify-between text-xs text-muted"><span>10% Tamil</span><span>90% Tamil</span></div>
              </div>
            ) : null}

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Generate Assets</p>
              {ASSET_OPTIONS.map((asset) => (
                <label key={asset.key} className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${assets[asset.key] ? "border-accent/25 bg-accent-glow" : "border-border bg-surface"}`}>
                  <span className="text-sm text-white">{asset.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${asset.cost ? "text-gold" : "text-muted"}`}>{asset.cost ? `+${asset.cost}⚡` : "free"}</span>
                    <input type="checkbox" className="h-4 w-4 accent-accent" checked={assets[asset.key]} onChange={(event) => setAssets((prev) => ({ ...prev, [asset.key]: event.target.checked }))} />
                  </div>
                </label>
              ))}
            </div>

            <div className="rounded-3xl border border-border bg-surface2 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">Estimated Cost</p>
                <p className="text-lg font-semibold text-gold">⚡ {tokenCost} tokens</p>
              </div>
              {tokenState.totalTokens < tokenCost ? (
                <div className="mt-3 flex items-center justify-between text-sm text-red">
                  <span>⚠️ Insufficient tokens</span>
                  <button type="button" className="font-medium text-gold" onClick={() => router.push("/tokens")}>Buy Tokens →</button>
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <Button size="lg" className="w-full" disabled={!canGenerate || isGenerating} loading={isGenerating} onClick={() => void handleGenerate()}>
                <Sparkles className="h-4 w-4" />
                ✨ Generate Script
              </Button>
              <p className="text-right text-xs text-muted">⌘ Enter to generate</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div>
        <Card className="flex min-h-[calc(100vh-96px)] flex-col">
          <CardBody className="flex h-full flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Script Output</p>
                <h2 className="mt-2 font-head text-2xl font-bold text-white">Generated script and assets</h2>
              </div>
              {isGenerated ? <Badge variant="success">Ready</Badge> : null}
            </div>

            {isGenerating ? (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between text-sm text-white"><span>{stageLabel}</span><span>{currentStage}/4</span></div>
                  <div className="mt-3 h-2 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#6C63FF,#B06AFF)] transition-all" style={{ width: `${(currentStage / 4) * 100}%` }} /></div>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs text-muted">
                    {STAGE_ORDER.map((stage, index) => (
                      <div key={stage} className="space-y-2">
                        <div className={`mx-auto h-3 w-3 rounded-full ${index + 1 < currentStage ? "bg-green" : index + 1 === currentStage ? "animate-pulse bg-accent" : "border border-border2"}`} />
                        <span>{STAGE_LABELS[stage].split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-surface2 p-6 font-mono text-[13px] leading-relaxed text-white/90">
                  <StageContent value={stages[STAGE_ORDER[currentStage - 1] || "hook"]} loading />
                </div>
              </div>
            ) : null}

            {!isGenerating && !isGenerated && !isLoadingSaved ? (
              <div className="animate-border-pulse flex flex-1 flex-col items-center justify-center rounded-[32px] border border-border bg-surface2/40 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-glow text-3xl">🎬</div>
                <h3 className="mt-6 font-head text-3xl font-bold text-white">Ready to Generate</h3>
                <p className="mt-3 max-w-xl text-sm text-muted">Fill in your video details and hit Generate. ScriptGen will build your script across 4 intelligent stages.</p>
              </div>
            ) : null}

            {isLoadingSaved ? <SkeletonText lines={8} /> : null}

            {isGenerated && !isGenerating ? (
              <>
                <div className="no-scrollbar flex gap-3 overflow-x-auto border-b border-border pb-3">
                  {tabs.map((tab) => {
                    const enabled = tab === "seo" ? !!seo : tab === "assets" ? chapters.length + broll.length + shorts.length + imagePrompts.length > 0 : true;
                    return (
                      <button key={tab} type="button" disabled={!enabled} onClick={() => setActiveTab(tab as ActiveTab)} className={`whitespace-nowrap border-b-2 pb-3 text-sm transition ${activeTab === tab ? "border-accent text-white" : "border-transparent text-muted hover:text-white disabled:opacity-40"}`}>
                        {tab === "seo"
                          ? "SEO Pack"
                          : tab === "assets"
                            ? "Assets"
                            : STAGE_LABELS[tab]}
                      </button>
                    );
                  })}
                </div>

                <div className="studio-scrollbar max-h-[420px] overflow-y-auto rounded-3xl border border-border bg-surface2 p-6 font-mono text-[13px] leading-relaxed text-white/90">
                  {activeTab === "seo" ? (
                    seo ? (
                      <div className="space-y-5 font-body text-sm">
                        {seo.titles.map((title) => (
                          <div key={`${title.text}-${title.score}`} className="rounded-2xl border border-border bg-surface p-4">
                            <div className="flex items-center justify-between gap-4">
                              <p className="font-medium text-white">{title.text}</p>
                              <span className="text-green">Score: {title.score}</span>
                            </div>
                            <div className="mt-3 h-2 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#3FFFA2,#7DFFBF)]" style={{ width: `${Math.min(100, title.score)}%` }} /></div>
                          </div>
                        ))}
                        <div className="rounded-2xl border border-border bg-surface p-4"><p className="text-white/90">{seo.description}</p></div>
                        <div className="flex flex-wrap gap-2">{seo.tags.map((tag) => <span key={tag} className="rounded-full border border-border2 bg-surface px-3 py-1 text-xs text-muted">{tag}</span>)}</div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted">Generate an SEO pack to see results.</p>
                    )
                  ) : activeTab === "assets" ? (
                    <div className="space-y-7 font-body text-sm">
                      <div><p className="text-[11px] uppercase tracking-[0.18em] text-muted">B-Roll List</p><div className="mt-3 space-y-3">{broll.length ? broll.map((item, index) => <div key={`${item.timestamp}-${index}`} className="rounded-2xl border border-border bg-surface p-4"><span className="text-gold">{item.timestamp}</span><p className="mt-2 text-white">{item.suggestion}</p></div>) : <p className="text-muted">No B-Roll items yet.</p>}</div></div>
                      <div><p className="text-[11px] uppercase tracking-[0.18em] text-muted">Chapter Markers</p><div className="mt-3 space-y-3">{chapters.length ? chapters.map((item) => <div key={`${item.timestamp}-${item.title}`} className="rounded-2xl border border-border bg-surface p-4"><span className="text-accent2">{item.timestamp}</span><p className="mt-2 text-white">{item.title}</p>{item.description ? <p className="mt-1 text-muted">{item.description}</p> : null}</div>) : <p className="text-muted">No chapter markers yet.</p>}</div></div>
                      <div><p className="text-[11px] uppercase tracking-[0.18em] text-muted">Viral Clips</p><div className="mt-3 grid gap-3 md:grid-cols-2">{shorts.length ? shorts.map((item, index) => <div key={`${item.title}-${index}`} className="rounded-2xl border border-border bg-surface p-4"><span className="text-xs uppercase tracking-[0.12em] text-red">Short</span><p className="mt-2 text-white">{item.title}</p><p className="mt-2 italic text-muted">{item.content}</p></div>) : <p className="text-muted">No shorts yet.</p>}</div></div>
                      <div><p className="text-[11px] uppercase tracking-[0.18em] text-muted">AI Image Prompts</p><div className="mt-3 space-y-3">{imagePrompts.length ? imagePrompts.map((item, index) => <div key={`${item.timestamp}-${index}`} className="rounded-2xl border border-border bg-surface p-4"><span className="text-accent2">{item.timestamp}</span><p className="mt-2 italic text-white">{item.prompt}</p></div>) : <p className="text-muted">No image prompts yet.</p>}</div></div>
                    </div>
                  ) : (
                    <StageContent value={stages[activeTab]} />
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={handleCopy} aria-label="Copy current content"><Copy className="h-4 w-4" />Copy Stage</Button>
                    <Button variant="ghost" onClick={handleDownload} aria-label="Download script"><Download className="h-4 w-4" />Download .txt</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => void handleRegenerate()} disabled={isRegenerating} aria-label="Regenerate current stage">{isRegenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}Regenerate</Button>
                    <Button onClick={() => void handleSave()} loading={isSaving} aria-label="Save script"><Save className="h-4 w-4" />Save</Button>
                  </div>
                </div>
              </>
            ) : null}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
