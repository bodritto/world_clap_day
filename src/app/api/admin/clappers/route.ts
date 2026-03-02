import { NextRequest, NextResponse } from 'next/server'
import { getClapperCount, getClapperCountFixed, setClapperCountManually } from '@/lib/db'
import { getAuthFromCookies } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const admin = await getAuthFromCookies()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [count, fixedCount] = await Promise.all([
    getClapperCount(),
    getClapperCountFixed(),
  ])
  return NextResponse.json({ count, fixedCount })
}

export async function PUT(request: NextRequest) {
  const admin = await getAuthFromCookies()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { count } = await request.json()

    if (typeof count !== 'number' || count < 0) {
      return NextResponse.json({ error: 'Invalid count value' }, { status: 400 })
    }

    const stats = await setClapperCountManually(count)
    return NextResponse.json({ count: stats.clapperCount, fixedCount: stats.clapperCountFixed })
  } catch (error) {
    console.error('Error updating clapper count:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
