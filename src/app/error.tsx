"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0e]">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#141418] p-8 text-center">
        <AlertTriangle size={48} className="mx-auto mb-4 text-red-400" />
        <h1 className="mb-2 text-xl font-bold text-zinc-100">Something went wrong</h1>
        <p className="mb-6 text-sm text-zinc-400">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-[#6d5efc] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    </div>
  );
}
