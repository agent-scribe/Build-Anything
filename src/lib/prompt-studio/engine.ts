/* ── Prompt Studio AI Engine ─────────────────────────────────────── */
/* Provides smart mock analysis + real AI when ANTHROPIC_API_KEY is set */

import type {
  QualityScore,
  FollowUpQuestion,
  PromptVersion,
  RewriteMode,
  TokenEstimate,
} from "./types";

// ── Token estimation (BPE approximation: ~4 chars per token) ────
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function estimateCosts(tokens: number): TokenEstimate {
  return {
    tokens,
    costs: [
      {
        model: "Claude Sonnet 4",
        inputCost: `$${((tokens / 1_000_000) * 3).toFixed(4)}`,
        outputCost: `$${((tokens / 1_000_000) * 15).toFixed(4)}`,
        totalEstimate: `$${((tokens / 1_000_000) * 18).toFixed(4)}`,
      },
      {
        model: "Claude Haiku 4",
        inputCost: `$${((tokens / 1_000_000) * 0.8).toFixed(4)}`,
        outputCost: `$${((tokens / 1_000_000) * 4).toFixed(4)}`,
        totalEstimate: `$${((tokens / 1_000_000) * 4.8).toFixed(4)}`,
      },
      {
        model: "GPT-4o",
        inputCost: `$${((tokens / 1_000_000) * 2.5).toFixed(4)}`,
        outputCost: `$${((tokens / 1_000_000) * 10).toFixed(4)}`,
        totalEstimate: `$${((tokens / 1_000_000) * 12.5).toFixed(4)}`,
      },
      {
        model: "Gemini 2.5 Pro",
        inputCost: `$${((tokens / 1_000_000) * 1.25).toFixed(4)}`,
        outputCost: `$${((tokens / 1_000_000) * 10).toFixed(4)}`,
        totalEstimate: `$${((tokens / 1_000_000) * 11.25).toFixed(4)}`,
      },
    ],
  };
}

// ── Quality scoring (local heuristic — no AI needed) ────────────
export function scorePrompt(text: string): QualityScore {
  const words = text.trim().split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const hasSpecifics =
    /\d+|color|font|section|page|button|hero|pricing|feature/i.test(text);
  const hasTechTerms =
    /api|database|auth|react|next|tailwind|component|responsive/i.test(text);
  const hasAudience =
    /user|customer|visitor|audience|client|developer|designer/i.test(text);
  const hasDesignTerms =
    /dark|light|minimal|modern|gradient|clean|bold|elegant|theme/i.test(text);

  const clarity = Math.min(100, Math.round(
    (words > 5 ? 20 : 5) +
    (sentences > 1 ? 20 : 5) +
    (words > 15 ? 20 : 10) +
    (text.length > 50 ? 20 : 5) +
    (!/[A-Z]{5,}/.test(text) ? 20 : 5)
  ));

  const specificity = Math.min(100, Math.round(
    (hasSpecifics ? 30 : 0) +
    (hasTechTerms ? 20 : 0) +
    (hasDesignTerms ? 20 : 0) +
    (words > 20 ? 15 : words > 10 ? 10 : 0) +
    (/\d/.test(text) ? 15 : 0)
  ));

  const structure = Math.min(100, Math.round(
    (sentences > 2 ? 30 : sentences > 1 ? 15 : 5) +
    (/,/.test(text) ? 20 : 0) +
    (words > 30 ? 25 : words > 15 ? 15 : 5) +
    (/with|include|feature|section/i.test(text) ? 25 : 0)
  ));

  const completeness = Math.min(100, Math.round(
    (hasAudience ? 20 : 0) +
    (hasDesignTerms ? 20 : 0) +
    (hasSpecifics ? 20 : 0) +
    (hasTechTerms ? 15 : 0) +
    (words > 40 ? 25 : words > 20 ? 15 : 5)
  ));

  const overall = Math.round(
    clarity * 0.25 + specificity * 0.3 + structure * 0.2 + completeness * 0.25
  );

  let feedback: string;
  if (overall >= 80) feedback = "Excellent prompt! Highly detailed and well-structured.";
  else if (overall >= 60) feedback = "Good prompt. Add more specific details about design, features, or audience to improve.";
  else if (overall >= 40) feedback = "Decent start. Try specifying colors, sections, target audience, and key features.";
  else feedback = "Basic prompt. Add details: what type of site, who it's for, key sections, colors, and style.";

  return { overall, clarity, specificity, structure, completeness, feedback };
}

