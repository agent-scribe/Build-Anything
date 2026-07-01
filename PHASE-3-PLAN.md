# Sbuild — Phase 3 Plan

**Phase 2 status: shipped.** All 8 milestones complete. MVP runs in demo mode with zero config.
Live app: https://webuild-studio.netlify.app · Repo: github.com/agent-scribe/Build-Anything

---

## Where Phase 2 landed

Phase 2 turned the demo into a product: real Claude AI generation, multi-page sites, deep visual editing (drag-drop, inline, AI edits), Unsplash images, mock auth & persistence, cart + simulated checkout, subscription tiers, export (HTML/ZIP/React), error handling, SEO. Everything works out of the box; buyers swap in real credentials via `SETUP.md`.

### Current section types (12)
navbar, hero, features, products, pricing, testimonials, faq, cta, newsletter, logos, stats, footer

---

## Phase 3 north star

**Scale the template library to 100+ ready-to-use designs, add missing section types, build the marketing site that sells Sbuild, and lay groundwork for real-time collaboration.** This phase turns "a tool" into "a platform with a catalog."

---

## Milestones

### M1 — New section types (expand the building blocks)

Add 10 new section types to the schema + renderer + inspector. Each is a schema extension following the existing pattern.

| Section | Description |
|---------|-------------|
| `gallery` | Image grid/masonry with lightbox, captions, filtering |
| `team` | Team member cards with photo, role, bio, social links |
| `blog` | Blog post cards with thumbnail, date, excerpt, read-more |
| `contact` | Contact form with name/email/message + map embed slot |
| `comparison` | Feature comparison table (checkmarks, plans as columns) |
| `timeline` | Vertical timeline with dates, titles, descriptions |
| `video` | Video embed section (YouTube/Vimeo) with overlay text |
| `banner` | Announcement/promo banner with dismiss, countdown timer |
| `portfolio` | Project showcase cards with category filtering |
| `metrics` | Animated counter cards (revenue, users, growth %) |

**Acceptance:** All 10 render correctly, are editable in the inspector, can be drag-dropped, and the AI generator can produce them.

### M2 — Template engine & starter library (100+ templates)

Build a template system and populate it with 100+ industry-specific starter sites.

**Architecture:**
- `src/lib/templates/registry.ts` — typed template registry with metadata (name, category, industry, tags, thumbnail, SiteDocument)
- Templates are static JSON files under `src/lib/templates/data/` — one per template
- Template picker UI in the dashboard (replaces/augments the prompt composer for quick starts)
- Categories: E-commerce (30+), SaaS/Tech (20+), Creative/Portfolio (15+), Services (15+), Food & Hospitality (10+), Health & Fitness (10+)

**Template list (100+ across categories):**

**E-commerce (30):**
1. Minimalist Fashion Store
2. Luxury Jewelry Boutique
3. Organic Skincare Shop
4. Sneaker Drop Store
5. Vintage Clothing Marketplace
6. Pet Supplies Store
7. Electronics & Gadgets
8. Handmade Crafts Shop
9. Home Decor Store
10. Gourmet Food & Wine
11. Subscription Box Service
12. Kids Clothing Store
13. Outdoor & Adventure Gear
14. Beauty & Cosmetics
15. Plant & Garden Shop
16. Book Store
17. Candle & Fragrance Shop
18. Fitness Equipment Store
19. Art Prints & Posters
20. Phone Accessories
21. Sustainable Fashion
22. Watches & Accessories
23. Coffee & Tea Shop
24. Sports Memorabilia
25. Musical Instruments
26. Toy & Game Store
27. Stationery & Office
28. Automotive Parts
29. Eyewear Store
30. Gift & Novelty Shop

**SaaS & Tech (20):**
31. AI/ML Product Landing
32. Developer Tools Platform
33. Project Management SaaS
34. Analytics Dashboard SaaS
35. CRM Software Landing
36. Email Marketing Platform
37. Cloud Storage Service
38. Cybersecurity Product
39. API Platform / DevTools
40. No-Code Builder Landing
41. Video Conferencing App
42. HR & Recruiting Platform
43. Fintech / Banking App
44. EdTech Learning Platform
45. Social Media Management
46. Design Tool Landing
47. Automation Platform
48. Data Pipeline Tool
49. Customer Support SaaS
50. Startup Launch Page

