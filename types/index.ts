export interface ScriptStages {
  hook: string;
  intro: string;
  main: string;
  outro: string;
  productionNotes?: string;
}

export interface SEOPack {
  titles: string[];
  description: string;
  tags: string[];
  thumbnailPrompts: string[];
}

export interface GenerateRequest {
  title: string;
  channelName?: string;
  duration: number; // in minutes
  contentType: string;
  tone: string;
  language: string;
  includeCode: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface GenerateResponse {
  id: string;
  script: ScriptStages;
  seo: SEOPack;
  createdAt: string;
}

export interface UserCredits {
  freeScriptsUsed: number;
  paidCredits: number;
  totalGenerated: number;
  freeTokensRemaining: number;
  paidTokens: number;
  totalTokens: number;
  canGenerate: boolean;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    credits: UserCredits;
  };
}

export interface TokenPack {
  id: string;
  name: string;
  tokens: number;
  price: number;
  features: string[];
  popular?: boolean;
}
