"use client";

import * as React from "react";
import type { SectionOf } from "@/lib/schema/page-schema";
import { SectionShell } from "./_shared";

export function Newsletter({ section }: { section: SectionOf<"newsletter"> }) {
  const { headline, subheadline, placeholder, buttonLabel, disclaimer } = section.props;
  const [submitted, setSubmitted] = React.useState(false);
  const boxed = section.variant === "boxed";

  const inner = (
    <div className="mx-auto max-w-xl text-center">
      <h2
        className="text-2xl font-semibold tracking-tight md:text-3xl"
        style={{ fontFamily: "var(--wb-font-heading)" }}
      >
        {headline}
      </h2>
      {subheadline ? <p className="mt-2 opacity-90">{subheadline}</p> : null}
      <form
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <input
          type="email"
          required
          placeholder={placeholder}
          aria-label="Email address"
          className="min-w-0 flex-1 rounded-[var(--wb-radius)] px-4 py-2.5 text-sm outline-none sm:max-w-xs"
          style={{ background: "var(--wb-bg)", color: "var(--wb-fg)", border: "1px solid var(--wb-border)" }}
        />
        <button
          type="submit"
          className="rounded-[var(--wb-radius)] px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "var(--wb-primary)", color: "var(--wb-primary-fg)" }}
        >
          {submitted ? "Subscribed ✓" : buttonLabel}
        </button>
      </form>
      {disclaimer ? <p className="mt-3 text-xs opacity-70">{disclaimer}</p> : null}
    </div>
  );

  return (
    <SectionShell section={section}>
      {boxed ? (
        <div
          className="mx-auto max-w-3xl rounded-[var(--wb-radius)] p-8 md:p-12"
          style={{ background: section.background === "primary" ? "transparent" : "var(--wb-card)" }}
        >
          {inner}
        </div>
      ) : (
        inner
      )}
    </SectionShell>
  );
}
