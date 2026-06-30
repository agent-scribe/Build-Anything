"use client";

import { signIn, getProviders } from "next-auth/react";
import * as React from "react";
import { Sparkles } from "lucide-react";

export default function SignInPage() {
  const [providers, setProviders] = React.useState<Record<string, { id: string; name: string }> | null>(null);

  React.useEffect(() => {
    getProviders().then((p) => setProviders(p as Record<string, { id: string; name: string }> | null));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0e]">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#141418] p-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Sparkles className="text-[#6d5efc]" size={24} />
          <h1 className="text-xl font-bold text-white">WeBuild</h1>
        </div>
        <p className="mb-6 text-center text-sm text-zinc-400">
          Sign in to save your projects and access them anywhere.
        </p>
        <div className="flex flex-col gap-3">
          {providers ? (
            Object.values(providers).map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
              >
                Continue with {provider.name}
              </button>
            ))
          ) : (
            <div className="text-center text-sm text-zinc-500">Loading…</div>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-zinc-600">
          No account needed — signing in creates one automatically.
        </p>
      </div>
    </div>
  );
}
