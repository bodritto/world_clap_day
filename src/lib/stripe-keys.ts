/**
 * Publishable key for Stripe (client-safe).
 * Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env (use pk_test_... for dev, pk_live_... for production).
 */
export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
