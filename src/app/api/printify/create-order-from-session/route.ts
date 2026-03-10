import { NextRequest, NextResponse } from 'next/server'
import type { PrintifyCreateOrderPayload } from '@/lib/printify'

interface PrintifyItemCompact {
  p: string   // product_id
  v: number   // variant_id
  q: number   // quantity
  n: string   // item name
}

export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json()

    if (!session_id) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 })
    }

    const { retrieveSession } = await import('@/lib/stripe')
    const session = await retrieveSession(session_id)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
    }

    if (session.metadata?.order_type !== 'merch') {
      return NextResponse.json({ error: 'Not a merch order' }, { status: 400 })
    }

    const printifyItemsRaw = session.metadata?.printify_items
    if (!printifyItemsRaw) {
      return NextResponse.json({ error: 'No Printify items in session' }, { status: 400 })
    }

    const printifyItems: PrintifyItemCompact[] = JSON.parse(printifyItemsRaw)

    const customerDetails = session.customer_details

    // Prefer shipping_details (set when shipping_address_collection is on).
    // Fall back to customer billing address if the session predates the feature.
    const shippingAddr = session.shipping_details?.address ?? customerDetails?.address
    const shippingName = session.shipping_details?.name ?? customerDetails?.name ?? 'Customer'

    if (!shippingAddr) {
      return NextResponse.json(
        { error: 'No address found in session. Please contact support.' },
        { status: 400 }
      )
    }

    const email = customerDetails?.email ?? session.customer_email ?? ''
    const phone = customerDetails?.phone ?? ''

    const nameParts = shippingName.trim().split(/\s+/)
    const firstName = nameParts[0] ?? 'Customer'
    const lastName = nameParts.slice(1).join(' ') || '-'

    const fullName = shippingName

    const payload: PrintifyCreateOrderPayload = {
      label: `WCD-${session_id.slice(-8).toUpperCase()}`,
      line_items: printifyItems.map((item) => ({
        product_id: item.p,
        variant_id: item.v,
        quantity: item.q,
      })),
      shipping_method: 1,
      send_shipping_notification: true,
      address_to: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || '0000000000',
        country: shippingAddr.country ?? 'US',
        region: shippingAddr.state ?? '',
        address1: shippingAddr.line1 ?? '',
        address2: shippingAddr.line2 ?? '',
        city: shippingAddr.city ?? '',
        zip: shippingAddr.postal_code ?? '',
      },
    }

    const { createOrder, isTestMode } = await import('@/lib/printify')
    const order = await createOrder(payload, isTestMode())

    return NextResponse.json({
      order,
      items: printifyItems,
      shippingAddress: {
        name: fullName,
        line1: shippingAddr.line1,
        line2: shippingAddr.line2,
        city: shippingAddr.city,
        state: shippingAddr.state,
        postal_code: shippingAddr.postal_code,
        country: shippingAddr.country,
      },
      email,
    })
  } catch (error) {
    console.error('create-order-from-session error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to create Printify order'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
