import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import {
  pickCountryFromDistribution,
  getAllDistributionCodes,
  COUNTRY_WEIGHTS,
} from '@/lib/clapperCountryDistribution'

// Allow self-signed certificates for DigitalOcean managed databases
if (process.env.DATABASE_URL?.includes('digitalocean.com')) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

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

  const isRemote = connectionString.includes('digitalocean.com') ||
                   connectionString.includes('sslmode=require')

  const pool = new Pool({ 
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : false,
  })
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
  country?: string
  countryCode?: string
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
      country: data.country,
      countryCode: data.countryCode,
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

/** Update supporter by Stripe session ID (paymentId) with wall-of-clappers form data */
export async function updateSupporterByPaymentId(
  paymentId: string,
  data: { name: string; email?: string; country?: string; countryCode?: string }
) {
  if (!prisma) return null
  return prisma.supporter.updateMany({
    where: { paymentId },
    data: {
      name: data.name,
      email: data.email,
      country: data.country,
      countryCode: data.countryCode,
    },
  })
}

/** Update or create supporter for the wall: if one exists with this paymentId, update; otherwise create (e.g. when webhook didn't run). */
export async function upsertSupporterForWall(
  paymentId: string,
  data: { name: string; email?: string; country?: string; countryCode?: string }
) {
  if (!prisma) return null
  const existing = await prisma.supporter.findFirst({ where: { paymentId } })
  if (existing) {
    await prisma.supporter.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        email: data.email,
        country: data.country,
        countryCode: data.countryCode,
      },
    })
    return existing.id
  }
  const created = await prisma.supporter.create({
    data: {
      name: data.name,
      email: data.email,
      country: data.country,
      countryCode: data.countryCode,
      paymentId,
      paymentMethod: 'stripe',
      tier: 'single-clap',
    },
  })
  await incrementClapperCount()
  return created.id
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
      data: { id: 'main', clapperCount: 64241, clapperCountFixed: 64241 },
    })
    return newStats.clapperCount
  }

  return stats.clapperCount
}

export async function getClapperCountFixed(): Promise<number> {
  if (!prisma) {
    return 64241
  }

  const stats = await prisma.siteStats.findUnique({
    where: { id: 'main' },
  })

  if (!stats) {
    return 64241
  }

  return stats.clapperCountFixed ?? stats.clapperCount
}

export async function incrementClapperCount(): Promise<number> {
  if (!prisma) return 64241
  const { total } = await incrementClapperCountByCountry()
  return total
}

/** Set both current and fixed count (e.g. when admin sets value manually). Reseeds per-country counts from new total. */
export async function setClapperCountManually(count: number): Promise<{ clapperCount: number; clapperCountFixed: number }> {
  if (!prisma) {
    return { clapperCount: 64241, clapperCountFixed: 64241 }
  }
  await (prisma as any).clapperCountryCount.deleteMany({})
  await seedClapperCountryCountsFromTotal(count)
  const stats = await prisma.siteStats.upsert({
    where: { id: 'main' },
    update: { clapperCount: count, clapperCountFixed: count },
    create: { id: 'main', clapperCount: count, clapperCountFixed: count },
  })
  return { clapperCount: stats.clapperCount, clapperCountFixed: stats.clapperCountFixed }
}

const TOTAL_WEIGHT = COUNTRY_WEIGHTS.reduce((s, x) => s + x.weight, 0)

