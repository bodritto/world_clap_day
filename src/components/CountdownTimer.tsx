'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { calculateTimeLeft } from '@/lib/utils'

interface CountdownTimerProps {
  targetDate: string | Date
}

interface TimeUnit {
  value: number
  labelKey: 'days' | 'hours' | 'minutes' | 'seconds'
  color: string
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const t = useTranslations('countdown')
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="countdown-circle animate-pulse">
            <div className="text-center">
              <div className="h-8 w-12 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const timeUnits: TimeUnit[] = [
    { value: timeLeft.days, labelKey: 'days', color: 'border-amber-400' },
    { value: timeLeft.hours, labelKey: 'hours', color: 'border-blue-400' },
    { value: timeLeft.minutes, labelKey: 'minutes', color: 'border-green-400' },
    { value: timeLeft.seconds, labelKey: 'seconds', color: 'border-red-400' },
  ]

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6">
      {timeUnits.map((unit, index) => (
        <div
          key={unit.labelKey}
          className="relative"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${unit.color} flex items-center justify-center bg-white shadow-lg`}
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {unit.value.toString().padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-muted font-medium tracking-wider">
                {t(unit.labelKey)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
