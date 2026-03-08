import { NextRequest, NextResponse } from 'next/server'
import { upsertSupporterForWall } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id, firstName, lastName, email, countryCode, countryName } = body

    if (!session_id || typeof session_id !== 'string') {
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      )
    }

    // Full first name + first letter of last name + period, e.g. "Pupa L."
    const first = (firstName ?? '').trim()
    const last = (lastName ?? '').trim()
    const name =
      first && last
        ? `${first} ${(last[0] ?? '').toUpperCase()}.`
        : first || last
        ? `${first || last}.`
        : 'Anonymous'

    await upsertSupporterForWall(session_id, {
      name,
      email: email || undefined,
      country: countryName || undefined,
      countryCode: countryCode || undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating supporter for wall:', error)
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    )
  }
}
