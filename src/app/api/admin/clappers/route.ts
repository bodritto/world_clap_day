import { NextRequest, NextResponse } from 'next/server'
import { prisma, getClapperCount } from '@/lib/db'
import { getAuthFromCookies } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const admin = await getAuthFromCookies()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const count = await getClapperCount()
  return NextResponse.json({ count })
}

export async function PUT(request: NextRequest) {
  const admin = await getAuthFromCookies()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!prisma) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    const { count } = await request.json()

    if (typeof count !== 'number' || count < 0) {
      return NextResponse.json({ error: 'Invalid count value' }, { status: 400 })
    }

    const stats = await prisma.siteStats.upsert({
      where: { id: 'main' },
      update: { clapperCount: count },
      create: { id: 'main', clapperCount: count },
    })

    return NextResponse.json({ count: stats.clapperCount })
  } catch (error) {
    console.error('Error updating clapper count:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
