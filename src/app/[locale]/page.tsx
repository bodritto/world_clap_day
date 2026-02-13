import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import AddToCalendar from '@/components/AddToCalendar'
import CountdownTimer from '@/components/CountdownTimer'
import AnimatedCounter from '@/components/AnimatedCounter'
import EmailSubscriptionForm from '@/components/EmailSubscriptionForm'
import SecondSectionAndMap from '@/components/SecondSectionAndMap'
import WallOfClaps from '@/components/WallOfClaps'
import { MapRefreshProvider } from '@/lib/MapRefreshContext'
import { getSiteSettings, getSupporters } from '@/sanity/client'
import type { Locale } from '@/i18n/config'

// Default data for when Sanity is not configured
const defaultSettings = {
  countdownDate: '2026-08-15T12:00:00Z', // World Clap Day date
  supporterCount: 64241,
  socialLinks: {
    instagram: 'https://instagram.com/worldclapday',
    facebook: 'https://facebook.com/worldclapday',
    twitter: 'https://twitter.com/worldclapday',
    youtube: 'https://youtube.com/@worldclapday',
    reddit: 'https://reddit.com/r/worldclapday',
  },
}

const GRID_CLAPPERS_SIZE = 12 // 3×4 grid

// Mock supporters to fill the grid when DB has fewer (or for demo)
const mockSupporters = [
  { _id: 'mock-1', name: 'Anna K.', country: 'Germany', countryCode: 'DE', _createdAt: '2024-01-15' },
  { _id: 'mock-2', name: 'David M.', country: 'United States', countryCode: 'US', _createdAt: '2024-01-14' },
  { _id: 'mock-3', name: 'Maria S.', country: 'Spain', countryCode: 'ES', _createdAt: '2024-01-13' },
  { _id: 'mock-4', name: 'John L.', country: 'United Kingdom', countryCode: 'GB', _createdAt: '2024-01-12' },
  { _id: 'mock-5', name: 'Yuki T.', country: 'Japan', countryCode: 'JP', _createdAt: '2024-01-11' },
  { _id: 'mock-6', name: 'Sophie L.', country: 'France', countryCode: 'FR', _createdAt: '2024-01-10' },
  { _id: 'mock-7', name: 'Luca B.', country: 'Italy', countryCode: 'IT', _createdAt: '2024-01-09' },
  { _id: 'mock-8', name: 'Emma W.', country: 'Canada', countryCode: 'CA', _createdAt: '2024-01-08' },
  { _id: 'mock-9', name: 'James O.', country: 'Australia', countryCode: 'AU', _createdAt: '2024-01-07' },
  { _id: 'mock-10', name: 'Olga P.', country: 'Poland', countryCode: 'PL', _createdAt: '2024-01-06' },
  { _id: 'mock-11', name: 'Carlos R.', country: 'Brazil', countryCode: 'BR', _createdAt: '2024-01-05' },
  { _id: 'mock-12', name: 'Priya N.', country: 'India', countryCode: 'IN', _createdAt: '2024-01-04' },
]

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  let settings = defaultSettings
  let supporters: typeof mockSupporters = mockSupporters

  try {
    const [sanitySettings, sanitySupporters] = await Promise.all([
      getSiteSettings().then((s) => s || null),
      getSupporters().catch(() => []),
    ])
    if (sanitySettings) {
      settings = { ...defaultSettings, ...sanitySettings }
    }
    if (sanitySupporters && sanitySupporters.length > 0) {
      supporters = sanitySupporters as typeof mockSupporters
    }
    // Pad with mock up to 12 so the 3×4 grid is always full (for now)
    if (supporters.length < GRID_CLAPPERS_SIZE) {
      const need = GRID_CLAPPERS_SIZE - supporters.length
      const pad = mockSupporters.slice(0, need).map((m, i) => ({ ...m, _id: `mock-pad-${i}` }))
      supporters = [...supporters, ...pad]
    }
  } catch {
    console.log('Using default settings')
  }

  return (
    <MapRefreshProvider>
      <HomePageContent settings={settings} supporters={supporters} />
    </MapRefreshProvider>
  )
}

