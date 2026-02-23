'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
          <nav className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-muted order-2 sm:order-1">
            <Link href="/support-policy" className="hover:text-primary transition-colors">
              {t('supportPolicy')}
            </Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              {t('privacyPolicy')}
            </Link>
            <Link href="/terms-of-use" className="hover:text-primary transition-colors">
              {t('termsOfUse')}
            </Link>
          </nav>
          <p className="text-muted text-sm text-center sm:text-right shrink-0 order-1 sm:order-2">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
