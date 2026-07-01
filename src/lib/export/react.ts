/**
 * react.ts — SiteDocument → portable React/Next.js bundle (file map).
 * ------------------------------------------------------------------
 * Emits a small set of files the user can drop into any React project.
 * The document is the data; the shared PageRenderer (shipped alongside)
 * is the deterministic view. Returned as { path: contents } so the route
 * can stream it as JSON or a downstream job can zip it.
 */
import type { SiteDocument } from "@/lib/schema/page-schema";

export function exportReactBundle(doc: SiteDocument): Record<string, string> {
  const safeName = (doc.meta.name || "site").replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  return {
    "site.json": JSON.stringify(doc, null, 2),

    "site.ts": `import type { SiteDocument } from "./schema/page-schema";
import data from "./site.json";

/** Your generated site document, typed. Edit data here or in site.json. */
export const site = data as SiteDocument;
`,

    "App.tsx": `import { PageRenderer } from "./renderer/PageRenderer";
import { ThemeProvider } from "./renderer/ThemeProvider";
import { site } from "./site";

/**
 * Drop-in entry. Renders the first page of your generated site.
 * Copy the /renderer, /sections and /schema folders from Sbuild alongside this file.
 */
export default function App() {
  return (
    <ThemeProvider theme={site.theme}>
      <PageRenderer page={site.pages[0]} document={site} />
    </ThemeProvider>
  );
}
`,

    "README.md": `# ${doc.meta.name} — exported from Sbuild

${doc.meta.description}

## Contents
- \`site.json\` — your site as data (the source of truth)
- \`site.ts\` — typed accessor
- \`App.tsx\` — renders the home page

## Use it
1. Copy \`schema/\`, \`renderer/\` and \`sections/\` from your Sbuild project next to these files.
2. \`import App from "./App"\` and mount it.
3. Edit \`site.json\` (or regenerate in Sbuild) — the UI updates deterministically.

Generated ${new Date().toISOString().slice(0, 10)} · document version ${doc.version}
`,

    [`${safeName}.css`]: `/* Theme tokens — also embedded in App via ThemeProvider. */
:root{
  --background:${doc.theme.colors.background};
  --foreground:${doc.theme.colors.foreground};
  --primary:${doc.theme.colors.primary};
}
`,
  };
}
