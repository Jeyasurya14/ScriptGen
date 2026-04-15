"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Copy, Download, LoaderCircle, RotateCcw, Save, Sparkles, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { SkeletonText } from "@/components/ui/Skeleton";
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
type TokenState = { totalTokens: number; canGenerate: boolean };

const StageContent = React.memo(function StageContent({ value, loading }: { value: string; loading?: boolean }) {
  if (loading && !value) return <SkeletonText lines={6} />;
  return <div className="whitespace-pre-wrap">{value}</div>;
});

function createInitialAssets(): GenerateRequest["assets"] {
  return { seo: true, broll: true, shorts: false, imagePrompts: false, tamilContext: true };
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
      const p = JSON.parse(stored) as { language?: GenerateRequest["language"]; vidLength?: GenerateRequest["vidLength"] };
      if (p.language) setLanguage(p.language);
      if (p.vidLength) setVidLength(p.vidLength);
    } catch { window.localStorage.removeItem(STORAGE_KEY); }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ language, vidLength }));
  }, [language, vidLength]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isGenerating) void handleGenerate();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isGenerating, topic, language, vidLength, contentType, assets, tamilRatio, tokenState.totalTokens]);

  useEffect(() => { void fetchCredits(); }, [session?.user?.email]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) void loadSavedScript(id);
  }, [searchParams]);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref || !session?.user?.email || referralHandled.current) return;
    referralHandled.current = true;
    void applyReferral(ref);
  }, [searchParams, session?.user?.email]);

  async function fetchCredits() {
    try {
      const r = await fetch("/api/credits");
      if (!r.ok) return;
      const p = await r.json();
      setTokenState({ totalTokens: p.totalTokens, canGenerate: p.canGenerate });
    } catch (e) { console.error(e); }
  }

  async function applyReferral(code: string) {
    try {
      const r = await fetch("/api/referral", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const p = await r.json();
      if (r.ok) { toast.success(p.message || "Referral applied!"); await fetchCredits(); await update(); }
    } catch (e) { console.error(e); } finally {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("ref");
      router.replace(params.size ? `/generate?${params.toString()}` : "/generate");
    }
  }

  async function loadSavedScript(scriptId: string) {
    setIsLoadingSaved(true);
    try {
      const r = await fetch(`/api/scripts/${scriptId}`);
      const p = await r.json();
      if (!r.ok) throw new Error(p.error || "Failed to load");
      const s = p.script;
      setTopic(s.title || "");
      setStages(parseSavedStages(s.script_content));
      setSeo(s.seo_data ? normalizeSeo(JSON.stringify(s.seo_data)) : null);
      setChapters(s.chapters_data ? normalizeChapters(JSON.stringify(s.chapters_data)) : []);
      setBroll(s.broll_data ? normalizeBroll(JSON.stringify(s.broll_data)) : []);
      setShorts(s.shorts_data ? normalizeShorts(JSON.stringify(s.shorts_data)) : []);
      setImagePrompts(s.images_data ? normalizeImagePrompts(JSON.stringify(s.images_data)) : []);
      const meta = s.seo_data?.meta;
      if (meta?.language) setLanguage(meta.language);
      if (meta?.contentType) setContentType(meta.contentType);
      setIsGenerated(true);
      setActiveTab("hook");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to load script"); }
    finally { setIsLoadingSaved(false); }
  }

  function getBasePayload() {
    return {
      topic, language,
      tamilRatio: language === "thanglish" ? tamilRatio : undefined,
      vidLength, contentType, assets,
      formData: {
        title: topic, channelName: "",
        duration: getMinutesForLength(vidLength),
        contentType: mapContentTypeToLegacy(contentType),
        difficulty: "intermediate", tone: "engaging",
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
    const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const p = await r.json();
    if (!r.ok) throw new Error(Array.isArray(p.error) ? p.error[0]?.message : p.error || "Generation failed");
    return p.content as string;
  }

  async function deductTokens(count: number) {
    const r = await fetch("/api/credits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ count }) });
    const p = await r.json();
    if (!r.ok) throw new Error(p.error || "Failed to update credits");
    setTokenState({ totalTokens: p.totalTokens, canGenerate: p.canGenerate });
    await update();
  }

  async function handleGenerate() {
    if (topic.trim().length < 10) { toast.error("Topic must be at least 10 characters."); return; }
    if (tokenState.totalTokens < tokenCost) { toast.error("Insufficient tokens."); return; }
    const base = getBasePayload();
    setIsGenerating(true); setIsGenerated(false); setStages(EMPTY_STAGES); setSeo(null); setChapters([]); setBroll([]); setShorts([]); setImagePrompts([]);
    try {
      setCurrentStage(1); setStageLabel("Stage 1 — Hook & Intro");
      const hook = await callGenerate({ ...base, type: "section", stage: "hook_intro", previousContent: "" });
      setCurrentStage(2); setStageLabel("Stage 2 — Main Content");
      const content = await callGenerate({ ...base, type: "section", stage: "main_content", previousContent: hook });
      setCurrentStage(3); setStageLabel("Stage 3 — Demo & Outro");
      const outro = await callGenerate({ ...base, type: "section", stage: "demo_outro", previousContent: `${hook}\n\n${content}` });
      setCurrentStage(4); setStageLabel("Stage 4 — Production");
      const production = await callGenerate({ ...base, type: "production_notes", fullScript: [hook, content, outro].join("\n\n") });
      const nextStages = { hook, content, outro, production };
      const fullScript = serializeStages(nextStages);
      setStages(nextStages);
      if (assets.seo) { setSeo(normalizeSeo(await callGenerate({ ...base, type: "seo", fullScript }))); }
      if (assets.broll) {
        setChapters(normalizeChapters(await callGenerate({ ...base, type: "chapters", fullScript })));
        setBroll(normalizeBroll(await callGenerate({ ...base, type: "broll", fullScript })));
      }
      if (assets.shorts) { setShorts(normalizeShorts(await callGenerate({ ...base, type: "shorts", fullScript }))); }
      if (assets.imagePrompts) { setImagePrompts(normalizeImagePrompts(await callGenerate({ ...base, type: "image_prompts", fullScript }))); }
      await deductTokens(tokenCost);
      setIsGenerated(true); setActiveTab("hook");
      toast.success("Script generated successfully.");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Generation failed"); }
    finally { setIsGenerating(false); setCurrentStage(0); await fetchCredits(); }
  }

  async function handleSave() {
    if (!isGenerated) return;
    setIsSaving(true);
    try {
      const r = await fetch("/api/scripts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: topic, duration: getMinutesForLength(vidLength), contentType,
          scriptContent: serializeStages(stages),
          seoData: seo ? { ...seo, meta: { language, contentType } } : { meta: { language, contentType } },
          imagesData: imagePrompts, chaptersData: chapters, brollData: { items: broll }, shortsData: { items: shorts },
        }),
      });
      const p = await r.json();
      if (!r.ok) throw new Error(p.error || "Failed to save");
      toast.success("Script saved.");
      if (p.scriptId) router.replace(`/generate?id=${p.scriptId}`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
    finally { setIsSaving(false); }
  }

  async function handleRegenerate() {
    if (!["hook", "content", "outro", "production"].includes(activeTab)) { toast.error("Select a stage tab first."); return; }
    if (tokenState.totalTokens < 2) { toast.error("Insufficient tokens."); return; }
    const base = getBasePayload();
    setIsRegenerating(true);
    try {
      let value = "";
      if (activeTab === "hook") value = await callGenerate({ ...base, type: "section", stage: "hook_intro", previousContent: "" });
      else if (activeTab === "content") value = await callGenerate({ ...base, type: "section", stage: "main_content", previousContent: stages.hook });
      else if (activeTab === "outro") value = await callGenerate({ ...base, type: "section", stage: "demo_outro", previousContent: `${stages.hook}\n\n${stages.content}` });
      else value = await callGenerate({ ...base, type: "production_notes", fullScript: serializeStages(stages) });
      setStages((prev) => ({ ...prev, [activeTab]: value }));
      await deductTokens(2);
      toast.success("Stage regenerated.");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Regeneration failed"); }
    finally { setIsRegenerating(false); }
  }

  function handleCopy() {
    let value = "";
    if (activeTab === "seo") {
      value = seo ? `${seo.description}\n\n${seo.tags.join(", ")}` : "";
    } else if (activeTab === "assets") {
      value = ["B-Roll", ...broll.map((i) => `${i.timestamp} — ${i.suggestion}`), "", "Chapters", ...chapters.map((i) => `${i.timestamp} — ${i.title}`), "", "Shorts", ...shorts.map((i) => `${i.title}: ${i.content}`), "", "Image Prompts", ...imagePrompts.map((i) => `${i.timestamp} — ${i.prompt}`)].join("\n");
    } else {
      value = stages[activeTab];
    }
    if (!value) { toast.error("Nothing to copy."); return; }
    void navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard.");
  }

  function handleDownload() {
    const blob = new Blob([serializeStages(stages)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${topic || "script"}.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  const canGenerate = tokenState.totalTokens >= tokenCost && topic.trim().length >= 10;

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">

      {/* ── Settings panel ─────────────────────────────── */}
      <div className="flex w-72 shrink-0 flex-col border-r border-border bg-bg overflow-y-auto">
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-medium text-white">Script Settings</span>
          <div className="flex items-center gap-1 text-xs text-muted">
            <Zap className="h-3 w-3 text-gold" />
            <span className="font-medium text-white">{tokenState.totalTokens}</span>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-4">

          {/* Topic */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="topic" className="text-xs font-medium text-muted">Video Topic</label>
              <span className={`text-[10px] tabular-nums ${topic.length >= 480 ? "text-red" : "text-hint"}`}>{topic.length}/500</span>
            </div>
            <Textarea
              id="topic"
              rows={4}
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 500))}
              placeholder="e.g. FastAPI + Celery tutorial for building background job queues in Tamil"
            />
          </div>

          {/* Length + Type */}
          <div className="grid grid-cols-2 gap-3">
            <Select label="Length" value={vidLength} onChange={(e) => setVidLength(e.target.value as GenerateRequest["vidLength"])} options={VIDEO_LENGTH_OPTIONS} />
            <Select label="Type" value={contentType} onChange={(e) => setContentType(e.target.value as GenerateRequest["contentType"])} options={CONTENT_TYPE_OPTIONS} />
          </div>

          {/* Language */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted">Language</p>
            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLanguage(opt.value)}
                  className={`rounded border py-1.5 text-xs font-medium transition-colors ${
                    language === opt.value
                      ? "border-accent/50 bg-accent/10 text-accent2"
                      : "border-border bg-surface2 text-muted hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tamil ratio */}
          {language === "thanglish" && (
            <div className="rounded border border-border bg-surface2 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">Tamil ratio</p>
                <span className="text-xs font-medium text-white">{tamilRatio}%</span>
              </div>
              <input
                type="range" min={10} max={90} step={5}
                value={tamilRatio}
                onChange={(e) => setTamilRatio(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <div className="mt-1 flex justify-between text-[10px] text-hint">
                <span>10% Tamil</span>
                <span>90% Tamil</span>
              </div>
            </div>
          )}

          {/* Assets */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted">Assets</p>
            <div className="divide-y divide-border rounded border border-border">
              {ASSET_OPTIONS.map((asset) => (
                <label key={asset.key} className="flex cursor-pointer items-center justify-between px-3 py-2.5 transition hover:bg-surface">
                  <span className="text-xs text-white">{asset.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] ${asset.cost ? "text-gold" : "text-hint"}`}>
                      {asset.cost ? `+${asset.cost}` : "free"}
                    </span>
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 accent-accent"
                      checked={assets[asset.key]}
                      onChange={(e) => setAssets((prev) => ({ ...prev, [asset.key]: e.target.checked }))}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cost */}
          <div className="rounded border border-border bg-surface px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Estimated cost</span>
              <span className="text-xs font-semibold text-white">{tokenCost} tokens</span>
            </div>
            {tokenState.totalTokens < tokenCost && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-red">Insufficient tokens</span>
                <button type="button" onClick={() => router.push("/tokens")} className="text-xs text-accent2 hover:underline">
                  Buy →
                </button>
              </div>
            )}
          </div>

          {/* Generate */}
          <div className="space-y-1.5">
            <Button
              size="md"
              className="w-full"
              disabled={!canGenerate || isGenerating}
              loading={isGenerating}
              onClick={() => void handleGenerate()}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate Script
            </Button>
            <p className="text-right text-[10px] text-hint">⌘ Enter to generate</p>
          </div>
        </div>
      </div>

      {/* ── Output panel ───────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Output header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white">Output</span>
            {isGenerated && <Badge variant="success">Ready</Badge>}
          </div>
          {isGenerated && !isGenerating && (
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" onClick={handleCopy}><Copy className="h-3 w-3" />Copy</Button>
              <Button variant="ghost" size="sm" onClick={handleDownload}><Download className="h-3 w-3" />Download</Button>
              <Button variant="ghost" size="sm" onClick={() => void handleRegenerate()} disabled={isRegenerating}>
                {isRegenerating ? <LoaderCircle className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                Regenerate
              </Button>
              <Button size="sm" onClick={() => void handleSave()} loading={isSaving}>
                <Save className="h-3 w-3" />Save
              </Button>
            </div>
          )}
        </div>

        {/* Progress */}
        {isGenerating && (
          <div className="shrink-0 border-b border-border px-5 py-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">{stageLabel}</span>
              <span className="tabular-nums text-hint">{currentStage}/4</span>
            </div>
            <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${(currentStage / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        {isGenerated && !isGenerating && (
          <div className="no-scrollbar shrink-0 flex overflow-x-auto border-b border-border">
            {tabs.map((tab) => {
              const enabled = tab === "seo" ? !!seo : tab === "assets" ? chapters.length + broll.length + shorts.length + imagePrompts.length > 0 : true;
              const label = tab === "seo" ? "SEO Pack" : tab === "assets" ? "Assets" : STAGE_LABELS[tab];
              return (
                <button
                  key={tab}
                  type="button"
                  disabled={!enabled}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 border-b-2 px-4 py-2.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                    activeTab === tab ? "border-accent text-white" : "border-transparent text-muted hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Empty state */}
          {!isGenerating && !isGenerated && !isLoadingSaved && (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-surface">
                <Sparkles className="h-4 w-4 text-muted" />
              </div>
              <p className="text-sm font-medium text-white">Ready to generate</p>
              <p className="max-w-xs text-xs leading-relaxed text-muted">
                Fill in your script settings on the left and click Generate. ScriptGen will build your script across 4 sequential stages.
              </p>
            </div>
          )}

          {/* Loading saved */}
          {isLoadingSaved && <div className="p-6"><SkeletonText lines={10} /></div>}

          {/* Generating preview */}
          {isGenerating && (
            <div className="p-5">
              <div className="rounded border border-border bg-surface p-5 font-mono text-xs leading-relaxed text-white/80">
                <StageContent value={stages[STAGE_ORDER[currentStage - 1] || "hook"]} loading />
              </div>
            </div>
          )}

          {/* Generated content */}
          {isGenerated && !isGenerating && (
            <div className="p-5">
              {activeTab === "seo" ? (
                seo ? (
                  <div className="space-y-3">
                    {seo.titles.map((t) => (
                      <div key={t.text} className="rounded border border-border bg-surface p-3">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm text-white">{t.text}</p>
                          <span className="shrink-0 text-xs tabular-nums text-green">{t.score}</span>
                        </div>
                        <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-border">
                          <div className="h-full rounded-full bg-green/60" style={{ width: `${Math.min(100, t.score)}%` }} />
                        </div>
                      </div>
                    ))}
                    <div className="rounded border border-border bg-surface p-3 text-sm text-white/80">{seo.description}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {seo.tags.map((tag) => (
                        <span key={tag} className="rounded border border-border bg-surface px-2 py-0.5 text-xs text-muted">{tag}</span>
                      ))}
                    </div>
                  </div>
                ) : <p className="text-sm text-muted">No SEO data available.</p>
              ) : activeTab === "assets" ? (
                <div className="space-y-6">
                  {[
                    { title: "B-Roll", items: broll.map((i) => ({ ts: i.timestamp, text: i.suggestion })) },
                    { title: "Chapter Markers", items: chapters.map((i) => ({ ts: i.timestamp, text: i.title })) },
                  ].map(({ title, items }) => (
                    <div key={title}>
                      <p className="mb-2 text-xs font-medium text-muted">{title}</p>
                      {items.length ? (
                        <div className="divide-y divide-border rounded border border-border">
                          {items.map((item, i) => (
                            <div key={i} className="flex gap-4 px-3 py-2.5">
                              <span className="w-16 shrink-0 text-xs font-mono text-hint">{item.ts}</span>
                              <span className="text-xs text-white">{item.text}</span>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-xs text-hint">None generated.</p>}
                    </div>
                  ))}
                  {shorts.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-muted">Shorts / Clips</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {shorts.map((s, i) => (
                          <div key={i} className="rounded border border-border bg-surface p-3">
                            <p className="text-xs font-medium text-white">{s.title}</p>
                            <p className="mt-1 text-xs italic text-muted">{s.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded border border-border bg-surface p-5 font-mono text-xs leading-relaxed text-white/90">
                  <StageContent value={stages[activeTab]} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
