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

export default function AddToCalendar() {
  const t = useTranslations('home')

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <a
        href={buildGoogleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {t('addToCalendar')}
      </a>
    </div>
  )
}
