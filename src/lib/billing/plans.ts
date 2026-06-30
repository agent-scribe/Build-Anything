export type PlanId = "free" | "pro" | "studio";

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number;          // monthly in dollars, 0 = free
  stripePriceId?: string; // set via env
  features: string[];
  limits: {
    projects: number;
    aiGenerations: number; // per month
    customDomain: boolean;
    removeBranding: boolean;
  };
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "3 projects",
      "5 AI generations/month",
      "HTML export",
      "Community support",
    ],
    limits: {
      projects: 3,
      aiGenerations: 5,
      customDomain: false,
      removeBranding: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 19,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Unlimited projects",
      "100 AI generations/month",
      "All export formats",
      "Custom domain",
      "Remove WeBuild branding",
      "Priority support",
    ],
    limits: {
      projects: Infinity,
      aiGenerations: 100,
      customDomain: true,
      removeBranding: true,
    },
  },
  studio: {
    id: "studio",
    name: "Studio",
    price: 49,
    stripePriceId: process.env.STRIPE_STUDIO_PRICE_ID,
    features: [
      "Everything in Pro",
      "Unlimited AI generations",
      "AI image generation",
      "White-label reselling",
      "Team collaboration",
      "Dedicated support",
    ],
    limits: {
      projects: Infinity,
      aiGenerations: Infinity,
      customDomain: true,
      removeBranding: true,
    },
  },
};

export function getPlan(id: string): PlanConfig {
  return PLANS[id as PlanId] ?? PLANS.free;
}
