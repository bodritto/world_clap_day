'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Search, MapPin } from 'lucide-react'
import { searchCities, City } from '@/lib/cities'
import { useTimezoneStore } from '@/lib/store'

const STORAGE_KEY = 'wcd_user_location'

interface StoredLocation {
  city: string
  country: string
  countryCode: string
  timezone: string
  savedAt: string
}

interface CityPickerProps {
  onLocationSaved?: () => void
}

export default function CityPicker({ onLocationSaved }: CityPickerProps) {
  const t = useTranslations('cityPicker')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<City[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedLocation, setSavedLocation] = useState<StoredLocation | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const setTimezone = useTimezoneStore((state) => state.setTimezone)

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const location = JSON.parse(stored) as StoredLocation
        setSavedLocation(location)
        // Also update the timezone store with the saved location
        if (location.timezone) {
          setTimezone({
            timezone: location.timezone,
            city: location.city,
            country: location.country,
            source: 'city',
          })
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [setTimezone])

  // Search cities as user types
  useEffect(() => {
    if (query.length >= 2) {
      const matches = searchCities(query, 8)
      setResults(matches)
      setIsOpen(matches.length > 0)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectCity = async (city: City) => {
    setIsSubmitting(true)
    setIsOpen(false)
    setQuery('')

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: city.city,
          country: city.country,
          countryCode: city.countryCode,
        }),
      })

      if (response.ok) {
        const location: StoredLocation = {
          city: city.city,
          country: city.country,
          countryCode: city.countryCode,
          timezone: city.timezone,
          savedAt: new Date().toISOString(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(location))
        setSavedLocation(location)
        
        // Update the timezone store with the selected city's timezone
        setTimezone({
          timezone: city.timezone,
          city: city.city,
          country: city.country,
          source: 'city',
        })
        
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        onLocationSaved?.()
      }
    } catch (error) {
      console.error('Error saving location:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <label className="block text-center text-lg font-medium text-foreground mb-4">
        {t('title')}
      </label>

      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder={t('placeholder')}
            disabled={isSubmitting}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground disabled:opacity-50"
          />
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden"
          >
            {results.map((city, index) => (
              <button
                key={`${city.countryCode}-${city.city}-${index}`}
                onClick={() => handleSelectCity(city)}
                className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-muted flex-shrink-0" />
                <div>
                  <span className="font-medium text-foreground">{city.city}</span>
                  <span className="text-muted ml-2">{city.country}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="mt-3 text-center text-primary font-medium animate-fade-in">
            {t('success')}
          </div>
        )}

        {/* Loading State */}
        {isSubmitting && (
          <div className="mt-3 text-center text-muted">
            {t('saving')}
          </div>
        )}
      </div>
    </div>
  )
}
