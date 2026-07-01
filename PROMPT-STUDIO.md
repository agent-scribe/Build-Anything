# Prompt Studio — AI Prompt Engineering Platform

WeBuild's Prompt Studio transforms a basic prompt input into an intelligent prompt engineering workflow. Users enter a rough idea and receive quality-scored, AI-enhanced, multi-version prompts they can refine, save, and export.

## Live URL

https://webuild-studio.netlify.app/prompt-studio

---

## User Workflow

```
1. Enter rough idea  →  "I want a SaaS landing page for a code review tool"
2. AI Quality Score   →  Scores clarity, specificity, structure, completeness (0-100)
3. Follow-up Questions →  3-5 smart questions about audience, design, features, tech, business model
4. Enhanced Prompt    →  Structured prompt with all context merged
5. Rewrite Versions   →  8 modes: Shorter, Detailed, Creative, Developer, Investor, SEO, Casual, Formal
6. Refine / Save / Export → Iterate with "Improve Again", save to history, export MD/TXT/JSON/PDF
```

---

## Features

### Quality Scoring
Local heuristic scoring (no API calls) evaluates prompts on four dimensions:
- **Clarity** — sentence count, length, readability
- **Specificity** — mentions of concrete elements (colors, sections, features)
- **Structure** — comma usage, sentence variety, section keywords
- **Completeness** — audience, design terms, tech terms, overall depth

Score breakdown is displayed with color-coded progress bars and actionable feedback.

### Smart Follow-Up Questions
Context-aware question generation that only asks what's missing:
- Skips audience question if the input already mentions users/customers
- Skips design question if colors/themes are specified
- Skips tech question if frameworks/APIs are mentioned
- Maximum 5 questions, minimum 0 (auto-enhances if input is already detailed)

### AI Rewrite Modes (8 Modes)
| Mode | What It Does |
|------|-------------|
| Shorter | Strips boilerplate, condenses to essentials |
| More Detailed | Adds accessibility, SEO, responsive breakpoints |
| More Creative | Adds creative direction: asymmetric layouts, bold typography, animations |
| Developer Ready | Adds full tech spec: stack, architecture, testing, CI/CD, perf budgets |
| Investor Pitch | Adds market opportunity, revenue model, traction metrics |
| SEO Optimized | Adds keyword strategy, schema markup, meta optimization |
| Casual Tone | Rewrites in friendly, conversational language |
| Formal / Enterprise | Restructures as formal spec with acceptance criteria |

### Iterative Improvement ("Improve Again")
Each click adds a new layer of requirements:
1. Performance & Quality (image optimization, code splitting, error boundaries)
2. User Experience (transitions, keyboard nav, toast notifications)
3. Conversion Optimization (CTA placement, social proof, exit intent)
4. Security & Compliance (HTTPS, CSRF, CSP, GDPR)

### Token & Cost Calculator
Estimates token count (~4 chars/token BPE approximation) and shows costs for:
- Claude Sonnet 4 ($3/$15 per 1M tokens)
- Claude Haiku 4 ($0.80/$4 per 1M tokens)
- GPT-4o ($2.50/$10 per 1M tokens)
- Gemini 2.5 Pro ($1.25/$10 per 1M tokens)

### Multi-Format Export
- **Markdown (.md)** — direct download
- **Plain Text (.txt)** — direct download
- **JSON (.json)** — includes prompt content + metadata (mode, tokens, timestamp)
- **PDF** — opens print dialog via new window

### Prompt History
- Saves up to 50 entries in localStorage
- Favorite/unfavorite entries
- Delete individual entries
- Load any past prompt with full version history
- Quality score preview bar per entry

### Favorite Templates (16 Templates, 7 Categories)
Pre-built prompts users can load and customize:
- **SaaS** — CRM Platform, Analytics Dashboard, Project Management
- **Portfolio** — Developer Portfolio, Designer Portfolio
- **E-Commerce** — Fashion Store, Tech Gadgets Store
- **AI Agent** — AI Chatbot Platform, AI Workflow Automation
- **Mobile App** — Fitness App, Finance App
- **Dashboard** — Admin Dashboard, IoT Monitor
- **Landing Page** — Startup Launch, Event/Conference

