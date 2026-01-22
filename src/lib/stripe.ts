import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripe() {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
    })
  }
  return stripeInstance
}

export async function createCheckoutSession(items: Array<{
  name: string
  price: number
  quantity: number
}>, supporterName?: string) {
  const stripe = getStripe()
  
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        description: 'World Clap Day Support',
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

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
