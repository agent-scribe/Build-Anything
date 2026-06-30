# WeBuild

Prompt-to-store AI builder. Describe a business → get a beautiful, editable,
high-converting site → customize it visually → export clean code.

This repo is **Phase 1: the core architecture and engine**. It runs end-to-end
today: generate (real or demo), edit on a live canvas, theme it, and export.

## Quickstart

```bash
npm install
cp .env.example .env.local      # optional: add ANTHROPIC_API_KEY for live generation
npm run dev                     # → http://localhost:3000/dashboard
```

No API key? The dashboard runs a built-in **demo generator** (returns a complete
sample store) so the entire UI is explorable offline. Add `ANTHROPIC_API_KEY` to
switch to real Claude generation automatically.

## How it works (the one idea)

**The page is data, not code.** The model never writes JSX — it emits a strictly
typed JSON `SiteDocument`. A deterministic renderer turns that document into UI;
the editor mutates the document; export serializes it. This is what makes
generation reliable, editing trivial, and export clean.

```
prompt → [plan → generate → validate → repair] → SiteDocument → renderer → canvas
                         (Claude)        (Zod)                    (your code)
```

## Phase 1 deliverable map

| Deliverable | Where |
|---|---|
| Tech stack & architecture | `ARCHITECTURE.md` |
| JSON layout schema (source of truth) | `src/lib/schema/page-schema.ts` |
| Model-facing contract | `src/lib/schema/json-schema.ts` |
| Core generator system prompt | `src/lib/ai/generator-prompt.ts` |
| Generation engine (plan→validate→repair) | `src/lib/ai/pipeline.ts`, `client.ts` |
| Streaming API | `src/app/api/generate/route.ts` |
| Export engine (HTML + React) | `src/app/api/export/route.ts`, `src/lib/export/*` |
| Editor state (Zustand + undo) | `src/lib/store/useEditorStore.ts` |
| Cart state | `src/lib/ecommerce/cart.ts` |
| Section library + renderer | `src/components/sections/*`, `src/components/renderer/*` |
| **Dashboard workspace** | `src/components/dashboard/*` |

## Scripts

```bash
npm run dev         # start the dashboard
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run db:push     # push prisma schema (needs DATABASE_URL)
```

## Notes

- **Tailwind**: pinned to v3.4 for a clean first-run. The app chrome uses core
  utilities; generated sites are themed entirely via CSS variables, so migrating
  to v4 later touches nothing in the renderer.
- **Persistence**: the Prisma schema models `Project · Version · Asset` with the
  document stored as JSON. Wiring it to the store is Phase 1.5 (auth + autosave).
- **Demo vs live**: `hasAnthropicKey()` decides automatically — no flags.

## What's next (Phase 2)

Multi-page generation, drag-and-drop section reordering, AI re-theme ("make it
warmer"), per-item content editing (products, plans, testimonials), real image
generation/Unsplash resolution, auth + autosave, and one-click Vercel deploy of
exported sites.
