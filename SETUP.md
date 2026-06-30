# WeBuild — Buyer Setup Guide

This is a fully functional MVP running in **demo mode**. All features work out of the box with local browser storage. To connect real services, add the environment variables below.

---

## What's included (works immediately)

- ✅ AI site generation (with `ANTHROPIC_API_KEY`) or built-in sample fallback
- ✅ Visual editor: drag-drop, inline editing, AI edits, theme customizer
- ✅ Multi-page sites with navigation
- ✅ E-commerce: product cards, cart, checkout flow (simulated)
- ✅ Export: single HTML, multi-page ZIP, React project ZIP
- ✅ Local auth & project persistence (browser localStorage)
- ✅ Pricing page with 3 tiers (Free / Pro / Studio)

---

## Connect real services

### 1. Authentication (replace demo login with OAuth)

Add a real auth provider (NextAuth.js is pre-configured in the codebase — see `prisma/schema.prisma` for the adapter models):

```env
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# GitHub OAuth
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Database (replace localStorage with cloud persistence)

Connect any PostgreSQL database (Neon, Supabase, PlanetScale, etc.):

```env
DATABASE_URL="postgresql://user:pass@host:5432/webuild?sslmode=require"
```

Then run: `npx prisma db push`

### 3. Payments (replace simulated checkout with Stripe)

```env
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Create products in Stripe Dashboard and add price IDs:
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_STUDIO_PRICE_ID="price_..."
```

### 4. AI Generation

```env
ANTHROPIC_API_KEY="sk-ant-..."
```

---

## Architecture notes

- **Page is data, not code**: the AI generates a typed JSON `SiteDocument`, a deterministic renderer draws it, the editor mutates it, export serializes it.
- **Schema is truth**: `src/lib/schema/page-schema.ts` (Zod) defines every capability. New features = schema extension + renderer + inspector update.
- **Mock → Real swap**: The mock auth/db/checkout modules are in `src/lib/mock-auth/` and `src/lib/mock-db/`. Replace their imports with real implementations when you add credentials.

---

## Deployment

The app auto-deploys from `main` to Netlify. For full functionality (streaming AI, serverless routes), deploy on **Vercel**:

1. Import the repo on vercel.com
2. Set environment variables above
3. Deploy — that's it

Live demo: https://webuild-studio.netlify.app
