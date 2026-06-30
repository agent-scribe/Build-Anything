import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode === "subscription" && session.customer && session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = sub.items.data[0]?.price.id;

      // Determine plan from price ID
      let plan = "pro";
      if (priceId === process.env.STRIPE_STUDIO_PRICE_ID) plan = "studio";

      await prisma.subscription.updateMany({
        where: { stripeCustomerId: session.customer as string },
        data: {
          plan,
          stripeSubId: sub.id,
          stripePriceId: priceId,
          status: "active",
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      });
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const status = sub.status === "active" ? "active" : sub.status === "canceled" ? "canceled" : "past_due";

    await prisma.subscription.updateMany({
      where: { stripeSubId: sub.id },
      data: {
        status,
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        ...(sub.status === "canceled" ? { plan: "free" } : {}),
      },
    });
  }

  return NextResponse.json({ received: true });
}
