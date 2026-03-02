'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import DonationFormBlock from '@/components/DonationFormBlock'

export default function SupportUsClient() {
  const t = useTranslations('supportPage')

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Центрируем контент между хедером и футером, но с фиксированными отступами между блоками */}
      <div className="flex-1 flex items-center">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          <section className="px-0">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="text-base sm:text-xl text-muted mt-2 sm:mt-3">
              {t('subtitle')}
            </p>
            <p className="text-sm sm:text-lg text-muted mt-1.5 sm:mt-2">
              {t('description')}
            </p>
          </section>

          <section className="mt-28 sm:mt-24 mb-16 sm:mb-20">
            <DonationFormBlock imageUrl={null} />
          </section>

          <div className="p-6 bg-white rounded-xl border border-border">
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
    </div>
  )
}
