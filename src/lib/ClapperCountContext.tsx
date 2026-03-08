'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { pickCountryFromDistribution } from '@/lib/clapperCountryDistribution'
import { CLAPPER_TICK_INTERVAL_MS, getClapperAddPerTick } from '@/lib/clapperTickConfig'

const MAP_UPDATE_EVERY_TICKS = 20

type ClapperCountContextValue = {
  totalCount: number
  /** True after first successful fetch from /api/clapper-counts (so animation uses real DB value) */
  hasSyncedWithServer: boolean
  /** Country counts for map; updated every MAP_UPDATE_EVERY_TICKS ticks to limit re-renders */
  mapCountryCounts: Record<string, number>
  /** Alpha-2 codes of countries that got a clap in the last tick (for map flash) */
  lastTickCountries: string[]
  tickCount: number
}

const ClapperCountContext = createContext<ClapperCountContextValue | null>(null)

interface ClapperCountProviderProps {
  children: ReactNode
  initialTotal: number
  initialCountryCounts: Record<string, number>
}

export function ClapperCountProvider({
  children,
  initialTotal,
  initialCountryCounts,
}: ClapperCountProviderProps) {
  const [totalCount, setTotalCount] = useState(initialTotal)
  const [hasSyncedWithServer, setHasSyncedWithServer] = useState(false)
  const [liveCountryCounts, setLiveCountryCounts] = useState<Record<string, number>>(initialCountryCounts)
  const [mapCountryCounts, setMapCountryCounts] = useState<Record<string, number>>(initialCountryCounts)
  const [tickCount, setTickCount] = useState(0)
  const [lastTickCountries, setLastTickCountries] = useState<string[]>([])

  // Sync with server on mount so the site shows the same count as the admin (fixes SSR fallback to default)
  useEffect(() => {
    let cancelled = false
    fetch('/api/clapper-counts')
      .then((res) => res.json())
      .then((body: { success?: boolean; data?: { totalCount?: number; countryCounts?: Record<string, number> } }) => {
        if (cancelled || !body?.success || body.data?.totalCount == null) return
        setTotalCount(body.data.totalCount)
        setHasSyncedWithServer(true)
        if (body.data.countryCounts && Object.keys(body.data.countryCounts).length > 0) {
          setLiveCountryCounts(body.data.countryCounts)
          setMapCountryCounts(body.data.countryCounts)
        }
      })
      .catch(() => { setHasSyncedWithServer(true) })
    return () => { cancelled = true }
  }, [])

  const tick = useCallback(() => {
    const add = getClapperAddPerTick()
    const codes: string[] = []
    for (let i = 0; i < add; i++) {
      codes.push(pickCountryFromDistribution())
    }
    setLastTickCountries(codes)
    setTotalCount((prev) => prev + add)
    setLiveCountryCounts((prev) => {
      const next = { ...prev }
      for (const code of codes) {
        next[code] = (next[code] ?? 0) + 1
      }
      return next
    })
    setTickCount((c) => c + 1)
  }, [])

  useEffect(() => {
    const id = setInterval(tick, CLAPPER_TICK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [tick])

  useEffect(() => {
    if (tickCount > 0 && tickCount % MAP_UPDATE_EVERY_TICKS === 0) {
      setMapCountryCounts({ ...liveCountryCounts })
    }
  }, [tickCount, liveCountryCounts])

  const value = useMemo<ClapperCountContextValue>(
    () => ({ totalCount, hasSyncedWithServer, mapCountryCounts, lastTickCountries, tickCount }),
    [totalCount, hasSyncedWithServer, mapCountryCounts, lastTickCountries, tickCount]
  )

  return (
    <ClapperCountContext.Provider value={value}>
      {children}
    </ClapperCountContext.Provider>
  )
}

export function useClapperCount(): ClapperCountContextValue {
  const ctx = useContext(ClapperCountContext)
  if (!ctx) {
    return {
      totalCount: 0,
      hasSyncedWithServer: false,
      mapCountryCounts: {},
      lastTickCountries: [],
      tickCount: 0,
    }
  }
  return ctx
}
