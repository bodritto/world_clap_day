import { NextRequest, NextResponse } from 'next/server'
import { subscribeToMailingList, unsubscribeFromMailingList } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const subscriber = await subscribeToMailingList(email, name)

    if (!subscriber) {
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to mailing list (database not configured)',
        subscriber: { email, name },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to mailing list',
      subscriber: { email: subscriber.email, name: subscriber.name },
    })
  } catch (error) {
    console.error('Mailing list subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to mailing list' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    await unsubscribeFromMailingList(email)

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from mailing list',
    })
  } catch (error) {
    console.error('Mailing list unsubscription error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe from mailing list' },
      { status: 500 }
    )
  }
}
