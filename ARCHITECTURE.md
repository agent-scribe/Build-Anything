# Sbuild — Phase 1: Core Architecture & Engine

> Prompt-to-store AI builder. A user describes a business; the system generates a
> tailored, high-converting, editable site represented as structured data, renders
> it live, and exports it as a clean React/Next.js bundle or static HTML/CSS/JS.

This document defines the system that everything else in Phase 1 is built around.
The guiding principle is **the page is data, not code**. The LLM never writes JSX.
It emits a strictly-typed JSON document (the *Site Document*) that our own
deterministic renderer turns into UI. This is what makes generation reliable,
editing trivial, and export clean.

---

## 1. Tech Stack & System Architecture

### 1.1 The recommendation at a glance

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router, RSC) | One codebase for UI, API route handlers, server actions, and streaming. First-class Vercel deploy. |
| Language | **TypeScript (strict)** | The schema is the contract; types enforce it end-to-end. |
| UI | **React 19 + Tailwind CSS v4** | Utility CSS maps cleanly to a token-driven renderer and to clean exported markup. |
| Primitives | **Radix UI** (unstyled) + **Lucide React** icons | Accessible behavior, zero visual lock-in, tiny export footprint. |
| Animation | **Framer Motion** | Canvas transitions, section reordering, drag. |
| Client state | **Zustand** (+ `immer`, `persist`, `temporal`/zundo for undo) | The editor is a single document mutated by many small actions. Zustand is the right size — no boilerplate, surgical re-renders. |
| Server state | **TanStack Query** | Generation jobs, project list, autosave. |
| AI | **Anthropic Claude** via the official SDK + **Vercel AI SDK** for streaming | Claude is strong at structured/long-form JSON. AI SDK gives us SSE streaming and a provider-swappable interface. |
| Validation | **Zod** (source of truth) → JSON Schema (for the model) | One schema definition powers TS types, runtime validation, *and* the model's output contract. |
| DB | **PostgreSQL** (Neon serverless) + **Prisma** | Relational fits projects→pages→versions. Neon scales to zero and branches per-PR. |
| Auth | **Clerk** (or Auth.js if you want zero vendor) | Drop-in, organizations/teams ready for when you sell seats. |
| Asset storage | **Cloudflare R2** (S3-compatible) | Generated/ uploaded images. No egress fees. |
| Background jobs | **Inngest** | Long generations, export bundling, retries — without managing a queue. |
| Deploy | **Vercel** | Edge streaming for generation, preview deploys for exported sites. |

You can ship Phase 1 with a thinner cut: **Next.js + Zustand + Zod + Anthropic SDK**,
storing the document in `localStorage` and Postgres only. Auth, R2, and Inngest
slot in without touching the core engine because the engine only ever speaks
*Site Document*.

### 1.2 System diagram (data flow)

```
                         ┌─────────────────────────────────────────────┐
                         │                BROWSER (Next.js)             │
                         │                                             │
  user prompt ─────────► │  Dashboard Workspace                        │
                         │   ├─ PromptComposer                         │
                         │   ├─ CanvasPreview ◄── PageRenderer ◄─┐     │
                         │   ├─ Inspector (visual customizer)    │     │
                         │   └─ Zustand editorStore (the doc) ───┘     │
                         └──────────────┬──────────────────────────────┘
                                        │  POST /api/generate (SSE)
                                        ▼
                         ┌─────────────────────────────────────────────┐
                         │            SERVER (Route Handler)            │
                         │                                             │
                         │   generatePipeline()                        │
                         │     1. PLAN     → section order + intent     │
                         │     2. GENERATE → full Site Document JSON    │
                         │     3. VALIDATE → Zod safeParse              │
                         │     4. REPAIR   → feed errors back, retry    │
                         │           ▲___________________│ (≤2x)        │
                         │                                             │
                         │   Anthropic Claude  ◄── system prompt +     │
                         │                         JSON Schema          │
                         └──────────────┬──────────────────────────────┘
                                        │ validated SiteDocument
                                        ▼
                         ┌─────────────────────────────────────────────┐
                         │  Postgres (Prisma): Project · Page · Version │
                         │  R2: assets        Inngest: export jobs      │
                         └─────────────────────────────────────────────┘

  EXPORT:  SiteDocument ──► /api/export ──► PageRenderer (SSR to string)
                                          └► codegen (.tsx bundle)  ──► .zip
```

