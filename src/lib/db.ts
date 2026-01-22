import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    // Return a mock client if no database is configured
    console.warn('DATABASE_URL not configured, database features disabled')
    return null
  }

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

// Helper functions for supporters
export async function addSupporter(data: {
  name: string
  email?: string
  tier?: string
  amount?: number
  paymentMethod?: string
  paymentId?: string
}) {
  if (!prisma) {
    console.warn('Database not configured, skipping addSupporter')
    return null
  }

  const supporter = await prisma.supporter.create({
    data: {
      name: data.name,
      email: data.email,
      tier: data.tier || 'single-clap',
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentId: data.paymentId,
    },
  })

  // Increment the clapper count
  await incrementClapperCount()

  return supporter
}

export async function getClapperCount(): Promise<number> {
  if (!prisma) {
    return 64241 // Default count
  }

  const stats = await prisma.siteStats.findUnique({
    where: { id: 'main' },
  })
  
  if (!stats) {
    // Initialize stats if they don't exist
    const newStats = await prisma.siteStats.create({
      data: { id: 'main', clapperCount: 64241 },
    })
    return newStats.clapperCount
  }
  
  return stats.clapperCount
}

export async function incrementClapperCount(): Promise<number> {
  if (!prisma) {
    return 64241
  }

  const stats = await prisma.siteStats.upsert({
    where: { id: 'main' },
    update: { clapperCount: { increment: 1 } },
    create: { id: 'main', clapperCount: 64242 },
  })
  
  return stats.clapperCount
}

// Helper functions for mailing list
export async function subscribeToMailingList(email: string, name?: string) {
  if (!prisma) {
    console.warn('Database not configured, skipping subscribeToMailingList')
    return null
  }

  return prisma.mailingListSubscriber.upsert({
    where: { email },
    update: {
      name,
      isActive: true,
      unsubscribedAt: null,
    },
    create: {
      email,
      name,
    },
  })
}

export async function unsubscribeFromMailingList(email: string) {
  if (!prisma) {
    return null
  }

  return prisma.mailingListSubscriber.update({
    where: { email },
    data: {
      isActive: false,
      unsubscribedAt: new Date(),
    },
  })
}

export async function getRecentSupporters(limit: number = 50) {
  if (!prisma) {
    return []
  }

  return prisma.supporter.findMany({
    select: {
      name: true,
      tier: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}
