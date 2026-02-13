'use client'

interface Supporter {
  _id: string
  name: string
  country?: string
  countryCode?: string
  tier?: { name: string }
  _createdAt: string
}

interface WallOfClapsProps {
  supporters: Supporter[]
}

/** Convert ISO 3166-1 alpha-2 code to flag emoji (e.g. "US" -> 🇺🇸) */
function getFlagEmoji(countryCode: string): string {
  const code = (countryCode || '').toUpperCase().slice(0, 2)
  if (code.length !== 2) return ''
  return [...code]
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('')
}

/** Country name -> alpha-2 for common names (fallback when only country is set) */
const countryNameToCode: Record<string, string> = {
  'United States': 'US',
  'United States of America': 'US',
  'United Kingdom': 'GB',
  'Germany': 'DE',
  'France': 'FR',
  'Spain': 'ES',
  'Italy': 'IT',
  'Canada': 'CA',
  'Australia': 'AU',
  'Japan': 'JP',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'India': 'IN',
  'Netherlands': 'NL',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Belgium': 'BE',
  'Poland': 'PL',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Ireland': 'IE',
  'Portugal': 'PT',
  'Argentina': 'AR',
  'Chile': 'CL',
  'Colombia': 'CO',
  'South Africa': 'ZA',
  'New Zealand': 'NZ',
  'Russia': 'RU',
  'China': 'CN',
  'South Korea': 'KR',
  'Turkey': 'TR',
}

function getFlagForSupporter(supporter: Supporter): string {
  if (supporter.countryCode) return getFlagEmoji(supporter.countryCode)
  if (supporter.country) {
    const code = countryNameToCode[supporter.country] || countryNameToCode[supporter.country.trim()]
    if (code) return getFlagEmoji(code)
  }
  return ''
}

const ROWS = 3
const COLS = 4
const GRID_SIZE = ROWS * COLS

const ClapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 218.56 191.79"
    className="w-8 h-8 fill-primary"
  >
    <path d="M106.28,78.64c4-11,15.42-14.06,23.63-6.19,8.6,8.23,17.15,16.56,25.11,25.4,21.65,24,18.11,62.53-7.27,82.51-18,14.19-43.3,15.25-63.15,2.69a64,64,0,0,1-11.07-8.89Q55.79,156.4,38,138.66c-8.78-8.75-7.87-17.48,3.21-24.23-1.63-1.4-3.21-2.61-4.62-4-8.09-8-5.72-19.82,4.8-24.11a6.51,6.51,0,0,0,.76-.48c-2-2.49-3.73-5.09-4.2-8.34A14.59,14.59,0,0,1,44.67,63,14.2,14.2,0,0,1,61,64.23c1.16,1,1.62,1.44,2.45-.48C67.58,54.18,79.14,52,86.58,59.34,92.5,65.19,98.33,71.14,104.22,77,104.79,77.59,105.21,78.37,106.28,78.64Zm55.89,56.93c-.13-13.61-4.77-25.42-14.26-35.2-7.37-7.59-14.9-15-22.39-22.49-3-3-7.23-3.33-10.15-.84s-3.33,6.78-.64,10.29c4.82,6.27,9.7,12.5,14.54,18.76,1.18,1.51,2.43,3,3.47,4.57a3.32,3.32,0,0,1-.86,4.86c-1.64,1.21-3.3.91-4.7-.58-.45-.48-.81-1-1.23-1.57-6.39-7.79-11.88-16.3-18.91-23.55C100.32,82.88,93.4,76.13,86.56,69.3c-1.77-1.76-3.47-3.6-5.34-5.25a7.32,7.32,0,0,0-8.83-.54,7.14,7.14,0,0,0-2.76,7.95,9.52,9.52,0,0,0,2.78,4.07L97,100.08c2.47,2.47,5,4.88,7.39,7.44,2.12,2.28,1.39,5.34-1.37,6.25-1.83.6-3-.56-4.11-1.69L58.8,72a29.12,29.12,0,0,0-2.36-2.23,7.13,7.13,0,0,0-11.36,7.61,9.51,9.51,0,0,0,2.85,4l37.4,37.51c1.47,1.48,3,2.92,4.33,4.5a3.06,3.06,0,0,1-.19,4.5,3.23,3.23,0,0,1-4.53.38,32.86,32.86,0,0,1-3.26-3.1Q66.76,110.25,51.82,95.32c-3.39-3.38-7.9-3.54-10.88-.51-2.83,2.89-2.54,7.37.75,10.68q9,9,18,18l18.74,18.72c.23.23.48.46.7.71,1.6,1.81,1.68,3.88.2,5.35s-3.51,1.4-5.29-.38c-7.49-7.48-14.93-15-22.41-22.47a23.5,23.5,0,0,0-3.16-2.83c-2.62-1.8-5.56-1.6-7.56.37s-2.32,5-.48,7.74a14.51,14.51,0,0,0,2,2.25c7.53,7.55,15,15.16,22.63,22.6,6.61,6.45,12.57,13.61,20,19.14,11.34,8.43,24,12.22,38.08,9.36A49.08,49.08,0,0,0,162.17,135.57Z" />
    <path d="M88,40.23c1.2-3.1,2.75-5.83,5.39-7.75a13.89,13.89,0,0,1,18.26,1.34c6,5.87,11.95,11.85,17.86,17.83,1.28,1.3,1.88,1.91,2.89-.41a14,14,0,0,1,20.64-5.88,16.45,16.45,0,0,1,2.54,2c7.87,7.91,15.92,15.66,23.51,23.83a57.16,57.16,0,0,1,1.75,76.2c-1.89,2.24-3.72,2.55-5.58,1-1.63-1.38-1.63-3.37.14-5.5a49.94,49.94,0,0,0,12-30.82c.49-15.06-5.1-27.79-15.61-38.43q-10.28-10.39-20.64-20.71c-3.11-3.1-7.34-3.34-10.31-.7s-3.12,6.84-.4,10.31,5.37,6.8,8,10.23c1.62,2.1,1.55,4.2-.08,5.55s-3.87,1-5.54-1.24c-10.35-14.14-23.76-25.39-35.79-37.94a7,7,0,0,0-10.27-.07c-2.83,3-2.75,7.1.32,10.27,3.77,3.89,7.62,7.7,11.43,11.54a3.63,3.63,0,0,1,.73,4.77c-.88,1.53-2.34,1.72-3.92,1.45A4.61,4.61,0,0,1,103,65.37c-6.59-6.6-13.14-13.24-19.78-19.8-3.37-3.35-7-3.66-10.28-1.14a7,7,0,0,0-2.56,4.15C69.8,51,68,52.14,66.06,51.64S63,49.35,63.43,47c1.64-10.13,14.39-14.8,22.73-8.32C86.74,39.09,87.29,39.59,88,40.23Z" />
  </svg>
)

export default function WallOfClaps({ supporters }: WallOfClapsProps) {
  if (supporters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Be the first to join the Wall of Claps!</p>
      </div>
    )
  }

  const displaySupporters = supporters.slice(0, GRID_SIZE)

  return (
    <div
      className="grid gap-6 max-w-3xl mx-auto"
      style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
    >
      {displaySupporters.map((supporter) => {
        const flag = getFlagForSupporter(supporter)
        return (
          <div key={supporter._id} className="flex flex-col items-center text-center">
            <ClapIcon />
            <p className="mt-2 text-foreground font-bold text-sm">
              {supporter.name}
            </p>
            {flag ? (
              <span className="text-2xl leading-none mt-1" title={supporter.country || supporter.countryCode} aria-hidden>
                {flag}
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