### 1.3 Why "page is data"

Every hard part of this product gets easier when the page is a validated document:

- **Reliable generation** — the model fills a known shape, not freeform code. We can
  `safeParse` the output and reject/repair anything malformed before it ever reaches the UI.
- **Trivial editing** — the visual customizer is just typed mutations on the document
  (`setSectionProp`, `reorderSections`, `setThemeToken`). Undo/redo is document history.
- **Clean export** — two deterministic functions: `document → React bundle` and
  `document → static HTML`. No "AI-written code" to audit.
- **Cheap iteration** — re-themes and copy rewrites are partial document edits, not full regenerations.

### 1.4 AI orchestration layer

A four-stage pipeline (implemented in `src/lib/ai/pipeline.ts`):

1. **Plan** — a fast model call returns the *section order* and a one-line intent per
   section given the business description. Cheap, deterministic-ish, and it dramatically
   improves the quality of stage 2 (the model commits to structure before writing content).
2. **Generate** — the main call. System prompt + injected JSON Schema + the plan →
   a complete `SiteDocument`. We request JSON output and stream it for UX.
3. **Validate** — `SiteDocumentSchema.safeParse`. On success we're done.
4. **Repair** — on failure we send Claude the *exact Zod issues* plus its previous output
   and ask for a corrected document. Bounded to 2 attempts, after which we surface a typed error.

This loop is the reliability backbone: model creativity in stage 2, deterministic
guarantees in stages 3–4.

---

## 2–4

The remaining Phase 1 deliverables live next to this file:

- **JSON Schema for page layouts** → `src/lib/schema/page-schema.ts` (Zod source of truth)
  and `src/lib/schema/json-schema.ts` (the schema string injected into the prompt).
- **Core generator prompt** → `src/lib/ai/generator-prompt.ts`.
- **Generation engine** → `src/lib/ai/pipeline.ts`, `src/lib/ai/client.ts`, `src/app/api/generate/route.ts`.
- **Dashboard workspace** → `src/components/dashboard/*` mounted at `src/app/dashboard/page.tsx`.
- **Renderer & component library** → `src/components/sections/*` + `src/components/renderer/*`.
- **Export engine** → `src/app/api/export/route.ts` + `src/lib/export/*`.

## Folder map

```
webuild/
├─ prisma/schema.prisma            data model: User · Project · Page · Version · Asset
├─ src/
│  ├─ app/
│  │  ├─ dashboard/page.tsx         mounts the workspace
│  │  ├─ api/generate/route.ts      streaming generation endpoint
│  │  └─ api/export/route.ts        export engine
│  ├─ components/
│  │  ├─ dashboard/                 Sidebar · Topbar · PromptComposer · CanvasPreview · Inspector
│  │  ├─ sections/                  Navbar · Hero · Features · Pricing · Products · Testimonials · FAQ · CTA · Footer
│  │  └─ renderer/                  ThemeProvider · PageRenderer (schema → UI)
│  ├─ lib/
│  │  ├─ schema/                    page-schema.ts (Zod) · json-schema.ts · defaults.ts
│  │  ├─ ai/                        generator-prompt.ts · client.ts · pipeline.ts
│  │  ├─ store/                     useEditorStore.ts (Zustand)
│  │  ├─ ecommerce/                 cart.ts (cart state) · types.ts
│  │  └─ utils/                     cn.ts · id.ts
│  └─ types/index.ts
└─ ARCHITECTURE.md                  (this file)
```

## Running it

```bash
cd webuild
npm install
cp .env.example .env.local        # add ANTHROPIC_API_KEY
npm run dev                        # http://localhost:3000/dashboard
```

The dashboard runs with a built-in mock generation path if no API key is present,
so the UI is fully explorable before you wire billing/keys.
