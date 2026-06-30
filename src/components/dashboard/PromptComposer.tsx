"use client";

import * as React from "react";
import { AlertCircle, ArrowUp, Loader2, Moon, ShoppingBag, Sparkles, Sun, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useEditorStore } from "@/lib/store/useEditorStore";

const EXAMPLES = [
  "A premium minimalist skincare store with a sage-green palette",
  "A SaaS landing page for an AI meeting-notes app, dark and techy",
  "A cozy artisan coffee roaster with online ordering",
  "A bold fitness coaching brand with pricing tiers",
];

export function PromptComposer() {
  const generate = useEditorStore((s) => s.generate);
  const status = useEditorStore((s) => s.status);
  const statusMessage = useEditorStore((s) => s.statusMessage);
  const plan = useEditorStore((s) => s.plan);
  const error = useEditorStore((s) => s.error);
  const hasDoc = useEditorStore((s) => Boolean(s.document));
  const usedMock = useEditorStore((s) => s.usedMock);

  const [prompt, setPrompt] = React.useState("");
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const [ecommerce, setEcommerce] = React.useState(false);
  const [aiAvailable, setAiAvailable] = React.useState<boolean | null>(null);

  const busy = status !== "idle" && status !== "error" && status !== "done";

  // Probe server for AI capability on mount
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/status")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setAiAvailable(data.hasKey === true);
      })
      .catch(() => {
        if (!cancelled) setAiAvailable(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function submit() {
    const value = prompt.trim();
    if (!value || busy) return;
    await generate({ prompt: value, mode, ecommerce });
  }

  return (
    <div className="border-b border-zinc-800/80 bg-[#0e0e11] px-4 py-3">
      <div className="mx-auto max-w-3xl">
        {/* AI status indicator */}
        {aiAvailable !== null && (
          <div className="mb-2 flex items-center gap-1.5 text-[11px]">
            {aiAvailable ? (
              <>
                <Sparkles size={12} className="text-[#6d5efc]" />
                <span className="text-[#a99bff]">AI generation active</span>
              </>
            ) : (
              <>
                <Zap size={12} className="text-amber-500" />
                <span className="text-amber-400/80">Demo mode — using built-in sample</span>
              </>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-zinc-800 bg-[#141418] focus-within:border-zinc-700">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
            }}
            rows={2}
            placeholder={hasDoc ? "Describe a change, or a whole new site…" : "Describe your business and the site you want…"}
            className="w-full resize-none bg-transparent px-4 pt-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
          <div className="flex items-center justify-between gap-2 px-3 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Toggle active={mode === "dark"} onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                {mode === "dark" ? <Moon size={13} /> : <Sun size={13} />}
                {mode === "dark" ? "Dark" : "Light"}
              </Toggle>
              <Toggle active={ecommerce} onClick={() => setEcommerce((v) => !v)}>
                <ShoppingBag size={13} />
                E-commerce
              </Toggle>
            </div>
            <button
              type="button"
              onClick={submit}
              disabled={!prompt.trim() || busy}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6d5efc] text-white transition-opacity hover:opacity-90 disabled:opacity-30"
              aria-label="Generate"
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <ArrowUp size={16} />}
            </button>
          </div>
        </div>

        {!hasDoc && status === "idle" ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setPrompt(ex)}
                className="rounded-full border border-zinc-800 bg-[#141418] px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
              >
                {ex}
              </button>
            ))}
          </div>
        ) : null}

        {busy ? (
          <div className="mt-2.5 flex items-center gap-2 text-xs text-zinc-400">
            <Loader2 size={13} className="animate-spin text-[#a99bff]" />
            <span>{statusMessage || "Working…"}</span>
            {plan ? (
              <div className="ml-1 flex flex-wrap gap-1">
                {plan.map((p, i) => (
                  <span key={i} className="rounded bg-zinc-800/70 px-1.5 py-0.5 text-[10px] text-zinc-400">
                    {p}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {status === "error" && error ? (
          <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Show mock/AI indicator after generation */}
        {hasDoc && status === "idle" && (
          <div className="mt-1.5 text-[10px] text-zinc-600">
            {usedMock ? "Generated from built-in sample" : "Generated with Claude AI"}
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors",
        active
          ? "border-[#6d5efc]/40 bg-[#6d5efc]/10 text-[#a99bff]"
          : "border-zinc-800 bg-transparent text-zinc-500 hover:text-zinc-300"
      )}
    >
      {children}
    </button>
  );
}
