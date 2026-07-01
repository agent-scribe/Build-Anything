/* ── Prompt Studio Types ─────────────────────────────────────────── */

export type RewriteMode =
  | "shorter"
  | "detailed"
  | "creative"
  | "developer"
  | "investor"
  | "seo"
  | "casual"
  | "formal";

export const REWRITE_LABELS: Record<RewriteMode, string> = {
  shorter: "Shorter",
  detailed: "More Detailed",
  creative: "More Creative",
  developer: "Developer Ready",
  investor: "Investor Pitch",
  seo: "SEO Optimized",
  casual: "Casual Tone",
  formal: "Formal / Enterprise",
};

export type PromptCategory =
  | "saas"
  | "portfolio"
  | "ecommerce"
  | "ai-agent"
  | "mobile-app"
  | "dashboard"
  | "landing-page";

export const CATEGORY_LABELS: Record<PromptCategory, string> = {
  saas: "SaaS",
  portfolio: "Portfolio",
  ecommerce: "E-Commerce",
  "ai-agent": "AI Agent",
  "mobile-app": "Mobile App",
  dashboard: "Dashboard",
  "landing-page": "Landing Page",
};

export interface QualityScore {
  overall: number; // 0-100
  clarity: number;
  specificity: number;
  structure: number;
  completeness: number;
  feedback: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  answer: string;
  category: "audience" | "features" | "design" | "tech" | "business";
}

export interface PromptVersion {
  id: string;
  content: string;
  mode: RewriteMode | "original" | "enhanced" | "improved";
  label: string;
  timestamp: number;
  tokenCount: number;
}

export interface PromptHistoryEntry {
  id: string;
  rawInput: string;
  enhancedPrompt: string;
  versions: PromptVersion[];
  qualityScore: QualityScore | null;
  followUps: FollowUpQuestion[];
  category: PromptCategory | null;
  imageDataUrl: string | null;
  timestamp: number;
  favorite: boolean;
}

export interface TokenEstimate {
  tokens: number;
  costs: {
    model: string;
    inputCost: string;
    outputCost: string;
    totalEstimate: string;
  }[];
}

export interface FavoriteTemplate {
  id: string;
  category: PromptCategory;
  title: string;
  description: string;
  prompt: string;
}

export type StudioStatus =
  | "idle"
  | "analyzing"
  | "asking"
  | "enhancing"
  | "rewriting"
  | "improving"
  | "done"
  | "error";
