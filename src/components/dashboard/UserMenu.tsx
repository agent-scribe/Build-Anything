"use client";

import * as React from "react";
import { useMockAuth } from "@/lib/mock-auth/context";
import { LogIn, LogOut, User, Crown } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
  const { user, isLoading, signOut } = useMockAuth();

  if (isLoading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-800" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth/signin"
        className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-700"
      >
        <LogIn size={13} />
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative group">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 transition-colors hover:border-zinc-600"
      >
        <User size={14} className="text-zinc-400" />
      </button>
      <div className="invisible absolute right-0 top-10 z-40 w-52 overflow-hidden rounded-xl border border-zinc-800 bg-[#141418] py-1 shadow-2xl group-hover:visible">
        <div className="border-b border-zinc-800 px-3 py-2">
          <p className="text-sm text-zinc-100">{user.name}</p>
          <p className="text-xs text-zinc-500">{user.email}</p>
          <div className="mt-1 flex items-center gap-1">
            <Crown size={10} className="text-[#6d5efc]" />
            <span className="text-[10px] font-medium uppercase text-[#a99bff]">{user.plan} plan</span>
          </div>
        </div>
        <Link
          href="/pricing"
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          <Crown size={13} />
          Upgrade Plan
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </div>
  );
}
