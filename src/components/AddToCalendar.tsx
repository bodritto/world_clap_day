'use client'

import { useTranslations } from 'next-intl'

// World Clap Day: 16 August 2026, 10:00 AM New York (EDT) = 14:00 UTC
const EVENT_START = '20260816T140000Z'
const EVENT_END = '20260816T141500Z' // 15 min
const TITLE = 'World Clap Day'
const DETAILS = 'Join the global moment. One clap, one world.'
const LOCATION = 'Worldwide'

function buildGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: TITLE,
    dates: `${EVENT_START}/${EVENT_END}`,
    details: DETAILS,
    location: LOCATION,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

const CalendarIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

interface AddToCalendarProps {
  /** Use dark button style (for email card on dark background) */
  variant?: 'default' | 'dark'
}

export default function AddToCalendar({ variant = 'default' }: AddToCalendarProps) {
  const t = useTranslations('home')

  if (variant === 'dark') {
    return (
      <a
        href={buildGoogleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition-colors border border-white/30"
      >
        <CalendarIcon />
        {t('addToCalendar')}
      </a>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <a
        href={buildGoogleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-medium"
      >
        <CalendarIcon />
        {t('addToCalendar')}
      </a>
    </div>
  )
}