/** Get clapper counts by country (alpha-2). Used for map coloring. */
export async function getClapperCountsByCountry(): Promise<Record<string, number>> {
  if (!prisma) return {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = await (prisma as any).clapperCountryCount.findMany()
  return rows.reduce(
    (acc: Record<string, number>, r: { countryCode: string; count: number }) => {
      acc[r.countryCode] = r.count
      return acc
    },
    {} as Record<string, number>
  )
}

/** Seed ClapperCountryCount from current SiteStats total (proportional to distribution). Call when table is empty. */
async function seedClapperCountryCountsFromTotal(total: number): Promise<void> {
  if (!prisma) return
  const now = new Date()
  let remaining = total
  const codes = getAllDistributionCodes()
  const entries: { countryCode: string; count: number; updatedAt: Date }[] = []
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]!
    const weight = COUNTRY_WEIGHTS[i]!.weight
    const count =
      i < codes.length - 1
        ? Math.min(remaining, Math.round((total * weight) / TOTAL_WEIGHT))
        : Math.max(0, remaining)
    remaining -= count
    entries.push({ countryCode: code, count, updatedAt: now })
  }
  await (prisma as any).clapperCountryCount.createMany({ data: entries })
  const sum = entries.reduce((s, e) => s + e.count, 0)
  await prisma.siteStats.upsert({
    where: { id: 'main' },
    update: { clapperCount: sum },
    create: { id: 'main', clapperCount: sum, clapperCountFixed: sum },
  })
}

/** Increment one country by 1 (picked from distribution) and total. Returns new total. */
export async function incrementClapperCountByCountry(): Promise<{ countryCode: string; total: number }> {
  if (!prisma) {
    return { countryCode: 'US', total: 64241 }
  }
  const existing = await (prisma as any).clapperCountryCount.count()
  if (existing === 0) {
    const stats = await prisma.siteStats.findUnique({ where: { id: 'main' } })
    const total = stats?.clapperCount ?? 64241
    await seedClapperCountryCountsFromTotal(total)
  }
  const countryCode = pickCountryFromDistribution()
  const now = new Date()
  await (prisma as any).clapperCountryCount.upsert({
    where: { countryCode },
    update: { count: { increment: 1 }, updatedAt: now },
    create: { countryCode, count: 1, updatedAt: now },
  })
  const stats = await prisma.siteStats.upsert({
    where: { id: 'main' },
    update: { clapperCount: { increment: 1 } },
    create: { id: 'main', clapperCount: 64242, clapperCountFixed: 64241 },
  })
  return { countryCode, total: stats.clapperCount }
}

/** Add configurable min–max to clapper count by country (weighted). Call every CLAPPER_TICK_INTERVAL_MS from cron. Returns new total. */
export async function incrementClapperCountRandom(): Promise<number> {
  if (!prisma) return 64241
  const { getClapperAddPerTick } = await import('@/lib/clapperTickConfig')
  const add = getClapperAddPerTick()
  let total = 0
  for (let i = 0; i < add; i++) {
    const r = await incrementClapperCountByCountry()
    total = r.total
  }
  return total
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

/** Supporters for Wall of Clappers: newest first (left to right, top to bottom). */
export async function getSupportersForWall(limit: number = 50) {
  if (!prisma) {
    return []
  }

  return prisma.supporter.findMany({
    select: {
      id: true,
      name: true,
      country: true,
      countryCode: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

// Helper functions for user locations (world map)
export async function addUserLocation(data: {
  city: string
  country: string
  countryCode: string
}) {
  if (!prisma) {
    console.warn('Database not configured, skipping addUserLocation')
    return null
  }

  return prisma.userLocation.create({
    data: {
      city: data.city,
      country: data.country,
      countryCode: data.countryCode,
    },
  })
}

export async function getLocationCountsByCountry(): Promise<Record<string, number>> {
  if (!prisma) {
    return {}
  }

  const counts = await prisma.userLocation.groupBy({
    by: ['countryCode'],
    _count: {
      countryCode: true,
    },
  })

  return counts.reduce((acc: Record<string, number>, item: { countryCode: string; _count: { countryCode: number } }) => {
    acc[item.countryCode] = item._count.countryCode
    return acc
  }, {})
}

export async function getTotalLocationCount(): Promise<number> {
  if (!prisma) {
    return 0
  }

  return prisma.userLocation.count()
}
