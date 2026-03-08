import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Calendar, Heart, Handshake, Share2 } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'getInvolvedPage' })

  return {
    title: `${t('title')} - World Clap Day`,
    description: t('intro'),
  }
}

export default async function GetInvolvedPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'getInvolvedPage' })

  const sections = [
    {
      icon: Calendar,
      titleKey: 'joinTheClapTitle' as const,
      textKey: 'joinTheClapText' as const,
      ctaKey: 'joinTheClapCta' as const,
      href: '/',
    },
    {
      icon: Heart,
      titleKey: 'supportTitle' as const,
      textKey: 'supportText' as const,
      ctaKey: 'supportCta' as const,
      href: '/support-us',
    },
    {
      icon: Handshake,
      titleKey: 'partnerTitle' as const,
      textKey: 'partnerText' as const,
      ctaKey: 'partnerCta' as const,
      href: '/partners',
    },
    {
      icon: Share2,
      titleKey: 'spreadTitle' as const,
      textKey: 'spreadText' as const,
      ctaKey: null,
      href: null,
    },
  ] as const

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12">
          {t('intro')}
        </p>

        <div className="space-y-10">
          {sections.map(({ icon: Icon, titleKey, textKey, ctaKey, href }) => (
            <section
              key={titleKey}
              className="p-6 rounded-xl bg-white border border-border shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {t(titleKey)}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t(textKey)}
                  </p>
                  {ctaKey && href && (
                    <Link
                      href={href}
                      className="inline-block px-5 py-2.5 rounded-full bg-primary text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      {t(ctaKey)}
                    </Link>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-border">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {t('contactTitle')}
          </h2>
          <p className="text-muted-foreground mb-2">{t('contactText')}</p>
          <a
            href="mailto:hello@worldclapday.com"
            className="text-primary hover:opacity-80 transition-opacity font-medium"
          >
            hello@worldclapday.com
          </a>
        </div>
      </div>
    </div>
  )
}