### Image Upload
Users can upload a UI screenshot or sketch. The system generates a description of the design that's merged into the enhanced prompt. (Uses mock description in MVP; production would use Claude Vision API.)

### Live Preview with Syntax Highlighting
Output panel shows prompt with:
- Line numbers
- Color-coded syntax (headers in purple, list items in cyan, bold in yellow)
- Scrollable with hover highlights

---

## Architecture

### File Structure

```
src/
├── app/prompt-studio/
│   └── page.tsx              # Main Prompt Studio page (single-file UI)
├── lib/prompt-studio/
│   ├── types.ts              # TypeScript types & constants
│   ├── engine.ts             # AI engine: scoring, follow-ups, rewriting, improvement
│   ├── store.ts              # Zustand store with localStorage persistence
│   └── templates.ts          # 16 favorite templates across 7 categories
```

### Key Types

```typescript
type RewriteMode = "shorter" | "detailed" | "creative" | "developer" | "investor" | "seo" | "casual" | "formal";
type PromptCategory = "saas" | "portfolio" | "ecommerce" | "ai-agent" | "mobile-app" | "dashboard" | "landing-page";
type StudioStatus = "idle" | "analyzing" | "asking" | "enhancing" | "rewriting" | "improving" | "done" | "error";

interface QualityScore {
  overall: number;    // 0-100
  clarity: number;
  specificity: number;
  structure: number;
  completeness: number;
  feedback: string;
}

interface PromptVersion {
  id: string;
  content: string;
  mode: RewriteMode | "original" | "enhanced" | "improved";
  label: string;
  timestamp: number;
  tokenCount: number;
}

interface PromptHistoryEntry {
  id: string;
  rawInput: string;
  enhancedPrompt: string;
  versions: PromptVersion[];
  qualityScore: QualityScore | null;
  followUps: FollowUpQuestion[];
  category: PromptCategory | null;
  imageDataUrl: string | null;
  timestamp: number;
  favorite: boolean;
}
```

### State Management (Zustand)

The store manages the entire pipeline state:
- `rawInput` / `imageDataUrl` — user inputs
- `status` — current pipeline step
- `qualityScore` / `followUps` — analysis results
- `enhancedPrompt` / `versions` — generated outputs
- `history` — persisted to localStorage (max 50 entries)

Key actions: `analyze()`, `submitAnswers()`, `rewrite(mode)`, `improve()`, `saveToHistory()`, `loadFromHistory(id)`, `loadTemplate(prompt)`.

### Engine (No API Required)

All prompt analysis and rewriting runs locally in the browser:
- `scorePrompt()` — regex-based heuristic scoring
- `generateFollowUps()` — context-aware question selection
- `enhancePrompt()` — structured prompt builder
- `rewritePrompt()` — mode-specific transformations
- `improvePrompt()` — iterative enhancement layers
- `estimateTokens()` / `estimateCosts()` — BPE approximation + model pricing
- `describeImage()` — mock image description (replace with Claude Vision in production)

---

## Production Upgrade Notes

### Buyer: Connect Real AI
Replace the local engine functions with API calls to Claude/GPT for:
1. **Quality scoring** — AI-powered analysis instead of regex heuristics
2. **Follow-up questions** — Context-aware questions generated by AI
3. **Prompt enhancement** — AI restructures and improves the prompt
4. **Rewrite modes** — AI generates genuinely different versions
5. **Image description** — Claude Vision API for uploaded screenshots

### Buyer: Add Authentication
Currently uses localStorage. After connecting auth (NextAuth.js):
- Save history to database instead of localStorage
- Per-user prompt history and favorites
- Usage limits per subscription tier

### Buyer: Monetize
- Free tier: 5 analyses/month, 3 rewrite modes
- Pro tier: Unlimited analyses, all 8 modes, PDF export
- Studio tier: AI-powered scoring, team sharing, API access

---

## Navigation Integration

Prompt Studio is linked from:
- Landing page navbar
- Landing page footer
- Dedicated CTA section on landing page (with "NEW" badge)
- Sitemap (`/prompt-studio`)

---

## Dependencies

- `zustand` — state management
- `lucide-react` — icons
- `next/link` — routing
- No additional packages required

---

## Local Development

```bash
cd webuild
npm install
npm run dev
# Visit http://localhost:3000/prompt-studio
```

No API keys needed — everything runs client-side with local mock engine.
