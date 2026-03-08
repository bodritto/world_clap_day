/**
 * Clapper auto-increment config. Used by cron/db (server) and ClapperCountContext (client).
 * Env: NEXT_PUBLIC_CLAPPER_TICK_INTERVAL_MS, NEXT_PUBLIC_CLAPPER_ADD_MIN, NEXT_PUBLIC_CLAPPER_ADD_MAX
 */
function parseNum(value: string | undefined, defaultVal: number): number {
  if (value == null || value === '') return defaultVal
  const n = parseInt(value, 10)
  return Number.isNaN(n) ? defaultVal : n
}

export const CLAPPER_TICK_INTERVAL_MS = parseNum(
  process.env.NEXT_PUBLIC_CLAPPER_TICK_INTERVAL_MS,
  5000
)
export const CLAPPER_ADD_MIN = parseNum(process.env.NEXT_PUBLIC_CLAPPER_ADD_MIN, 1)
export const CLAPPER_ADD_MAX = parseNum(process.env.NEXT_PUBLIC_CLAPPER_ADD_MAX, 5)

export function getClapperAddPerTick(): number {
  const min = Math.max(0, CLAPPER_ADD_MIN)
  const max = Math.max(min, CLAPPER_ADD_MAX)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
