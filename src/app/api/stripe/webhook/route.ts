import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { estimateId?: string }; payment_intent?: string | null };
    const estimateId = session.metadata?.estimateId;
    if (!estimateId) return NextResponse.json({ ok: true });

    const service = await createServiceClient();
    await service.from("estimates").update({
      tier: "tier2",
      stripe_payment_id: session.payment_intent as string,
    }).eq("id", estimateId);

    // Trigger PDF generation (fire and forget)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    fetch(`${appUrl}/api/pdf/${estimateId}?generate=1`, { method: "POST" }).catch(() => {});
  }

  return NextResponse.json({ received: true });
}
