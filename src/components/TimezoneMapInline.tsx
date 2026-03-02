'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps'
import { useTimezoneStore } from '@/lib/store'
import { searchCities, type City } from '@/lib/cities'
import { alpha2ToNumeric } from '@/lib/countryNumericIds'
import { useClapperCount } from '@/lib/ClapperCountContext'

const STORAGE_KEY = 'wcd_user_location'
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

/** Alpha-2 country counts → numeric id counts (for world-atlas). */
function alpha2CountsToNumeric(byAlpha2: Record<string, number>): Record<string, number> {
  const byNumeric: Record<string, number> = {}
  for (const [code, count] of Object.entries(byAlpha2)) {
    const num = alpha2ToNumeric[code]
    if (num) byNumeric[num] = count
  }
  return byNumeric
}

function supportersToCountryCounts(
  supporters: { countryCode?: string }[]
): Record<string, number> {
  const byAlpha2: Record<string, number> = {}
  for (const s of supporters) {
    const code = (s.countryCode || '').toUpperCase().slice(0, 2)
    if (code) byAlpha2[code] = (byAlpha2[code] || 0) + 1
  }
  return alpha2CountsToNumeric(byAlpha2)
}

function getCountryFill(count: number | undefined, maxCount: number): string {
  if (!count || count === 0) return '#e5e7eb'
  const n = Math.log(count + 1) / Math.log(maxCount + 1)
  const r = Math.round(252 + (193 - 252) * n)
  const g = Math.round(231 + (127 - 231) * n)
  const b = Math.round(243 + (181 - 243) * n)
  return `rgb(${r}, ${g}, ${b})`
}

// UTC offset in hours: -12 .. +12 → 25 stripes
const OFFSET_MIN = -12
const OFFSET_MAX = 12
const STRIPE_COUNT = OFFSET_MAX - OFFSET_MIN + 1 // 25

function getOffsetHoursFromTimezone(tz: string): number {
  try {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: tz,
      timeZoneName: 'longOffset',
    })
    const parts = formatter.formatToParts(new Date())
    const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
    const m = tzPart.match(/GMT([+-])(\d{1,2}):?(\d{2})?/)
    if (!m) return 0
    const sign = m[1] === '+' ? 1 : -1
    const h = parseInt(m[2], 10)
    const min = (m[3] ? parseInt(m[3], 10) : 0) / 60
    return sign * (h + min)
  } catch {
    return 0
  }
}

/** IANA timezone for a whole-hour UTC offset. Etc/GMT uses opposite sign: GMT-5 = UTC+5, GMT+5 = UTC-5. */
function offsetToIana(offsetHours: number): string {
  const sign = offsetHours <= 0 ? '+' : '-'  // invert: UTC-5 → Etc/GMT+5, UTC+5 → Etc/GMT-5
  const abs = Math.abs(offsetHours)
  return `Etc/GMT${sign}${abs}`
}

function formatUtcLabel(offsetHours: number): string {
  if (offsetHours === 0) return 'UTC'
  const sign = offsetHours > 0 ? '+' : ''
  return `UTC${sign}${offsetHours}`
}

/** Label above each stripe: "UTC" for 0, "+1"/"+2" or "-1"/"-2" for others */
function formatStripeLabel(offsetHours: number): string {
  if (offsetHours === 0) return 'UTC'
  const sign = offsetHours > 0 ? '+' : ''
  return `${sign}${offsetHours}`
}

/** e.g. "+2" or "-5" or "0" for hoursFromUtc translation */
function formatHoursFromUtcOffset(offsetHours: number): string {
  if (offsetHours === 0) return '0'
  const sign = offsetHours > 0 ? '+' : ''
  return `${sign}${offsetHours}`
}

interface TimezoneMapInlineProps {
  /** Clapper counts by country (alpha-2). When provided, map is colored by these. */
  countryCounts?: Record<string, number>
  /** Fallback: supporters with countryCode when countryCounts not provided */
  supporters?: { countryCode?: string }[]
}

