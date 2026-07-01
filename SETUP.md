# Sbuild — Production Setup Guide

This guide walks you through converting the MVP demo into a fully production-ready SaaS.

The MVP ships with mock implementations for auth, payments, database, and collaboration so it runs out of the box with zero configuration. Each section below explains what to swap and where.

---

## Quick Start (Demo Mode)

```bash
git clone https://github.com/agent-scribe/Build-Anything.git
cd Build-Anything
npm install
npm run dev
# Open http://localhost:3000
```

No API keys needed — everything works in demo mode.

---

## Environment Variables

Create `.env.local` in the project root:

```env
# AI Generation (required for real AI — without this, uses built-in samples)
ANTHROPIC_API_KEY=sk-ant-...

# Google Analytics (optional, free)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Unsplash Images (optional — uses placeholder URLs without this)
UNSPLASH_ACCESS_KEY=your-unsplash-key

# --- PRODUCTION UPGRADES (swap mocks for real services) ---

# Auth — NextAuth.js (code already scaffolded in src/lib/auth/)
# NEXTAUTH_SECRET=generate-a-random-secret
# NEXTAUTH_URL=https://yourdomain.com
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GITHUB_ID=...
# GITHUB_SECRET=...

# Database — Prisma (schema already in prisma/schema.prisma)
# DATABASE_URL=postgresql://user:pass@host:5432/webuild
# Recommended free tiers: Supabase, PlanetScale, Neon

# Payments — Stripe
# STRIPE_SECRET_KEY=sk_live_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Real-time Collaboration — Liveblocks or PartyKit
# LIVEBLOCKS_SECRET_KEY=sk_...
# NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...
```

---

## 1. AI Generation (Anthropic Claude)

**Current:** Falls back to built-in sample sites when no API key is set.
**To activate:** Add `ANTHROPIC_API_KEY` to `.env.local`.

- Model used: Claude Sonnet (configurable in `src/lib/ai/client.ts`)
- Cost: ~$0.01-0.05 per generation
- The AI prompt and schema are in `src/lib/ai/` — fully customizable

---

## 2. Authentication

**Current:** Mock auth via localStorage (`src/lib/mock-auth/`). Users can "sign up" and "log in" but it's client-side only.

**To go production:**

1. Install NextAuth: `npm install next-auth`
2. Uncomment the NextAuth env vars above
3. The auth scaffolding is already in `src/lib/auth/` — swap the mock provider imports in:
   - `src/app/dashboard/layout.tsx`
   - Any component importing `useMockAuth`
4. Set up OAuth apps on Google Cloud Console and/or GitHub Developer Settings (free)

**Free auth providers:** Google, GitHub, Discord — all free to integrate with NextAuth.

---

## 3. Database

**Current:** Projects stored in localStorage (`src/lib/mock-db/`).

**To go production:**

1. Set up a free PostgreSQL database:
   - **Supabase** — free tier: 500MB, 2 projects
   - **Neon** — free tier: 512MB
   - **PlanetScale** — free tier: 5GB (MySQL)
2. Add `DATABASE_URL` to `.env.local`
3. Run `npx prisma migrate dev` (schema already exists at `prisma/schema.prisma`)
4. Swap mock-db imports for Prisma client calls in `src/app/api/projects/`

---

## 4. Payments (Stripe)

**Current:** Simulated checkout (`src/lib/mock-stripe/`). Shows a success flow without real charges.

**To go production:**

1. Create a Stripe account at stripe.com
2. Add your Stripe keys to `.env.local`
3. Create products/prices in Stripe Dashboard matching the 3 tiers:
   - Free ($0), Pro ($29/mo), Studio ($99/mo)
4. Swap mock-stripe imports for real Stripe SDK calls in:
   - `src/app/api/checkout/route.ts`
   - `src/app/api/webhooks/stripe/route.ts`
5. Set up Stripe webhook endpoint for subscription lifecycle events

**Note:** Stripe supports 46+ countries. If your country isn't supported, alternatives include Paddle, LemonSqueezy, or Razorpay.

---

## 5. Real-time Collaboration

**Current:** Simulated locally (`src/lib/collab/`). Shows presence and share links but no actual WebSocket sync.

**To go production:**

1. **Liveblocks** (recommended) — generous free tier (up to 300 monthly active users)
   - `npm install @liveblocks/client @liveblocks/react`
   - Replace the mock collab store with Liveblocks hooks
2. **PartyKit** — free tier available, deploy on Cloudflare
3. **Yjs + y-websocket** — fully open source, self-host for free

---

## 6. Deployment

**Current:** Deployed on Netlify (free tier).

**Options (all have free tiers):**
- **Netlify** — current setup, auto-deploys from `main`
- **Vercel** — optimal for Next.js, free hobby tier
- **Cloudflare Pages** — generous free tier, global CDN
- **Railway** — free tier with $5 credit/month

---

## 7. Google Analytics

Already integrated. Just add `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` to `.env.local`.

Events tracked automatically:
- `generate_site` — when a user generates a site via AI
- `template_pick` — when a user selects a template
- `export_site` — when a user exports (HTML or React)
- `sign_up`, `begin_checkout`, `collab_connect`

---

## 8. Custom Domain

1. Buy a domain (Namecheap, Cloudflare, Google Domains)
2. In Netlify/Vercel: Settings → Domains → Add custom domain
3. Update `metadataBase` in `src/app/layout.tsx`
4. Update `sitemap.ts` base URL

---

## File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Marketing landing page
│   ├── features/           # Features page
│   ├── templates/          # Public template gallery
│   ├── pricing/            # Pricing page
│   ├── dashboard/          # Main editor dashboard
│   └── api/                # API routes (generate, export, checkout)
├── components/
│   ├── dashboard/          # Editor UI (Topbar, Sidebar, Inspector, Canvas)
│   └── sections/           # 22 renderable section components
├── lib/
│   ├── ai/                 # Claude AI generation logic
│   ├── collab/             # Collaboration store (mock → Liveblocks)
│   ├── mock-auth/          # Mock auth (→ NextAuth)
│   ├── mock-db/            # Mock persistence (→ Prisma)
│   ├── mock-stripe/        # Mock checkout (→ Stripe)
│   ├── store/              # Zustand editor store
│   ├── templates/          # 2,001 template catalog
│   ├── schema/             # Zod page schema (single source of truth)
│   └── analytics.ts        # GA4 event helpers
└── styles/                 # Tailwind config, globals
```

---

## Revenue Potential

With the infrastructure above (most of it free-tier), here's the unit economics:

| Plan | Price | AI Cost/gen | Margin |
|------|-------|-------------|--------|
| Free | $0 | ~$0.03 | Marketing funnel |
| Pro | $29/mo | ~$0.03 | ~97% |
| Studio | $99/mo | ~$0.03 | ~99% |

At 100 Pro subscribers: **$2,900/mo MRR** with <$50/mo infrastructure cost.