// ── Follow-up questions (smart, context-aware) ──────────────────
export function generateFollowUps(input: string): FollowUpQuestion[] {
  const lower = input.toLowerCase();
  const qs: FollowUpQuestion[] = [];
  let id = 0;

  // Always ask about audience
  if (!/audience|user|customer|who|target/i.test(lower)) {
    qs.push({
      id: `fq-${id++}`,
      question: "Who is the target audience for this site?",
      answer: "",
      category: "audience",
    });
  }

  // Design
  if (!/color|theme|dark|light|style|aesthetic|minimal/i.test(lower)) {
    qs.push({
      id: `fq-${id++}`,
      question: "What visual style do you prefer? (dark, light, minimal, bold, gradient)",
      answer: "",
      category: "design",
    });
  }

  // Features
  if (!/feature|section|hero|pricing|testimonial|blog|faq/i.test(lower)) {
    qs.push({
      id: `fq-${id++}`,
      question: "What key sections should the site include? (hero, features, pricing, testimonials, FAQ)",
      answer: "",
      category: "features",
    });
  }

  // Tech
  if (!/react|next|api|database|auth|integration/i.test(lower)) {
    qs.push({
      id: `fq-${id++}`,
      question: "Any specific integrations or technical requirements?",
      answer: "",
      category: "tech",
    });
  }

  // Business
  if (!/revenue|monetiz|pricing|plan|tier|subscription|free/i.test(lower)) {
    qs.push({
      id: `fq-${id++}`,
      question: "What's the business model? (SaaS subscription, one-time purchase, freemium, marketplace)",
      answer: "",
      category: "business",
    });
  }

  return qs.slice(0, 5);
}

// ── Prompt enhancement (builds structured prompt from raw input + answers) ──
export function enhancePrompt(
  raw: string,
  answers: FollowUpQuestion[],
  imageDescription?: string
): string {
  const answeredQs = answers.filter((q) => q.answer.trim());
  const parts: string[] = [];

  parts.push(`## Project Overview\n${raw}`);

  if (imageDescription) {
    parts.push(`\n## Reference Design\nBased on uploaded UI reference: ${imageDescription}`);
  }

  if (answeredQs.length > 0) {
    parts.push("\n## Requirements");
    for (const q of answeredQs) {
      const label =
        q.category === "audience" ? "Target Audience" :
        q.category === "features" ? "Key Features" :
        q.category === "design" ? "Visual Style" :
        q.category === "tech" ? "Technical Requirements" :
        "Business Model";
      parts.push(`- **${label}:** ${q.answer}`);
    }
  }

  parts.push("\n## Expected Output");
  parts.push(
    "Generate a complete, multi-section website with responsive design, " +
    "professional copy, and production-ready structure. Include all specified " +
    "sections with realistic placeholder content."
  );

  return parts.join("\n");
}

