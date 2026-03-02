import { NextRequest, NextResponse } from 'next/server'
import { incrementClapperCountRandom } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const maxDuration = 10

/**
 * Call this route every 5 seconds to add a random 1–5 to the live clapper count (by country, weighted distribution).
 * Protect with CRON_SECRET: send header "Authorization: Bearer <CRON_SECRET>" or "x-cron-secret: <CRON_SECRET>".
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : null
    const headerSecret = request.headers.get('x-cron-secret')
    if (bearer !== secret && headerSecret !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const total = await incrementClapperCountRandom()
    return NextResponse.json({ ok: true, count: total })
  } catch (error) {
    console.error('Clapper tick error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
