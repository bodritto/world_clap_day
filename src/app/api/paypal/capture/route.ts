import { NextRequest, NextResponse } from 'next/server'
import { addSupporter } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, supporterName, supporterEmail, tier, amount } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const { captureOrder } = await import('@/lib/paypal')
    const captureData = await captureOrder(orderId)

    if (captureData.status === 'COMPLETED') {
      // Add supporter to database
      try {
        await addSupporter({
          name: supporterName || 'Anonymous',
          email: supporterEmail,
          tier: tier || 'single-clap',
          amount: amount,
          paymentMethod: 'paypal',
          paymentId: orderId,
        })
      } catch (dbError) {
        console.error('Database update error:', dbError)
        // Don't fail the payment if database update fails
      }

      return NextResponse.json({ success: true, data: captureData })
    }

    return NextResponse.json(
      { error: 'Payment not completed', status: captureData.status },
      { status: 400 }
    )
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture PayPal payment' },
      { status: 500 }
    )
  }
}
