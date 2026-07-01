"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  History,
  Star,
  Trash2,
  Download,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Upload,
  Wand2,
  Zap,
  RotateCcw,
  Calculator,
  X,
  FileText,
  Code2,
  FileJson,
  FileDown,
  Image as ImageIcon,
  Send,
  RefreshCw,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Layers,
} from "lucide-react";
import { usePromptStudio } from "@/lib/prompt-studio/store";
import {
  REWRITE_LABELS,
  CATEGORY_LABELS,
  type RewriteMode,
  type PromptCategory,
} from "@/lib/prompt-studio/types";
import { estimateTokens, estimateCosts } from "@/lib/prompt-studio/engine";
import { FAVORITE_TEMPLATES } from "@/lib/prompt-studio/templates";

/* ─── helpers ─────────────────────────────────────────────────── */
function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scoreColor(n: number) {
  if (n >= 80) return "text-green-400";
  if (n >= 60) return "text-yellow-400";
  if (n >= 40) return "text-orange-400";
  return "text-red-400";
}

function scoreBg(n: number) {
  if (n >= 80) return "bg-green-500/20 border-green-500/30";
  if (n >= 60) return "bg-yellow-500/20 border-yellow-500/30";
  if (n >= 40) return "bg-orange-500/20 border-orange-500/30";
  return "bg-red-500/20 border-red-500/30";
}

/* ─── Export utils ────────────────────────────────────────────── */
function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportMarkdown(content: string) {
  downloadFile(content, "prompt.md", "text/markdown");
}

function exportTxt(content: string) {
  downloadFile(content, "prompt.txt", "text/plain");
}

function exportJson(content: string, meta: Record<string, unknown>) {
  const json = JSON.stringify({ prompt: content, ...meta }, null, 2);
  downloadFile(json, "prompt.json", "application/json");
}

