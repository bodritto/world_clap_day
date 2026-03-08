import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'

const MEDIA_ENTRIES = [
  {
    sourceKey: 'mediaSource1' as const,
    headlineKey: 'mediaHeadline1' as const,
    url: 'https://timesofindia.indiatimes.com/etimes/trending/world-clap-day-imagine-the-entire-planet-clapping-together-at-once-one-mans-vision-for-16-august-2026/articleshow/128894665.cms',
  },
  {
    sourceKey: 'mediaSource2' as const,
    headlineKey: 'mediaHeadline2' as const,
    url: 'https://natlawreview.com/press-releases/world-clap-day-announces-global-simultaneous-clap-scheduled-16-august-2026#google_vignette',
  },
] as const

const PROJECT_LINKS = [
  { labelKey: 'website' as const, url: 'https://worldclapday.com' },
  { labelKey: 'instagram' as const, url: 'https://instagram.com/worldclapday' },
  { labelKey: 'tiktok' as const, url: 'https://www.tiktok.com/@world.clap.day' },
  { labelKey: 'youtube' as const, url: 'https://youtube.com/@worldclapday' },
  {
    labelKey: 'facebook' as const,
    url: 'https://www.facebook.com/p/World-Clap-Day-61585619829019/',
  },
  {
    labelKey: 'linkedin' as const,
    url: 'https://linkedin.com/company/world-clap-day',
  },
] as const

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pressPage' })

  return {
    title: `${t('title')} - World Clap Day`,
    description: t('shortDescriptionText'),
  }
}

export default async function PressPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'pressPage' })

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          {t('title')}
        </h1>
        <div className="border-b border-border pb-6 mb-12">
          <p className="text-base text-muted-foreground">
            {t('forInterviews')}
            <a
              href="mailto:hello@worldclapday.com"
              className="text-primary hover:opacity-70 transition-opacity"
            >
              hello@worldclapday.com
            </a>
          </p>
        </div>
      </div>

      {/* World Clap Day in the media */}
      <section className="mb-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-12">
          {t('inTheMedia')}
        </h2>
        <div className="space-y-10">
          {MEDIA_ENTRIES.map((entry) => (
            <div
              key={entry.url}
              className="border-b border-border pb-10 last:border-b-0"
            >
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-medium">
                {t(entry.sourceKey)}
              </p>
              <h3 className="text-xl md:text-2xl mb-4 leading-relaxed font-medium text-foreground">
                {t(entry.headlineKey)}
              </h3>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:opacity-70 transition-opacity font-medium"
              >
                {t('readArticle')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Media Kit */}
      <section className="mb-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-12">
          {t('mediaKit')}
        </h2>
        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t('shortDescription')}
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t('shortDescriptionText')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t('longDescription')}
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t('longDescriptionText')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t('keyFacts')}
            </h3>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li>• {t('keyFact1')}</li>
              <li>• {t('keyFact2')}</li>
              <li>• {t('keyFact3')}</li>
              <li>• {t('keyFact4')}</li>
              <li>• {t('keyFact5')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Project Links */}
      <section className="mb-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
          {t('projectLinks')}
        </h2>
        <div className="space-y-3">
          {PROJECT_LINKS.map(({ labelKey, url }) => (
            <div key={labelKey} className="flex items-baseline gap-3">
              <span className="text-base text-muted-foreground font-medium shrink-0">
                {t(labelKey)}
              </span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-primary hover:opacity-70 transition-opacity break-all"
              >
                {url}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer contact */}
      <div className="border-t border-border pt-12">
        <p className="text-base text-muted-foreground">
          {t('forMediaInquiries')}
          <a
            href="mailto:hello@worldclapday.com"
            className="text-primary hover:opacity-70 transition-opacity font-medium"
          >
            hello@worldclapday.com
          </a>
        </p>
      </div>
    </div>
  )
}
