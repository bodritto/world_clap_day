import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partners' })

  return {
    title: `${t('title')} - World Clap Day`,
    description: t('introLine1'),
  }
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'partners' })

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Intro */}
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-12">
          {t('title')}
        </h1>
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground mb-8">
          <p>
            {t('introLine1')}
            <br />
            {t('introLine2')}
            <br />
            {t('introLine3')}
          </p>
        </div>
        <div className="mb-8">
          <p className="text-base text-muted-foreground">
            {t('forBrands')}
            <a
              href="mailto:hello@worldclapday.com"
              className="text-primary hover:opacity-70 transition-opacity"
            >
              hello@worldclapday.com
            </a>
          </p>
        </div>
        <div className="border-b border-border mb-16" />
      </div>

      {/* Brands */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
          {t('brandsHeading')}
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground mb-16">
          {t('brandsP')}
        </p>
        <div className="border-b border-border" />
      </section>

      {/* Schools & Universities */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
          {t('schoolsHeading')}
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground mb-8">
          {t('schoolsIntro')}
        </p>
        <ul className="space-y-4 mb-8 text-base leading-relaxed text-muted-foreground">
          <li className="flex">
            <span className="mr-3">•</span>
            <span>{t('schoolsBullet1')}</span>
          </li>
          <li className="flex">
            <span className="mr-3">•</span>
            <span>{t('schoolsBullet2')}</span>
          </li>
          <li className="flex">
            <span className="mr-3">•</span>
            <span>{t('schoolsBullet3')}</span>
          </li>
        </ul>
        <p className="text-base leading-relaxed text-muted-foreground mb-16">
          {t('schoolsOutro')}
        </p>
        <div className="border-b border-border" />
      </section>

      {/* Cities & Regions */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
          {t('citiesHeading')}
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          {t('citiesP1')}
        </p>
        <p className="text-base leading-relaxed text-muted-foreground mt-6">
          {t('citiesP2')}
        </p>
      </section>
    </div>
  )
}
