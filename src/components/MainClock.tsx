'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Clock, MapPin } from 'lucide-react'
import { useTimezoneStore } from '@/lib/store'

interface MainClockProps {
  className?: string
  eventDate: string // e.g., "16th August 2026"
}

export default function MainClock({ className = '', eventDate }: MainClockProps) {
  const t = useTranslations('mainClock')
  const { timezoneInfo, isLoading, setTimezone, setLoading } = useTimezoneStore()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  // Detect timezone from IP on mount (only if no timezone is set)
  useEffect(() => {
    setMounted(true)
    
    const detectTimezone = async () => {
      // If timezone is already set from a saved city, don't detect from IP
      if (timezoneInfo?.source === 'city') {
        setLoading(false)
        return
      }

      try {
        // First try to use the browser's timezone as a fallback
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        
        // Try to detect timezone from IP using a free API
        const response = await fetch('https://ipapi.co/json/', {
          signal: AbortSignal.timeout(5000), // 5 second timeout
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.timezone) {
            setTimezone({
              timezone: data.timezone,
              city: data.city,
              country: data.country_name,
              source: 'ip',
            })
            return
          }
        }
        
        // Fallback to browser timezone
        setTimezone({
          timezone: browserTimezone,
          source: 'browser',
        })
      } catch (error) {
        // On error, fallback to browser timezone
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        setTimezone({
          timezone: browserTimezone,
          source: 'browser',
        })
      }
    }

    detectTimezone()
  }, [setTimezone, setLoading, timezoneInfo?.source])

  // Update time every second
  useEffect(() => {
    if (!timezoneInfo?.timezone) return

    const updateTime = () => {
      try {
        const now = new Date()
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezoneInfo.timezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
        setCurrentTime(formatter.format(now))
      } catch {
        // If timezone is invalid, use local time
        const now = new Date()
        setCurrentTime(now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }))
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [timezoneInfo?.timezone])

  // Don't render on server
  if (!mounted) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="animate-pulse bg-gray-200 h-12 w-72 rounded-lg mb-2" />
        <div className="animate-pulse bg-gray-200 h-4 w-32 rounded" />
      </div>
    )
  }

  // Loading state
  if (isLoading && !timezoneInfo) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground">
          {eventDate}
        </h3>
        <div className="flex items-center gap-2 mt-2 text-muted">
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="text-sm">{t('detecting')}</span>
        </div>
      </div>
    )
  }

  const locationLabel = timezoneInfo?.city 
    ? `${timezoneInfo.city}${timezoneInfo.country ? `, ${timezoneInfo.country}` : ''}`
    : timezoneInfo?.timezone?.replace(/_/g, ' ').split('/').pop() || t('localTime')

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Main Title: Date + Time */}
      <h3 className="text-2xl md:text-3xl font-bold text-foreground">
        {eventDate} · {currentTime}
      </h3>
      
      {/* Subtitle: Current Timezone */}
      <div className="flex items-center gap-2 mt-2 text-muted">
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">
          {locationLabel}
        </span>
      </div>
    </div>
  )
}
