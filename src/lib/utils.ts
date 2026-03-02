import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export type DonationCurrency = 'eur' | 'usd' | 'gbp'

const CURRENCY_SYMBOLS: Record<DonationCurrency, string> = {
  eur: '€',
  usd: '$',
  gbp: '£',
}

export function getCurrencySymbol(currency: DonationCurrency): string {
  return CURRENCY_SYMBOLS[currency]
}

/** Convert ISO 3166-1 alpha-2 code to flag emoji (e.g. "US" -> 🇺🇸) */
export function getFlagEmoji(countryCode: string): string {
  const code = (countryCode || '').toUpperCase().slice(0, 2)
  if (code.length !== 2) return ''
  return [...code]
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('')
}

export function formatPrice(price: number, currency: DonationCurrency = 'usd'): string {
  const currencyUpper = currency.toUpperCase()
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyUpper,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Get offset in minutes for a timezone at a given UTC date (for DST).
 */
function getOffsetMinutesAtUTC(utcDate: Date, timeZone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone,
      timeZoneName: 'longOffset',
    })
    const parts = formatter.formatToParts(utcDate)
    const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
    const m = tzPart.match(/GMT([+-])(\d{1,2}):?(\d{2})?/)
    if (!m) return 0
    const sign = m[1] === '+' ? 1 : -1
    const h = parseInt(m[2], 10)
    const min = (m[3] ? parseInt(m[3], 10) : 0)
    return sign * (h * 60 + min)
  } catch {
    return 0
  }
}

/**
 * Convert "YYYY-MM-DDTHH:mm:ss" in a given timezone to the corresponding UTC Date.
 */
export function getUTCDateForLocalInTimeZone(
  localDateStr: string,
  timeZone: string
): Date {
  const [datePart, timePart] = localDateStr.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  const [h, min, s] = (timePart || '00:00:00').split(':').map(Number)
  const localAsUTC = Date.UTC(y, m - 1, d, h, min, s || 0)
  const noonUTC = new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
  const offsetMinutes = getOffsetMinutesAtUTC(noonUTC, timeZone)
  const targetUTC = new Date(localAsUTC - offsetMinutes * 60 * 1000)
  return targetUTC
}

export function calculateTimeLeft(targetDate: Date | string) {
  const difference = +new Date(targetDate) - +new Date()
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}
