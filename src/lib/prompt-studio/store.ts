/* ── Prompt Studio Zustand Store ────────────────────────────────── */
"use client";

import { create } from "zustand";
import type {
  StudioStatus,
  QualityScore,
  FollowUpQuestion,
  PromptVersion,
  PromptHistoryEntry,
  PromptCategory,
  RewriteMode,
} from "./types";
import {
  scorePrompt,
  generateFollowUps,
  enhancePrompt,
  rewritePrompt,
  improvePrompt,
  estimateTokens,
  describeImage,
} from "./engine";

// ── Persistence helpers ─────────────────────────────────────────
const HISTORY_KEY = "wb_prompt_history";

function loadHistory(): PromptHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: PromptHistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 50)));
  } catch {
    /* quota exceeded — silently ignore */
  }
}

// ── Store shape ─────────────────────────────────────────────────
interface PromptStudioState {
  /* Input */
  rawInput: string;
  imageDataUrl: string | null;

  /* Pipeline state */
  status: StudioStatus;
  qualityScore: QualityScore | null;
  followUps: FollowUpQuestion[];
  enhancedPrompt: string;
  versions: PromptVersion[];
  activeVersionId: string | null;
  improvementIteration: number;

  /* History */
  history: PromptHistoryEntry[];
  selectedHistoryId: string | null;

  /* Panels */
  showHistory: boolean;
  showTokenCalc: boolean;

  /* Actions */
  setRawInput: (text: string) => void;
  setImageDataUrl: (url: string | null) => void;
  analyze: () => void;
  answerFollowUp: (id: string, answer: string) => void;
  submitAnswers: () => void;
  rewrite: (mode: RewriteMode) => void;
  improve: () => void;
  selectVersion: (id: string) => void;
  saveToHistory: () => void;
  loadFromHistory: (id: string) => void;
  deleteFromHistory: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleHistory: () => void;
  toggleTokenCalc: () => void;
  reset: () => void;
  loadTemplate: (prompt: string) => void;
}

