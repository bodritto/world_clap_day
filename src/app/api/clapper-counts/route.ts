import { NextResponse } from 'next/server'
import { getClapperCount, getClapperCountsByCountry } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** GET - Returns total clapper count and per-country counts for map coloring. */
export async function GET() {
  try {
    const [totalCount, countryCounts] = await Promise.all([
      getClapperCount(),
      getClapperCountsByCountry(),
    ])
    return NextResponse.json({
      success: true,
      data: { countryCounts, totalCount },
    })
  } catch (error) {
    console.error('Error fetching clapper counts:', error)
    return NextResponse.json(
      { success: false, data: { countryCounts: {}, totalCount: 64241 } },
      { status: 500 }
    )
  }
}
