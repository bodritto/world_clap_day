import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import CountdownTimer from '@/components/CountdownTimer'
import AnimatedCounter from '@/components/AnimatedCounter'
import EmailSubscriptionForm from '@/components/EmailSubscriptionForm'
import WorldTimes from '@/components/WorldTimes'
import { getSiteSettings } from '@/sanity/client'

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

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  let settings = defaultSettings
  
  try {
    const sanitySettings = await getSiteSettings()
    if (sanitySettings) {
      settings = { ...defaultSettings, ...sanitySettings }
    }
  } catch (error) {
    // Use defaults if Sanity is not configured
    console.log('Using default settings')
  }

  return <HomePageContent settings={settings} />
}

function HomePageContent({ settings }: { settings: typeof defaultSettings }) {
  const t = useTranslations('home')
  const tCounter = useTranslations('counter')

  return (
    <div className="flex flex-col">
      {/* Hero Section with Planets Background */}
      <section className="relative min-h-[500px] md:min-h-[520px] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image with 50% dim overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/earth-planets.jpg"
            alt="Earth and planets"
            fill
            className="object-cover object-center opacity-50"
            priority
          />
        </div>

        {/* Centered Content */}
        <div className="relative z-10 w-full text-center px-6 py-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-[0.15em]">
            {t('title')}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white italic font-semibold max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <CountdownTimer targetDate={settings.countdownDate} />
        </div>
      </section>

      {/* Clapper Count Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <AnimatedCounter 
            targetValue={settings.supporterCount} 
            duration={2000}
            title={tCounter('title')}
          />
          <EmailSubscriptionForm />
          <WorldTimes />
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
            <Link
              href="/support-us"
              className="btn-primary"
            >
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
