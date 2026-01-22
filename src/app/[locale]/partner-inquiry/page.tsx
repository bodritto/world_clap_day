import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { ArrowLeft } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partnerInquiry' })
  
  return {
    title: `${t('title')} - World Clap Day`,
    description: t('subtitle'),
  }
}

export default async function PartnerInquiryPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  
  return <PartnerInquiryContent />
}

function PartnerInquiryContent() {
  const t = useTranslations('partnerInquiry')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-8 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            {t('backToPartners')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-muted">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Google Form Embed */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSc78aUMCwBIgs87BaubcYXSo6CwDxOvy097-TTWgejvbr5MGw/viewform?embedded=true"
              width="100%"
              height="977"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="w-full min-h-[977px]"
              title="Partner Inquiry Form"
              loading="lazy"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted">
            {t('contactText')}{' '}
            <a 
              href="mailto:partners@worldclapday.com" 
              className="text-primary hover:underline"
            >
              partners@worldclapday.com
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
