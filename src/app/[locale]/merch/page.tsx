import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Shirt, Mail } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'merchPage' })

  return {
    title: `${t('title')} - World Clap Day`,
    description: t('intro'),
  }
}

export default async function MerchPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'merchPage' })

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-8">
          <Shirt className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12">
          {t('intro')}
        </p>

        <div className="p-8 rounded-2xl bg-white border border-border shadow-sm text-left max-w-xl mx-auto">
          <p className="text-muted-foreground leading-relaxed mb-6">
            {t('comingSoon')}
          </p>
          <a
            href="mailto:hello@worldclapday.com?subject=Notify%20me%20when%20merch%20is%20available"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Mail className="w-4 h-4" />
            {t('notifyCta')}
          </a>
        </div>

        <div className="mt-12 pt-10 border-t border-border">
          <p className="text-muted-foreground mb-2">{t('contactText')}</p>
          <a
            href="mailto:hello@worldclapday.com"
            className="text-primary hover:opacity-80 transition-opacity font-medium"
          >
            hello@worldclapday.com
          </a>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            ← {t('backToHome')}
          </Link>
        </p>
      </div>
    </div>
  )
}
