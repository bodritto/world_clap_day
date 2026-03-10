import { NextRequest, NextResponse } from 'next/server'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { getProduct } = await import('@/lib/printify')
    const product = await getProduct(id)

    return NextResponse.json(product)
  } catch (error) {
    console.error('Printify product error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to fetch product'
    const status = message.includes('404') ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
