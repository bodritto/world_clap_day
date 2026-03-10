import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_CURRENCIES = ['eur', 'usd', 'gbp'] as const

/** Countries available for Printify shipping */
const SHIPPING_COUNTRIES = [
  'US', 'CA', 'GB', 'AU', 'NZ',
  'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI',
  'PT', 'IE', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'GR', 'LT', 'LV', 'EE',
  'JP', 'KR', 'SG', 'HK', 'TW', 'MY', 'TH', 'PH', 'ID', 'VN',
  'BR', 'MX', 'AR', 'CL', 'CO', 'PE',
  'ZA', 'NG', 'KE', 'GH',
  'IN', 'AE', 'SA', 'IL', 'TR',
  'UA', 'RU',
] as const

interface RequestItem {
  name: string
  price: number
  quantity: number
  printifyProductId?: string
  printifyVariantId?: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, supporterName, currency: rawCurrency } = body as {
      items: RequestItem[]
      supporterName?: string
      currency?: string
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    const currency = ALLOWED_CURRENCIES.includes(rawCurrency as never)
      ? (rawCurrency as (typeof ALLOWED_CURRENCIES)[number])
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

    // Detect Printify (merch) items
    const printifyItems = items.filter(
      (i) => i.printifyProductId && i.printifyVariantId
    )
    const hasMerch = printifyItems.length > 0

    const { createCheckoutSession } = await import('@/lib/stripe')
    const session = await createCheckoutSession(
      items,
      currency,
      supporterName,
      hasMerch
        ? {
            printify_items: JSON.stringify(
              printifyItems.map((i) => ({
                p: i.printifyProductId,
                v: i.printifyVariantId,
                q: i.quantity,
                n: i.name,
              }))
            ),
            order_type: 'merch',
          }
        : undefined,
      hasMerch ? SHIPPING_COUNTRIES : undefined
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
