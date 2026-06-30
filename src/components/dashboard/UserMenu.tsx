"use client";

import * as React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, User } from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-800" />;
  }

  if (!session) {
    return (
      <button
        type="button"
        onClick={() => signIn()}
        className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-700"
      >
        <LogIn size={13} />
        Sign in
      </button>
    );
  }

  return (
    <div className="relative group">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 transition-colors hover:border-zinc-600"
      >
        {session.user.image ? (
          <img src={session.user.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <User size={14} className="text-zinc-400" />
        )}
      </button>
      <div className="invisible absolute right-0 top-10 z-40 w-48 overflow-hidden rounded-xl border border-zinc-800 bg-[#141418] py-1 shadow-2xl group-hover:visible">
        <div className="border-b border-zinc-800 px-3 py-2">
          <p className="text-sm text-zinc-100">{session.user.name ?? "User"}</p>
          <p className="text-xs text-zinc-500">{session.user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </div>
  );
}
