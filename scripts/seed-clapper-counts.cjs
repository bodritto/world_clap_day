#!/usr/bin/env node
/**
 * Seed ClapperCountryCount and SiteStats with a total clapper count.
 * If the DB is empty, the site shows a default count until you run this script
 * or set the value in Admin → Clapper Count → Save.
 *
 * Distribution: 50% across top 12 countries, 50% across the rest.
 *
 * Usage:
 *   DATABASE_URL="..." node scripts/seed-clapper-counts.cjs [TOTAL]
 *   node scripts/seed-clapper-counts.cjs 247512
 *   node scripts/seed-clapper-counts.cjs --dry-run
 *
 * On production (empty DB): cd /var/www/wcd && export $(cat .env | xargs) && node scripts/seed-clapper-counts.cjs 247512
 */

require('dotenv/config')

const totalArg = process.argv.find((a) => a !== '--dry-run' && /^\d+$/.test(a))
const TARGET_TOTAL = totalArg ? parseInt(totalArg, 10) : 200100
const HALF = Math.floor(TARGET_TOTAL / 2) // 100050

// Top 12: descending weight (12, 11, …, 1). Sum = 78.
const TOP_12 = [
  { code: 'US', weight: 12 },
  { code: 'CA', weight: 11 },
  { code: 'AR', weight: 10 },
  { code: 'BR', weight: 9 },
  { code: 'AU', weight: 8 },
  { code: 'MX', weight: 7 },
  { code: 'DE', weight: 6 },
  { code: 'PT', weight: 5 },
  { code: 'ES', weight: 4 },
  { code: 'IT', weight: 3 },
  { code: 'JP', weight: 2 },
  { code: 'CL', weight: 1 },
]
const TOP_12_SUM = 78

// Others: 50% of total. Weights (same as in clapperCountryDistribution.ts).
const OTHERS = [
  { code: 'GB', weight: 5 },
  { code: 'IN', weight: 5 },
  { code: 'FR', weight: 4 },
  { code: 'NL', weight: 2 },
  { code: 'PL', weight: 2 },
  { code: 'RU', weight: 2 },
  { code: 'KR', weight: 1 },
  { code: 'ZA', weight: 1 },
  { code: 'SE', weight: 1 },
  { code: 'BE', weight: 1 },
  { code: 'AT', weight: 1 },
  { code: 'CH', weight: 1 },
  { code: 'TR', weight: 1 },
  { code: 'ID', weight: 1 },
  { code: 'PH', weight: 1 },
  { code: 'CO', weight: 1 },
  { code: 'EG', weight: 1 },
  { code: 'NG', weight: 1 },
  { code: 'PK', weight: 1 },
  { code: 'TH', weight: 1 },
  { code: 'VN', weight: 1 },
  { code: 'IE', weight: 1 },
  { code: 'NZ', weight: 1 },
  { code: 'GR', weight: 1 },
  { code: 'RO', weight: 1 },
  { code: 'CZ', weight: 1 },
  { code: 'HU', weight: 1 },
  { code: 'IL', weight: 1 },
]
const OTHERS_SUM = OTHERS.reduce((s, x) => s + x.weight, 0)

function distribute(total, items, weightSum) {
  const entries = []
  let remaining = total
  for (let i = 0; i < items.length; i++) {
    const w = items[i].weight
    const count =
      i < items.length - 1
        ? Math.min(remaining, Math.round((total * w) / weightSum))
        : Math.max(0, remaining)
    remaining -= count
    entries.push({ code: items[i].code, count })
  }
  return entries
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  if (dryRun) {
    console.log('Target total:', TARGET_TOTAL)
    const topEntries = distribute(HALF, TOP_12, TOP_12_SUM)
    const otherEntries = distribute(HALF, OTHERS, OTHERS_SUM)
    const topSum = topEntries.reduce((s, e) => s + e.count, 0)
    const otherSum = otherEntries.reduce((s, e) => s + e.count, 0)
    console.log('--dry-run: would seed as follows')
    console.log('Top 12 total:', topSum, topEntries)
    console.log('Others total:', otherSum, otherEntries.length, 'countries')
    console.log('Grand total:', topSum + otherSum)
    return
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is required')
    process.exit(1)
  }

  const { PrismaClient } = require('@prisma/client')
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')

  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const now = new Date()
  const topEntries = distribute(HALF, TOP_12, TOP_12_SUM)
  const otherEntries = distribute(HALF, OTHERS, OTHERS_SUM)

  const rows = [
    ...topEntries.map(({ code, count }) => ({ countryCode: code, count, updatedAt: now })),
    ...otherEntries.map(({ code, count }) => ({ countryCode: code, count, updatedAt: now })),
  ]
  const total = rows.reduce((s, r) => s + r.count, 0)

  await prisma.clapperCountryCount.deleteMany({})
  await prisma.clapperCountryCount.createMany({ data: rows })
  await prisma.siteStats.upsert({
    where: { id: 'main' },
    update: { clapperCount: total, clapperCountFixed: total },
    create: { id: 'main', clapperCount: total, clapperCountFixed: total },
  })

  console.log('Seeded', rows.length, 'countries, total clappers:', total)
  await prisma.$disconnect()
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
