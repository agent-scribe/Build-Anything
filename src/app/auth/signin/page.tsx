"use client";

import * as React from "react";
import { Sparkles, Info } from "lucide-react";
import { useMockAuth } from "@/lib/mock-auth/context";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { signIn, user } = useMockAuth();
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    signIn(name.trim(), email.trim());
    router.push("/dashboard");
  }

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

        {/* Demo mode banner */}
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
          <Info size={14} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="text-xs text-amber-300/80">
            <strong>Demo Mode:</strong> This uses local authentication. 
            The buyer can connect real OAuth providers (Google, GitHub) by adding their API keys.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#6d5efc]/50 focus:outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#6d5efc]/50 focus:outline-none"
          />
          <button
            type="submit"
            className="mt-1 rounded-lg bg-[#6d5efc] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sign In
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-zinc-600">
          Data is saved locally in your browser.
        </p>
      </div>
    </div>
  );
}
