import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') ?? '1')
    const limit = Math.min(Number(searchParams.get('limit') ?? '10'), 50)

    const { getProducts } = await import('@/lib/printify')
    const data = await getProducts(page, limit)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Printify products error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to fetch products'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
