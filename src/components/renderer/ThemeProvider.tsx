/**
 * ThemeProvider — applies a SiteDocument theme as CSS variables and loads
 * its Google Fonts. Wrap any rendered page (canvas or export) with this.
 */
"use client";

import * as React from "react";
import { themeStyle } from "@/components/sections/_shared";
import type { Theme } from "@/lib/schema/page-schema";

function useGoogleFonts(theme: Theme) {
  React.useEffect(() => {
    const families = Array.from(new Set([theme.fonts.heading, theme.fonts.body]))
      .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
      .join("&");
    const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    const id = `wb-fonts-${href}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, [theme.fonts.heading, theme.fonts.body]);
}

export function ThemeProvider({
  theme,
  children,
  className,
}: {
  theme: Theme;
  children: React.ReactNode;
  className?: string;
}) {
  useGoogleFonts(theme);
  return (
    <div data-mode={theme.mode} style={themeStyle(theme)} className={className}>
      {children}
    </div>
  );
}