export const usePromptStudio = create<PromptStudioState>((set, get) => ({
  /* ── Initial state ──────────────────────────────────────────── */
  rawInput: "",
  imageDataUrl: null,
  status: "idle",
  qualityScore: null,
  followUps: [],
  enhancedPrompt: "",
  versions: [],
  activeVersionId: null,
  improvementIteration: 0,
  history: loadHistory(),
  selectedHistoryId: null,
  showHistory: false,
  showTokenCalc: false,

  /* ── Actions ────────────────────────────────────────────────── */

  setRawInput: (text) => set({ rawInput: text }),

  setImageDataUrl: (url) => set({ imageDataUrl: url }),

  /** Step 1 + 2: Analyze input → quality score + follow-up questions */
  analyze: () => {
    const { rawInput } = get();
    if (!rawInput.trim()) return;

    set({ status: "analyzing" });

    // Simulate brief processing delay
    setTimeout(() => {
      const score = scorePrompt(rawInput);
      const followUps = generateFollowUps(rawInput);

      set({
        qualityScore: score,
        followUps,
        status: followUps.length > 0 ? "asking" : "enhancing",
      });

      // If no follow-ups needed, auto-enhance
      if (followUps.length === 0) {
        get().submitAnswers();
      }
    }, 600);
  },

  answerFollowUp: (id, answer) => {
    set((s) => ({
      followUps: s.followUps.map((q) =>
        q.id === id ? { ...q, answer } : q
      ),
    }));
  },

  /** Step 3 + 4: Build enhanced prompt + generate versions */
  submitAnswers: () => {
    const { rawInput, followUps, imageDataUrl } = get();
    set({ status: "enhancing" });

    setTimeout(() => {
      const imgDesc = imageDataUrl ? describeImage(imageDataUrl) : undefined;
      const enhanced = enhancePrompt(rawInput, followUps, imgDesc);
      const tokens = estimateTokens(enhanced);

      const originalVersion: PromptVersion = {
        id: `v-${Date.now()}-original`,
        content: enhanced,
        mode: "enhanced",
        label: "Enhanced",
        timestamp: Date.now(),
        tokenCount: tokens,
      };

      set({
        enhancedPrompt: enhanced,
        versions: [originalVersion],
        activeVersionId: originalVersion.id,
        improvementIteration: 0,
        status: "done",
      });
    }, 800);
  },

  /** Rewrite current prompt in a different mode */
  rewrite: (mode) => {
    const { enhancedPrompt, versions } = get();
    if (!enhancedPrompt) return;

    set({ status: "rewriting" });

    setTimeout(() => {
      const newVersion = rewritePrompt(enhancedPrompt, mode);
      set({
        versions: [...versions, newVersion],
        activeVersionId: newVersion.id,
        status: "done",
      });
    }, 500);
  },

  /** Iteratively improve the current version */
  improve: () => {
    const { versions, activeVersionId, improvementIteration } = get();
    const active = versions.find((v) => v.id === activeVersionId);
    if (!active) return;

    set({ status: "improving" });

    setTimeout(() => {
      const improved = improvePrompt(active.content, improvementIteration);
      const newVersion: PromptVersion = {
        id: `v-${Date.now()}-improved`,
        content: improved,
        mode: "improved",
        label: `Improved v${improvementIteration + 1}`,
        timestamp: Date.now(),
        tokenCount: estimateTokens(improved),
      };

      set({
        versions: [...versions, newVersion],
        activeVersionId: newVersion.id,
        improvementIteration: improvementIteration + 1,
        status: "done",
      });
    }, 600);
  },

  selectVersion: (id) => set({ activeVersionId: id }),

  /** Persist current session to history */
  saveToHistory: () => {
    const {
      rawInput,
      enhancedPrompt,
      versions,
      qualityScore,
      followUps,
      imageDataUrl,
      history,
    } = get();

    if (!enhancedPrompt) return;

    const entry: PromptHistoryEntry = {
      id: `h-${Date.now()}`,
      rawInput,
      enhancedPrompt,
      versions,
      qualityScore,
      followUps,
      category: null,
      imageDataUrl,
      timestamp: Date.now(),
      favorite: false,
    };

    const updated = [entry, ...history].slice(0, 50);
    saveHistory(updated);
    set({ history: updated });
  },

  loadFromHistory: (id) => {
    const entry = get().history.find((e) => e.id === id);
    if (!entry) return;

    set({
      rawInput: entry.rawInput,
      enhancedPrompt: entry.enhancedPrompt,
      versions: entry.versions,
      activeVersionId: entry.versions[0]?.id ?? null,
      qualityScore: entry.qualityScore,
      followUps: entry.followUps,
      imageDataUrl: entry.imageDataUrl,
      improvementIteration: 0,
      selectedHistoryId: id,
      status: "done",
    });
  },

  deleteFromHistory: (id) => {
    const updated = get().history.filter((e) => e.id !== id);
    saveHistory(updated);
    set({ history: updated });
  },

  toggleFavorite: (id) => {
    const updated = get().history.map((e) =>
      e.id === id ? { ...e, favorite: !e.favorite } : e
    );
    saveHistory(updated);
    set({ history: updated });
  },

  toggleHistory: () => set((s) => ({ showHistory: !s.showHistory })),
  toggleTokenCalc: () => set((s) => ({ showTokenCalc: !s.showTokenCalc })),

  reset: () =>
    set({
      rawInput: "",
      imageDataUrl: null,
      status: "idle",
      qualityScore: null,
      followUps: [],
      enhancedPrompt: "",
      versions: [],
      activeVersionId: null,
      improvementIteration: 0,
      selectedHistoryId: null,
    }),

  loadTemplate: (prompt) => {
    set({
      rawInput: prompt,
      status: "idle",
      qualityScore: null,
      followUps: [],
      enhancedPrompt: "",
      versions: [],
      activeVersionId: null,
      improvementIteration: 0,
      selectedHistoryId: null,
      imageDataUrl: null,
    });
  },
}));