**Creative & Portfolio (15):**
51. Photographer Portfolio
52. Design Agency
53. Freelance Developer
54. Architect / Interior Design
55. Video Production Studio
56. Music Artist / Band
57. Illustrator Showcase
58. Motion Graphics Studio
59. UX/UI Designer Portfolio
60. Creative Agency
61. Wedding Photographer
62. 3D Artist Portfolio
63. Copywriter / Content Creator
64. Tattoo Artist Studio
65. Film Director Portfolio

**Professional Services (15):**
66. Law Firm
67. Accounting & Tax
68. Marketing Agency
69. Consulting Firm
70. Real Estate Agency
71. Insurance Broker
72. Financial Advisor
73. IT Services / MSP
74. Recruitment Agency
75. Architecture Firm
76. Dental Practice
77. Veterinary Clinic
78. Cleaning Service
79. Plumbing / HVAC
80. Moving Company

**Food & Hospitality (10):**
81. Fine Dining Restaurant
82. Pizza / Fast Casual
83. Coffee House / Café
84. Bakery & Pastry Shop
85. Food Truck / Street Food
86. Brewery / Taproom
87. Sushi / Japanese Restaurant
88. Hotel & Resort
89. Catering Service
90. Meal Prep / Delivery

**Health & Fitness (10):**
91. Personal Trainer
92. Yoga Studio
93. CrossFit / Gym
94. Nutrition Coach
95. Mental Health Therapist
96. Spa & Wellness
97. Martial Arts Academy
98. Dance Studio
99. Physical Therapy Clinic
100. Medical Practice

**Bonus (5):**
101. Nonprofit / Charity
102. Church / Religious Org
103. School / University
104. Event / Conference
105. Podcast Landing Page

**Acceptance:** Template picker shows all 100+ templates with thumbnails, category filtering, and search. One click loads a full SiteDocument into the editor.

### M3 — Landing page & marketing site

Build the public-facing marketing site that sells Sbuild itself. This replaces the redirect-to-dashboard homepage.

**Pages:**
- `/` — Hero with live demo embed, feature grid, social proof, pricing CTA
- `/features` — Detailed feature breakdown with screenshots
- `/templates` — Public template gallery (browse before signing up)
- `/pricing` — Enhanced pricing page (already exists, polish it)

**Components:**
- Live demo embed (iframe of the dashboard in read-only mode)
- Feature comparison with competitors
- Customer testimonial carousel
- "Built with Sbuild" showcase gallery
- CTA sections with conversion tracking hooks

**Acceptance:** A visitor can browse the marketing site, see templates, understand pricing, and click through to the dashboard.

### M4 — Real-time collaboration (foundation)

Lay the groundwork for multi-user editing. Full Figma-style collab is Phase 4; this milestone builds the infrastructure.

- **WebSocket server** (via Partykit or Liveblocks) for document sync
- **Presence awareness**: show connected users' cursors/avatars in the editor
- **Conflict resolution**: operational transform or CRDT for concurrent edits to the SiteDocument JSON
- **Share link**: generate a shareable URL that gives another user edit access

**Acceptance:** Two users can open the same project and see each other's cursors. Edits from one appear in the other's view within 500ms. No data loss on concurrent edits.

---

## Suggested sequence

1. **M1** (new sections) — unblocks template variety
2. **M2** (100+ templates) — biggest value-add for the catalog
3. **M3** (landing page) — needs templates to showcase
4. **M4** (collaboration) — infrastructure, can run in parallel with M3

## Technical notes

- Each new section type follows the pattern: Zod schema union member → renderer component → inspector fields → generator prompt update → defaults entry
- Templates are pure data (SiteDocument JSON) — no code per template, just different prop combinations
- The generator prompt should reference available templates so AI can remix them
- Landing page can use Sbuild's own section components (dogfooding)
