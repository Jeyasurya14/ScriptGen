import type { GenerateRequest, ScriptStages, SEOPack } from "@/types";

export type ChapterItem = {
  timestamp: string;
  title: string;
  description?: string;
};

export type BRollItem = {
  timestamp: string;
  suggestion: string;
};

export type ShortItem = {
  title: string;
  content: string;
};

export type ImagePromptItem = {
  timestamp: string;
  prompt: string;
};

export const STORAGE_KEY = "scriptgen:settings";

export const STAGE_ORDER: Array<keyof ScriptStages> = ["hook", "content", "outro", "production"];

export const STAGE_LABELS: Record<keyof ScriptStages, string> = {
  hook: "Hook & Intro",
  content: "Main Content",
  outro: "Demo & Outro",
  production: "Production",
};

export const LANGUAGE_OPTIONS: Array<{ label: string; value: GenerateRequest["language"] }> = [
  { label: "English", value: "english" },
  { label: "Hinglish", value: "hindi" },
  { label: "Tamil", value: "tamil" },
  { label: "Thanglish", value: "thanglish" },
];

export const VIDEO_LENGTH_OPTIONS = [
  { label: "Short 5-8 min", value: "short" },
  { label: "Medium 10-15 min", value: "medium" },
  { label: "Long 20-30 min", value: "long" },
  { label: "Deep Dive 40+ min", value: "deep-dive" },
];

export const CONTENT_TYPE_OPTIONS = [
  { label: "Tutorial", value: "tutorial" },
  { label: "Live Build", value: "live-build" },
  { label: "Review", value: "review" },
  { label: "Explainer", value: "explainer" },
  { label: "News", value: "news" },
];

export const ASSET_OPTIONS = [
  { key: "seo", label: "SEO Pack (titles, description, tags)", cost: 2 },
  { key: "broll", label: "B-Roll List & Chapter Markers", cost: 1 },
  { key: "shorts", label: "Shorts Extraction (viral clips)", cost: 2 },
  { key: "imagePrompts", label: "AI Image Prompts (DALL-E ready)", cost: 2 },
  { key: "tamilContext", label: "Tamil Nadu Cultural Context", cost: 0 },
] as const;

export const EMPTY_STAGES: ScriptStages = {
  hook: "",
  content: "",
  outro: "",
  production: "",
};

export function mapLanguageToLegacy(language: GenerateRequest["language"]) {
  if (language === "english") return "English";
  if (language === "hindi") return "Hindi";
  if (language === "tamil") return "Tamil";
  return "Thanglish";
}

export function mapContentTypeToLegacy(contentType: GenerateRequest["contentType"]) {
  if (contentType === "live-build") return "Live Build";
  if (contentType === "explainer") return "Explainer";
  if (contentType === "tutorial") return "Tutorial";
  if (contentType === "review") return "Review";
  return "News";
}

export function getMinutesForLength(length: GenerateRequest["vidLength"]) {
  if (length === "short") return 6;
  if (length === "medium") return 12;
  if (length === "long") return 24;
  return 42;
}

export function buildTimestamps(length: GenerateRequest["vidLength"]) {
  const total = getMinutesForLength(length) * 60;
  const hookEnd = 24;
  const introEnd = Math.min(90, Math.floor(total * 0.18));
  const mainEnd = Math.floor(total * 0.68);
  const demoEnd = Math.floor(total * 0.88);

  return {
    hookStart: 0,
    hookEnd,
    introStart: hookEnd,
    introEnd,
    mainStart: introEnd,
    mainEnd,
    demoStart: mainEnd,
    demoEnd,
    outroStart: demoEnd,
    outroEnd: total,
  };
}

function cleanJsonString(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(cleanJsonString(value)) as T;
  } catch {
    return fallback;
  }
}

export function normalizeSeo(raw: string): SEOPack {
  const parsed = parseJson<{
    titles?: Array<{ text?: string; score?: number }>;
    description?: string;
    tags?: Array<{ text?: string } | string>;
  }>(raw, {});

  return {
    titles:
      parsed.titles?.map((title) => ({
        text: title.text || "Untitled",
        score: typeof title.score === "number" ? title.score : 0,
      })) || [],
    description: parsed.description || "",
    tags:
      parsed.tags?.map((tag) => (typeof tag === "string" ? tag : tag.text || "")).filter(Boolean) || [],
  };
}

export function normalizeChapters(raw: string): ChapterItem[] {
  const parsed = parseJson<Array<{ timestamp?: string; title?: string; description?: string }>>(raw, []);
  return parsed.map((item) => ({
    timestamp: item.timestamp || "0:00",
    title: item.title || "Untitled chapter",
    description: item.description,
  }));
}

export function normalizeBroll(raw: string): BRollItem[] {
  const parsed = parseJson<{ items?: Array<{ timestamp?: string; suggestion?: string }> }>(raw, {});
  return (
    parsed.items?.map((item) => ({
      timestamp: item.timestamp || "0:00",
      suggestion: item.suggestion || "Visual suggestion",
    })) || []
  );
}

export function normalizeShorts(raw: string): ShortItem[] {
  const parsed = parseJson<{ items?: Array<{ title?: string; content?: string }> }>(raw, {});
  return (
    parsed.items?.map((item, index) => ({
      title: item.title || `Short ${index + 1}`,
      content: item.content || "",
    })) || []
  );
}

export function normalizeImagePrompts(raw: string): ImagePromptItem[] {
  const parsed = parseJson<Array<{ timestamp?: string; description?: string; prompt?: string }>>(raw, []);
  return parsed.map((item) => ({
    timestamp: item.timestamp || "0:00",
    prompt: item.prompt || item.description || "",
  }));
}

export function serializeStages(stages: ScriptStages) {
  return [
    "## Hook & Intro",
    stages.hook,
    "",
    "## Main Content",
    stages.content,
    "",
    "## Demo & Outro",
    stages.outro,
    "",
    "## Production",
    stages.production,
  ].join("\n");
}

export function parseSavedStages(scriptContent?: string | null): ScriptStages {
  const next = { ...EMPTY_STAGES };
  const parts = (scriptContent || "").split(/^## /gm).filter(Boolean);

  for (const part of parts) {
    const [heading, ...bodyParts] = part.split("\n");
    const body = bodyParts.join("\n").trim();

    if (heading.startsWith("Hook")) next.hook = body;
    if (heading.startsWith("Main")) next.content = body;
    if (heading.startsWith("Demo")) next.outro = body;
    if (heading.startsWith("Production")) next.production = body;
  }

  return next;
}