// ── Rewrite modes (local transformations) ───────────────────────
export function rewritePrompt(
  content: string,
  mode: RewriteMode
): PromptVersion {
  const id = `v-${Date.now()}-${mode}`;
  let rewritten: string;

  switch (mode) {
    case "shorter":
      rewritten = content
        .replace(/\n## Expected Output[\s\S]*$/, "")
        .replace(/\n## Requirements\n/g, "\nRequirements: ")
        .replace(/- \*\*([^*]+)\*\*: /g, "$1: ")
        .replace(/\n{2,}/g, "\n")
        .trim();
      break;

    case "detailed":
      rewritten = content +
        "\n\n## Additional Details\n" +
        "- Include hover states and micro-interactions for all interactive elements\n" +
        "- Add loading skeletons for dynamic content areas\n" +
        "- Ensure WCAG 2.1 AA accessibility compliance\n" +
        "- Implement proper heading hierarchy (h1 → h6)\n" +
        "- Use semantic HTML5 elements throughout\n" +
        "- Add Open Graph and Twitter Card meta tags\n" +
        "- Include structured data (JSON-LD) for SEO\n" +
        "- Design for mobile-first with breakpoints at 640px, 768px, 1024px, 1280px";
      break;

    case "creative":
      rewritten =
        "🎨 **Creative Brief**\n\n" +
        content.replace("## Project Overview", "## The Vision") +
        "\n\n## Creative Direction\n" +
        "- Push boundaries with unconventional layouts (asymmetric grids, overlapping elements)\n" +
        "- Use bold typography pairings (display + mono, serif + geometric sans)\n" +
        "- Add delightful micro-animations and scroll-triggered reveals\n" +
        "- Consider glassmorphism, gradient meshes, or grain textures\n" +
        "- Create memorable visual moments that users want to share";
      break;

    case "developer":
      rewritten =
        "# Technical Specification\n\n" +
        "## Stack: Next.js 15 + React 19 + Tailwind CSS 3.4 + TypeScript\n\n" +
        content +
        "\n\n## Technical Requirements\n" +
        "- Component architecture: atomic design pattern\n" +
        "- State management: Zustand with Immer\n" +
        "- API layer: Next.js Route Handlers with Zod validation\n" +
        "- Database: PostgreSQL via Prisma ORM\n" +
        "- Auth: NextAuth.js with OAuth providers\n" +
        "- Testing: Vitest + React Testing Library\n" +
        "- CI/CD: GitHub Actions → Vercel/Netlify\n" +
        "- Performance budget: LCP < 2.5s, CLS < 0.1, FID < 100ms";
      break;

    case "investor":
      rewritten =
        "# Investment-Ready Product Overview\n\n" +
        content.replace("## Project Overview", "## Product Description") +
        "\n\n## Market Opportunity\n" +
        "- TAM: $XX billion (web development tools market)\n" +
        "- Growing at XX% CAGR driven by AI adoption and no-code trends\n" +
        "- Key differentiator: AI-first approach with production-ready output\n\n" +
        "## Revenue Model\n" +
        "- Freemium SaaS with usage-based AI generation pricing\n" +
        "- Three tiers targeting individual creators to enterprise teams\n" +
        "- Net revenue retention target: 130%+\n\n" +
        "## Traction Metrics\n" +
        "- [Insert user count, MRR, growth rate]\n" +
        "- [Insert customer testimonials and NPS score]";
      break;

    case "seo":
      rewritten = content +
        "\n\n## SEO Requirements\n" +
        "- Target primary keyword in H1, meta title, and first paragraph\n" +
        "- Include LSI keywords naturally throughout content\n" +
        "- Add schema.org structured data (Organization, Product, FAQ)\n" +
        "- Optimize meta description (150-160 chars) with CTA\n" +
        "- Include alt text for all images with target keywords\n" +
        "- Internal linking strategy with descriptive anchor text\n" +
        "- Page speed optimization: lazy loading, WebP images, code splitting\n" +
        "- Implement canonical URLs and Open Graph tags";
      break;

    case "casual":
      rewritten = content
        .replace(/## /g, "")
        .replace(/\*\*/g, "")
        .replace("Project Overview\n", "Here's the idea:\n")
        .replace("Requirements\n", "What I need:\n")
        .replace("Expected Output\n", "What I'm looking for:\n") +
        "\n\nKeep it fun, friendly, and easy to navigate. Think of it like explaining the product to a friend over coffee.";
      break;

    case "formal":
      rewritten =
        "# Formal Project Specification\n\n" +
        "## 1. Executive Summary\n" +
        content.replace("## Project Overview\n", "") +
        "\n\n## 2. Scope of Work\n" +
        "The deliverable shall comprise a fully responsive, multi-page web application " +
        "meeting all requirements specified herein.\n\n" +
        "## 3. Acceptance Criteria\n" +
        "- All pages render correctly across Chrome, Firefox, Safari, and Edge\n" +
        "- Lighthouse scores: Performance ≥90, Accessibility ≥95, SEO ≥95\n" +
        "- WCAG 2.1 Level AA compliance verified\n" +
        "- All interactive elements function as specified";
      break;

    default:
      rewritten = content;
  }

  return {
    id,
    content: rewritten,
    mode,
    label: mode.charAt(0).toUpperCase() + mode.slice(1).replace("-", " "),
    timestamp: Date.now(),
    tokenCount: estimateTokens(rewritten),
  };
}

// ── Iterative improvement ───────────────────────────────────────
export function improvePrompt(content: string, iteration: number): string {
  const improvements = [
    // Iteration 1: Add structure
    (c: string) =>
      c +
      "\n\n## Performance & Quality\n" +
      "- Optimize all images with next/image or responsive srcset\n" +
      "- Implement code splitting for each page route\n" +
      "- Add error boundaries with graceful fallback UI\n" +
      "- Include loading states and skeleton screens",
    // Iteration 2: Add UX details
    (c: string) =>
      c +
      "\n\n## User Experience\n" +
      "- Smooth page transitions (300ms ease-in-out)\n" +
      "- Keyboard navigation support for all interactive elements\n" +
      "- Toast notifications for user actions\n" +
      "- Form validation with inline error messages\n" +
      "- Persistent user preferences (theme, language)",
    // Iteration 3: Add conversion optimization
    (c: string) =>
      c +
      "\n\n## Conversion Optimization\n" +
      "- Above-the-fold CTA with high contrast\n" +
      "- Social proof section (logos, testimonials, metrics)\n" +
      "- Urgency elements where appropriate (limited offer, countdown)\n" +
      "- Exit-intent popup with email capture\n" +
      "- A/B test-ready component variants",
    // Iteration 4: Add security & compliance
    (c: string) =>
      c +
      "\n\n## Security & Compliance\n" +
      "- HTTPS everywhere with HSTS headers\n" +
      "- CSRF protection on all forms\n" +
      "- Content Security Policy headers\n" +
      "- GDPR-compliant cookie consent\n" +
      "- Rate limiting on API endpoints",
  ];

  const idx = Math.min(iteration, improvements.length - 1);
  return improvements[idx](content);
}

// ── Image description mock (in production, use Claude vision) ──
export function describeImage(_dataUrl: string): string {
  return (
    "The uploaded design shows a modern web interface with a top navigation bar, " +
    "a hero section with a large heading and CTA button, a features grid below, " +
    "and a dark color scheme with accent colors. The layout uses a centered " +
    "container with generous whitespace and card-based content blocks."
  );
}
