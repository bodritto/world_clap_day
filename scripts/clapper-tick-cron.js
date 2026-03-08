#!/usr/bin/env node
/**
 * Calls GET /api/cron/clapper-tick every NEXT_PUBLIC_CLAPPER_TICK_INTERVAL_MS (default 5s)
 * to add NEXT_PUBLIC_CLAPPER_ADD_MIN–MAX to the live clapper count (per-country, weighted).
 *
 * Usage:
 *   CRON_SECRET=your-secret BASE_URL=http://localhost:3000 node scripts/clapper-tick-cron.js
 *   Optional: NEXT_PUBLIC_CLAPPER_TICK_INTERVAL_MS=5000 NEXT_PUBLIC_CLAPPER_ADD_MIN=1 NEXT_PUBLIC_CLAPPER_ADD_MAX=5
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const CRON_SECRET = process.env.CRON_SECRET
const INTERVAL_MS = parseInt(process.env.NEXT_PUBLIC_CLAPPER_TICK_INTERVAL_MS || '5000', 10)

const url = `${BASE_URL.replace(/\/$/, '')}/api/cron/clapper-tick`
const headers = {}
if (CRON_SECRET) {
  headers['Authorization'] = `Bearer ${CRON_SECRET}`
  headers['x-cron-secret'] = CRON_SECRET
}

async function tick() {
  try {
    const res = await fetch(url, { headers })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      console.log(`[${new Date().toISOString()}] tick ok, count=${data.count ?? '—'}`)
    } else {
      console.error(`[${new Date().toISOString()}] tick failed ${res.status}`, data)
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] tick error`, err.message)
  }
}

console.log(`Clapper tick cron: ${url} every ${INTERVAL_MS / 1000}s`)
tick()
setInterval(tick, INTERVAL_MS)
