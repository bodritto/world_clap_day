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
import ScrollToHash from '@/components/ScrollToHash'
import { ClapperCountProvider } from '@/lib/ClapperCountContext'
import { EmailFormProvider } from '@/lib/EmailFormContext'
import { getClapperCount, getClapperCountsByCountry, getSupportersForWall } from '@/lib/db'

const defaultSettings = {
  countdownDate: '2026-08-15T12:00:00Z',
  supporterCount: 64241,
  socialLinks: {
    instagram: 'https://instagram.com/worldclapday',
    facebook: 'https://facebook.com/worldclapday',
    twitter: 'https://twitter.com/worldclapday',
    youtube: 'https://youtube.com/@worldclapday',
    reddit: 'https://reddit.com/r/worldclapday',
  },
}

export const dynamic = 'force-dynamic'

const GRID_CLAPPERS_SIZE = 12 // 3×4 grid

type WallSupporter = {
  _id: string
  name: string
  country?: string
  countryCode?: string
  _createdAt: string
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  let supporters: WallSupporter[] = []
  let initialTotal = defaultSettings.supporterCount
  let initialCountryCounts: Record<string, number> = {}
  try {
    const [wallRows, total, countryCounts] = await Promise.all([
      getSupportersForWall(GRID_CLAPPERS_SIZE),
      getClapperCount(),
      getClapperCountsByCountry(),
    ])
    supporters = wallRows.map((s) => ({
      _id: s.id,
      name: s.name,
      country: s.country ?? undefined,
      countryCode: s.countryCode ?? undefined,
      _createdAt: s.createdAt.toISOString(),
    }))
    initialTotal = total
    initialCountryCounts = countryCounts
  } catch (err) {
    console.error('Homepage: using default clapper count (DB unavailable or error)', err)
  }
  const settings = { ...defaultSettings, supporterCount: initialTotal }

  return (
    <ClapperCountProvider initialTotal={initialTotal} initialCountryCounts={initialCountryCounts}>
      <HomePageContent settings={settings} supporters={supporters} />
    </ClapperCountProvider>
  )
}

function HomePageContent({
  settings,
  supporters,
}: {
  settings: typeof defaultSettings
  supporters: WallSupporter[]
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

        <EmailFormProvider>
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
            <AnimatedCounter duration={2000} title={tCounter('title')} />
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
        </EmailFormProvider>
      </section>

      {/* Section 2 (90dvh). Timezone map with country coloring from clapper counts. */}
      <SecondSectionAndMap />

      {/* Section 3: Wall of Claps — third "page" ends here */}
      <section id="wall-of-clappers" className="py-16 px-4 bg-white scroll-mt-20">
        <ScrollToHash id="wall-of-clappers" />
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            {tSupport('wallOfClaps')}
          </h2>
          <p className="text-center text-muted mb-8">
            {tSupport('wallOfClapsText')}
          </p>
          <div className="flex justify-center mb-10">
            <Link
              href="/get-involved#donate"
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
            <Link href="/get-involved#donate" className="btn-primary">
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
