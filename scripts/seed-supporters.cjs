#!/usr/bin/env node
/**
 * Seed Supporter table with demo entries for the Wall of Clappers.
 * Use when the wall is empty and you want to show sample data.
 *
 * Usage:
 *   DATABASE_URL="..." node scripts/seed-supporters.cjs
 *   node scripts/seed-supporters.cjs --dry-run
 *
 * Or: npm run seed:supporters (after adding script to package.json)
 */

require('dotenv/config')

const DEMO_SUPPORTERS = [
  { name: 'Anna K.', country: 'Germany', countryCode: 'DE' },
  { name: 'David M.', country: 'United States', countryCode: 'US' },
  { name: 'Maria S.', country: 'Spain', countryCode: 'ES' },
  { name: 'John L.', country: 'United Kingdom', countryCode: 'GB' },
  { name: 'Yuki T.', country: 'Japan', countryCode: 'JP' },
  { name: 'Sophie L.', country: 'France', countryCode: 'FR' },
  { name: 'Luca B.', country: 'Italy', countryCode: 'IT' },
  { name: 'Emma W.', country: 'Canada', countryCode: 'CA' },
  { name: 'James O.', country: 'Australia', countryCode: 'AU' },
  { name: 'Olga P.', country: 'Poland', countryCode: 'PL' },
  { name: 'Carlos R.', country: 'Brazil', countryCode: 'BR' },
  { name: 'Priya N.', country: 'India', countryCode: 'IN' },
]

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  if (dryRun) {
    console.log('--dry-run: would seed', DEMO_SUPPORTERS.length, 'supporters')
    DEMO_SUPPORTERS.forEach((s, i) => console.log(`  ${i + 1}. ${s.name} (${s.countryCode})`))
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

  const created = await prisma.supporter.createMany({
    data: DEMO_SUPPORTERS.map((s) => ({
      name: s.name,
      country: s.country,
      countryCode: s.countryCode,
      tier: 'single-clap',
    })),
    skipDuplicates: true,
  })

  console.log('Seeded', created.count, 'supporters for Wall of Clappers')
  await prisma.$disconnect()
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