function exportPdf(content: string) {
  // Simple HTML-to-PDF via print
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`
    <html><head><title>Prompt Export</title>
    <style>body{font-family:system-ui;max-width:700px;margin:2rem auto;line-height:1.6;white-space:pre-wrap;}</style>
    </head><body>${content.replace(/\n/g, "<br>")}</body></html>
  `);
  win.document.close();
  win.print();
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PROMPT STUDIO PAGE                                            */
/* ═══════════════════════════════════════════════════════════════ */
export default function PromptStudioPage() {
  const store = usePromptStudio();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"studio" | "templates">("studio");
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | "all">("all");

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => store.setImageDataUrl(reader.result as string);
      reader.readAsDataURL(file);
    },
    [store]
  );

  const activeVersion = store.versions.find(
    (v) => v.id === store.activeVersionId
  );

  const filteredTemplates =
    selectedCategory === "all"
      ? FAVORITE_TEMPLATES
      : FAVORITE_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* ─── Top bar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Home</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              <h1 className="text-lg font-semibold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Prompt Studio
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={store.toggleTokenCalc}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition ${
                store.showTokenCalc
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Calculator className="h-4 w-4" />
              Tokens
            </button>
            <button
              onClick={store.toggleHistory}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition ${
                store.showHistory
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <History className="h-4 w-4" />
              History
              {store.history.length > 0 && (
                <span className="ml-1 rounded-full bg-violet-500/30 px-1.5 text-xs">
                  {store.history.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 flex gap-6">
        {/* ─── History sidebar ──────────────────────────────────── */}
        {store.showHistory && (
          <aside className="w-72 shrink-0 space-y-3 animate-in slide-in-from-left">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-300">
                Prompt History
              </h2>
              <button
                onClick={store.toggleHistory}
                className="text-zinc-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {store.history.length === 0 ? (
              <p className="text-xs text-zinc-500">
                No saved prompts yet. Generate and save a prompt to see it here.
              </p>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
                {store.history.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => store.loadFromHistory(entry.id)}
                    className={`group cursor-pointer rounded-lg border p-3 transition ${
                      store.selectedHistoryId === entry.id
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <p className="text-sm text-zinc-300 line-clamp-2">
                      {entry.rawInput}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        {formatDate(entry.timestamp)}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            store.toggleFavorite(entry.id);
                          }}
                          className="p-1 hover:text-yellow-400"
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${
                              entry.favorite
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-zinc-500"
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            store.deleteFromHistory(entry.id);
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {entry.qualityScore && (
                      <div className="mt-1.5">
                        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              entry.qualityScore.overall >= 80
                                ? "bg-green-500"
                                : entry.qualityScore.overall >= 60
                                ? "bg-yellow-500"
                                : "bg-orange-500"
                            }`}
                            style={{
                              width: `${entry.qualityScore.overall}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}

        {/* ─── Main content ─────────────────────────────────────── */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Tab switcher */}
          <div className="flex gap-1 rounded-xl bg-white/5 p-1">
            <button
              onClick={() => setActiveTab("studio")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                activeTab === "studio"
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Wand2 className="inline h-4 w-4 mr-1.5 -mt-0.5" />
              Prompt Studio
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                activeTab === "templates"
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="inline h-4 w-4 mr-1.5 -mt-0.5" />
              Templates
            </button>
          </div>

          {activeTab === "templates" ? (
            /* ─── TEMPLATES TAB ──────────────────────────────────── */
            <div className="space-y-4">
              {/* Category filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    selectedCategory === "all"
                      ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30"
                      : "bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                {(Object.entries(CATEGORY_LABELS) as [PromptCategory, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        selectedCategory === key
                          ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30"
                          : "bg-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>

              {/* Template grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="group rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-violet-500/30 hover:bg-violet-500/5 transition cursor-pointer"
                    onClick={() => {
                      store.loadTemplate(tpl.prompt);
                      setActiveTab("studio");
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block rounded-md bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400 mb-1.5">
                          {CATEGORY_LABELS[tpl.category]}
                        </span>
                        <h3 className="font-medium text-zinc-200">
                          {tpl.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {tpl.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-violet-400 transition" />
                    </div>
                    <p className="mt-2 text-xs text-zinc-500 line-clamp-3">
                      {tpl.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ─── STUDIO TAB ─────────────────────────────────────── */
            <div className="space-y-6">
              {/* Input area */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-1">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={store.rawInput}
                    onChange={(e) => store.setRawInput(e.target.value)}
                    onKeyDown={(e) => {
                      // Ctrl/Cmd+Enter submits, matching common prompt-tool UX.
                      const canAnalyze =
                        store.rawInput.trim() &&
                        store.status !== "analyzing" &&
                        store.status !== "enhancing";
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canAnalyze) {
                        e.preventDefault();
                        store.analyze();
                      }
                    }}
                    placeholder="Describe your website idea... e.g. 'A SaaS landing page for an AI-powered code review tool with dark theme, pricing tiers, and testimonials'"
                    rows={4}
                    className="w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                  />

                  {/* Bottom toolbar */}
                  <div className="flex items-center justify-between border-t border-white/5 px-3 py-2">
                    <div className="flex items-center gap-2">
                      {/* Image upload */}
                      <label className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition">
                        <ImageIcon className="h-3.5 w-3.5" />
                        {store.imageDataUrl ? "Image attached" : "Upload UI"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {store.imageDataUrl && (
                        <button
                          onClick={() => store.setImageDataUrl(null)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                      <span className="text-xs text-zinc-600">
                        {store.rawInput.length > 0 &&
                          `${estimateTokens(store.rawInput)} tokens`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="hidden text-[10px] text-zinc-600 sm:inline">
                        <kbd className="rounded border border-white/10 bg-white/5 px-1">Ctrl</kbd>
                        <span className="mx-0.5">+</span>
                        <kbd className="rounded border border-white/10 bg-white/5 px-1">↵</kbd> to analyze
                      </span>
                      {store.status !== "idle" && (
                        <button
                          onClick={store.reset}
                          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Reset
                        </button>
                      )}
                      <button
                        onClick={store.analyze}
                        disabled={
                          !store.rawInput.trim() ||
                          store.status === "analyzing" ||
                          store.status === "enhancing"
                        }
                        className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        {store.status === "analyzing" ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Analyze & Enhance
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image preview */}
              {store.imageDataUrl && (
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-xs text-zinc-500 mb-2">
                    Reference Design
                  </p>
                  <img
                    src={store.imageDataUrl}
                    alt="Uploaded reference"
                    className="max-h-48 rounded-lg object-contain"
                  />
                </div>
              )}

              {/* Quality Score */}
              {store.qualityScore && (
                <div
                  className={`rounded-2xl border p-5 ${scoreBg(
                    store.qualityScore.overall
                  )}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="h-5 w-5 text-zinc-400" />
                    <h3 className="font-medium text-zinc-200">
                      Quality Score
                    </h3>
                    <span
                      className={`ml-auto text-2xl font-bold ${scoreColor(
                        store.qualityScore.overall
                      )}`}
                    >
                      {store.qualityScore.overall}
                      <span className="text-sm text-zinc-500">/100</span>
                    </span>
                  </div>

                  {/* Score breakdown */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {(
                      [
                        ["Clarity", store.qualityScore.clarity],
                        ["Specificity", store.qualityScore.specificity],
                        ["Structure", store.qualityScore.structure],
                        ["Completeness", store.qualityScore.completeness],
                      ] as const
                    ).map(([label, val]) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-400">{label}</span>
                          <span className={scoreColor(val)}>{val}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              val >= 80
                                ? "bg-green-500"
                                : val >= 60
                                ? "bg-yellow-500"
                                : val >= 40
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-zinc-400">
                    {store.qualityScore.feedback}
                  </p>
                </div>
              )}

              {/* Follow-up Questions */}
              {store.status === "asking" && store.followUps.length > 0 && (
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-medium text-zinc-200">
                      Help us enhance your prompt
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Answer these questions to generate a more detailed,
                    higher-quality prompt. Skip any that don&apos;t apply.
                  </p>

                  {store.followUps.map((q) => (
                    <div key={q.id}>
                      <label className="block text-sm text-zinc-300 mb-1.5">
                        {q.question}
                      </label>
                      <input
                        type="text"
                        value={q.answer}
                        onChange={(e) =>
                          store.answerFollowUp(q.id, e.target.value)
                        }
                        placeholder="Type your answer..."
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  ))}

                  <button
                    onClick={store.submitAnswers}
                    className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 transition"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate Enhanced Prompt
                  </button>
                </div>
              )}

              {/* Processing indicator */}
              {(store.status === "enhancing" ||
                store.status === "rewriting" ||
                store.status === "improving") && (
                <div className="flex items-center justify-center gap-3 py-8">
                  <RefreshCw className="h-5 w-5 animate-spin text-violet-400" />
                  <span className="text-sm text-zinc-400">
                    {store.status === "enhancing"
                      ? "Crafting your enhanced prompt..."
                      : store.status === "rewriting"
                      ? "Rewriting prompt..."
                      : "Improving prompt..."}
                  </span>
                </div>
              )}

              {/* Results area */}
              {store.versions.length > 0 && store.status === "done" && (
                <div className="space-y-4">
                  {/* Version tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {store.versions.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => store.selectVersion(v.id)}
                        className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          store.activeVersionId === v.id
                            ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30"
                            : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>

                  {/* Active version output */}
                  {activeVersion && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                      {/* Output header */}
                      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-violet-400" />
                          <span className="text-sm font-medium text-zinc-300">
                            {activeVersion.label}
                          </span>
                          <span className="text-xs text-zinc-600">
                            {activeVersion.tokenCount} tokens
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(activeVersion.content)}
                            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition"
                          >
                            {copied ? (
                              <Check className="h-3.5 w-3.5 text-green-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>

                      {/* Output body with syntax highlighting */}
                      <div className="p-4 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono leading-relaxed">
                          {activeVersion.content
                            .split("\n")
                            .map((line, i) => (
                              <div key={i} className="hover:bg-white/[0.02]">
                                <span className="inline-block w-8 text-right pr-3 text-zinc-600 select-none text-xs">
                                  {i + 1}
                                </span>
                                {line.startsWith("#") ? (
                                  <span className="text-violet-400 font-semibold">
                                    {line}
                                  </span>
                                ) : line.startsWith("- ") ? (
                                  <span className="text-cyan-300">{line}</span>
                                ) : line.startsWith("**") ? (
                                  <span className="text-yellow-300">
                                    {line}
                                  </span>
                                ) : (
                                  <span>{line}</span>
                                )}
                              </div>
                            ))}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Action bar */}
                  <div className="flex flex-wrap gap-3">
                    {/* Rewrite modes */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500 mb-2">
                        AI Rewrite Modes
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(
                          Object.entries(REWRITE_LABELS) as [
                            RewriteMode,
                            string
                          ][]
                        ).map(([mode, label]) => (
                          <button
                            key={mode}
                            onClick={() => store.rewrite(mode)}
                            className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-violet-500/20 transition"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Improve + Save + Export */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={store.improve}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
                      >
                        <TrendingUp className="h-4 w-4" />
                        Improve Again
                      </button>
                      <button
                        onClick={store.saveToHistory}
                        className="flex items-center gap-1.5 rounded-lg bg-white/5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10 transition"
                      >
                        <Star className="h-4 w-4" />
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Export options */}
                  {activeVersion && (
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <span className="text-xs text-zinc-500">Export:</span>
                      <button
                        onClick={() => exportMarkdown(activeVersion.content)}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        .md
                      </button>
                      <button
                        onClick={() => exportTxt(activeVersion.content)}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        .txt
                      </button>
                      <button
                        onClick={() =>
                          exportJson(activeVersion.content, {
                            mode: activeVersion.mode,
                            tokens: activeVersion.tokenCount,
                            timestamp: activeVersion.timestamp,
                          })
                        }
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition"
                      >
                        <FileJson className="h-3.5 w-3.5" />
                        .json
                      </button>
                      <button
                        onClick={() => exportPdf(activeVersion.content)}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Token Calculator panel */}
              {store.showTokenCalc && activeVersion && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-violet-400" />
                      <h3 className="font-medium text-zinc-200">
                        Token & Cost Estimator
                      </h3>
                    </div>
                    <button
                      onClick={store.toggleTokenCalc}
                      className="text-zinc-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-center py-3">
                    <p className="text-3xl font-bold text-violet-400">
                      {activeVersion.tokenCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      estimated tokens
                    </p>
                  </div>

                  <div className="space-y-2">
                    {estimateCosts(activeVersion.tokenCount).costs.map((c) => (
                      <div
                        key={c.model}
                        className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                      >
                        <span className="text-sm text-zinc-300">
                          {c.model}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-medium text-zinc-200">
                            {c.totalEstimate}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            in {c.inputCost} / out {c.outputCost}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {store.status === "idle" && store.versions.length === 0 && (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                    <Wand2 className="h-8 w-8 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-zinc-300">
                      AI Prompt Engineering Studio
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 max-w-md mx-auto">
                      Enter a rough idea above and our AI will analyze it,
                      ask intelligent follow-up questions, and generate
                      multiple optimized prompt versions you can refine,
                      save, and export.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {["Quality Scoring", "Smart Follow-ups", "8 Rewrite Modes", "Multi-format Export", "Token Calculator", "Prompt History"].map(
                      (f) => (
                        <span
                          key={f}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-500"
                        >
                          {f}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
