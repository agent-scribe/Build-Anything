import type { FavoriteTemplate, PromptCategory } from "./types";

/* ── Favorite Prompt Templates ──────────────────────────────────── */

export const FAVORITE_TEMPLATES: FavoriteTemplate[] = [
  // SaaS
  {
    id: "saas-crm",
    category: "saas",
    title: "CRM Platform",
    description: "Customer relationship management SaaS",
    prompt:
      "Build a modern CRM SaaS platform landing page with a hero section showing a dashboard preview, feature grid highlighting contact management, deal pipeline, email automation, and analytics. Include pricing tiers (Starter $29/mo, Growth $79/mo, Enterprise custom), testimonials from B2B companies, integration logos (Slack, Gmail, Salesforce), and a free trial CTA. Dark theme with blue accents.",
  },
  {
    id: "saas-analytics",
    category: "saas",
    title: "Analytics Dashboard",
    description: "Data analytics and reporting tool",
    prompt:
      "Create a data analytics SaaS landing page. Hero with animated chart visualization, sections for real-time dashboards, custom reports, team collaboration, API access. Show pricing (Free, Pro $49/mo, Team $149/mo). Include customer logos, a metrics section (10M+ data points processed, 5,000+ companies). Modern minimal design with gradient accents.",
  },
  {
    id: "saas-pm",
    category: "saas",
    title: "Project Management",
    description: "Team project management tool",
    prompt:
      "Design a project management SaaS website. Kanban board preview in hero, features: task tracking, time logging, Gantt charts, team chat, file sharing. Pricing: Personal Free, Team $12/user/mo, Business $24/user/mo. Testimonials, integration section, mobile app preview. Clean UI with purple/indigo palette.",
  },

  // Portfolio
  {
    id: "portfolio-dev",
    category: "portfolio",
    title: "Developer Portfolio",
    description: "Software developer personal site",
    prompt:
      "Build a developer portfolio with a terminal-styled hero showing a typing animation, project showcase grid with GitHub stats, skills section (React, Node, Python, AWS), blog/writing section, open source contributions, and contact form. Dark theme with green terminal accents. Include resume download button.",
  },
  {
    id: "portfolio-designer",
    category: "portfolio",
    title: "Designer Portfolio",
    description: "UI/UX designer showcase",
    prompt:
      "Create a minimal designer portfolio. Full-bleed hero with featured project, case study cards with before/after comparisons, process section (Research → Wireframe → Design → Test), client testimonials, dribbble/behance links. White/cream background with serif typography and subtle animations.",
  },

  // E-Commerce
  {
    id: "ecom-fashion",
    category: "ecommerce",
    title: "Fashion Store",
    description: "Premium fashion e-commerce",
    prompt:
      "Build a premium fashion e-commerce store. Full-width hero with seasonal collection, product grid with quick-add, size/color filters, lookbook section, new arrivals carousel, newsletter signup with 10% discount offer. Categories: Women, Men, Accessories, Sale. Minimalist black/white aesthetic with elegant typography.",
  },
  {
    id: "ecom-tech",
    category: "ecommerce",
    title: "Tech Gadgets Store",
    description: "Electronics and gadgets shop",
    prompt:
      "Create a tech gadgets online store. Hero featuring flagship product with 3D-style presentation, categories: Smartphones, Laptops, Audio, Wearables, Accessories. Product cards with ratings, compare feature highlight, flash deals section, tech specs tables. Dark theme with neon blue accents.",
  },

  // AI Agent
  {
    id: "ai-chatbot",
    category: "ai-agent",
    title: "AI Chatbot Platform",
    description: "Conversational AI platform",
    prompt:
      "Design an AI chatbot platform landing page. Hero with live chat demo preview, features: multi-language support, custom training, API integration, analytics dashboard. Use cases section (Customer Support, Sales, HR). Pricing: Starter 1,000 msgs/mo free, Pro $49/mo, Enterprise custom. Show accuracy metrics and response time stats. Gradient purple-blue theme.",
  },
  {
    id: "ai-workflow",
    category: "ai-agent",
    title: "AI Workflow Automation",
    description: "AI-powered task automation",
    prompt:
      "Build an AI workflow automation platform site. Visual workflow builder preview in hero, templates gallery (email automation, data extraction, content generation), integration logos (Zapier, Notion, Slack, HubSpot), ROI calculator section. Pricing with usage-based tiers. Modern dark UI with green accents.",
  },

  // Mobile App
  {
    id: "mobile-fitness",
    category: "mobile-app",
    title: "Fitness App",
    description: "Health and fitness mobile app",
    prompt:
      "Create a fitness app landing page. Phone mockup in hero showing workout tracking UI, features: personalized plans, exercise library (500+ exercises), progress tracking, nutrition logging, social challenges. App store badges, user testimonials with before/after results, pricing (Free, Premium $9.99/mo). Energetic gradient theme with orange/red accents.",
  },
  {
    id: "mobile-finance",
    category: "mobile-app",
    title: "Finance App",
    description: "Personal finance management app",
    prompt:
      "Design a personal finance app website. Dual phone mockups showing spending dashboard and budget view, features: expense tracking, bill reminders, savings goals, investment overview, bank sync. Security badges section, 4.8 star rating highlight, download CTAs for iOS/Android. Clean white theme with green money accents.",
  },

  // Dashboard
  {
    id: "dash-admin",
    category: "dashboard",
    title: "Admin Dashboard",
    description: "Full-featured admin panel",
    prompt:
      "Build an admin dashboard with sidebar navigation, top metrics cards (Revenue, Users, Orders, Conversion Rate), line chart for revenue trends, recent orders table, user activity feed, notification panel. Include dark/light mode toggle, search bar, user avatar menu. Professional dark theme with indigo accent color.",
  },
  {
    id: "dash-iot",
    category: "dashboard",
    title: "IoT Monitor",
    description: "IoT device monitoring dashboard",
    prompt:
      "Create an IoT monitoring dashboard. Real-time device status grid, sensor data charts (temperature, humidity, power), alert feed, device map view, uptime statistics. Sidebar with device categories. Dark theme optimized for wall displays with green/amber/red status indicators.",
  },

  // Landing Page
  {
    id: "landing-startup",
    category: "landing-page",
    title: "Startup Launch",
    description: "Product launch landing page",
    prompt:
      "Design a startup product launch landing page. Bold hero with product screenshot and waitlist signup, problem/solution section, 3-step how-it-works, feature comparison vs competitors, early-bird pricing, founder story section, FAQ accordion, footer with social links. Conversion-optimized with multiple CTAs. Modern gradient theme.",
  },
  {
    id: "landing-event",
    category: "landing-page",
    title: "Event / Conference",
    description: "Event registration page",
    prompt:
      "Build a tech conference landing page. Hero with event date countdown timer, speaker grid with photos and bios, schedule/agenda with track filters, ticket tiers (Early Bird $199, Regular $349, VIP $599), venue info with map, sponsor logos, FAQ section. Professional dark theme with vibrant accent colors.",
  },
];

export function getTemplatesByCategory(category: PromptCategory): FavoriteTemplate[] {
  return FAVORITE_TEMPLATES.filter((t) => t.category === category);
}
