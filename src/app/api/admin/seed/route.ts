import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  const seedSecret = process.env.ADMIN_SEED_SECRET
  if (!seedSecret) {
    return NextResponse.json(
      { error: 'ADMIN_SEED_SECRET env var is not set' },
      { status: 403 }
    )
  }

  try {
    const { email, password, name, secret } = await request.json()

    if (secret !== seedSecret) {
      return NextResponse.json({ error: 'Invalid seed secret' }, { status: 403 })
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const existing = await prisma.adminUser.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.adminUser.create({
      data: { email, passwordHash, name },
    })

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
