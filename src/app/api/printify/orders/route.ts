import { NextRequest, NextResponse } from 'next/server'
import type { PrintifyCreateOrderPayload } from '@/lib/printify'

export async function POST(request: NextRequest) {
  try {
    const body: PrintifyCreateOrderPayload = await request.json()

    if (!body.line_items || body.line_items.length === 0) {
      return NextResponse.json(
        { error: 'No line items provided' },
        { status: 400 }
      )
    }
    if (!body.address_to) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      )
    }

    const { createOrder, isTestMode } = await import('@/lib/printify')
    const order = await createOrder(body, isTestMode())

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Printify order error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to create order'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
