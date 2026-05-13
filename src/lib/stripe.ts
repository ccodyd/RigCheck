import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-04-22.dahlia",
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});

export const TIER2_PRICE = 4900; // $49.00 in cents
export const OWNER_OP_MONTHLY_PRICE_ID = process.env.STRIPE_OWNER_OP_PRICE_ID;
export const FLEET_MONTHLY_PRICE_ID = process.env.STRIPE_FLEET_PRICE_ID;
