import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import DonationFormBlock from '@/components/DonationFormBlock'

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
  const tSupport = await getTranslations({ locale, namespace: 'supportPage' })

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5">
          {t('title')}
        </h1>
        <p className="text-base text-muted leading-relaxed">
          {t('intro')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 space-y-0">

        {/* ── Spread the Idea ───────────────────────────────────────────── */}
        <section className="py-10 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {t('spreadTitle')}
          </h2>
          <p className="text-muted mb-4">{t('spreadSubtitle')}</p>
          <p className="text-muted mb-2">{t('spreadYouCan')}</p>
          <ul className="list-disc list-inside space-y-1.5 text-muted mb-6 pl-1">
            <li>{t('spreadBullet1')}</li>
            <li>{t('spreadBullet2')}</li>
            <li>{t('spreadBullet3')}</li>
            <li>{t('spreadBullet4')}</li>
            <li>{t('spreadBullet5')}</li>
          </ul>
          <p className="text-muted mb-2">{t('spreadSocial')}</p>
          <p className="text-muted">{t('spreadGoal')}</p>
        </section>

        {/* ── Help Us Answer Questions ───────────────────────────────────── */}
        <section className="py-10 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {t('answerTitle')}
          </h2>
          <p className="text-muted mb-4">{t('answerSubtitle')}</p>
          <ul className="list-disc list-inside space-y-1.5 text-muted mb-6 pl-1">
            <li>{t('answerQ1')}</li>
            <li>{t('answerQ2')}</li>
            <li>{t('answerQ3')}</li>
            <li>{t('answerQ4')}</li>
          </ul>
          <p className="text-muted">{t('answerHelpText')}</p>
        </section>

        {/* ── Become a Local Connector ───────────────────────────────────── */}
        <section className="py-10 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {t('connectorTitle')}
          </h2>
          <p className="text-muted mb-4">{t('connectorIntro')}</p>
          <ul className="list-disc list-inside space-y-1.5 text-muted mb-6 pl-1">
            <li>{t('connectorBullet1')}</li>
            <li>{t('connectorBullet2')}</li>
            <li>{t('connectorBullet3')}</li>
            <li>{t('connectorBullet4')}</li>
            <li>{t('connectorBullet5')}</li>
          </ul>
          <p className="text-muted mb-2">{t('connectorText1')}</p>
          <p className="text-muted">
            {t('connectorText2')}{' '}
            <a
              href="mailto:hello@worldclapday.com"
              className="text-primary hover:opacity-80 transition-opacity"
            >
              hello@worldclapday.com
            </a>
          </p>
        </section>

      </div>

      {/* ── Support / Donation Section ───────────────────────────────────── */}
      <section id="donate" className="bg-gray-50 py-16 px-4 border-t border-border">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t('donateTitle')}
          </h2>

          <p className="text-muted mb-1">{t('donateIntro1')}</p>
          <p className="text-muted mb-5">{t('donateIntro2')}</p>

          <p className="text-muted mb-2">{t('donateHelpTitle')}</p>
          <ul className="list-disc list-inside space-y-1.5 text-muted mb-5 pl-1">
            <li>{t('donateBullet1')}</li>
            <li>{t('donateBullet2')}</li>
            <li>{t('donateBullet3')}</li>
            <li>{t('donateBullet4')}</li>
          </ul>

          <p className="text-muted mb-8">
            {t('donateWallText')}{' '}
            <Link href="/#wall-of-clappers" className="text-primary hover:opacity-80 transition-opacity">
              {t('donateWallLink')}
            </Link>
            .
          </p>

          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <DonationFormBlock imageUrl={null} directCheckout />
          </div>

          {/* Legal disclaimer */}
          <div className="mt-8 space-y-2">
            <p className="text-xs text-muted">
              {tSupport('disclaimer1')} <strong>{tSupport('companyName')}</strong>, {tSupport('disclaimer2')}
            </p>
            <p className="text-xs text-muted">
              {tSupport('disclaimer3')}{' '}
              <Link href="/support-policy" className="text-primary hover:underline">
                {tSupport('supportPolicy')}
              </Link>
              .
            </p>
            <p className="text-xs text-muted">
              {tSupport('disclaimer4')}{' '}
              <a href="mailto:hello@worldclapday.com" className="text-primary hover:underline">
                hello@worldclapday.com
              </a>
              . {tSupport('disclaimer5')}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
