'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type MapRefreshContextValue = {
  refreshTrigger: number
  incrementRefresh: () => void
}

const MapRefreshContext = createContext<MapRefreshContextValue | null>(null)

export function MapRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const incrementRefresh = useCallback(() => {
    setRefreshTrigger((n) => n + 1)
  }, [])
  return (
    <MapRefreshContext.Provider value={{ refreshTrigger, incrementRefresh }}>
      {children}
    </MapRefreshContext.Provider>
  )
}

export function useMapRefresh(): MapRefreshContextValue {
  const ctx = useContext(MapRefreshContext)
  if (!ctx) {
    return {
      refreshTrigger: 0,
      incrementRefresh: () => {},
    }
  }
  return ctx
}
