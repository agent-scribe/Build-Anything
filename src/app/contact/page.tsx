"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, Mail, MessageSquare } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

// ponytail: swap these for the real inbox + scheduler before launch.
const CONTACT_EMAIL = "hello@sbuild.studio";
const BOOKING_URL = "https://cal.com/sbuild/intro";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Please add your name.");
    if (!emailValid) return setError("Please enter a valid email.");
    if (message.trim().length < 10) return setError("Tell us a little more (10+ characters).");
    setError(null);

    // No mail backend configured — hand off to the visitor's mail client with a
    // fully pre-filled message so the lead still reaches the inbox.
    const subject = encodeURIComponent(`New inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
      <MarketingNav />

      <section className="mx-auto max-w-5xl px-4 pt-32 pb-20">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Left: pitch + alternatives */}
          <div>
            <h1 className="text-4xl font-bold md:text-5xl">Let&apos;s talk</h1>
            <p className="mt-4 text-lg text-zinc-400">
              Questions about plans, agencies, white-labeling, or a custom build? Send a note and
              we&apos;ll reply within one business day.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-[#141418] p-5 transition-colors hover:border-zinc-700"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#6d5efc]/10">
                  <Calendar size={20} className="text-[#a99bff]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    Book a 15-min intro call <ArrowRight size={15} className="text-zinc-500" />
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">Pick a time that works. No pressure, no pitch deck.</p>
                </div>
              </a>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-[#141418] p-5 transition-colors hover:border-zinc-700"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#6d5efc]/10">
                  <Mail size={20} className="text-[#a99bff]" />
                </div>
                <div>
                  <div className="font-semibold">Email us directly</div>
                  <p className="mt-1 text-sm text-zinc-400">{CONTACT_EMAIL}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center">
                <CheckCircle2 size={40} className="text-green-400" />
                <h2 className="mt-4 text-xl font-semibold">Almost there</h2>
                <p className="mt-2 max-w-xs text-sm text-zinc-400">
                  Your email draft is open and ready to send. If nothing opened, email us at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#a99bff] underline">{CONTACT_EMAIL}</a>.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm text-zinc-400 hover:text-zinc-200"
                >
                  ← Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-[#141418] p-6">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <MessageSquare size={16} className="text-[#a99bff]" />
                  Send a message
                </div>

                <label className="block text-sm text-zinc-400">
                  Name
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-[#0e0e11] px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#6d5efc]/50 focus:outline-none"
                    placeholder="Jane Doe"
                  />
                </label>

                <label className="mt-4 block text-sm text-zinc-400">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-[#0e0e11] px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#6d5efc]/50 focus:outline-none"
                    placeholder="jane@company.com"
                  />
                </label>

                <label className="mt-4 block text-sm text-zinc-400">
                  How can we help?
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="mt-1.5 w-full resize-none rounded-lg border border-zinc-800 bg-[#0e0e11] px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#6d5efc]/50 focus:outline-none"
                    placeholder="A sentence or two about your project or question."
                  />
                </label>

                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6d5efc] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Send message
                  <ArrowRight size={16} />
                </button>
                <p className="mt-3 text-center text-xs text-zinc-600">
                  We reply within one business day. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
