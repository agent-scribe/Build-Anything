# Sbuild — AI Website & Store Generator

**Live demo:** [webuild-studio.netlify.app](https://webuild-studio.netlify.app)

Describe any business in plain English and get a beautiful, editable, high-converting website or online store in seconds. Customize visually, then export clean React or HTML code.

---

## What's Included

- **AI-Powered Generation** — Claude AI turns a prompt into a complete multi-page site
- **10,001 Starter Templates** — 4,301 e-commerce + 5,700 website templates across 19 categories
- **Visual Editor** — Drag-and-drop sections, inline text editing, AI-assisted edits
- **22 Section Types** — Hero, features, pricing, testimonials, gallery, team, blog, contact, timeline, video, and 12 more
- **E-Commerce Built In** — Product catalogs, cart drawer, checkout flow, order confirmation
- **Multi-Page Sites** — Generate and manage multiple pages with shared navigation
- **Export** — Clean HTML or React component bundle
- **3-Tier Pricing** — Free / Pro ($29/mo) / Studio ($99/mo) subscription pages
- **Collaboration Foundation** — Presence awareness, share links, cursor tracking
- **Google Analytics** — Event tracking for generation, template picks, exports
- **SEO Optimized** — Sitemap, robots.txt, OpenGraph meta, semantic HTML
- **Marketing Site** — Landing page, features page, public template gallery, pricing page
- **Responsive** — Works on desktop, tablet, and mobile
- **Dark Mode UI** — Professional editor interface (Linear/Vercel aesthetic)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS 3.4 |
| State | Zustand + Immer (undo/redo) |
| AI | Anthropic Claude SDK |
| Schema | Zod (single source of truth) |
| Icons | Lucide React |
| Analytics | Google Analytics 4 |
| Deploy | Netlify (auto-deploy from main) |

## Quick Start

```bash
git clone https://github.com/agent-scribe/Build-Anything.git
cd Build-Anything
npm install
npm run dev
```

Works immediately in demo mode — no API keys required. See [SETUP.md](./SETUP.md) for production configuration.

## How It Works

**The page is data, not code.** The AI emits a typed JSON `SiteDocument` (validated by Zod). A deterministic renderer draws it. The editor mutates the document. Export serializes it. This architecture makes generation reliable, editing trivial, and export clean.

```
prompt → [plan → generate → validate → repair] → SiteDocument → renderer → canvas
                         (Claude AI)     (Zod)                    (React)
```

## MVP Status

This is a fully functional MVP with mock implementations for rapid demo:

| Feature | MVP (Current) | Production (Buyer Adds) |
|---|---|---|
| Auth | localStorage mock | NextAuth + Google/GitHub OAuth |
| Database | localStorage | PostgreSQL via Prisma (Supabase free tier) |
| Payments | Simulated checkout | Stripe / Paddle / LemonSqueezy |
| Collaboration | Local simulation | Liveblocks / PartyKit (free tiers) |
| AI | Demo fallback + real Claude | Anthropic API key |
| Images | Placeholder URLs | Unsplash API (free) |

All integration points are clearly documented in [SETUP.md](./SETUP.md). Every mock can be swapped independently — the architecture is modular.

## Revenue Potential

| Scenario | MRR | Annual |
|---|---|---|
| 50 Pro ($29) + 10 Studio ($99) | $2,440 | $29,280 |
| 100 Pro + 25 Studio | $5,375 | $64,500 |
| 200 Pro + 50 Studio | $10,750 | $129,000 |

Infrastructure cost at scale: <$50/month (AI generation is pay-per-use at ~$0.03/generation).

## File Structure

```
src/
├── app/                    # Pages (landing, features, templates, pricing, dashboard)
├── components/
│   ├── dashboard/          # Editor UI (Topbar, Sidebar, Inspector, Canvas, Collab)
│   └── sections/           # 22 renderable section types
├── lib/
│   ├── ai/                 # Claude AI pipeline
│   ├── collab/             # Collaboration system
│   ├── templates/          # 10,001 template catalog (combinator pattern)
│   ├── schema/             # Zod page schema
│   ├── store/              # Zustand editor store
│   ├── mock-auth/          # → swap for NextAuth
│   ├── mock-db/            # → swap for Prisma
│   └── mock-stripe/        # → swap for Stripe
```

## Scripts

```bash
npm run dev         # development server
npm run build       # production build
npm run typecheck   # TypeScript check
npm run lint        # ESLint
```

## License

Proprietary — all rights transfer to buyer upon purchase.
