import { NextResponse } from 'next/server'
import { getClapperCount, getRecentSupporters } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const [count, recentSupporters] = await Promise.all([
      getClapperCount(),
      getRecentSupporters(20),
    ])

    return NextResponse.json({
      count,
      recentSupporters,
    })
  } catch (error) {
    console.error('Error fetching clapper count:', error)
    // Return default count if database is not available
    return NextResponse.json({
      count: 64241,
      recentSupporters: [],
    })
  }
}
