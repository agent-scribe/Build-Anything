# Sbuild — Phase 2 Plan

**Phase 1 status: shipped and live.**
Live app: https://webuild-studio.netlify.app · Repo: github.com/agent-scribe/Build-Anything · Host: Netlify (auto-deploy from `main`)

---

## Where Phase 1 landed

Phase 1 delivered a working prompt-to-store builder on the principle that **the page is data, not code**: a typed `SiteDocument` (Zod) is generated, rendered by a deterministic component library, edited through a visual inspector, and exported as clean HTML or a React bundle.

Verified working on the live site:

- Prompt to a complete, validated site (navbar, hero, logos, products, features, testimonials, pricing, FAQ, CTA, newsletter, footer).
- E-commerce product cards with pricing, compare-at price, and add-to-cart.
- Live visual editing — inspector edits update the canvas instantly (content, layout, full theme color tokens, fonts, radius, mode).
- Layers panel (reorder, duplicate, hide, delete, add section), undo/redo, device preview.
- Export to a single clean `.html` file and a React component bundle.
- Local persistence (work survives refresh).

### The one known limitation (top of Phase 2)

The AI generation and export were built as **serverless route handlers** that call Claude. On Netlify, those functions do **not** return reliably — the `/api/generate` request hangs (the serverless layer buffers/stalls the streamed and even non-streamed response). To keep the live site fully functional, generation and export now run **client-side** against a high-quality built-in sample. **The complete Claude engine — system prompt, plan→generate→validate→repair pipeline, schema, and streaming route — is fully implemented in the repo and ready to activate.** Phase 2's first job is to make real AI generation run in production.

---

## Phase 2 north star

Turn the reliable demo into a real product: **real Claude generation in production, multi-page stores, deeper editing, real images, accounts, and a true checkout** — the feature set needed to actually sell a pre-revenue store built on Sbuild.

---

## Milestones

### M1 — Real AI generation in production *(highest priority)*

**Why:** the engine exists; it just needs a runtime that executes it. This converts "demo" into "AI".

- Move the serverless generation off Netlify Functions to a streaming-friendly runtime: deploy on **Vercel** (native RSC/route-handler streaming) or convert to **Netlify Edge Functions / background functions**. Recommendation: Vercel for the app, keep Netlify for static exports.
- Add a server capability probe (`/api/status` → `{ hasKey }`) so the client uses real Claude when a key is configured and falls back to the local builder otherwise.
- Re-enable the streaming pipeline path in the editor store (the SSE client code is preserved in git history) behind the probe.
- Set `ANTHROPIC_API_KEY` as an encrypted env var; add request timeouts, retries, and a per-user rate limit.
- **Acceptance:** a novel prompt produces a genuinely tailored, schema-valid site in production with visible streaming progress; invalid output is auto-repaired; no hung requests.

### M2 — Multi-page generation & navigation

- Generate `/`, `/products`, product detail, `/about`, `/cart`, `/checkout` as part of one `SiteDocument`.
- Page switcher in the dashboard; navbar links resolve to real pages; per-page SEO.
- **Acceptance:** a store generates 3+ linked pages that navigate correctly in preview and export.

### M3 — Deeper editing (the customizer that sells)

- **Drag-and-drop** section reordering (dnd-kit) replacing up/down arrows.
- **Per-item editing**: add/remove/reorder items inside sections — products, pricing plans, testimonials, features, FAQ.
- **Inline canvas editing**: click text on the canvas to edit in place.
- **AI-assisted edits**: "make it warmer", "rewrite this hero", "add a guarantee" — targeted Claude edits that patch the document, not full regeneration.
- **Acceptance:** a user can restructure and rewrite any section without touching the prompt, including one-click AI tone/restyle.

### M4 — Real images & assets

- Resolve `{{unsplash:keywords}}` tokens via the Unsplash API; optional AI image generation for hero/product shots.
- Asset uploads to **Cloudflare R2** (S3-compatible) with an asset picker in the inspector.
- **Acceptance:** generated and exported sites show real images, and users can replace any image.

### M5 — Accounts, persistence & autosave

- **Auth** (Clerk or Auth.js) and **Postgres via Prisma** (schema already modeled: `Project · Version · Asset`).
- Project list, autosave, named versions, restore. Replace `localStorage` as the source of truth.
- **Acceptance:** a signed-in user has multiple saved projects with version history across devices.

### M6 — Real e-commerce & checkout

- Cart drawer UI, product management, inventory, and a **Stripe** checkout (Stripe-hosted first, then embedded).
- Order confirmation and a basic orders view.
- **Acceptance:** a generated store can take a real test payment end-to-end.

### M7 — Export & deploy engine

- Multi-page export; full **Next.js project** export (not just a file map) as a downloadable `.zip` (JSZip).
- **One-click deploy** of an exported store to Netlify/Vercel via their deploy APIs.
- **Acceptance:** "Export → Deploy" publishes a generated store to a live URL in one flow.

### M8 — Monetization & polish

- Subscription tiers (the pricing UI already exists): free trial, Pro (custom domains, AI image gen, remove-branding), Studio (for resellers — fits the Flippa sell-pre-revenue-stores workflow).
- Quality: error boundaries, unit tests for schema/pipeline, Playwright E2E for generate→edit→export, analytics, and accessibility pass.

---

## Suggested sequence

1. **M1** (real AI in prod) — unblocks the core value.
2. **M3** (deeper editing) and **M4** (real images) in parallel — biggest perceived-quality jump.
3. **M5** (accounts) — required before monetization.
4. **M2** (multi-page), **M6** (checkout), **M7** (deploy), then **M8** (billing/polish).

## Technical notes carried from Phase 1

- Keep the schema (`page-schema.ts`) as the single source of truth; every new capability (multi-page, item editing, new sections) is a schema extension plus a renderer + inspector update.
- Prefer **Vercel** for the dynamic app to get first-class streaming; Netlify remains excellent for the **static exported** stores.
- Reuse the existing pure serializers (`lib/export/*`) for both client and server export — they already power the live client-side export.
