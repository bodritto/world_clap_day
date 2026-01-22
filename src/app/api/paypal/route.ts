import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, supporterName } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const { createOrder } = await import('@/lib/paypal')
    const order = await createOrder(amount, supporterName)

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('PayPal create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    )
  }
}
