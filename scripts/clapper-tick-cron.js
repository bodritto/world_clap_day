#!/usr/bin/env node
/**
 * Calls GET /api/cron/clapper-tick every 5 seconds to add 1–5 to the live clapper count
 * by incrementing per-country counts (weighted distribution). Total = sum of country counts.
 *
 * Usage:
 *   CRON_SECRET=your-secret BASE_URL=http://localhost:3000 node scripts/clapper-tick-cron.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const CRON_SECRET = process.env.CRON_SECRET
const INTERVAL_MS = 5000

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
