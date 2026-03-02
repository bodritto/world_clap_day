import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_CURRENCIES = ['eur', 'usd', 'gbp'] as const

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, supporterName, currency: rawCurrency } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    const currency = ALLOWED_CURRENCIES.includes(rawCurrency)
      ? rawCurrency
      : 'eur'

    for (const item of items) {
      const amount = Number(item.price) * (item.quantity || 1)
      if (amount < 0.01) {
        return NextResponse.json(
          { error: 'Amount must be at least 0.01' },
          { status: 400 }
        )
      }
    }

    const { createCheckoutSession } = await import('@/lib/stripe')
    const session = await createCheckoutSession(items, currency, supporterName)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
