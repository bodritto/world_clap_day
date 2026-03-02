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

const TICK_INTERVAL_MS = 5000
const MIN_ADD = 1
const MAX_ADD = 5
const MAP_UPDATE_EVERY_TICKS = 20

type ClapperCountContextValue = {
  totalCount: number
  /** Country counts for map; updated every MAP_UPDATE_EVERY_TICKS ticks to limit re-renders */
  mapCountryCounts: Record<string, number>
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
  const [liveCountryCounts, setLiveCountryCounts] = useState<Record<string, number>>(initialCountryCounts)
  const [mapCountryCounts, setMapCountryCounts] = useState<Record<string, number>>(initialCountryCounts)
  const [tickCount, setTickCount] = useState(0)

  const tick = useCallback(() => {
    const add = Math.floor(Math.random() * (MAX_ADD - MIN_ADD + 1)) + MIN_ADD
    setTotalCount((prev) => prev + add)
    setLiveCountryCounts((prev) => {
      const next = { ...prev }
      for (let i = 0; i < add; i++) {
        const code = pickCountryFromDistribution()
        next[code] = (next[code] ?? 0) + 1
      }
      return next
    })
    setTickCount((c) => c + 1)
  }, [])

  useEffect(() => {
    const id = setInterval(tick, TICK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [tick])

  useEffect(() => {
    if (tickCount > 0 && tickCount % MAP_UPDATE_EVERY_TICKS === 0) {
      setMapCountryCounts({ ...liveCountryCounts })
    }
  }, [tickCount, liveCountryCounts])

  const value = useMemo<ClapperCountContextValue>(
    () => ({ totalCount, mapCountryCounts }),
    [totalCount, mapCountryCounts]
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
      mapCountryCounts: {},
    }
  }
  return ctx
}
