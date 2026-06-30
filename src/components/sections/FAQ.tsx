"use client";

import * as React from "react";
import type { SectionOf } from "@/lib/schema/page-schema";
import { HeadingBlock, Icon, SectionShell } from "./_shared";

export function FAQ({ section }: { section: SectionOf<"faq"> }) {
  const { title, subtitle, items } = section.props;
  const twoCol = section.variant === "two-column";
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <SectionShell section={section}>
      <HeadingBlock title={title} subtitle={subtitle} />
      <div className={`mx-auto max-w-3xl ${twoCol ? "grid gap-x-10 md:grid-cols-2" : ""}`}>
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="border-b py-4" style={{ borderColor: "var(--wb-border)" }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium">{item.question}</span>
                <Icon
                  name={isOpen ? "minus" : "plus"}
                  size={18}
                  className="shrink-0"
                  style={{ color: "var(--wb-muted-fg)" }}
                />
              </button>
              {isOpen ? (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--wb-muted-fg)" }}>
                  {item.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
