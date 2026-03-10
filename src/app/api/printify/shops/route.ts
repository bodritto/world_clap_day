import { NextResponse } from 'next/server'

/** Dev-only helper: lists all shops connected to PRINTIFY_API_KEY so you can find your shop ID. */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }
  try {
    const { getShops } = await import('@/lib/printify')
    const shops = await getShops()
    return NextResponse.json(shops)
  } catch (error) {
    console.error('Printify shops error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch shops'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
