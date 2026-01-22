'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export default function Footer() {
  const t = useTranslations('footer')

  const footerLinks = [
    { href: '/support-policy' as const, label: t('supportPolicy') },
    { href: '/privacy-policy' as const, label: t('privacyPolicy') },
    { href: '/terms-of-use' as const, label: t('termsOfUse') },
  ]

  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Footer Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted hover:text-primary transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Legal Text */}
          <p className="text-muted text-sm text-center md:text-right">
            {t('legalText')}{' '}
            <Link href="/terms-of-use" className="text-primary hover:underline">
              {t('termsOfUse')}
            </Link>
            ,{' '}
            <Link href="/privacy-policy" className="text-primary hover:underline">
              {t('privacyPolicy')}
            </Link>
            , {t('and')}{' '}
            <Link href="/support-policy" className="text-primary hover:underline">
              {t('supportPolicy')}
            </Link>
            .
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-muted text-sm">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