function HomePageContent({
  settings,
  supporters,
}: {
  settings: typeof defaultSettings
  supporters: typeof mockSupporters
}) {
  const t = useTranslations('home')
  const tCounter = useTranslations('counter')
  const tSupport = useTranslations('supportPage')

  return (
    <div className="flex flex-col">
      {/* Section 1: First "page" — hero, countdown, counter, email. Email always visible, flexible height. */}
      <section className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-black">
        {/* Image covers top portion; rest is bg-black */}
        <div className="absolute inset-0 z-0 h-[100dvh]">
          <Image
            src="/earth-planets.jpg"
            alt="Earth and planets"
            fill
            className="object-cover object-center opacity-50"
            priority
          />
        </div>

        <div className="relative z-10 flex min-h-[100dvh] flex-col px-4 py-6 sm:py-8">
          {/* Upper content limited so "Join the Clap" heading stays visible on first screen */}
          <div className="flex max-h-[85dvh] min-h-0 flex-1 flex-col justify-center gap-6 sm:gap-8 max-w-4xl mx-auto w-full text-center pt-[6.3rem] sm:pt-[8.4rem] md:pt-[10.5rem] lg:pt-[12.6rem]">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-[0.15em]">
              {t('title')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white italic font-semibold">
              {t('subtitle')}
            </p>
            <CountdownTimer targetDate={settings.countdownDate} />
            <AnimatedCounter
              targetValue={settings.supporterCount}
              duration={2000}
              title={tCounter('title')}
            />
          </div>

          {/* Join the Clap — block sits above black end; section height = 100dvh + block + padding */}
          <div className="shrink-0 mt-16 sm:mt-20 pb-8 sm:pb-10 max-w-xl mx-auto w-full">
            <div className="rounded-2xl bg-white/15 backdrop-blur-md border-2 border-white/25 shadow-2xl shadow-black/40 p-6 sm:p-8 [&_input]:bg-white/15 [&_input]:border-white/40 [&_input]:text-white [&_input::placeholder]:text-white/70 [&_label]:text-white/90 [&_button]:bg-primary [&_button]:text-white [&_span]:text-white/90">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {t('joinTheClap')}
              </h2>
              <p className="text-sm text-white/90 mb-6">
                {t('joinTheClapSubline')}
              </p>
              <EmailSubscriptionForm />
              <div className="relative flex items-center gap-4 mt-6">
                <span className="flex-1 h-px bg-white/40" aria-hidden />
                <span className="text-sm text-white/90 font-medium">{t('or')}</span>
                <span className="flex-1 h-px bg-white/40" aria-hidden />
              </div>
              <div className="mt-6">
                <AddToCalendar variant="dark" />
              </div>
            </div>
          </div>
          {/* Scroll indicator on black background, smaller */}
          <div className="flex justify-center pt-6 pb-4">
            <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center pt-1.5">
              <div className="w-1 h-3 bg-white/70 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 (90dvh). Calendar + find local clap time + map in same block. */}
      <SecondSectionAndMap />

      {/* Section 3: Wall of Claps — third "page" ends here */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            {tSupport('wallOfClaps')}
          </h2>
          <p className="text-center text-muted mb-8">
            {tSupport('wallOfClapsText')}
          </p>
          <div className="flex justify-center mb-10">
            <Link
              href="/support-us"
              className="px-8 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              {tSupport('getOnTheWall')}
            </Link>
          </div>
          <WallOfClaps supporters={supporters} />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t('missionTitle')}
          </h2>
          <p className="text-lg text-muted leading-relaxed mb-8">
            {t('missionText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support-us" className="btn-primary">
              {t('joinMovement')}
            </Link>
            <Link
              href="/partners"
              className="px-6 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-medium"
            >
              {t('becomePartner')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
