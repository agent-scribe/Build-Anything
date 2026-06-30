import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" })
  : null;

interface CartLine {
  productId: string;
  name: string;
  price: number;      // dollars (e.g. 29.99)
  currency: string;
  imageAlt: string;
  quantity: number;
}

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }

  let lines: CartLine[];
  try {
    const body = await req.json();
    lines = body.lines;
    if (!Array.isArray(lines) || lines.length === 0) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lines.map((line) => ({
        price_data: {
          currency: line.currency.toLowerCase(),
          unit_amount: Math.round(line.price * 100), // convert dollars → cents
          product_data: {
            name: line.name,
          },
        },
        quantity: line.quantity,
      })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
