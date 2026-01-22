import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { addSupporter } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const { constructWebhookEvent } = await import('@/lib/stripe')
    event = constructWebhookEvent(body, signature)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const supporterName = session.metadata?.supporterName || 'Anonymous'
      const supporterEmail = session.customer_email || session.metadata?.supporterEmail
      const tier = session.metadata?.tier || 'single-clap'
      const amount = session.amount_total ? session.amount_total / 100 : undefined

      try {
        // Add supporter to database
        await addSupporter({
          name: supporterName,
          email: supporterEmail || undefined,
          tier,
          amount,
          paymentMethod: 'stripe',
          paymentId: session.id,
        })
        
        console.log('Payment successful for:', supporterName)
      } catch (error) {
        console.error('Error saving supporter to database:', error)
        // Don't return error - payment was still successful
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('Payment failed:', paymentIntent.id)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
