'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { useTimezoneStore } from '@/lib/store'
import { searchCities, type City } from '@/lib/cities'

const STORAGE_KEY = 'wcd_user_location'

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

/** IANA timezone for a whole-hour UTC offset (Etc/GMT±N, sign inverted per spec). */
function offsetToIana(offsetHours: number): string {
  const sign = offsetHours <= 0 ? '-' : '+'
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

export default function TimezoneMapInline() {
  const t = useTranslations('worldMap')
  const timezoneInfo = useTimezoneStore((s) => s.timezoneInfo)
  const setTimezone = useTimezoneStore((s) => s.setTimezone)
  const [selectedOffset, setSelectedOffset] = useState(0)
  const [hoverOffset, setHoverOffset] = useState<number | null>(null)
  const [cityQuery, setCityQuery] = useState('')
  const [cityResults, setCityResults] = useState<City[]>([])
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const cityDropdownRef = useRef<HTMLDivElement>(null)
  const cityInputRef = useRef<HTMLInputElement>(null)

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
    <div className="w-full space-y-3">
      <p className="text-muted text-center text-sm">
        {t('selectOnMap')}
      </p>

      {/* City search — select city to highlight its timezone on the map */}
      <div className="relative max-w-md mx-auto" ref={cityDropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
          <input
            ref={cityInputRef}
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            onFocus={() => cityResults.length > 0 && setCityDropdownOpen(true)}
            placeholder={t('searchCityPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            aria-autocomplete="list"
            aria-expanded={cityDropdownOpen}
          />
        </div>
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

      {/* UTC label + hours from UTC on the same line */}
      <div className="text-center flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span className="text-lg font-semibold text-foreground tabular-nums">
          {formatUtcLabel(selectedOffset)}
        </span>
        <span className="text-muted text-sm">
          {t('hoursFromUtc', { offset: formatHoursFromUtcOffset(selectedOffset) })}
        </span>
      </div>

      {/* Mobile: native select — comfortable tap target, no tiny stripes */}
      <div className="sm:hidden w-full max-w-xs mx-auto">
        <label htmlFor="tz-offset-mobile" className="sr-only">
          {t('selectOnMap')}
        </label>
        <select
          id="tz-offset-mobile"
          value={selectedOffset}
          onChange={(e) => handleSelect(Number(e.target.value))}
          className="w-full py-3 px-4 text-base rounded-lg border border-gray-300 bg-white text-foreground cursor-pointer touch-manipulation"
        >
          {offsets.map((offset) => (
            <option key={offset} value={offset}>
              {formatUtcLabel(offset)}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile: map as decoration only (no stripes) */}
      <div className="sm:hidden relative w-full overflow-hidden rounded-lg bg-gray-100" style={{ aspectRatio: '2000/1280' }}>
        <img
          src="/world-map.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
          aria-hidden
        />
      </div>

      {/* Desktop: stripe labels above map, then map + interactive stripes */}
      <div className="hidden sm:block w-full">
        {/* Labels row: UTC over 0, -1 -2 -3... left, +1 +2 +3... right */}
        <div className="flex w-full mb-1">
          {offsets.map((offset) => (
            <div
              key={offset}
              className="flex-1 shrink-0 text-center text-xs font-medium text-muted tabular-nums"
            >
              {formatStripeLabel(offset)}
            </div>
          ))}
        </div>
        <div className="relative w-full overflow-hidden rounded-lg bg-gray-100" style={{ aspectRatio: '2000/1280' }}>
          <img
            src="/world-map.svg"
            alt="World map"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex pointer-events-none">
            <div className="absolute inset-0 flex pointer-events-auto">
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
                    className="flex-1 shrink-0 transition-colors cursor-pointer border-0 border-r border-gray-300/50 last:border-r-0"
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
