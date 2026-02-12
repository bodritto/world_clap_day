import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
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

const defaultSupporters = [
  { _id: '1', name: 'Anna K.', country: 'Germany', _createdAt: '2024-01-15' },
  { _id: '2', name: 'David M.', country: 'USA', _createdAt: '2024-01-14' },
  { _id: '3', name: 'Maria S.', country: 'Spain', _createdAt: '2024-01-13' },
  { _id: '4', name: 'John L.', country: 'UK', _createdAt: '2024-01-12' },
  { _id: '5', name: 'Yuki T.', country: 'Japan', _createdAt: '2024-01-11' },
  { _id: '6', name: 'Sophie L.', country: 'France', _createdAt: '2024-01-10' },
]

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  let settings = defaultSettings
  let supporters = defaultSupporters

  try {
    const [sanitySettings, sanitySupporters] = await Promise.all([
      getSiteSettings().then((s) => s || null),
      getSupporters().catch(() => []),
    ])
    if (sanitySettings) {
      settings = { ...defaultSettings, ...sanitySettings }
    }
    if (sanitySupporters && sanitySupporters.length > 0) {
      supporters = sanitySupporters
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
  supporters: typeof defaultSupporters
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
