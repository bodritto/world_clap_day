import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripe() {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured (set in .env)')
    }
    if (secretKey === 'sk_test_xxx' || secretKey === 'sk_live_xxx') {
      throw new Error(
        'STRIPE_SECRET_KEY is still the placeholder. Get a real key from https://dashboard.stripe.com/apikeys and set it in .env'
      )
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
  supporterName?: string,
  extraMetadata?: Record<string, string>,
  shippingCountries?: readonly string[]
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
          description:
            extraMetadata?.order_type === 'merch'
              ? 'World Clap Day Merch'
              : 'World Clap Day Support',
        },
        unit_amount: unitAmountCents,
      },
      quantity: item.quantity,
    }
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  if (process.env.NODE_ENV === 'production' && siteUrl.includes('localhost')) {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL must be set in production (e.g. https://worldclapday.com) for Stripe redirects'
    )
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout?canceled=true`,
    metadata: {
      supporterName: supporterName || 'Anonymous',
      ...extraMetadata,
    },
    ...(shippingCountries && shippingCountries.length > 0
      ? {
          shipping_address_collection: {
            allowed_countries:
              shippingCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
          },
          phone_number_collection: { enabled: true },
        }
      : {}),
  })

  return session
}

export async function retrieveSession(sessionId: string) {
  const stripe = getStripe()
  // Note: shipping_details and customer_details are top-level fields on the
  // session and do NOT need expansion — only line_items is a nested list.
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  })
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
