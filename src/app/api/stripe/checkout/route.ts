import { NextRequest, NextResponse } from "next/server";
import { stripe, TIER2_PRICE } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { estimateId } = await request.json();
  if (!estimateId) return NextResponse.json({ error: "Missing estimateId" }, { status: 400 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: TIER2_PRICE,
          product_data: {
            name: "RigCheck Full Report",
            description: "Line-item parts & labor breakdown, OEM part numbers, adjuster-ready PDF",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { estimateId },
    success_url: `${appUrl}/estimate/${estimateId}?payment=success`,
    cancel_url: `${appUrl}/estimate/${estimateId}?payment=cancelled`,
  });

  // Store payment intent reference
  const service = await createServiceClient();
  await service.from("estimates").update({
    stripe_payment_id: session.payment_intent as string,
  }).eq("id", estimateId);

  return NextResponse.json({ url: session.url });
}
