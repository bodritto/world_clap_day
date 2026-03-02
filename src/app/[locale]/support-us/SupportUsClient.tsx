'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import DonationFormBlock from '@/components/DonationFormBlock'

export default function SupportUsClient() {
  const t = useTranslations('supportPage')

  return (
    <div className="h-full min-h-0 flex flex-col bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 pb-3 flex-1 min-h-0 flex flex-col gap-4 overflow-auto">
        <section className="shrink-0 px-0">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            {t('title')}
          </h1>
          <p className="text-base sm:text-xl text-muted mb-2 sm:mb-4">
            {t('subtitle')}
          </p>
          <p className="text-sm sm:text-lg text-muted">
            {t('description')}
          </p>
        </section>

        <section className="shrink-0">
          <DonationFormBlock imageUrl={null} />
        </section>

        <div className="shrink-0 p-4 sm:p-5 bg-white rounded-xl border border-border">
          <p className="text-sm text-muted mb-2">
            {t('disclaimer1')} <strong>{t('companyName')}</strong>, {t('disclaimer2')}
          </p>
          <p className="text-sm text-muted mb-2">
            {t('disclaimer3')}{' '}
            <Link href="/support-policy" className="text-primary hover:underline">
              {t('supportPolicy')}
            </Link>
            .
          </p>
          <p className="text-sm text-muted">
            {t('disclaimer4')}{' '}
            <a href="mailto:hello@worldclapday.com" className="text-primary hover:underline">
              hello@worldclapday.com
            </a>
            . {t('disclaimer5')}
          </p>
        </div>
      </div>
    </div>
  )
}
