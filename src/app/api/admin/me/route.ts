import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthFromCookies } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const admin = await getAuthFromCookies()
  if (!admin || !prisma) {
    return NextResponse.json({ user: null })
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: admin.userId },
    select: { id: true, email: true, name: true },
  })

  return NextResponse.json({ user })
}