export default function TimezoneMapInline({
  countryCounts: countryCountsAlpha2,
  supporters = [],
}: TimezoneMapInlineProps) {
  const t = useTranslations('worldMap')
  const { totalCount } = useClapperCount()
  const timezoneInfo = useTimezoneStore((s) => s.timezoneInfo)
  const setTimezone = useTimezoneStore((s) => s.setTimezone)
  const [selectedOffset, setSelectedOffset] = useState(0)
  const [hoverOffset, setHoverOffset] = useState<number | null>(null)
  const [cityQuery, setCityQuery] = useState('')
  const [cityResults, setCityResults] = useState<City[]>([])
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const cityDropdownRef = useRef<HTMLDivElement>(null)
  const cityInputRef = useRef<HTMLInputElement>(null)
  const [sparks, setSparks] = useState<
    { id: number; x: number; y: number; createdAt: number }[]
  >([])
  const sparkIdRef = useRef(0)
  const lastTotalRef = useRef(totalCount)

  // When the global clapper counter increases, spawn a few sparkles on the map.
  useEffect(() => {
    if (totalCount <= lastTotalRef.current) {
      lastTotalRef.current = totalCount
      return
    }
    const delta = totalCount - lastTotalRef.current
    lastTotalRef.current = totalCount
    const sparkCount = Math.min(Math.max(delta, 1), 3)
    const now = Date.now()
    setSparks((prev) => [
      ...prev,
      ...Array.from({ length: sparkCount }, () => ({
        id: sparkIdRef.current++,
        x: Math.random(),
        y: Math.random(),
        createdAt: now,
      })),
    ])
  }, [totalCount])

  // Drop old sparkles after their animation has finished.
  useEffect(() => {
    if (sparks.length === 0) return
    const timeout = setTimeout(() => {
      const cutoff = Date.now() - 1200
      setSparks((prev) => prev.filter((s) => s.createdAt > cutoff))
    }, 1300)
    return () => clearTimeout(timeout)
  }, [sparks.length])

  const countryCounts = useMemo(
    () =>
      countryCountsAlpha2 != null && Object.keys(countryCountsAlpha2).length > 0
        ? alpha2CountsToNumeric(countryCountsAlpha2)
        : supportersToCountryCounts(supporters),
    [countryCountsAlpha2, supporters]
  )
  const maxCount = useMemo(
    () => Math.max(...Object.values(countryCounts), 1),
    [countryCounts]
  )

  const offsetFromStore = useMemo(() => {
    if (!timezoneInfo?.timezone) return 0
    return Math.round(getOffsetHoursFromTimezone(timezoneInfo.timezone))
  }, [timezoneInfo?.timezone])

  useEffect(() => {
    const clamped = Math.max(OFFSET_MIN, Math.min(OFFSET_MAX, offsetFromStore))
    setSelectedOffset(clamped)
  }, [offsetFromStore])

  useEffect(() => {
    if (cityQuery.length >= 2) {
      setCityResults(searchCities(cityQuery, 8))
      setCityDropdownOpen(true)
    } else {
      setCityResults([])
      setCityDropdownOpen(false)
    }
  }, [cityQuery])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(e.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(e.target as Node)
      ) {
        setCityDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = useCallback(
    (offsetHours: number) => {
      setSelectedOffset(offsetHours)
      const iana = offsetToIana(offsetHours)
      setTimezone({
        timezone: iana,
        source: 'city',
      })
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const base = stored ? { ...JSON.parse(stored) } : {}
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...base,
            timezone: iana,
            savedAt: new Date().toISOString(),
          })
        )
      } catch {
        // ignore
      }
    },
    [setTimezone]
  )

  const handleCitySelect = useCallback(
    (city: City) => {
      const offset = Math.round(getOffsetHoursFromTimezone(city.timezone))
      const clamped = Math.max(OFFSET_MIN, Math.min(OFFSET_MAX, offset))
      setSelectedOffset(clamped)
      setTimezone({
        timezone: city.timezone,
        city: city.city,
        country: city.country,
        source: 'city',
      })
      setCityQuery('')
      setCityResults([])
      setCityDropdownOpen(false)
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const base = stored ? { ...JSON.parse(stored) } : {}
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...base,
            city: city.city,
            country: city.country,
            countryCode: city.countryCode,
            timezone: city.timezone,
            savedAt: new Date().toISOString(),
          })
        )
      } catch {
        // ignore
      }
    },
    [setTimezone]
  )

  const offsets = Array.from(
    { length: STRIPE_COUNT },
    (_, i) => OFFSET_MIN + i
  )

  return (
    <div className="w-full min-w-0 space-y-3">
      <p className="text-muted text-center text-sm sm:text-left">
        {t('selectOnMap')}
      </p>

      {/* Wrapper so one ref covers both mobile and desktop city search for click-outside */}
      <div ref={cityDropdownRef} className="contents">
      {/* Mobile: city input + UTC select in one row, left-aligned */}
      <div className="sm:hidden flex flex-col gap-3">
        <div className="flex gap-2 items-stretch">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              ref={cityInputRef}
              type="text"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              onFocus={() => cityResults.length > 0 && setCityDropdownOpen(true)}
              placeholder={t('searchCityPlaceholder')}
              className="w-full pl-9 pr-3 py-2.5 text-base rounded-lg border border-gray-300 bg-white text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              aria-autocomplete="list"
              aria-expanded={cityDropdownOpen}
            />
            {cityDropdownOpen && cityResults.length > 0 && (
              <ul
                className="absolute z-10 top-full left-0 right-0 mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                role="listbox"
              >
                {cityResults.map((city) => (
                  <li key={`${city.city}-${city.country}`} role="option">
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-foreground"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city.city}, {city.country}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <label htmlFor="tz-offset-mobile" className="sr-only">
            {t('selectOnMap')}
          </label>
          <select
            id="tz-offset-mobile"
            value={selectedOffset}
            onChange={(e) => handleSelect(Number(e.target.value))}
            className="shrink-0 w-auto min-w-[5rem] py-2.5 px-3 text-base rounded-lg border border-gray-300 bg-white text-foreground cursor-pointer touch-manipulation"
          >
            {offsets.map((offset) => (
              <option key={offset} value={offset}>
                {formatUtcLabel(offset)}
              </option>
            ))}
          </select>
        </div>
        {/* Mobile: итоговый часовой пояс — My Timezone: UTC±N, крупно, по центру, с отступами */}
        <p className="text-2xl font-bold text-foreground tabular-nums text-center my-5">
          My Timezone: {formatUtcLabel(selectedOffset)}
        </p>
      </div>

      {/* Desktop: город 80% + UTC селект 20% в одной строке, затем итоговый пояс по центру */}
      <div className="hidden sm:block space-y-3">
        <div className="grid grid-cols-[4fr_1fr] gap-2 w-full">
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
            <input
              ref={cityInputRef}
              type="text"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              onFocus={() => cityResults.length > 0 && setCityDropdownOpen(true)}
              placeholder={t('searchCityPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 text-base rounded-lg border border-gray-300 bg-white text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              aria-autocomplete="list"
              aria-expanded={cityDropdownOpen}
            />
            {cityDropdownOpen && cityResults.length > 0 && (
              <ul
                className="absolute z-10 top-full left-0 right-0 mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                role="listbox"
              >
                {cityResults.map((city) => (
                  <li key={`${city.city}-${city.country}`} role="option">
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-foreground"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city.city}, {city.country}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <label htmlFor="tz-offset-desktop" className="sr-only">
            {t('selectOnMap')}
          </label>
          <select
            id="tz-offset-desktop"
            value={selectedOffset}
            onChange={(e) => handleSelect(Number(e.target.value))}
            className="w-full min-w-0 py-2.5 px-3 rounded-lg border border-gray-300 bg-white text-foreground cursor-pointer text-sm"
          >
            {offsets.map((offset) => (
              <option key={offset} value={offset}>
                {formatUtcLabel(offset)}
              </option>
            ))}
          </select>
        </div>
        {/* Desktop: итоговый часовой пояс — My Timezone: UTC±N, по центру над картой, крупно как заголовок, с отступами */}
        <div className="flex justify-center text-center my-6">
          <span className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
            My Timezone: {formatUtcLabel(selectedOffset)}
          </span>
        </div>
      </div>
      </div>

      {/* Map (same on mobile and desktop): countries colored; stripe labels + overlay for selection */}
      <div className="w-full min-w-0">
        {/* Stripe labels: hidden on mobile (select + big UTC label are enough); on desktop show with caption */}
        <div className="hidden sm:flex w-full mb-1 min-w-0 items-baseline gap-1">
          <span className="text-xs text-muted shrink-0">{t('stripeLabelsHint')}</span>
          <div className="flex flex-1 min-w-0">
            {offsets.map((offset) => (
              <div
                key={offset}
                className="flex-1 min-w-0 text-center text-xs font-medium text-muted tabular-nums truncate"
              >
                {formatStripeLabel(offset)}
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full min-w-0 overflow-hidden rounded-lg bg-gray-100" style={{ aspectRatio: '2/1', minHeight: '240px' }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 120, center: [0, 30] }}
            style={{ width: '100%', height: '100%' }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const id = String(geo.id)
                  const count = countryCounts[id] || 0
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getCountryFill(count, maxCount)}
                      stroke="#9ca3af"
                      strokeWidth={0.5}
                      style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
          {/* Sparkles indicating new claps */}
          <div className="pointer-events-none absolute inset-0">
            {sparks.map((spark) => (
              <span
                key={spark.id}
                className="absolute rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.9)] spark-on-map"
                style={{
                  width: 10,
                  height: 10,
                  left: `${spark.x * 100}%`,
                  top: `${spark.y * 100}%`,
                }}
              />
            ))}
          </div>
          {/* Stripe overlay: tap/click to select timezone (mobile + desktop) */}
          <div className="flex absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 flex pointer-events-auto min-w-0">
              {offsets.map((offset, i) => {
                const isSelected = selectedOffset === offset
                const isHover = hoverOffset === offset
                const isEven = i % 2 === 0
                let bg = isEven ? 'rgba(229,231,235,0.5)' : 'rgba(209,213,219,0.5)'
                if (isSelected) bg = 'rgba(107,114,128,0.55)'
                else if (isHover) bg = 'rgba(156,163,175,0.6)'
                return (
                  <button
                    key={offset}
                    type="button"
                    className="flex-1 min-w-0 transition-colors cursor-pointer border-0 border-r border-gray-300/50 last:border-r-0 touch-manipulation"
                    style={{ backgroundColor: bg }}
                    onMouseEnter={() => setHoverOffset(offset)}
                    onMouseLeave={() => setHoverOffset(null)}
                    onClick={() => handleSelect(offset)}
                    title={formatUtcLabel(offset)}
                    aria-label={formatUtcLabel(offset)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
