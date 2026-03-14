export interface GenerateRequest {
  topic: string;
  language: "english" | "hindi" | "tamil" | "thanglish";
  tamilRatio?: number;
  vidLength: "short" | "medium" | "long" | "deep-dive";
  contentType: "tutorial" | "live-build" | "review" | "explainer" | "news";
  assets: {
    seo: boolean;
    broll: boolean;
    shorts: boolean;
    imagePrompts: boolean;
    tamilContext: boolean;
  };
}

export interface ScriptStages {
  hook: string;
  content: string;
  outro: string;
  production: string;
}

export interface SEOPack {
  titles: Array<{ text: string; score: number }>;
  description: string;
  tags: string[];
}

export interface GeneratedImagePrompt {
  timestamp: string;
  prompt: string;
}

export interface GeneratedAssets {
  broll?: string[];
  shorts?: string[];
  imagePrompts?: GeneratedImagePrompt[];
  chapters?: Array<{ timestamp: string; title: string; description?: string }>;
}

export interface GenerateResponse {
  scriptId: string;
  stages: ScriptStages;
  seo?: SEOPack;
  assets?: {
    broll?: string[];
    shorts?: string[];
    imagePrompts?: Array<{ timestamp: string; prompt: string }>;
  };
  tokensCost: number;
  tokensRemaining: number;
}

export interface TokenPack {
  id: "30" | "100" | "300";
  tokens: number;
  price: number;
  label: string;
  scripts: string;
  featured?: boolean;
}

export interface TokenBalance {
  freeTokensUsed: number;
  freeTokensRemaining: number;
  paidTokens: number;
  totalGenerated: number;
  totalTokens: number;
  canGenerate: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string;
  tokens: number;
  referralCode: string;
}

export interface DashboardScriptRow {
  id: string;
  title: string;
  language: string;
  seoScore: number | null;
  createdAt: string;
  status: "done" | "draft";
}

export interface ReferralStats {
  totalReferred: number;
  tokensEarned: number;
  activeUsers: number;
}
