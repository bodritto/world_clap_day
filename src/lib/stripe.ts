import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripe() {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured (set in .env)')
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
    })
  }
  return stripeInstance
}

export type StripeCurrency = 'eur' | 'usd' | 'gbp'

/** Stripe minimum is 1 unit in most currencies (e.g. 1 cent USD). */
const MIN_CENTS = 1

export async function createCheckoutSession(
  items: Array<{ name: string; price: number; quantity: number }>,
  currency: StripeCurrency = 'eur',
  supporterName?: string
) {
  const stripe = getStripe()

  const lineItems = items.map((item) => {
    const unitAmountCents = Math.round(item.price * 100)
    if (unitAmountCents < MIN_CENTS) {
      throw new Error(`Amount must be at least 0.01 ${currency.toUpperCase()}`)
    }
    return {
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.name,
          description: 'World Clap Day Support',
        },
        unit_amount: unitAmountCents,
      },
      quantity: item.quantity,
    }
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout?canceled=true`,
    metadata: {
      supporterName: supporterName || 'Anonymous',
    },
  })

  return session
}

export async function retrieveSession(sessionId: string) {
  const stripe = getStripe()
  return stripe.checkout.sessions.retrieve(sessionId)
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
  }
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
