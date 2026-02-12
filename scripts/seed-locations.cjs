// Seed UserLocation rows for the world map.
//
// Usage:
//   DATABASE_URL="..." node scripts/seed-locations.cjs
//   node scripts/seed-locations.cjs --truncate
//   node scripts/seed-locations.cjs --total 84563 --seed 42
//   node scripts/seed-locations.cjs --dry-run
//
// Notes:
// - Does NOT hardcode credentials; reads DATABASE_URL from env (dotenv supported).
// - Inserts rows into the Prisma-mapped table: "UserLocation".
// - Generates counts for: US, UK(GB), Argentina(AR), China(CN), India(IN), Canada(CA), Turkey(TR)
// - Ensures total rows = --total (default 84563) and order is descending in the list above.
//
// IMPORTANT: This will create tens of thousands of rows. Use --dry-run first if desired.

require('dotenv/config')

const { Pool } = require('pg')

// -----------------------------
// Args
// -----------------------------
const args = process.argv.slice(2)
const hasFlag = (f) => args.includes(f)
const getArgValue = (name, fallback) => {
  const idx = args.indexOf(name)
  if (idx === -1) return fallback
  const v = args[idx + 1]
  return v ?? fallback
}

const TOTAL = Number(getArgValue('--total', '84563'))
const SEED = Number(getArgValue('--seed', String(Date.now() % 2147483647)))
const TRUNCATE = hasFlag('--truncate')
const DRY_RUN = hasFlag('--dry-run')

if (!Number.isFinite(TOTAL) || TOTAL <= 0) {
  console.error('Invalid --total. Must be a positive number.')
  process.exit(1)
}

// -----------------------------
// Deterministic RNG (LCG)
// -----------------------------
function createRng(seed) {
  let state = (seed >>> 0) || 1
  return function rng() {
    // LCG parameters (Numerical Recipes)
    state = (1664525 * state + 1013904223) >>> 0
    return state / 0x100000000
  }
}

const rng = createRng(SEED)

// -----------------------------
// Countries (top list)
// -----------------------------
const countries = [
  { code: 'US', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'San Francisco'] },
  // User says "UK" but ISO alpha-2 is GB
  { code: 'GB', name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'] },
  { code: 'AR', name: 'Argentina', cities: ['Buenos Aires', 'Córdoba', 'Mendoza', 'Rosario', 'La Plata'] },
  { code: 'CN', name: 'China', cities: ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou', 'Chengdu'] },
  { code: 'IN', name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'] },
  { code: 'CA', name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'] },
  { code: 'TR', name: 'Turkey', cities: ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa'] },
]

// -----------------------------
// Generate descending counts that sum to TOTAL
// -----------------------------
function generateCounts(total) {
  // Base weights roughly reflecting "top" ordering + small randomness
  const base = [1.0, 0.78, 0.52, 0.48, 0.46, 0.34, 0.30]
  const weights = base.map((w, i) => {
    const jitter = 0.9 + rng() * 0.2 // 0.9..1.1
    // Slightly increase separation for earlier entries
    const sep = 1 + (countries.length - i) * 0.015
    return w * jitter * sep
  })
  const sumW = weights.reduce((a, b) => a + b, 0)

  let counts = weights.map((w) => Math.floor((total * w) / sumW))

  // Ensure strictly descending in the given order.
  for (let i = 1; i < counts.length; i++) {
    if (counts[i] >= counts[i - 1]) {
      counts[i] = Math.max(1, counts[i - 1] - 1)
    }
  }

  // Fix sum by adding remainder to the top country (US).
  const currentSum = counts.reduce((a, b) => a + b, 0)
  const diff = total - currentSum
  counts[0] += diff

  // Guard: if diff caused order to break (rare), push extras into earlier buckets.
  for (let i = 1; i < counts.length; i++) {
    if (counts[i] >= counts[i - 1]) {
      const needed = counts[i] - (counts[i - 1] - 1)
      counts[i] -= needed
      counts[0] += needed
    }
  }

  return counts
}

const counts = generateCounts(TOTAL)
const summary = countries.map((c, i) => ({ code: c.code, name: c.name, count: counts[i] }))

// -----------------------------
// DB helpers
// -----------------------------
function getPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is not set.')
    process.exit(1)
  }

  // DigitalOcean managed Postgres typically requires SSL; local environments may not have the CA bundle
  // installed, which leads to: "self-signed certificate in certificate chain".
  //
  // We intentionally disable verification ONLY when connecting to DigitalOcean (or when sslmode is present).
  const useInsecureSsl =
    /ondigitalocean\.com/i.test(connectionString) || /[?&]sslmode=/i.test(connectionString)

  if (useInsecureSsl) {
    // Make Node accept the presented chain for this process.
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  return new Pool({
    connectionString,
    ssl: useInsecureSsl ? { rejectUnauthorized: false } : undefined,
  })
}

function randomCreatedAtWithinDays(days) {
  const ms = Math.floor(rng() * days * 24 * 60 * 60 * 1000)
  return new Date(Date.now() - ms)
}

function pick(arr) {
  return arr[Math.floor(rng() * arr.length)]
}

async function insertBatch(client, rows) {
  // rows: Array<{ city, country, countryCode, createdAt }>
  const values = []
  const placeholders = []
  for (let i = 0; i < rows.length; i++) {
    const base = i * 4
    placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`)
    values.push(rows[i].city, rows[i].country, rows[i].countryCode, rows[i].createdAt)
  }

  const sql = `
    INSERT INTO "UserLocation" ("city", "country", "countryCode", "createdAt")
    VALUES ${placeholders.join(',')}
  `

  await client.query(sql, values)
}

async function main() {
  console.log('Seed locations summary (alpha-2 country codes):')
  for (const s of summary) {
    console.log(`- ${s.code} (${s.name}): ${s.count}`)
  }
  console.log(`Total: ${summary.reduce((a, b) => a + b.count, 0)}`)
  console.log(`Seed: ${SEED}`)

  if (DRY_RUN) {
    console.log('Dry run enabled; not writing to DB.')
    return
  }

  const pool = getPool()
  const client = await pool.connect()
  try {
    if (TRUNCATE) {
      console.log('Truncating "UserLocation"...')
      await client.query('TRUNCATE TABLE "UserLocation"')
    }

    console.log('Inserting rows...')
    const BATCH_SIZE = 2000

    for (let i = 0; i < countries.length; i++) {
      const c = countries[i]
      const n = counts[i]
      let inserted = 0

      while (inserted < n) {
        const take = Math.min(BATCH_SIZE, n - inserted)
        const rows = new Array(take)
        for (let j = 0; j < take; j++) {
          rows[j] = {
            city: pick(c.cities),
            country: c.name,
            countryCode: c.code,
            createdAt: randomCreatedAtWithinDays(60),
          }
        }

        await insertBatch(client, rows)
        inserted += take

        if (inserted % 10000 === 0 || inserted === n) {
          console.log(`  ${c.code}: ${inserted}/${n}`)
        }
      }
    }

    console.log('Done.')
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

